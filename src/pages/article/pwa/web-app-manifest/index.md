---
title: Web Manifest 讓網站可以被安裝成 Web App
description: 設定 Web Manifest 可以描繪出安裝 Web App 所需要的資訊與外觀
createdAt: 2025-02-23T06:34:23.319Z
modifiedAt: "2025-02-23T06:35:01.910Z"
tags:
  - PWA
  - WEB MANIFEST
index: 2
---

### [介紹](#intro)

Web Manifest 是一個 JSON 格式的設定檔，可以用來定義 Web App 安裝時顯示的資訊與設定安裝後啟動 Web App 的介面，
這裡有一個 [範例網站](https://pwa-sharing.pages.dev/) 可以參考實際上在不同裝置上會如何呈現，範例需要原始碼的話參考裡有提供連結。

#### 安裝顯示的資訊

- 安裝的名稱
- 安裝的圖示
- 安裝時顯示的 Web App 預覽圖

#### 啟動介面相關

- 適用範圍 (例如 `/app` 路徑底下才要讓網頁可以被安裝)
- 外觀 (保留 URL 介面或是像 App 一個完整的獨立視窗)
- 啟動畫面
- 預設背景 (網站還沒載入時顯示)

### [範例](#example)

參考 PWA sharing 的 [Web manifest](https://pwa-sharing.pages.dev/manifest.webmanifest)，有實際的例子可以對照更容易理解這些屬性，下面挑了一些支援度相當高的屬做說明，由於影響 Web App 很明顯建議都要設定。

`screenshots` 與 `icons` 內容比較複雜底下另外做說明。

```json
{
  "name": "PWA sharing",
  "short_name": "PWA sharing",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "scope": "/",
  "description": "PWA sharing example code",
  "screenshots": [],
  "theme_color": "#ffffff",
  "icons": []
}
```

### [參考](#reference)
- [MDN Web app manifests](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest)
- [Vite PWA](https://vite-pwa-org.netlify.app/)
- [PWA sharing](https://pwa-sharing.pages.dev)
- [PWA sharing source code](https://github.com/sky172839465/pwa-sharing)
