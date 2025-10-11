import { VitePWA } from 'vite-plugin-pwa'

export default VitePWA({
  registerType: 'prompt',
  // https://vite-pwa-org.netlify.app/guide/inject-manifest.html
  strategies: 'injectManifest',
  injectManifest: {
    globPatterns: [] // Cache only necessary files
  },
  manifest: {
    name: 'yusong.dev',
    short_name: 'yusong.dev',
    description: 'This is Yusong\'s blog',
    theme_color: '#ffffff',
    display: 'standalone',
    'icons': [
      {
        'src': 'pwa-64x64.png',
        'sizes': '64x64',
        'type': 'image/png'
      },
      {
        'src': 'pwa-192x192.png',
        'sizes': '192x192',
        'type': 'image/png'
      },
      {
        'src': 'pwa-512x512.png',
        'sizes': '512x512',
        'type': 'image/png'
      },
      {
        'src': 'maskable-icon-512x512.png',
        'sizes': '512x512',
        'type': 'image/png',
        'purpose': 'maskable'
      }
    ]
  },
  // https://vite-pwa-org.netlify.app/guide/development.html#type-declarations
  devOptions: {
    suppressWarnings: true,
    enabled: true,
    type: 'module'
  }
})
