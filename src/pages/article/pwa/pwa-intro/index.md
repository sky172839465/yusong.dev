---
title: 簡單認識 PWA
description: 認識 PWA 具有哪些功能、用抽象的範例來說明把 PWA 加入既有的網站有什麼好處
createdAt: 2025-01-31T00:00:00.000Z
modifiedAt: "2025-02-23T14:59:36.262Z"
tags:
  - PWA
index: 0
---

### [起源](#come-from)

PWA 是 `Progressive Web App` 漸進式網頁應用程式的縮寫。

> Progressive Web App (PWA) 最早由 Google 在 2015 年提出，目標是讓 Web 應用具備與原生 App 相似的體驗，同時保留 Web 的開放性與易維護性。從技術角度來看，PWA 並不是一種新的框架或技術，而是對 Web 應用程式的一組標準與最佳實踐，使其在現代瀏覽器中能夠具備更強的能力。

### [主要功能](#core-tech)

主要圍繞在底下幾個功能：

- ⚙️ Service Worker
  - 攔截請求
  - 自訂快取請求
  - 預先擷取資源
  - 背景執行
- 📱 Web App Manifest
  - 設定 Web App 外觀
  - 安裝資訊
  - 豐富安裝界面
- 🔔 Web Push Notification
  - 發送推播
  - 推播導向 Web App
- 🔐 HTTPS (限制)
  - PWA 必須在 HTTPS 環境下執行

第一次接觸可能還是不太理解結合既有的網站跟 PWA 所能帶來的好處是什麼？

下面用一個比喻說明結合 PWA 後可以帶來的好處 ↓

### [比喻](#simile)

想像第一次當老闆在巷子裡開了一間內用限定的咖啡店。隨著工作越來越熟悉，你希望生意越來越好、能提供更好的消費體驗，於是我們開始想在既有的商業模式上做出一些改善(漸進式)！

1. 開始「記錄熟客」(⚙️ Service Worker 快取)
   隨著客人光顧的次數增加我們常常可以看到店員會記住客人的點餐模式、規格與習慣，甚至可以預測他們的喜好推薦新商品。

   > 曾經進入過網站快取在沒有 Service Worker 的情況下我們可以靠 CDN 設定快取減少每次造訪需要重新下載的時間。  
   > 有了 Service Worker 除了 CDN 快取，我們還可以預先在背景擷取整個網站的資源，就像是下載成一個完整的 App 本體一樣，可以在未來操作體驗上減少更多下載的時間。

1. 推出「外送服務」(📱 Web App Manifest)
   為了拓展客源、增加客人光顧的機會推出外送服務，客人只要付外送費就能更容易買到咖啡。

   > Web App Manifest 的安裝機制，可以讓使用者把網站安裝到裝置的桌面，支付了安裝的代價，Web App 變得可以隨點即用更方便了。

1. 亂槍打鳥「商品通知」(🔔 Web Push Notification)
   想讓客人知道新品上市或促銷活動，開始到處貼宣傳單，客人即使沒有來店裡，也能得到最新資訊。

   > Web Notification 加上 Service Worker 攔截 Push message 可以達到像一般 App 一樣對使用者發送推播通知。

1. 這些改善有機會替咖啡店創造更多機會，不再只是被動等待生意上門，咖啡店 (網站) 的本質沒有改變，但現在它服務更好了 (快取、預先擷取資源)，容易吸引更多回頭客 (推播通知)，並且更方便了 (可以安裝成 Web App 使用)！

### [範例](#example)

PWA 系列都會使用這個 [PWA sharing](https://pwa-sharing.pages.dev/) 網站做解說，如果想要研究實作內容可以看這一篇文章 [範例解說](/article/pwa/example/)，GitHub 程式碼的位置也列在裡面。

### [結論](#conclusion)

PWA 強調的是漸進式，也就是說不是全部功能都要實作缺一不可，各取所需挑需要的功能逐步實作到既有的網站上，漸進式的做出改善就可以了。

### [參考](#reference)

- [PWA WIKI](https://zh.wikipedia.org/zh-tw/漸進式網路應用程式)
- [MDN PWA](https://developer.mozilla.org/zh-TW/docs/Web/Progressive_web_apps)
