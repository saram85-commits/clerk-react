import { createClient } from '@supabase/supabase-js'
//import { getToken } from '@clerk/clerk-react'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
  {
    global: {
      fetch: async (url, options = {}) => {
        const token = await getToken({ template: 'supabase' })

        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })
      },
    },
  }
)
