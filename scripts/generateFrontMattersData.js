import fs from 'fs'
import matter from 'gray-matter'
import { globSync } from 'tinyglobby'

const markdownFilePaths = globSync(['src/**/*.md', '!src/**/*.draft.md'])
const frontMatters = await Promise.all(
  markdownFilePaths
    .map(async (markdownFilePath) => {
      const text = await fs.promises.readFile(markdownFilePath, 'utf-8')
      return { path: markdownFilePath, data: matter(text).data }
    })
)
fs.writeFileSync(
  'src/data/frontMatters.json',
  JSON.stringify(frontMatters, null, 2),
  { encoding: 'utf-8' }
)