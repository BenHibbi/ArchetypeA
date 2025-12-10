import { NextResponse } from 'next/server'

const SCREENSHOTONE_ACCESS_KEY = process.env.SCREENSHOTONE_ACCESS_KEY

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL manquante' }, { status: 400 })
    }

    if (!SCREENSHOTONE_ACCESS_KEY) {
      return NextResponse.json({ error: 'Clé API ScreenshotOne non configurée' }, { status: 500 })
    }

    // Build ScreenshotOne URL with parameters
    const params = new URLSearchParams({
      access_key: SCREENSHOTONE_ACCESS_KEY,
      url: url,
      viewport_width: '1280',
      viewport_height: '800',
      format: 'png',
      block_ads: 'true',
      block_cookie_banners: 'true',
      block_chats: 'true',
      delay: '2', // Wait 2 seconds for page to fully load
    })

    const screenshotUrl = `https://api.screenshotone.com/take?${params.toString()}`

    // Fetch the screenshot
    const response = await fetch(screenshotUrl)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('ScreenshotOne error:', errorText)
      return NextResponse.json(
        { error: 'Erreur lors de la capture du screenshot' },
        { status: response.status }
      )
    }

    // Get the image as buffer and convert to base64
    const imageBuffer = await response.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString('base64')
    const dataUrl = `data:image/png;base64,${base64Image}`

    return NextResponse.json({ screenshot: dataUrl })
  } catch (error) {
    console.error('Screenshot API error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la capture du screenshot' },
      { status: 500 }
    )
  }
}
