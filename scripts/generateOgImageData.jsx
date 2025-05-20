import fs from 'fs'
import { concat, isEmpty, keyBy } from 'lodash-es'
import { tryit } from 'radash'
// eslint-disable-next-line no-unused-vars
import React from 'react'
import satori from 'satori'
import sharp from 'sharp'
import { twj } from 'tw-to-css'

const MODIFIED_FILES = (process.env.MODIFIED_FILES || '').split('\n').filter(Boolean)
const IS_MODIFIED_FILES_EXIST = !isEmpty(MODIFIED_FILES)
const MODIFIED_FILE_MAP = keyBy(MODIFIED_FILES)

const routes = JSON.parse(fs.readFileSync('src/data/routes.json', 'utf-8'))
const modifiedRoutes = IS_MODIFIED_FILES_EXIST
  ? routes.filter((route) => {
    const filePath = route.file
    if (filePath.endsWith('index.jsx')) {
      return filePath.replace('index.jsx', 'index.meta.js') in MODIFIED_FILE_MAP
    }

    return filePath in MODIFIED_FILE_MAP
  })
  : routes
const favicon = fs.readFileSync('public/favicon.svg', 'utf-8').replace(/>\s+</g, '><')
console.log('Modified routes', modifiedRoutes)

const HOMEPAGE_TITLE = 'YUSONG.DEV'

const getOgImgComponent = (route) => {
  const { data = {} } = route
  const { title, tags = [] } = data
  const isNoTags = tags[0] === false
  const isHomepage = title === HOMEPAGE_TITLE
  let OgImg
  if (isHomepage) {
    OgImg = (
      <div
        style={{
          fontFamily: 'Noto Sans TC',
          fontWeight: 700,
          backgroundColor: '#f8fafc',
          backgroundImage: 'url(\'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><path d=%22M0 0 L40 40 M40 0 L0 40%22 stroke=%22%23000000%22 stroke-opacity=%220.05%22 stroke-width=%222%22/></svg>\')',
          ...twj('w-full h-full flex flex-col justify-between p-12 text-black bg-repeat')
        }}
      >
        <div
          style={{
            boxShadow: '0 0 80px rgba(255, 255, 255, 0.6)',
            ...twj('flex justify-center items-center gap-20 h-full w-full p-4 pl-2 bg-white')
          }}
        >
          <div style={twj('flex rounded-md p-2')}>
            <img
              style={twj('rounded-sm')}
              src={`data:image/svg+xml,${favicon}`}
              width={150}
              height={150}
            />
          </div>
          <span
            style={{
              fontSize: '120px',
              ...twj('flex')
            }}
          >
            {HOMEPAGE_TITLE}
          </span>
        </div>
      </div>
    )
    return OgImg
  }
  
  OgImg = (
    <div
      style={{
        fontFamily: 'Noto Sans TC',
        fontWeight: 700,
        backgroundColor: '#f8fafc',
        backgroundImage: 'url(\'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><path d=%22M0 0 L40 40 M40 0 L0 40%22 stroke=%22%23000000%22 stroke-opacity=%220.05%22 stroke-width=%222%22/></svg>\')',
        ...twj('w-full h-full flex flex-col justify-between p-12 text-black bg-repeat')
      }}
    >
      <div style={twj('flex h-[8%] w-full items-center justify-between')}>
        <div
          style={{
            boxShadow: '0 0 80px rgba(255, 255, 255, 0.6)',
            ...twj('flex items-center gap-6 p-4 pl-2 bg-white')
          }}
        >
          <div style={twj('flex rounded-md bg-white p-2')}>
            <img
              style={twj('rounded-sm')}
              src={`data:image/svg+xml,${favicon}`}
              width={50}
              height={50}
            />
          </div>
          <span
            style={{
              fontSize: '50px',
              ...twj('flex')
            }}
          >
            {HOMEPAGE_TITLE}
          </span>
        </div>
      </div>
      <div
        style={{
          fontSize: '90px',
          ...twj('flex h-[84%] items-center justify-center px-10')
        }}
      >
        <div
          style={{
            boxShadow: '0 0 80px rgba(255, 255, 255, 0.6)',
            ...twj('bg-white p-4')
          }}  
        >
          {title}
        </div>
      </div>
      <div style={twj('flex h-[8%] w-full items-center justify-end text-white')}>
        <div
          style={{
            fontSize: '20px',
            ...twj(`flex gap-6 ${isNoTags ? 'hidden' : ''}`)
          }}
        >
          {tags.map((tag, index) => (
            <div
              style={{
                backdropFilter: 'blur(24px)',
                ...twj('flex p-4 bg-black/30 text-white text-xl rounded-md')
              }}
              key={index}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
  return OgImg
}

const IMAGE_TYPE = {
  OG: 'og',
  X: 'x'
}

const IMAGE_FILE = {
  [IMAGE_TYPE.OG]: 'og.jpg',
  [IMAGE_TYPE.X]: 'x.jpg'
}

 
 
const DIMENSIONS = {
  [IMAGE_TYPE.OG]: { width: 1200, height: 630 },
  [IMAGE_TYPE.X]: { width: 1200, height: 675 }
}

const fontData = fs.readFileSync('scripts/fonts/NotoSansTC-Regular.ttf')

const generateSVG = async (route, imageType) => {
  const { file } = route
  const imageFile = IMAGE_FILE[imageType]
  const ogImgPath = file.replace(/index.jsx|index.md/, `images/${imageFile}`)
  const Component = getOgImgComponent(route)
  const svg = await satori(Component, {
    fonts: [
      {
        name: 'Noto Sans TC',
        data: fontData,
        style: 'normal'
      }
    ],
    ...DIMENSIONS[imageType]
  })

  const outputDir = ogImgPath.replace(imageFile, '')
  const [error] = await tryit(() => fs.promises.access(outputDir))()
  if (error) {
    await fs.promises.mkdir(outputDir, { recursive: true })
  }
  
  const jpg = await sharp(Buffer.from(svg)).jpeg().toBuffer()
  return fs.promises.writeFile(ogImgPath, jpg)
}

const [error] = await tryit(() => {
  return Promise.all(concat(...[IMAGE_TYPE.OG, IMAGE_TYPE.X].map((imageType) => {
    return modifiedRoutes.map((route) => generateSVG(route, imageType))
  })))
})()

if (error) {
  console.log(error)
}
