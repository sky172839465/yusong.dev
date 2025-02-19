---
title: PWA 介紹
description: 介紹 PWA 漸進式應用程式
createdAt: 2025-01-31T00:00:00.000Z
modifiedAt: "2025-02-19T12:18:19.386Z"
tags:
  - PWA
index: 0
series: PWA
---

### [起源](#come-from)

> Progressive Web App (PWA) 最早由 Google 在 2015 年提出，目標是讓 Web 應用具備與原生 App 相似的體驗，同時保留 Web 的開放性與易維護性。從技術角度來看，PWA 並不是一種新的框架或技術，而是對 Web 應用的一組標準與最佳實踐，使其在現代瀏覽器中能夠具備更強的能力。

### [主要技術](#core-tech)

主要圍繞以下幾點技術要素：

- Service Worker
  - 攔截與快取請求
  - 背景執行
- Web App Manifest
  - 設定 web app 外觀與安裝資訊
- Web Push Notification
  - 發送推播
- HTTPS (限制)
  - PWA 必須 在 HTTPS 環境下執行，以確保 Service Worker 不能被中間人攻擊 (MITM Attack) 。

### [抽象使用情境](#story)

想像第一次當老闆在巷子裡開了一間咖啡店，客人要來到現場才能買咖啡。但隨著工作越來越熟悉，你希望生意越來越好、能提供更好的消費體驗，於是你開始做出一些改善(漸進式)！

1. 增加「紙杯外帶服務」(Service Worker Cache)
   客人不再需要每次都在店裡等待咖啡製作，讓他們可以帶著咖啡到任何地方享用 —— Service Worker，快取使用者曾經瀏覽過的內容即使在網路環境不佳的情況下也可以正常瀏覽。

1. 推出「外送服務」(Web App Manifest)
   為了拓展客源開始接受網路預約，客人只要付外送費(安裝)就能更容易買到咖啡 —— PWA 的安裝機制，使用者可以把網站「安裝」到手機桌面，隨時點擊開啟，無需每次輸入網址。

1. 開始提供「商品通知」(Web Push Notification)
   想讓客人知道新品上市或促銷活動，於是開始到處貼宣傳單：「今天新推出巧克力拿鐵！」，客人即使沒有來店裡，也能知道最新資訊 —— 推播通知，可以主動將新訊息推送給使用者。

1. 這些改善有機會替咖啡店創造更多機會，不再只是被動等待生意上門。
   這是 PWA 帶來的轉變 —— 你還是那家熟悉的咖啡店 (網站) ，但現在它變得更自由、更便利 (可安裝成 Web App)，吸引更多回頭客 (推播通知)，並且還有可能降低經營成本 (快取靜態檔案)！

加入 PWA 不會改變網站的本質，而是讓它變得更具彈性、性能更好、更容易進行傳播。

### 參考

1. https://zh.wikipedia.org/zh-tw/漸進式網路應用程式
1. https://developer.mozilla.org/zh-TW/docs/Web/Progressive_web_apps
