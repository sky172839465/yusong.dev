import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api'
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { twj } from 'tw-to-css'
export const config = {
  runtime: 'edge'
}

const style = twj`
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
`

const OgImage = (props) => {
  const { title, subtitle } = props
  return (
    <div style={style}>
      <div className='flex size-full flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white'>
        <h1 className='text-6xl font-bold'>
          {title}
        </h1>
        <p className='mt-4 text-2xl'>
          {subtitle}
        </p>
      </div>
    </div>
  )
}

export default function handler(req) {
  const { searchParams } = new URL(req.url)

  // Get dynamic query parameters (e.g., title and subtitle)
  const title = searchParams.get('title') || 'Hello, World!'
  const subtitle = searchParams.get('subtitle') || 'Dynamic OG Image Generation'
  const width = searchParams.get('width') || 1200
  const height = searchParams.get('height') || 630

  return new ImageResponse(
    (
      <OgImage
        title={title}
        subtitle={subtitle}
      />
    ),
    {
      width,
      height,
      fonts: [
        {
          name: 'Inter',
          data: fetchFont(), // Optional: Fetch and include a custom font
          weight: 400,
          style: 'normal'
        }
      ]
    }
  )
}

// Optional: Fetch a custom font
async function fetchFont() {
  const res = await fetch(
    'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700&display=swap'
  )
  return res.arrayBuffer()
}