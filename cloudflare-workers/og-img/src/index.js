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
    const tags = (searchParams.get('tags') || 'blog,react').split(',')
    const isNoTags = tags[0] === 'false'
    let component
    try {
      component = (
        <div
          style={{
            fontFamily: 'Noto Sans TC',
            fontWeight: 700,
            ...twj('flex flex-col w-full bg-white')
          }}
        >
          <div
            style={{
              fontSize: '80px',
              ...twj('flex h-[84%] items-center justify-center px-10')
            }}
          >
            {title}
          </div>
          <div style={twj('flex h-[16%] w-full items-center justify-between bg-black px-8 text-white')}>
            <div style={twj('flex items-center gap-2')}>
              <div style={twj('flex rounded-md bg-white p-2')}>
                <img
                  style={twj('rounded-sm')}
                  src={favicon}
                  width={50}
                  height={50}
                />
              </div>
              <span
                style={{
                  fontSize: '30px',
                  ...twj('flex')
                }}
              >
                YUSONG.TW
              </span>
            </div>
            <div
              style={{
                fontSize: '20px',
                ...twj(`flex gap-2 ${isNoTags ? 'hidden' : ''}`)
              }}
            >
              {tags.map((tag, index) => (
                <div
                  style={{
                    border: '4px solid white',
                    ...twj('flex rounded-md p-2')
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
  const fontUrl = 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@700&display=swap'
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
