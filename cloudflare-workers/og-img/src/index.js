import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api'
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { twj } from 'tw-to-css'

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
          <div
            style={{
              backgroundColor: 'rgb(255 255 255 / 0.3)',
              ...twj('absolute left-10 top-10 flex gap-2 items-center backdrop-blur-sm rounded-xl p-2')
            }}
          >
            <div style={twj('flex rounded-xl')}>
              <img
                style={twj('rounded-md')}
                src={`data:image/svg+xml,<?xml version="1.0" encoding="UTF-8"?>
                <!DOCTYPE svg  PUBLIC '-//W3C//DTD SVG 20010904//EN'  'http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd'>
                <svg version="1.0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <metadata>Created by Svg.la</metadata>
                <g transform="translate(0 512) scale(.1 -.1)">
                <path d="m0 2805v-2316l62 67c82 88 233 186 443 289 262 129 332 155 444 166 132 14 226 34 265 59 113 69 776 867 989 1189 38 58 117 170 174 249 96 130 113 147 194 203s95 70 169 179c44 65 104 140 134 167 88 78 107 136 64 201-23 33-116 88-167 98-69 14-269 141-328 209-51 58-98 167-113 260-17 112-45 194-81 244-17 24-28 46-24 49 3 3 27-2 53-12s124-42 217-71c94-29 184-59 200-68 37-19 78-62 99-105 23-45 71-261 91-402 13-102 18-117 41-136 14-12 34-34 44-49l19-29 7 29c10 41-5 521-22 662-25 224-58 342-233 845-28 80-51 149-51 152s17 6 38 6c46 0 33 22 145-255 124-310 178-480 192-605 12-108 12-108 44-57 16 24 45 57 65 72 25 19 36 35 36 54 0 33 48 135 88 183 44 55 250 236 297 261 46 25 86 26 441 12l212-8-97-77c-53-43-139-114-191-159-167-142-258-180-455-191-112-6-151-12-195-30-132-56-197-139-207-263-3-35 2-163 12-284 19-243 13-356-24-466-22-64-39-90-122-192-47-58-99-141-99-158 0-3 24-7 53-11 28-4 120-18 202-32 215-36 414-54 615-54h175l2 50c4 99 76 198 178 246 54 26 107 29 272 16l82-7-55-65c-31-36-87-108-124-160-68-94-118-139-156-141-29-1 216-86 293-102l68-14 3-47c3-42 1-47-15-43-10 3-62 17-115 32-54 14-118 34-143 45s-89 31-141 46c-92 25-108 26-402 28-321 3-308 2-799 72l-123 17-62-43c-103-70-131-104-234-276-107-180-102-173-486-666-147-189-305-393-352-453-205-266-276-313-566-380-300-69-751-337-901-534-58-77-113-186-127-253l-10-48h2559 2559v2560 2560h-2560-2560v-2315z"/>
                <path d="m3570 4440c30-5 111-8 180-7h125l-90 8c-49 4-130 7-180 7-83-1-86-1-35-8z"/>
                <path d="m2460 3925c0-12 63-100 107-149 48-54 104-164 123-241 12-54 54-138 78-158 8-6 1 13-15 43-17 30-36 79-43 109-13 53-9 178 5 216 6 15 5 17-4 9-6-6-17-41-24-79l-13-69-18 47c-24 65-23 142 3 202 12 26 19 50 17 52-8 9-49-91-54-133l-5-43-20 27c-12 15-24 29-28 32-3 3-29 36-58 73-28 37-51 65-51 62z"/>
                <path d="m2437 3700c24-11 83-47 133-81 49-35 92-61 94-58 7 6-172 125-217 144-52 21-60 17-10-5z"/>
                <path d="m4071 2867c-6-29-20-67-31-84l-19-32 81 39c110 54 142 78 45 35-65-29-78-32-73-18 8 30 19 113 14 113-3 0-10-24-17-53z"/>
                <path d="m3990 2754c0-17-7-39-15-50-17-23-19-38-3-28 6 4 37 7 67 7l56-1-46 10c-45 9-47 11-47 45 0 19-3 37-6 40-3 4-6-7-6-23z"/>
                </g>
                </svg>`.replace(/\n/g, '')}
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
                style={{
                  backgroundColor: 'rgb(255 255 255 / 0.3)',
                  ...twj('p-2 flex text-white backdrop-blur-sm rounded-md')
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
