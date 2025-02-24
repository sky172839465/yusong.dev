---
title: "PWA 範例解說"
description: "PWA 系列有另外做了範例網站，這篇主要講解這個網站的結構"
createdAt: "2025-02-23T15:02:20.508Z"
modifiedAt: "2025-02-23T15:02:20.508Z"
tags:
  - PWA
  - EXAMPLE
index: 1
---

### [結構](#structure)

- `Vite` 前端打包工具
  > 這是現在相當熱門的工具，速度快而且內建許多功能，
  > React 已經 [宣布終止 CRA](https://react.dev/blog/2025/02/14/sunsetting-create-react-app) 開發 React SPA 的話 Vite 已經成為主流，
  > 如果不熟悉建議到 [官方網站](https://vite.dev/) 熟悉一下用法
  > 前端相關設定檔在 `vite.config.js`
- `react-router` react 路由
  > 檔案系統路由，頁面都在 `src/client/pages` 底下只要是 `index.jsx` `index.md` 都會成為一個獨立的頁面
- `Vite PWA` Vite 的擴充程式

  > 這個擴充程式相當方便如果不需要用到 Service worker 接收推播通知或是跳出更新提示，只要寫設定檔就能完成大部分 PWA 的功能了，

  > 相關的設定檔有兩個 `pwa.config.js` 與 `pwa-assets.config.js`
  >
  > `pwa.config.js` Vite PWA 設定檔
  >
  > `pwa-assets.config.js` Vite PWA 的命令列工具 [assets-generator](https://vite-pwa-org.netlify.app/assets-generator/) 用於產生對應不同裝置要使用的圖示規格

大部分範例都會以 `Vite PWA` 的設定為核心做講解，即使實際上開發環境不相同有走過一次開發流程，要找到對應的工具也會比較容易上手。

### [參考](#reference)

- [Vite PWA](https://vite-pwa-org.netlify.app/)
- [PWA sharing](https://pwa-sharing.pages.dev/)
- [PWA sharing source code](https://github.com/sky172839465/pwa-sharing/)
