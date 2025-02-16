import fs from 'fs'
import matter from 'gray-matter'
import { keyBy, orderBy } from 'lodash-es'
import { globSync } from 'tinyglobby'

import { ARTICLE_PATH_NAME, DATA_FOLDER, DRAFT_ARTICLE_PATH_NAME, PAGE_FILE_NAME, PAGE_META_FILE_NAME, ROUTE_FOLDER } from './constants.js'

const TYPE = {
  WEBSITE: 'website',
  ARTICLE: 'article'
}

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

fs.writeFileSync(`${DATA_FOLDER}/routes.json`, JSON.stringify([...pages, ...articles]), { encoding: 'utf-8' })
fs.writeFileSync(`${DATA_FOLDER}/articles.json`, JSON.stringify(articles), { encoding: 'utf-8' })

const series = pages.filter((page) => {
  return page.path.startsWith('/article') && page.file.endsWith('index.jsx')
})
fs.writeFileSync(`${DATA_FOLDER}/series.json`, JSON.stringify(series), { encoding: 'utf-8' })

const pwaArticles = orderBy(
  articles.filter((article) => {
    return article.path.startsWith('/article/pwa')
  }),
  'data.index',
  'asc'
)
fs.writeFileSync(`${DATA_FOLDER}/pwaArticles.json`, JSON.stringify(pwaArticles), { encoding: 'utf-8' })