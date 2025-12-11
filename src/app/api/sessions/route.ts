import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { createClient } from '@/lib/supabase/server'

async function requireAuth() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      supabase: null,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }

  return { supabase, response: null }
}

// GET /api/sessions - Liste les sessions avec pagination
export async function GET(request: NextRequest) {
  try {
    const { supabase, response } = await requireAuth()
    if (!supabase) return response!

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const clientId = searchParams.get('client_id')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build base query for both count and data
    let countQuery = supabase.from('sessions').select('*', { count: 'exact', head: true })

    let dataQuery = supabase
      .from('sessions')
      .select(
        `
        *,
        clients (*),
        responses (*)
      `
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status && status !== 'all') {
      countQuery = countQuery.eq('status', status)
      dataQuery = dataQuery.eq('status', status)
    }

    if (clientId) {
      countQuery = countQuery.eq('client_id', clientId)
      dataQuery = dataQuery.eq('client_id', clientId)
    }

    // Execute both queries in parallel
    const [{ count }, { data: sessions, error }] = await Promise.all([countQuery, dataQuery])

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data: sessions,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: offset + limit < (count || 0),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/sessions - Créer une nouvelle session
export async function POST(request: NextRequest) {
  try {
    const { supabase, response } = await requireAuth()
    if (!supabase) return response!

    const body = await request.json()
    const { client_id } = body

    if (!client_id || typeof client_id !== 'string') {
      return NextResponse.json({ error: 'client_id is required' }, { status: 400 })
    }

    // Générer un ID court et unique pour l'URL
    const sessionId = nanoid(10)

    const { data: session, error } = await supabase
      .from('sessions')
      .insert({
        id: sessionId,
        client_id,
        status: 'pending',
      })
      .select(
        `
        *,
        clients (*)
      `
      )
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
