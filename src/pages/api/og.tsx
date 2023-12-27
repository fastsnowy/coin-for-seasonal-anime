import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const config = {
  runtime: 'edge',
}

export default async function handler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.nextUrl)
    // ?title=Hello%20World
    const hasTitle = searchParams.has('title')
    const title = hasTitle ? searchParams.get('title') : '🪙'

    return new ImageResponse(
      (
        <div
          style={{
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: '100% 100%',
            width: '100%',
            height: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            position: 'relative',
            backgroundImage: `url(${`data:image/svg+xml,${encodeURIComponent(
              '<svg id="visual" viewBox="0 0 1200 630" width="1200" height="630" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"><rect x="0" y="0" width="1200" height="630" fill="#f2f2f2"></rect><path d="M0 136L28.5 131.2C57 126.3 114 116.7 171.2 109C228.3 101.3 285.7 95.7 342.8 101.3C400 107 457 124 514.2 141.2C571.3 158.3 628.7 175.7 685.8 184C743 192.3 800 191.7 857.2 195.2C914.3 198.7 971.7 206.3 1028.8 197.7C1086 189 1143 164 1171.5 151.5L1200 139L1200 0L1171.5 0C1143 0 1086 0 1028.8 0C971.7 0 914.3 0 857.2 0C800 0 743 0 685.8 0C628.7 0 571.3 0 514.2 0C457 0 400 0 342.8 0C285.7 0 228.3 0 171.2 0C114 0 57 0 28.5 0L0 0Z" fill="#FCAF3C" stroke-linecap="round" stroke-linejoin="miter"></path></svg>',
            )}`})`,
          }}
        >
          <h2
            style={{
              width: '100%',
              color: '#020202',
              fontSize: '4rem',
              justifyContent: 'center',
              paddingLeft: '1rem',
              paddingRight: '1rem',
            }}
          >
            {title}
          </h2>
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              width: '100%',
              bottom: '1rem',
              paddingLeft: '1rem',
              paddingRight: '1rem',
              justifyContent: 'space-between',
            }}
          >
            <h2
              style={{
                width: '100%',
                color: '#020202',
                fontSize: '3rem',
                justifyContent: 'flex-start',
              }}
            >
              <span style={{ color: '#FCAF3C' }}>🪙</span>
              coin for seasonal anime
            </h2>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        // Supported options: 'twemoji', 'blobmoji', 'noto', 'openmoji', 'fluent' and 'fluentFlat'
        // Default to 'twemoji'
        emoji: 'twemoji',
      },
    )
  } catch (error) {
    console.error(error)
    return new Response(`Internal Server Error: ${error}`, { status: 500 })
  }
}
