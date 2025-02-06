import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'
import { simpleGit } from 'simple-git'

(async function () {
  const { stdout = '' } = await simpleGit().raw(['diff', '--name-status', 'origin/main'])
  console.log(stdout)
  const lines = stdout.trim().split('\n')

  const modifiedMarkdownFiles = lines
    .map(line => line.split('\t'))
    .filter(([status, file]) => (status === 'M' || status === 'A') && file.endsWith('.md'))
    .map(([, file]) => file)

  const today = new Date().toISOString().split('T')[0]

  modifiedMarkdownFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file)
    if (!fs.existsSync(filePath)) return

    let content = fs.readFileSync(filePath, 'utf8')
    const match = content.match(/^---\n([\s\S]+?)\n---/)

    if (match) {
      let frontmatter = yaml.load(match[1])
      if (frontmatter.modifiedAt) {
        frontmatter.modifiedAt = today
        const updatedFrontmatter = `---\n${yaml.dump(frontmatter)}---`
        content = content.replace(match[0], updatedFrontmatter)
        fs.writeFileSync(filePath, content, 'utf8')
      }
    }
  })
})()