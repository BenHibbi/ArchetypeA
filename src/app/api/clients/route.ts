import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/clients - Liste tous les clients
export async function GET() {
  try {
    const supabase = await createClient()

    const { data: clients, error } = await supabase
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

// POST /api/clients - Créer un nouveau client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, company_name, contact_name, website_url, notes } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: client, error } = await supabase
      .from('clients')
      .insert({
        email,
        company_name,
        contact_name,
        website_url,
        notes,
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
