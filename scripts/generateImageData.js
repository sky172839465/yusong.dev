import fs from 'fs'
import { groupBy, isEmpty, keyBy, keys } from 'lodash-es'
import path from 'path'
import sharp from 'sharp'
import { glob } from 'tinyglobby'

import { DATA_FOLDER, PUBLIC_DATA_FOLDER, ROUTE_FOLDER } from './constants.js'

const MODIFIED_FILES = (process.env.MODIFIED_FILES || '').split('\n').filter(Boolean)
const IS_MODIFIED_FILES_EXIST = !isEmpty(MODIFIED_FILES)

const inputFolder = 'src'  // Folder where the original images are
const SIZE = {
  SMALL: 'small',   // Small size for mobile
  MEDIUM: 'medium',  // Medium size for tablets
  LARGE: 'large'   // Large size for desktops
}
const QUALITY = {
  [SIZE.SMALL]: 100,
  [SIZE.MEDIUM]: 90,
  [SIZE.LARGE]: 80
}
const sizes = {
  [SIZE.SMALL]: 768,
  [SIZE.MEDIUM]: 1024,
  [SIZE.LARGE]: 1200
}

// Get dimensions of an image
async function getImageDimensions(filePath) {
  try {
    const metadata = await sharp(filePath).metadata()
    return { width: metadata.width, height: metadata.height }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error)
    return null
  }
}

// Process images: Resize & Get dimensions
async function processImages() {
  const imagePaths = await glob([`${inputFolder}/**/*.{jpg,jpeg,png}`], {
    ignore: ['**/*.gen.{jpg,jpeg,png,webp}', '**/og.jpg', '**/x.jpg']
  })
  const transformImageMap = keyBy(
    IS_MODIFIED_FILES_EXIST
      ? MODIFIED_FILES.filter((file) => file.match(/\.(jpg|jpeg,png)$/))
      : imagePaths
  )

  let results = []
  console.log('Grab image paths', imagePaths.slice(0, 3))
  console.log('Modified file paths', MODIFIED_FILES)

  for (const filePath of imagePaths) {
    const fileName = path.basename(filePath, path.extname(filePath))
    const outputDir = path.dirname(filePath)

    // Get original image dimensions
    const originalDimensions = await getImageDimensions(filePath)
    if (!originalDimensions) continue
    
    const isNeedTransform = filePath in transformImageMap
    const webpFilePath = path.join(outputDir, `${fileName}-origin.gen.webp`)
    if (isNeedTransform) {
      await sharp(filePath)
        .webp({ quality: 100 })
        .toFile(webpFilePath)
    }

    let imageInfo = {
      original: {
        path: filePath,
        webp: webpFilePath,
        route: outputDir,
        width: originalDimensions.width,
        height: originalDimensions.height
      },
      sizes: []
    }

    // Resize and save images in multiple sizes
    for (const [label, width] of Object.entries(sizes)) {
      // const outputFilePath = path.join(outputDir, `${fileName}-${label}.gen${path.extname(filePath)}`)
      const outputFilePath = path.join(outputDir, `${fileName}-${label}.gen.webp`)

      if (isNeedTransform) {
        await sharp(filePath)
          .webp({ quality: QUALITY[label] })
          .resize({ width: imageInfo.original.width > width ? width : imageInfo.original.width })
          .toFile(outputFilePath)
      }

      // Get dimensions of resized image
      const resizedDimensions = await getImageDimensions(outputFilePath)

      imageInfo.sizes.push({
        size: label,
        path: outputFilePath,
        width: resizedDimensions.width,
        height: resizedDimensions.height
      })
    }

    results.push(imageInfo)
  }

  return results
}

// Run the script
const images = await processImages()

fs.writeFileSync(`${DATA_FOLDER}/images.json`, JSON.stringify(images), { encoding: 'utf-8' })

const routeImageMap = groupBy(images, 'original.route')
for (const route of keys(routeImageMap)) {
  const image = routeImageMap[route]
  fs.writeFileSync(
    `${PUBLIC_DATA_FOLDER}/${route.replace(ROUTE_FOLDER, '').replaceAll('/', '_')}.json`,
    JSON.stringify(keyBy(image, 'original.path')),
    { encoding: 'utf-8' }
  )
}
