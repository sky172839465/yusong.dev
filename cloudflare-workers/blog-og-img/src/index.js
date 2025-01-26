import { ImageResponse } from 'workers-og'

export default {
  async fetch (request) {
    const { searchParams } = new URL(request.url)

    // Extract query params for the OG image content
    const title = searchParams.get('title') || 'Default Title'
    const description = searchParams.get('description') || 'Default Description'

    return new ImageResponse((
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#282c34',
          color: 'white',
          fontFamily: 'Arial, sans-serif'
        }}
      >
        <h1 style={{ fontSize: '50px', margin: 0 }}>
          {title}
        </h1>
        <p style={{ fontSize: '20px', margin: 0 }}>
          {description}
        </p>
      </div>
    ), {
      width: 1200,
      height: 630
    })
  }
}