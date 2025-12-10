import { NextResponse } from 'next/server'
import { notifyAdminOfInterest, sendConfirmationToClient } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const {
      clientEmail,
      clientPhone,
      clientMessage,
      businessName,
      designTitle,
      actionType,
      finalPrice,
    } = await request.json()

    if (!clientEmail || !actionType) {
      return NextResponse.json(
        { error: 'clientEmail and actionType are required' },
        { status: 400 }
      )
    }

    // Send notification to admin
    const adminResult = await notifyAdminOfInterest({
      clientEmail,
      clientPhone,
      clientMessage,
      businessName,
      designTitle,
      actionType,
      finalPrice,
    })

    if (adminResult.error) {
      console.error('Failed to notify admin:', adminResult.error)
    }

    // Send confirmation to client
    const clientResult = await sendConfirmationToClient({
      clientEmail,
      businessName,
      actionType,
    })

    if (clientResult.error) {
      console.error('Failed to send confirmation:', clientResult.error)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
