import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

let client: SupabaseClient

if (url && anon) {
  client = createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: window.localStorage
    }
  })
} else {
  console.warn('VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing. Using mock Supabase client. Auth will not work.')
  // Mock client to prevent crash - cast as SupabaseClient for type safety
  client = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
      signInWithPassword: async () => ({ error: new Error('Supabase not configured') }),
      signUp: async () => ({ error: new Error('Supabase not configured') }),
      signOut: async () => ({ error: null }),
    },
    // Add other mocks as needed for generic usage
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: [], error: null }),
      update: () => ({ data: [], error: null }),
      delete: () => ({ data: [], error: null })
    })
  } as unknown as SupabaseClient
}

export const supabase = client

