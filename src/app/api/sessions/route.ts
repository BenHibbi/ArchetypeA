import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { createClient } from '@/lib/supabase/server'

// GET /api/sessions - Liste toutes les sessions
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const clientId = searchParams.get('client_id')

    let query = supabase
      .from('sessions')
      .select(`
        *,
        clients (*),
        responses (*)
      `)
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    const { data: sessions, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(sessions)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/sessions - Créer une nouvelle session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { client_id } = body

    if (!client_id) {
      return NextResponse.json(
        { error: 'client_id is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Générer un ID court et unique pour l'URL
    const sessionId = nanoid(10)

    const { data: session, error } = await supabase
      .from('sessions')
      .insert({
        id: sessionId,
        client_id,
        status: 'pending',
      })
      .select(`
        *,
        clients (*)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Créer une entrée vide dans responses pour l'upsert
    await supabase.from('responses').insert({
      session_id: sessionId,
      moodboard_likes: [],
      features: [],
    })

    return NextResponse.json(session, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
