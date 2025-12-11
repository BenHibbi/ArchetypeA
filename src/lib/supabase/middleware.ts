import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

type CookieToSet = { name: string; value: string; options?: CookieOptions }

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect studio routes
  if (!user && request.nextUrl.pathname.startsWith('/studio')) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // Check approval status for studio routes
  if (user && request.nextUrl.pathname.startsWith('/studio')) {
    // Skip check for pending page itself
    if (!request.nextUrl.pathname.startsWith('/auth/pending')) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('status')
        .eq('user_id', user.id)
        .single()

      // If no profile or not approved, redirect to pending page
      if (!profile || profile.status !== 'approved') {
        const url = request.nextUrl.clone()
        url.pathname = '/auth/pending'
        return NextResponse.redirect(url)
      }
    }
  }

  // If user is approved and tries to access pending page, redirect to studio
  if (user && request.nextUrl.pathname === '/auth/pending') {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('status')
      .eq('user_id', user.id)
      .single()

    if (profile?.status === 'approved') {
      const url = request.nextUrl.clone()
      url.pathname = '/studio'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
