import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx', // Ensure JSX files are properly processed
        '.jsx': 'jsx'
      }
    }
  },
  ssr: {
    noExternal: ['satori'] // Ensure Satori is processed correctly
  }
})