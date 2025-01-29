import fs from 'fs'
import matter from 'gray-matter'
import { keyBy } from 'lodash-es'
import { globSync } from 'tinyglobby'

const TYPE = {
  WEBSITE: 'website',
  ARTICLE: 'article'
}

const ROUTE_FOLDER = 'src/pages'
const PAGE_FILE_NAME = 'index.jsx'
const PAGE_META_FILE_NAME = 'index.meta.js'
const pageFilePaths = globSync(`${ROUTE_FOLDER}/**/${PAGE_FILE_NAME}`)
const pageMetaFilePathMap = keyBy(globSync(`${ROUTE_FOLDER}/**/${PAGE_META_FILE_NAME}`))
const pages = await Promise.all(
  pageFilePaths
    .map(async (pageFilePath) => {
      const pageMetaFilePath = pageFilePath.replace(PAGE_FILE_NAME, PAGE_META_FILE_NAME)
      const isMetaExist = (pageMetaFilePath in pageMetaFilePathMap)
      const metaData = isMetaExist ? await import(`../${pageMetaFilePath}`).then(module => module.default) : {}
      return {
        file: pageFilePath,
        path: pageFilePath.replace(ROUTE_FOLDER, '').replace(PAGE_FILE_NAME, ''),
        type: TYPE.WEBSITE,
        data: {
          ...metaData,
          tags: [false]
        }
      }
    })
)

const ARTICLE_PATH_NAME = 'index.md'
const DRAFT_ARTICLE_PATH_NAME = 'index.draft.md'
const articleFilePaths = globSync([
  `${ROUTE_FOLDER}/**/${ARTICLE_PATH_NAME}`,
  `!${ROUTE_FOLDER}/**/${DRAFT_ARTICLE_PATH_NAME}`
])
const articles = await Promise.all(
  articleFilePaths
    .map(async (articleFilePath) => {
      const text = await fs.promises.readFile(articleFilePath, 'utf-8')
      return {
        file: articleFilePath,
        path: articleFilePath.replace(ROUTE_FOLDER, '').replace(ARTICLE_PATH_NAME, ''),
        type: TYPE.ARTICLE,
        data: matter(text).data
      }
    })
)

const DATA_FOLDER = 'src/data'
fs.writeFileSync(`${DATA_FOLDER}/routes.json`, JSON.stringify([...pages, ...articles], null, 2), { encoding: 'utf-8' })
fs.writeFileSync(`${DATA_FOLDER}/frontMatters.json`, JSON.stringify(articles, null, 2), { encoding: 'utf-8' })