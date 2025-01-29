import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api'
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { twj } from 'tw-to-css'

import favicon from './favicon'

export default {
  async fetch (request, env, ctx) {
    const requestUrl = request.url
    const cache = await caches.open('response')
    const cached = await cache.match(requestUrl)
    if (cached) {
      console.log('response cache hit')
      return cached
    }

    const { searchParams } = new URL(requestUrl)
    const title = searchParams.get('title') || 'Hello, World!'
    const width = searchParams.get('width') || 1200
    const height = searchParams.get('height') || 630
    const tags = (searchParams.get('tags') || 'react,single page app,blog').split(',')
    let component
    try {
      component = (
        <div
          style={{
            fontFamily: 'Noto Sans TC',
            fontWeight: 400,
            backgroundImage: `linear-gradient(
              to right top,
              #e17100,
              #fb2c36
            )`,
            ...twj('relative flex text-white w-full h-full items-center justify-center')
          }}
        >
          <div style={twj('absolute left-10 top-10 flex gap-2 items-center bg-white/30 backdrop-blur-sm rounded-xl p-2')}>
            <div style={twj('flex rounded-xl')}>
              <img
                style={twj('rounded-md')}
                src={favicon}
                width={50}
                height={50}
              />
            </div>
            <span style={{ fontSize: 30, fontWeight: 700 }}>
              YUSONG.TW
            </span>
          </div>
          <h1
            style={{
              fontSize: 50,
              fontWeight: 700,
              ...twj('font-bold text-white drop-shadow-lg p-12')
            }}
          >
            {title}
          </h1>
          <div
            style={{
              fontWeight: 700,
              ...twj('absolute left-10 bottom-10 flex text-black gap-2')
            }}
          >
            {tags.map((tag, index) => (
              <div
                style={twj('p-2 flex bg-white/30 backdrop-blur-sm rounded-md')}
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

    const response = new ImageResponse(
      component,
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
      }
    )
    ctx.waitUntil(cache.put(requestUrl, response.clone()))
    return response
  }
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
