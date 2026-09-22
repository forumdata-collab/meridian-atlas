# iPhone 版開發

原生容器使用 Capacitor 8.5.1 / WKWebView，應用界面複用現有 React 與 Three.js 圖譜。`mobile/vite.config.ts` 生成獨立客戶端資源，不需要 Vinext 服務、私人網頁或開發者電腦在線。

```bash
npm ci
npm run mobile:sync
npm run mobile:ios
```

需要 Xcode 26+ 才能編譯原生 iOS 工程。項目目標為 iPhone / iOS 16.4+：原生 Deployment Target 和移動端 Vite 瀏覽器目標均以 16.4 為基線，簽名腳本也會核對最終包的 `MinimumOSVersion=16.4`。移動端使用 Tailwind CSS 4；Tailwind 官方只設計和測試 Safari 16.4+，而 Safari 16.4 對應 iOS 16.4。在完成舊系統專項兼容改造與真機驗證前，不應降低或宣傳低於這一版本的支持。

在 Xcode 中選擇自己的開發團隊後，可連接設備運行；App Store 或 TestFlight 分發需要相應 Apple 開發者條件。命令行簽名、archive、IPA 導出和驗證流程見 [iPhone 簽名與打包](IOS-SIGNING.md)。

```bash
npm run typecheck
npm test
npm run mobile:sync
npm run mobile:test
```

`mobile/ios/App/App.xcodeproj` 為原生工程。倉庫不存儲簽名證書、描述文件、密碼或 Apple 賬戶資料。構建輸出、同步到原生目錄的 Web 資源及用戶 Xcode 狀態均忽略。

GitHub 的 `iOS build` 工作流手動觸發，編譯不簽名的模擬器與設備構建，用於檢查工程並下載開發產物。**未簽名設備產物不能直接安裝到普通 iPhone，也不是已通過審核的安裝包。** 不會自動上傳 App Store。

兼容基線依據：[Tailwind CSS 兼容性](https://tailwindcss.com/docs/compatibility)明確把 Safari 16.4 列為 v4 核心功能的最低瀏覽器；[Apple Safari 16.4 發佈説明](https://developer.apple.com/documentation/safari-release-notes/safari-16_4-release-notes)説明該版本隨 iOS 16.4 提供。項目自己的 CSS 還使用了 `:has()`、動態視口單位和 `color-mix()`，所以編譯成功不能替代 iOS 版本覆蓋測試。

## 本地數據與網絡

- 沒有遠程 `server.url`、熱更新後台或通配導航白名單。
- 核心模型從包內加載，並核對 SHA-256。
- 內容安全策略限制 WebView 內網絡請求為同源資源。
- 外部 HTTPS 文獻通過系統瀏覽組件打開，不把外部網頁放進帶原生橋接能力的主 WebView。
- 當前沒有賬號、患者數據庫、雲同步、廣告或分析 SDK。
- 無相機、麥克風、相冊、聯繫人、位置、HealthKit 權限。

這會減少攻擊面，但不等於絕對安全；仍需維護依賴、複核原生包與設備行為。詳見 [隱私説明](IOS-PRIVACY.md) 和 [上架材料](IOS-SUBMISSION.md)。
