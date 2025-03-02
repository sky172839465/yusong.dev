import fs from 'fs'
import matter from 'gray-matter'
import { compact, flow, get, keyBy, map, orderBy, values } from 'lodash-es'
import markdownit from 'markdown-it'
import path from 'path'
import { tryit } from 'radash'
import { globSync } from 'tinyglobby'

import getConvertedHtml from '../src/utils/getConvertedHtml.js'
import { ARTICLE_PATH_NAME, DATA_FOLDER, DRAFT_ARTICLE_PATH_NAME, PAGE_FILE_NAME, PAGE_META_FILE_NAME, PUBLIC_DATA_FOLDER, PUBLIC_FOLDER, ROUTE_FOLDER } from './constants.js'

const TYPE = {
  WEBSITE: 'website',
  ARTICLE: 'article'
}

const LANG = {
  EN: 'en',
  ZH_TW: 'zh-TW'
}
const LANG_CODE_MAP = keyBy(values(LANG))

const getLang = pagePath => {
  return LANG_CODE_MAP[get(pagePath.match(/^\/([A-Za-z-]+)\//), '1')] || LANG.ZH_TW
}

const md = markdownit({
  html: true,
  linkify: true,
  typographer: true
})

const pageFilePaths = globSync(`${ROUTE_FOLDER}/**/${PAGE_FILE_NAME}`)
const pageMetaFilePathMap = keyBy(globSync(`${ROUTE_FOLDER}/**/${PAGE_META_FILE_NAME}`))
const pages = await Promise.all(
  pageFilePaths
    .map(async (pageFilePath) => {
      const pageMetaFilePath = pageFilePath.replace(PAGE_FILE_NAME, PAGE_META_FILE_NAME)
      const isMetaExist = (pageMetaFilePath in pageMetaFilePathMap)
      const metaData = isMetaExist ? await import(`../${pageMetaFilePath}`).then(module => module.default) : {}
      const pagePath = pageFilePath.replace(ROUTE_FOLDER, '').replace(PAGE_FILE_NAME, '')
      return {
        file: pageFilePath,
        path: pagePath,
        type: TYPE.WEBSITE,
        lang: getLang(pagePath),
        data: {
          ...metaData,
          tags: [false]
        }
      }
    })
)

const noJsArticleTemplate = fs.readFileSync('scripts/noJsArticle/index.html', 'utf-8')

const articleFilePaths = globSync([
  `${ROUTE_FOLDER}/**/${ARTICLE_PATH_NAME}`,
  `!${ROUTE_FOLDER}/**/${DRAFT_ARTICLE_PATH_NAME}`
])
// const getConvertedHtml = await import('../src/utils/getConvertedHtml.js').then((m) => m.default)
const articles = await Promise.all(
  articleFilePaths
    .map(async (articleFilePath) => {
      const text = await fs.promises.readFile(articleFilePath, 'utf-8')
      const pagePath = articleFilePath.replace(ROUTE_FOLDER, '').replace(ARTICLE_PATH_NAME, '')
      const { data, content } = matter(text)
      // create nojs html
      const htmlFilePath = `${PUBLIC_FOLDER}/nojs${pagePath}/index.html`
      const dir = path.dirname(htmlFilePath)
      const [htmlContent] = await Promise.all([
        await (async () => {
          const originHtml = (md.render(content)).replaceAll(/\.png|\.jpg/g, '-origin.gen.webp')
          const [error, convertedHtml] = await tryit(() => getConvertedHtml(originHtml))()
          if (error) {
            throw error
          }

          return convertedHtml
        })(),
        await fs.promises.mkdir(dir, { recursive: true })
      ])
      await fs.promises.writeFile(
        htmlFilePath,
        noJsArticleTemplate.replace('<!-- __replacement__ -->', htmlContent),
        'utf-8'
      )
      return {
        file: articleFilePath,
        path: pagePath,
        type: TYPE.ARTICLE,
        lang: getLang(pagePath),
        data
      }
    })
)

fs.writeFileSync(`${DATA_FOLDER}/routes.json`, JSON.stringify([...pages, ...articles]), { encoding: 'utf-8' })
fs.writeFileSync(`${DATA_FOLDER}/articles.json`, JSON.stringify(articles), { encoding: 'utf-8' })

const series = pages.filter((page) => {
  return (page.path.startsWith('/article') || page.path.match(/^\/(\D+)?\/article/)) && page.file.endsWith('index.jsx')
})
fs.writeFileSync(`${DATA_FOLDER}/series.json`, JSON.stringify(series), { encoding: 'utf-8' })

const articleMapByFilePathName = keyBy(articles, 'file')
Promise.all(
  series.map(async (item) => {
    const seriesPath = item.path
    const [error, response] = await tryit(
      () => import(path.resolve(`${ROUTE_FOLDER}/${seriesPath}index.meta.js`))
    )()
    const seriesName = error ? 'NotFound' : get(response, 'default.title', 'TitleNotFound')
    
    const seriesArticles = flow(
      () => globSync(`${ROUTE_FOLDER}/${seriesPath}/**/index.md`),
      (filePaths) => map(filePaths, (filePath) => articleMapByFilePathName[filePath]),
      compact,
      (targetArticles) => orderBy(targetArticles, 'data.index', 'asc'),
      (sortedArticles) => map(sortedArticles, (sortedArticle) => ({ ...sortedArticle, series: seriesName }))
    )()
    return fs.promises.writeFile(
      `${PUBLIC_DATA_FOLDER}/${seriesPath.replaceAll('/', '_')}articles.json`,
      JSON.stringify(seriesArticles),
      { encoding: 'utf-8' }
    )
  })
)
