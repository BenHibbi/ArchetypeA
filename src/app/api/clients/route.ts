import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Tables } from '@/types/database'

interface ClientWithSessions extends Tables<'clients'> {
  sessions?: Array<Tables<'sessions'> & {
    responses?: Tables<'responses'>[]
  }>
}

async function requireAuth() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { supabase: null, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  return { supabase, response: null }
}

// GET /api/clients - Liste tous les clients (auth required)
export async function GET() {
  try {
    const { supabase, response } = await requireAuth()
    if (!supabase) return response!

    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        sessions (
          id,
          status,
          started_at,
          completed_at,
          created_at,
          responses (*)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Cast to proper type since Supabase can't infer joins
    const clients = data as unknown as ClientWithSessions[]

    // Ajouter la dernière session à chaque client
    const clientsWithLatest = clients.map((client) => ({
      ...client,
      latest_session: client.sessions?.[0] || null,
    }))

    return NextResponse.json(clientsWithLatest)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/clients - Créer un nouveau client (auth required)
export async function POST(request: NextRequest) {
  try {
    const { supabase, response } = await requireAuth()
    if (!supabase) return response!

    const body = await request.json()
    const { email, company_name, contact_name, website_url, notes } = body || {}

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: client, error } = await (supabase
      .from('clients') as any)
      .insert({
        email: email.trim(),
        company_name: company_name?.trim() || null,
        contact_name: contact_name?.trim() || null,
        website_url: website_url?.trim() || null,
        notes: notes?.trim() || null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
