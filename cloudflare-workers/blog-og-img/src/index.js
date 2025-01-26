import { ImageResponse } from '@cloudflare/pages-plugin-vercel-og/api'
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { twj } from 'tw-to-css'

// Load the generated TailwindCSS styles as a string

// export default {
//   async fetch (request) {
//     const { searchParams } = new URL(request.url)
  
//     // Get dynamic query parameters (e.g., title and subtitle)
//     const title = searchParams.get('title') || 'Hello, World!'
//     const subtitle = searchParams.get('subtitle') || 'Dynamic OG Image Generation'
//     const width = searchParams.get('width') || 1200
//     const height = searchParams.get('height') || 630
  
//     return new ImageResponse(
//       (
//         // <div
//         //   style={twj`
//         //     flex size-full flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white
//         //   `}
//         // >
//         //   <h1 style={twj`text-6xl font-bold`}>
//         //     {title}
//         //   </h1>
//         //   <p className={twj`mt-4 text-2xl`}>
//         //     {subtitle}
//         //   </p>
//         // </div>
//         <div style={{ display: 'flex' }}>
//           Hello, world!
//           <br />
//           {title}
//           <br />
//           {subtitle}
//         </div>
//       ),
//       {
//         width,
//         height,
//         fonts: [
//           {
//             name: 'Inter',
//             // data: await fetchFont(), // Optional: Fetch and include a custom font
//             weight: 400,
//             style: 'normal'
//           }
//         ]
//       }
//     )
//   }
// }

export default {
  async fetch (request) {
    const { searchParams } = new URL(request.url)
  
    // Get dynamic query parameters (e.g., title and subtitle)
    const title = searchParams.get('title') || 'Hello, World!'
    const subtitle = searchParams.get('subtitle') || 'Dynamic OG Image Generation'
    const width = searchParams.get('width') || 1200
    const height = searchParams.get('height') || 630
    let component
    try {
      component = (
        <div
          style={{
            fontFamily: 'Roboto',
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
              fontSize: 32,
              ...twj('font-bold text-white drop-shadow-lg')
            }}
          >
            {`${title}  ${subtitle}`}
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
    // Optional: Fetch a custom font
    // const fetchFont = async () => {
    //   // Step 1: Fetch the Google Font CSS
    const fontCssUrl =
        'https://fonts.googleapis.com/css2?family=Noto+Sans+TC&display=swap'
    //   const fontCss = await fetch(fontCssUrl).then((res) => res.text())

    //   // Step 2: Extract the font file URL (e.g., .woff2) from the CSS
    //   const fontFileMatch = fontCss.match(/url\((https:\/\/[^)]+\.woff2)\)/)
    //   if (!fontFileMatch) {
    //     return new Response('Font file URL not found in Google Fonts CSS', {
    //       status: 500
    //     })
    //   }
    //   const fontFileUrl = fontFileMatch[1]

    //   // Step 3: Download the font file
    //   const fontData = await fetch(fontFileUrl).then((res) => res.arrayBuffer())
    //   return fontData
    // }
    // const fontData = await fetchFont()
    // Step 1: Fetch the Google Font CSS
    // const fontCssUrl =
    // 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap'
    const fontCss = await fetch(fontCssUrl).then((res) => res.text())
    console.log(fontCss)

    // Step 2: Extract the font file URL (e.g., .woff2) from the CSS
    const fontFileMatch = fontCss.match(/url\((https:\/\/[^)]+\.tff)\)/)
    if (!fontFileMatch) {
      return new Response('Font file URL not found in Google Fonts CSS', {
        status: 500
      })
    }
    const fontFileUrl = fontFileMatch[1]

    // Step 3: Download the font file
    const fontData = await fetch(fontFileUrl).then((res) => res.arrayBuffer())
    console.log(fontData.byteLength, typeof fontData)

    return new ImageResponse(
      component,
      {
        width,
        height,
        fonts: [
          {
            name: 'Roboto',
            data: fontData, // Optional: Fetch and include a custom font
            style: 'normal'
          }
        ]
        // debug: true
      }
    )
  }
}
