import fs from 'fs'
import path from 'path'

const inputPath = process.env.INPUT_PATH || '/src/article'
const inputTitle = process.env.INPUT_TITLE
const inputDescription = process.env.INPUT_DESCRIPTION
const inputTags = process.env.INPUT_TAGS
const inputIndex = process.env.INPUT_INDEX
const inputContent = process.env.INPUT_CONTENT

if (!inputTitle || !inputDescription || !inputContent) {
  console.error('Missing required inputs')
  process.exit(1)
}

// 確保路徑存在
const articleDir = path.join(process.cwd(), inputPath)
if (!fs.existsSync(articleDir)) {
  fs.mkdirSync(articleDir, { recursive: true })
}

const filePath = path.join(articleDir, 'index.md')

const now = new Date().toISOString()

const dynamicFrontmatterList = []
if (inputTags) {
  const tagsArray = inputTags.split(',').map(tag => tag.toUpperCase().trim())
  dynamicFrontmatterList.push(`tags:\n  - ${tagsArray.join('\n  - ')}`)
}

if (inputIndex) {
  dynamicFrontmatterList.push(`index: ${inputIndex}`)
}

const dynamicFrontmatter = dynamicFrontmatterList.join('\n')

const markdownContent = `---
title: "${inputTitle}"
description: "${inputDescription}"
createdAt: ${now}
modifiedAt: ${now}
${dynamicFrontmatter}
---

${inputContent}
`

// 寫入檔案
fs.writeFileSync(filePath, markdownContent, 'utf8')

console.log(`Article generated at: ${filePath}`)