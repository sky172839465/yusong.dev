import { VitePWA } from 'vite-plugin-pwa'

export default VitePWA({
  registerType: 'autoUpdate',
  devOptions: {
    enabled: true
  }
})
