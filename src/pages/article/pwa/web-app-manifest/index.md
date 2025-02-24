---
title: Web Manifest 介紹
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
[範例網站](https://pwa-sharing.pages.dev/) 可以參考實際上在不同裝置上會如何呈現，範例網站的程式碼解說參考 [這篇](/article/pwa/example/) 文章。

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

參考 PWA sharing 的 [Web manifest](https://pwa-sharing.pages.dev/manifest.webmanifest)，有實際的範例對照更容易理解這些屬性，下面挑了一些支援度相當高的屬做說明，由於影響 Web App 很明顯建議都要設定。

`screenshots` 與 `icons` 內容比較複雜底下另外做說明。

#### 基本設定

```json
{
  "name": "PWA sharing",
  "short_name": "PWA sharing",
  "description": "PWA sharing example code",
  "scope": "/",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ffffff",
  "icons": [],
  "screenshots": []
}
```

- name
  > 完整名稱，安裝成 Web App 後行動裝置的設定應用程式裡會顯示這個名稱
- short_name
  > 顯示在桌面上的 Web App 名稱，只有一個圖示的寬度，所以要短一點
- description
  > Web App 的描述，像是 App 商店裡用於描述這個程式的用途，在豐富的安裝使用者介面會顯示在 UI 上
- scope
  > 指定 Web App 的適用範圍，例如網站是 `https://example.com` 但是開始接受安裝成爲 Web App 的是另外開發的網站放在 `https://example.com/app` 路徑時可以指定成 `/app`
- start_url
  > 指定未開啟的 Web App 開起來時預設要開哪一個頁面，通常首頁可以直接放 `/`
- display
  > 決定安裝成 Web App 時的應用程式外框
- background_color
  > Web App 尚未載入前空白畫面預設的背景色
- theme_color
  > 主題顏色會影響 Web App 頂部 URL 介面區塊的顏色，需要 dark mode 的時候可以在 HTML 加上 meta 根據主題顏色動態切換
  >
  > [MDN combind with media query](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/theme_color#description)

#### 圖示 `icons`

```json
[
  {
    "src": "pwa-64x64.png",
    "sizes": "64x64",
    "type": "image/png"
  },
  {
    "src": "pwa-192x192.png",
    "sizes": "192x192",
    "type": "image/png"
  },
  {
    "src": "pwa-512x512.png",
    "sizes": "512x512",
    "type": "image/png"
  },
  {
    "src": "pwa-512x512.png",
    "sizes": "512x512",
    "purpose": "any",
    "type": "image/png"
  },
  {
    "src": "maskable-icon-512x512.png",
    "sizes": "512x512",
    "purpose": "maskable",
    "type": "image/png"
  }
]
```

#### 豐富的安裝使用者介面 `screenshots`

```json
[
  {
    "src": "rich-install/0_desktop-home.png",
    "label": "PWA sharing 0_desktop-home",
    "form_factor": "wide",
    "sizes": "1600x919",
    "type": "image/png"
  },
  {
    "src": "rich-install/1_desktop-sw.png",
    "label": "PWA sharing 1_desktop-sw",
    "form_factor": "wide",
    "sizes": "1600x919",
    "type": "image/png"
  },
  {
    "src": "rich-install/2_desktop-notification.png",
    "label": "PWA sharing 2_desktop-notification",
    "form_factor": "wide",
    "sizes": "1600x919",
    "type": "image/png"
  },
  {
    "src": "rich-install/0_mobile-home.png",
    "label": "PWA sharing 0_mobile-home",
    "form_factor": "narrow",
    "sizes": "772x1568",
    "type": "image/png"
  },
  {
    "src": "rich-install/1_mobile-sw.png",
    "label": "PWA sharing 1_mobile-sw",
    "form_factor": "narrow",
    "sizes": "772x1568",
    "type": "image/png"
  },
  {
    "src": "rich-install/2_mobile-notification.png",
    "label": "PWA sharing 2_mobile-notification",
    "form_factor": "narrow",
    "sizes": "772x1568",
    "type": "image/png"
  }
]
```

### [參考](#reference)

- [MDN Web app manifests](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest)
- [Vite PWA](https://vite-pwa-org.netlify.app/)
- [PWA sharing](https://pwa-sharing.pages.dev)
- [PWA sharing source code](https://github.com/sky172839465/pwa-sharing)
