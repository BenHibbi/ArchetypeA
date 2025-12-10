import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/responses - Créer ou mettre à jour une réponse
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { session_id, ...responseData } = body

    if (!session_id) {
      return NextResponse.json(
        { error: 'session_id is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Upsert: créer ou mettre à jour
    const { data: response, error } = await supabase
      .from('responses')
      .upsert(
        {
          session_id,
          ...responseData,
        },
        { onConflict: 'session_id' }
      )
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/responses?session_id=xxx - Obtenir une réponse par session
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'session_id is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: response, error } = await supabase
      .from('responses')
      .select('*')
      .eq('session_id', sessionId)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
