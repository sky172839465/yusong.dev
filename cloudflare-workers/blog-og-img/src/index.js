import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api'
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { twj } from 'tw-to-css'

export default {
  async fetch (request) {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'Hello, World!'
    const subtitle = searchParams.get('subtitle') || 'Dynamic OG Image Generation'
    const width = searchParams.get('width') || 1200
    const height = searchParams.get('height') || 630
    let component
    try {
      component = (
        <div
          style={{
            fontFamily: 'Noto Sans TC',
            fontWeight: 400,
            backgroundImage: `linear-gradient(
              to bottom,
              #ffffff 5%,
              #e17100 40%,
              #000000 100%
            )`,
            ...twj('flex text-white w-full h-full items-center justify-center')
          }}
        >
          <h1
            style={{
              fontSize: 64,
              ...twj('font-bold text-white drop-shadow-lg')
            }}
          >
            {`${title}  ${subtitle} 好喔`}
          </h1>
        </div>
      )
    } catch (e) {
      console.log(e)
      component = (
        <div style={{ color: 'green' }}>
          {`${title} ${subtitle}`}
        </div>
      )
    }

    return new ImageResponse(
      component,
      {
        width,
        height,
        fonts: [
          {
            name: 'Noto Sans TC',
            data: await fetchFont(), // Optional: Fetch and include a custom font
            style: 'normal'
          }
        ]
        // debug: true
      }
    )
  }
}

// Optional: Fetch a custom font
const fetchFont = async () => {
  // Step 1: Fetch the Google Font CSS
  const fontCssUrl = 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC&display=swap'
  const fontCss = await fetch(fontCssUrl).then((res) => res.text())

  // Step 2: Extract the font file URL (e.g., .woff2) from the CSS
  const fontFileMatch = fontCss.match(/url\((https:\/\/[^)]+\.ttf)\)/)
  if (!fontFileMatch) {
    return new Response('Font file URL not found in Google Fonts CSS', {
      status: 500
    })
  }
  const fontFileUrl = fontFileMatch[1]

  // Step 3: Download the font file
  const fontData = await fetch(fontFileUrl).then((res) => res.arrayBuffer())
  return fontData
}
