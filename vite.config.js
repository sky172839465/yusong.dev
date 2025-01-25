import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'
import mdPlugin from 'vite-plugin-markdown'

import { name } from './package.json'
const {
  BASENAME
} = process.env

// https://vitejs.dev/config/
export default ({ mode }) => {
  const isProd = mode === 'production'
  const appBaseName = BASENAME ? `/${name}` : ''

  return defineConfig({
    base: isProd
      ? BASENAME ? appBaseName : undefined
      : '',
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
      'window.APP_BASENAME': `"${appBaseName}"`,
      'window.IS_PROD': `${isProd}`
    }
  })
}
