import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api'
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { twj } from 'tw-to-css'

import favicon from './favicon'

const generateSvg = async (data, ctx) => {
  const { title, tags, width, height } = data
  let component
  try {
    component = (
      <div
        style={{
          fontFamily: 'Noto Sans TC',
          backgroundImage: `linear-gradient(
            to right top,
            #e17100,
            #fb2c36
          )`,
          ...twj('relative flex text-white w-full h-full items-center justify-center')
        }}
      >
        <div
          style={{
            backgroundColor: 'rgb(255 255 255 / 0.3)',
            ...twj('absolute left-10 top-10 flex gap-2 items-center backdrop-blur-sm rounded-xl p-2')
          }}
        >
          <div style={twj('flex rounded-xl')}>
            <img
              style={twj('rounded-md')}
              src={favicon.replace(/\n/g, '')}
              width={50}
              height={50}
            />
          </div>
          <span style={{ fontSize: 30, fontWeight: 'bold' }}>
            YUSONG.TW
          </span>
        </div>
        <h1
          style={{
            fontSize: 50,
            fontWeight: 'bold',
            ...twj('font-bold text-white text-center drop-shadow-lg p-12')
          }}
        >
          {title}
        </h1>
        <div
          style={{
            fontWeight: 'bold',
            ...twj('absolute left-10 text-white bottom-10 flex text-black gap-2')
          }}
        >
          {tags.map((tag, index) => (
            <div
              style={{
                backgroundColor: 'rgb(255 255 255 / 0.3)',
                ...twj('p-2 flex backdrop-blur-sm rounded-md')
              }}
              key={index}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    )
  } catch (e) {
    console.log(e)
  }

  return new ImageResponse(component,
    {
      width,
      height,
      fonts: [
        {
          name: 'Noto Sans TC',
          data: await fetchFont(ctx), // Optional: Fetch and include a custom font
          style: 'normal'
        }
      ]
      // debug: true
    })
}

// Optional: Fetch a custom font
const fetchFont = async (ctx) => {
  // Step 1: Fetch the Google Font CSS
  const fontUrl = 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700&display=swap'
  const cache = await caches.open('fonts')
  const cached = await cache.match(fontUrl)
  if (cached) {
    console.log('font cache hit')
    return cached.arrayBuffer()
  }

  const fontCss = await fetch(fontUrl).then((res) => res.text())

  // Step 2: Extract the font file URL (e.g., .woff2) from the CSS
  const fontFileMatch = fontCss.match(/url\((https:\/\/[^)]+\.ttf)\)/)
  if (!fontFileMatch) {
    return new Response('Font file URL not found in Google Fonts CSS', {
      status: 500
    })
  }
  const fontFileUrl = fontFileMatch[1]

  // Step 3: Download the font file
  const response = await fetch(fontFileUrl)
  ctx.waitUntil(cache.put(fontUrl, response.clone()))
  const fontData = await response.arrayBuffer()
  return fontData
}


export default generateSvg
