import fs from 'fs'
import { groupBy, keyBy, keys } from 'lodash-es'
import path from 'path'
import sharp from 'sharp'
import { glob } from 'tinyglobby'

import { DATA_FOLDER, PUBLIC_DATA_FOLDER, ROUTE_FOLDER } from './constants.js'

const inputFolder = 'src'  // Folder where the original images are
const sizes = {
  small: 480,   // Small size for mobile
  medium: 800,  // Medium size for tablets
  large: 1200   // Large size for desktops
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
    ignore: ['**/*.gen.{jpg,jpeg,png}', '**/og.jpg', '**/x.jpg']
  })

  let results = []

  for (const filePath of imagePaths) {
    const fileName = path.basename(filePath, path.extname(filePath))
    const outputDir = path.dirname(filePath)

    // Get original image dimensions
    const originalDimensions = await getImageDimensions(filePath)
    if (!originalDimensions) continue

    let imageInfo = {
      original: {
        path: filePath,
        route: outputDir,
        width: originalDimensions.width,
        height: originalDimensions.height
      },
      sizes: []
    }

    // Resize and save images in multiple sizes
    for (const [label, width] of Object.entries(sizes)) {
      const outputFilePath = path.join(outputDir, `${fileName}-${label}.gen${path.extname(filePath)}`)

      await sharp(filePath)
        .resize({ width: imageInfo.original.width > width ? width : imageInfo.original.width })
        .toFile(outputFilePath)

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

fs.writeFileSync(`${DATA_FOLDER}/images.json`, JSON.stringify(images, null, 2), { encoding: 'utf-8' })

const routeImageMap = groupBy(images, 'original.route')
for (const route of keys(routeImageMap)) {
  const image = routeImageMap[route]
  fs.writeFileSync(
    `${PUBLIC_DATA_FOLDER}/${route.replace(ROUTE_FOLDER, '').replaceAll('/', '_')}.json`,
    JSON.stringify(keyBy(image, 'original.path'), null, 2),
    { encoding: 'utf-8' }
  )
}
