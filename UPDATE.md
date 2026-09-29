# 每天上午 09:00 更新程序

此流程由目前 Codex 聊天的 heartbeat automation 執行。工作目錄為本 repository，所有中間資料只能放 `work/` 或 `tmpcode/`，用 `outputs/` 保存交付成果。使用 Browser Use／Computer Use 與可見 DOM；不得以直接 HTTP 抓頁取代使用者指定的瀏覽操作。

## 範圍

1. 天瓏繁體中文全分類榜：`https://www.tenlong.com.tw/zh_tw/recent_bestselling?range=7` 與 `?range=30`。逐一跟隨已觀察到的「下一頁」，每榜前 100 名。
2. 博客來中文書總榜：`https://www.books.com.tw/web/sys_saletopb/books/?attribute=7` 與 `?attribute=30`。
3. 博客來電腦資訊榜：`https://www.books.com.tw/web/sys_saletopb/books/19?attribute=7` 與 `?attribute=30`。
4. 榜單範圍維持精確名稱。天瓏沒有已確認的跨語言全站總榜或獨立「電腦資訊」總分類榜。博客來全站熱銷榜包含非書籍商品，不能拿即時榜冒充 7 日或 30 日榜。

## 擷取與核對

- 先讀瀏覽工具當次文件。正常逐頁瀏覽，不並發大量請求、不使用 stealth、代理輪替或驗證繞過。遇到 CAPTCHA 或封鎖，停止該站，保存可見狀態並通知使用者接手；未成功的榜單標記為待查核，保留上次成功的日期，絕不填 0 或當成今日資料。
- 使用 DOM 讀取天瓏 `li.single-book` 的 `.rank`、`strong.title a`；博客來 `li.item` 的 `.no`、`h4 a`。每次擷取核對頁面週期、分類及名次 1–100 無重複、缺漏。
- 從 `https://www.tenlong.com.tw/publishers/A01` 依可見分頁取得深智書目，按 ISBN 比對天瓏，書名正規化後比對博客來。對出版社目錄未列出、名稱縮寫、版次不同或近似匹配的候選，開啟商品頁核對出版社與 ISBN，不能單靠書名或 ISBN 前綴推論。
- 為每本上榜書保存原站名次、書名、商品頁 URL、來源榜單、實際擷取時間、ISBN 或確認依據、個別截圖、榜單截圖。
- 用 Browser Use 拍原頁完整截圖，使用同一頁 DOM 的卡片矩形裁切；不可重新繪製原始截圖。macOS `sips --cropToHeightWidth HEIGHT WIDTH --cropOffset Y X SOURCE --out DEST` 可裁切。工具 screenshot clip 在首次執行中出現座標未套用，請視覺核對裁切結果。
- 截圖不可包含登入姓名、購物車私密資訊或瀏覽紀錄。天瓏完整榜頁須裁切至「最後瀏覽商品」heading 之前。先產生個別卡片，再裁切原榜截圖，以保留原始座標。
- 依 `outputs/data/YYYY-MM-DD.json` schema 建立今日快照。每份榜單須帶 status 與 capturedAt；資料日期用 Asia/Taipei。保留過往快照與其截圖，使用日期子目錄避免覆寫歷史。

## 更新網頁與發表

- 更新 `outputs/data.js` 指向今日報表；`outputs/data/` 保存每日 JSON。不要刪掉過去日期。
- 更新 `outputs/screenshots.zip` 為本次全部書籍截圖。
- 有失敗來源時，網頁必須清楚區分「待查核」與「前 100 名未比對到」，以最近成功資料加原日期顯示。必要時先改善網頁狀態支援，再發布。
- 使用 Browser Use 驗證網站的資料筆數、篩選、搜尋、單本圖片及下載。確認每筆 screenshot 存在且名次與資料一致。
- 只提交本站文件與 outputs 公開交付物，不加入 work、原始瀏覽紀錄、驗證資料或秘密。`git add` 具名檔案，commit 後 push origin main，再執行 `node scripts/publish.mjs` 發布 gh-pages branch。
- 使用 `gh api repos/joshhu/30-computer-use-browser-use-dom-2/pages/builds/latest` 確認 built；再從公開網址抽查今日日期與代表書籍。
- 更新正常且榜單沒有實質變動時保持安靜；有上榜、離榜、重要名次變化、失敗或需使用者操作才通知，附網頁連結與可查證的摘要。不要每次固定發無變更狀態訊息。

## 執行條件

本機 Codex 與瀏覽功能、GitHub 權限須可用。未確認實際執行成功前，不可保證每日資料一定準時更新。
