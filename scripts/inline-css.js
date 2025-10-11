import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 取得路徑
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')

// 找出 index.html 和 CSS
const htmlPath = path.join(distDir, 'index.html')
const cssFile = fs.readdirSync(path.join(distDir, 'assets')).find(file => file.endsWith('.css'))
const cssPath = path.join(distDir, 'assets', cssFile)

// 讀取內容
const html = fs.readFileSync(htmlPath, 'utf-8')
const css = fs.readFileSync(cssPath, 'utf-8')

// 將 `<link rel="stylesheet" ...>` 換成 inline <style>
const newHtml = html.replace(/<link rel="stylesheet".*?>/, `<style>${css}</style>`)

// 寫回 HTML
fs.writeFileSync(htmlPath, newHtml)

console.log(`\n⚙️  import dist/assets/${cssFile} as inline css into index.html`)
