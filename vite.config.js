import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import path from 'path'
import { defineConfig } from 'vite'
import mdPlugin from 'vite-plugin-markdown'
import sitemapPlugin from 'vite-plugin-sitemap'

import { homepage } from './package.json'
import pwaPluginConfig from './pwa.config'
import routes from './src/data/routes.json'

const routePaths = routes.map(route => route.path)


// https://vitejs.dev/config/
export default ({ mode }) => {
  const isProd = mode === 'production'

  return defineConfig({
    plugins: [
      react(),
      tailwindcss(),
      pwaPluginConfig,
      mdPlugin.plugin({ mode: 'html' }),
      sitemapPlugin({
        hostname: homepage,
        dynamicRoutes: routePaths
      })
    ],
    css: {
      postcss: {
        plugins: [autoprefixer()]
      }
    },
    build: {
      minify: 'esbuild',
      cssCodeSplit: true,
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            // Move common libraries to a separate chunk
            vendor: ['react', 'react-dom']
          }
        }
      }
    },
    define: {
      'window.IS_PROD': `${isProd}`,
      'window.THEME_KEY': '"dark-mode"'
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  })
}
