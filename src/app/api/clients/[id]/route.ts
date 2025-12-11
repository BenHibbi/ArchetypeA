import { NextRequest, NextResponse } from 'next/server'
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

// GET /api/clients/[id] - Obtenir un client par ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { supabase, response } = await requireAuth()
    if (!supabase) return response!

    const { id } = params
    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
    }

    const { data: client, error } = await supabase
      .from('clients')
      .select(
        `
        *,
        sessions (
          id,
          status,
          started_at,
          completed_at,
          created_at,
          responses (*)
        )
      `
      )
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json(client)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/clients/[id] - Mettre à jour un client
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { supabase, response } = await requireAuth()
    if (!supabase) return response!

    const { id } = params
    const body = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
    }

    // Build update object with only provided fields
    const updateData: {
      email?: string
      company_name?: string | null
      contact_name?: string | null
      website_url?: string | null
      notes?: string | null
    } = {}

    if ('email' in body && typeof body.email === 'string') {
      updateData.email = body.email.trim()
    }
    if ('company_name' in body) {
      updateData.company_name =
        typeof body.company_name === 'string' ? body.company_name.trim() || null : null
    }
    if ('contact_name' in body) {
      updateData.contact_name =
        typeof body.contact_name === 'string' ? body.contact_name.trim() || null : null
    }
    if ('website_url' in body) {
      updateData.website_url =
        typeof body.website_url === 'string' ? body.website_url.trim() || null : null
    }
    if ('notes' in body) {
      updateData.notes = typeof body.notes === 'string' ? body.notes.trim() || null : null
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: client, error } = await (supabase.from('clients') as any)
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(client)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/clients/[id] - Supprimer un client
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { supabase, response } = await requireAuth()
    if (!supabase) return response!

    const { id } = params
    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
    }

    const { error } = await supabase.from('clients').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
