import { VitePWA } from 'vite-plugin-pwa'

export default VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'yusong.tw',
    short_name: 'yusong.tw',
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
  devOptions: {
    enabled: true
  }
})
