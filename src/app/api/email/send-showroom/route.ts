import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendShowroomEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId, clientEmail, clientName, businessName } = await request.json()

    if (!sessionId || !clientEmail) {
      return NextResponse.json(
        { error: 'sessionId and clientEmail are required' },
        { status: 400 }
      )
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const showroomUrl = `${appUrl}/showroom/${sessionId}`

    const { error } = await sendShowroomEmail({
      clientEmail,
      clientName: clientName || clientEmail.split('@')[0],
      showroomUrl,
      businessName,
    })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
