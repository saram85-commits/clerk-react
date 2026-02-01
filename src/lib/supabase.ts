import { createClient } from '@supabase/supabase-js'
import { useAuth } from '@clerk/clerk-react'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  )
}

// Create Supabase client with JWT token from Clerk
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: async (url, options = {}) => {
      try {
        // Get Clerk JWT token
        const { getToken } = useAuth()
        const token = await getToken({ template: 'supabase' })

        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        })
      } catch (error) {
        console.error('Error getting token:', error)
        return fetch(url, options)
      }
    },
  },
})
supabase.ts
// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

// export function createSupabaseClient(
//   getToken?: () => Promise<string | null>
// ) {
//   return createClient(supabaseUrl, supabaseAnonKey, {
//     global: {
//       fetch: async (url, options = {}) => {
//         const token = getToken ? await getToken() : null

//         return fetch(url, {
//           ...options,
//           headers: {
//             ...options.headers,
//             ...(token ? { Authorization: `Bearer ${token}` } : {}),
//           },
//         })
//       },
//     },
//   })
// }


/**
 * Helper function to ensure user exists in public.users
 * Call this after user signs up via Clerk
 */
export async function ensureUserExists(
  userId: string,
  email: string,
  fullName: string
) {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          id: userId,
          email,
          full_name: fullName,
          created_at: new Date().toISOString(),
        },
        {
          onConflict: 'id',
        }
      )
      .select()

    if (error) {
      console.error('Error ensuring user exists:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Exception ensuring user exists:', error)
    return null
  }
}

/**
 * Helper function to create or update user profile
 */
export async function upsertUserProfile(
  userId: string,
  profile: {
    name?: string
    title?: string
    bio?: string
    skills?: string[]
    interests?: string[]
    availability?: string
    location?: string
    role?: 'mentee' | 'mentor' | 'both'
  }
) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          user_id: userId,
          ...profile,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id',
        }
      )
      .select()

    if (error) {
      console.error('Error upserting profile:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Exception upserting profile:', error)
    return null
  }
}

/**
 * Helper to fetch mentors for dashboard
 */
export async function fetchMentors() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('role', ['mentor', 'both'])
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching mentors:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Exception fetching mentors:', error)
    return []
  }
}

/**
 * Helper to fetch matches for a user
 */
export async function fetchUserMatches(userId: string) {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        mentor:profiles!matches_mentor_id_fkey(*),
        mentee:profiles!matches_mentee_id_fkey(*)
      `)
      .or(`mentor_id.eq.${userId},mentee_id.eq.${userId}`)

    if (error) {
      console.error('Error fetching matches:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Exception fetching matches:', error)
    return []
  }
}

/**
 * Helper to send mentorship request
 */
export async function sendMentorshipRequest(
  mentorId: string,
  menteeId: string
) {
  try {
    const { data, error } = await supabase.from('matches').insert({
      mentor_id: mentorId,
      mentee_id: menteeId,
      status: 'pending',
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error('Error sending mentorship request:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Exception sending mentorship request:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Helper to update match status
 */
export async function updateMatchStatus(
  matchId: string,
  status: 'pending' | 'accepted' | 'rejected'
) {
  try {
    const { data, error } = await supabase
      .from('matches')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', matchId)

    if (error) {
      console.error('Error updating match status:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Exception updating match status:', error)
    return { success: false, error: String(error) }
  }
}
