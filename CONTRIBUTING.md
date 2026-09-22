# 參與 Meridian Atlas / Contributing

歡迎提交使用反饋、可復現修復、文獻校訂和可驗證的定位改進。當前階段以維護為主，較大的功能或底模改動請先開 Issue 討論。

## 報告問題

寫明頁面或穴位編號、操作步驟、預期與實際結果、瀏覽器和設備。截圖請隱藏個人信息。不要上傳患者資料、私人病史、未獲授權的掃描書籍或有再分發限制的模型。

## 數據與定位校訂

提供書名或標準號、版本、條款/頁碼、公開來源鏈接、簡短證據及建議修改。把原文、事實摘要、現代解釋和三維座標分開。古今差異保留説明，不直接改古文迎合現代穴序。

幾何修改需要指出當前底模上的可復現參照，檢查雙側、相關穴組與經絡路線依賴，並註明仍未核實的部分。不能僅以網格吸附誤差或測試通過宣稱解剖校準完成。

## 提交代碼

1. Fork 倉庫並創建分支，使用 Node.js 24+、`npm ci`。
2. 圍繞一個具體問題改動；運行 `npm run typecheck`、`npm test`、`npm run lint`、`npm run build`。
3. UI 改動在瀏覽器實際檢查；數據改動核對源條目及相關依賴。
4. PR 説明問題、結果、驗證方式和限制；不要提交 `.env`、原始下載資料、緩存或生成目錄。

提交即表示你有權貢獻相關內容，並同意原創貢獻採用本項目 AGPL-3.0-only。保留第三方許可聲明；不要引入無法説明許可範圍的素材。

English contributions are welcome. Include a reproducible case and cite versions/pages for data corrections. Keep source evidence separate from interpretation and geometry. Submit only material you have the right to contribute under the applicable licenses.
