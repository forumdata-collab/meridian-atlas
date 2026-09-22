# iPhone 簽名與打包

本流程在持有 Apple 開發團隊權限的 Mac 上生成簽名 archive，並按選擇導出可驗證的 IPA。默認 `debugging` 方式優先用於已登記的個人 iPhone。腳本不會上傳 App Store Connect，不會創建或下載明文私鑰文件，也不會把證書、描述文件、密碼或 Apple 賬戶資料寫入倉庫。

Apple 的發佈流程先創建 archive，再按分發方式導出；`xcodebuild -exportArchive` 使用 `ExportOptions.plist`。腳本遵循這一流程，並在運行時用所安裝 Xcode 的 `xcodebuild -help` 檢查導出方式，避免靜態文檔與 Xcode 版本不一致。依據：[Apple 發佈概覽](https://developer.apple.com/documentation/xcode/distributing-your-app-for-beta-testing-and-releases)、[Apple 命令行構建説明](https://developer.apple.com/library/archive/technotes/tn2339/_index.html)和 [archive 導出文件説明](https://help.apple.com/xcode/mac/current/en.lproj/deva1f2ab5a2.html)。

## 前提

1. 安裝完整 Xcode 26 或更新版本。只有 Command Line Tools 不夠。若 Xcode 不在默認位置，可只為當前命令顯式指定 `DEVELOPER_DIR`：

   ```bash
   export DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer
   ```

   或由機器所有者切換系統選擇：

   ```bash
   sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
   ```

2. 打開 Xcode 完成首次啓動設置，在 Xcode 的 Accounts 設置中登錄由賬戶持有人授權的 Apple 賬戶。不要把賬戶密碼、App Store Connect API 私鑰或證書導出文件放進倉庫。
3. 在 Apple Developer 賬戶中確認團隊擁有 Bundle ID `io.github.galaxyhzy.meridianatlas`。如果實際註冊的是其他 ID，通過 `--bundle-id` 明確傳入。
4. 若使用 `debugging` 或 `release-testing`，目標 iPhone 必須按所選分發方式登記到團隊。開發調試包還需要按系統提示啓用 Developer Mode 和信任開發者。
5. 在倉庫根目錄安裝鎖定依賴：

   ```bash
   npm ci
   ```

## 先做預檢

Team ID 是 Apple 開發團隊的 10 位標識，不是密碼。腳本只把它作為構建參數：

```bash
scripts/ios-signing-preflight.sh \
  --team-id ABCDE12345 \
  --allow-provisioning-updates
```

`--allow-provisioning-updates` 明確允許 `xcodebuild` 聯繫 Apple 管理自動簽名資源。只有在賬戶持有人已授權登錄後才使用。若本機已有有效簽名身份和描述文件，可省略該參數。

預檢會驗證：當前系統是 macOS、顯式 `DEVELOPER_DIR`（如果設置）或 `xcode-select` 指向完整 Xcode、Xcode 版本至少為 26、iPhoneOS SDK 可用、Node.js 至少為 24、Release build settings 可解析，以及本機可見的代碼簽名身份數量。沒有本機簽名身份但啓用了 provisioning updates 時，真正的 archive 仍是權威檢查，因為 Xcode 可能在該步驟創建或下載賬戶管理的簽名資源。

## 生成優先用於真機的調試 IPA

每個包必須明確指定 build number。它符合 Apple 的 `CFBundleVersion` 數字格式，並應隨提交遞增：

```bash
scripts/ios-signing-package.sh \
  --team-id ABCDE12345 \
  --build-number 1 \
  --method debugging \
  --allow-provisioning-updates
```

腳本先執行 `npm run mobile:sync`，再創建 Release archive，導出 IPA，並完成以下檢查：

- archive 與 IPA 的代碼簽名都能通過 `codesign --verify`；
- `TeamIdentifier` 與傳入 Team ID 一致；
- Bundle ID、marketing version、build number 與命令一致；
- `MinimumOSVersion` 是 16.4；
- 導出的 IPA 只有一個頂層 App，並生成 SHA-256。

輸出進入忽略版本控制的 `work/ios-signing/<version>-<build>-<method>-<timestamp>/`。腳本使用 `umask 077` 創建本地 archive、導出配置、描述文件副本和 IPA，使新產物默認只允許當前用戶訪問。只有腳本輸出 `Verified signed IPA` 後，該文件才可稱為簽名 IPA。archive-only 運行、CI 的 `UNSIGNED.zip`、普通 `.app` 壓縮包都不是可安裝 IPA。

把 iPhone 連接到 Mac，在 Xcode 的 Devices and Simulators 窗口選擇設備並安裝導出的 IPA。安裝成功後從手機主屏幕斷開調試器啓動，完成 [IOS-SUBMISSION.md](IOS-SUBMISSION.md) 中的離線、渲染、觸摸、導航、朗讀和外部鏈接檢查。簽名驗證只證明包的身份與結構，不證明運行體驗。

## 其他導出方式

註冊設備上的 release 測試：

```bash
scripts/ios-signing-package.sh \
  --team-id ABCDE12345 \
  --build-number 2 \
  --method release-testing \
  --allow-provisioning-updates
```

準備供稍後人工上傳 App Store Connect 的 IPA：

```bash
scripts/ios-signing-package.sh \
  --team-id ABCDE12345 \
  --build-number 3 \
  --method app-store-connect \
  --allow-provisioning-updates
```

`app-store-connect` 只導出文件，不上傳、不創建商店記錄、不提交審核。Apple 説明首次上傳前還要建立 App Store Connect app record，且上傳後仍需等待平台處理；這些都不在本腳本範圍內。

若只需生成和保留簽名 archive，加入 `--archive-only`。該模式會明確輸出“no IPA was created”，不能把 `.xcarchive` 描述成 iPhone 安裝包。

## iOS 16.4 兼容邊界

原生 Deployment Target、移動端 Vite 瀏覽器目標和簽名腳本統一使用 iOS 16.4。前端使用 Tailwind CSS 4；Tailwind 官方把 Safari 16.4 列為核心功能最低瀏覽器，並建議需要更舊瀏覽器時使用 Tailwind 3.4；Apple 説明 Safari 16.4 隨 iOS 16.4 提供。因此簽名腳本拒絕低於 16.4 的 `--minimum-ios` 並核對 archive 與 IPA 的 `MinimumOSVersion`。

這仍不替代真機驗收。首個候選包至少要在一台 iOS 16.4 設備或對應模擬器，以及一台當前 iOS 設備上檢查：首次離線啓動、3D 模型加載與 SHA-256 校驗、豎屏與橫屏佈局、觸摸旋轉/縮放、所有主要頁面、系統朗讀、系統瀏覽界面、回到 App 後的狀態，以及從主屏幕冷啓動。完成舊系統專項改造前，不應宣傳 iOS 15 支持。

## 常見失敗

- 有完整 Xcode，但 `xcode-select` 顯示 `/Library/Developer/CommandLineTools`：設置 `DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer`，或選擇完整 Xcode 的 `Contents/Developer`。
- `0 valid identities found`：由賬戶持有人在 Xcode 登錄並確認團隊權限；如果授權自動管理簽名，重試時加入 `--allow-provisioning-updates`。腳本不會自行導出或上傳私鑰。
- Bundle ID 不可用：先在開發者賬戶確認實際註冊值，再通過 `--bundle-id` 傳入；不要悄悄改用其他產品的 ID。
- provisioning profile 不含設備：在 Apple Developer 團隊登記目標 iPhone，再重新導出 `debugging` 或 `release-testing` 包。
- 導出方式不受支持：運行 `xcodebuild -help` 查看當前 Xcode 的 `-exportOptionsPlist` 支持值，不要把舊版本示例直接套到 Xcode 26。
