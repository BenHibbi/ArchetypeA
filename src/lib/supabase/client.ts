import { createBrowserClient } from '@supabase/ssr'

// Note: Pour activer le typage complet Supabase, générer les types avec:
// npx supabase gen types typescript --project-id <project-id> > src/types/database.ts
// Puis importer et utiliser: createBrowserClient<Database>(...)

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
