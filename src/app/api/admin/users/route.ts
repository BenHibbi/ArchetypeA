import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Liste des emails admin (toi)
const ADMIN_EMAILS = ['benjamin.lacaze@gmail.com', 'benjaminlacazemusic@gmail.com', 'ben@archetype.design']

export async function GET() {
  const supabase = await createClient()

  // Vérifier que l'utilisateur est admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Récupérer tous les profils utilisateurs
  const { data: profiles, error } = await supabase
    .from('user_profiles')
    .select('*')
    .order('requested_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ profiles })
}

export async function PATCH(request: Request) {
  const supabase = await createClient()

  // Vérifier que l'utilisateur est admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, status } = await request.json()

  if (!id || !['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { error } = await supabase
    .from('user_profiles')
    .update({
      status,
      approved_at: status === 'approved' ? new Date().toISOString() : null,
      approved_by: user.email,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
