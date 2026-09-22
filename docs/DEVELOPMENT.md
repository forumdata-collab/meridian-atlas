# 開發與運行

應用使用 React 19、TypeScript、Three.js 和 Vinext/Vite，構建目標由 Cloudflare Vite 插件生成。現有 `.openai/hosting.json` 包含本項目的公開站點標識與空邏輯綁定，不包含賬號憑據或密鑰；運行本地版本不需要 Sites 或 Cloudflare 賬戶。

## 克隆後運行

```bash
npm ci
npm run dev -- --host 127.0.0.1 --port 4318
```

Node.js 24+ 是受支持的開發和測試環境。測試通過 Node 的模塊鈎子直接加載實際 TypeScript 數據，不需要複製一份測試專用實現。Python 工具不是運行應用的前提。

生產構建：`npm run build`。本地生產預覽：`npm start -- --ip 127.0.0.1 --port 4319`。不要直接雙擊 HTML；本項目不是已導出的靜態網站。公開源碼倉庫也不會自動部署網站。

## 結構

- `app/AtlasApp.tsx`：圖譜、時辰和來源等頁面狀態與面板。
- `app/BodyViewer.tsx`：Three.js 人體、經絡、標籤、動畫和點選。
- `app/Pronunciation.tsx`、`app/JingmaiPanel.tsx`、`app/Combinations.tsx`：對應學習功能。
- `lib/atlas.ts`、`lib/luo.ts`、`lib/course-catalog.ts`：目錄、十五絡和循行的應用入口。
- `lib/mesh-registration.json`、`lib/*course.json`：綁定和路線；修改綁定後需要同步依賴哈希及受影響路線。
- `public/models/`：運行時模型、許可證、準備過程與哈希。
- `scripts/test.mjs`：自動化迴歸。`scripts/export_anatomical_review.mjs`：可選審校交接導出。

## 可選研究腳本

`scripts/` 同時包含導入、幾何準備、配準試驗和審校腳本。它們不是每次安裝或構建都會運行的步驟。部分腳本需要 Python、NumPy、Pillow 或其他文件中聲明的庫，並需要自行取得具有相應使用權限的外部參考輸入。先閲讀對應腳本的參數及頂部説明；不要無差別批量執行，也不要把實驗結果自動覆蓋進已採用的綁定。

倉庫包含當前應用所需的完整運行數據，不附帶原始 PDF、TARA 原始彙編、NIMBLE 權重或獨立研究模型。正常啓動和 156 項測試不依賴這些外部研究輸入。

`scripts/manage.sh` 是可選的 Linux/tmux 本地進程管理器，只管理本項目會話。一般開發使用上面的 npm 命令即可。若採用該腳本，重建後需重啓預覽進程，以免舊進程使用過時資源清單。

## 自行託管與源碼入口

現有源碼入口為 `app/AtlasApp.tsx` 中的 GitHub 鏈接。發佈修改版前請把入口指向實際運行版本的相應源碼，並遵守 AGPL 第 13 條等適用義務。倉庫源碼鏈接不替代發佈者對其自行修改內容的源碼提供責任。

## 已知限制

所有位置尚未通過逐穴解剖審校；169 條記錄仍使用區域模板。五處甲根方向修正也不代表指寸和真實甲溝邊界已驗證。圖譜動畫與傳統主治只用於學習，不提供針刺或個體診療指導。

當前構建可能報告較大的客戶端分包及 Vite 配置加載提示；這些不是構建失敗。沒有在本次開源準備中重新設計模型或拆分交互功能。
