import { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { supabase } from '../lib/supabase'

export function useEnsureUser() {
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (!isLoaded || !user) return

    const ensureUserAndProfile = async () => {
      const clerkUserId = user.id

      // 1️⃣ Ensure user exists
      await supabase.from('users').upsert({
        id: clerkUserId,
        email: user.primaryEmailAddress?.emailAddress,
        full_name: user.fullName,
      })

      // 2️⃣ Ensure profile exists
      await supabase.from('profiles').upsert({
        user_id: clerkUserId,
      })
    }

    ensureUserAndProfile()
  }, [isLoaded, user])
}