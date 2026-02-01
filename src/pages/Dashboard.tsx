// import { useUser } from '@clerk/clerk-react'

// export default function Dashboard() {
//   const { user, isLoaded } = useUser()

//   // Wait until Clerk finishes loading
//   if (!isLoaded) {
//     return <p>Loading...</p>
//   }

//   return (
//     <div>
//       <h1>Dashboard</h1>
//       <p>
//         {user?.primaryEmailAddress?.emailAddress}
//       </p>
//     </div>
//   )
// }
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { supabase } from '../lib/supabase'
import MentorCard from '../components/MentorCard'

export default function Dashboard() {
  const { user, isLoaded } = useUser()
  const [mentors, setMentors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded || !user) return

    const loadDashboard = async () => {
      try {
        // 1️⃣ Ensure user exists in USERS table
        await supabase.from('users').upsert({
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          full_name: user.fullName,
        })

        // 2️⃣ Fetch current user's PROFILE
        const { data: menteeProfile, error: menteeError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (menteeError) throw menteeError
        if (!menteeProfile) return

        // 3️⃣ Fetch mentor PROFILES
        const { data: mentorProfiles, error: mentorError } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'mentor')

        if (mentorError) throw mentorError

        // 4️⃣ Match logic (shared skills + interests)
        const matchedMentors = mentorProfiles.map((mentor) => {
          const sharedSkills =
            mentor.skills?.filter((skill: string) =>
              menteeProfile.interests?.includes(skill)
            ) || []

          const sharedInterests =
            mentor.interests?.filter((interest: string) =>
              menteeProfile.interests?.includes(interest)
            ) || []

          return {
            ...mentor,
            score: sharedSkills.length + sharedInterests.length,
          }
        })

        // 5️⃣ Sort best matches first
        matchedMentors.sort((a, b) => b.score - a.score)

        setMentors(matchedMentors)
      } catch (error) {
        console.error('Dashboard error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [user, isLoaded])

  if (!isLoaded || loading) return <p>Loading mentors...</p>

  // 6️⃣ Send mentorship request
  const requestMentorship = async (mentorUserId: string) => {
    if(!user) return 
    const { error } = await supabase.from('matches').insert({
      mentor_id: mentorUserId, // profile.user_id
      mentee_id: user.id,
      status: 'pending',
    })

    if (error) alert(error.message)
    else alert('Mentorship request sent!')
  }

  return (
    <div>
      <h1>Recommended Mentors</h1>

      {mentors.length === 0 && <p>No mentors found.</p>}

      {mentors.map((mentor) => (
        <MentorCard key={mentor.id} mentor={mentor} onRequest={requestMentorship} />
      ))}
    </div>
  )
}
