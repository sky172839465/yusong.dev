import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'
import mdPlugin from 'vite-plugin-markdown'

// https://vitejs.dev/config/
export default ({ mode }) => {
  const isProd = mode === 'production'

  return defineConfig({
    plugins: [
      react(),
      mdPlugin.plugin({ mode: 'html' })
    ],
    css: {
      postcss: {
        plugins: [tailwindcss()]
      }
    },
    define: {
      'window.IS_PROD': `${isProd}`
    }
  })
}
