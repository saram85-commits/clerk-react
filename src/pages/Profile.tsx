// import { useEffect, useState } from 'react'
// import { useUser } from '@clerk/clerk-react'
// import { supabase } from '../lib/supabase.ts'

// export default function Profile() {
//   const { user, isLoaded } = useUser()
//   const [setProfile] = useState<any>(null) // FIXED
//   const [editingProfile, setEditingProfile] = useState<any>(null)
//   const [loading, setLoading] = useState(true)

//   // Fetch profile from Supabase
//   useEffect(() => {
//     if (!user) return
//     const fetchProfile = async () => {
//       const { data, error } = await supabase
//         .from('users')
//         .select('*')
//         .eq('id', user.id)
//         .single()

//       if (error) console.error(error)
//       else {
//         setProfile(data)
//         setEditingProfile(data) // initialize editable state
//       }

//       setLoading(false)
//     }

//     fetchProfile()
//   }, [user])

//   if (!isLoaded || loading) return <p>Loading...</p>

//   const handleSave = async () => {
//     if (!user || !editingProfile) return

//     // 🔹 ADD THIS TO DEBUG
//     console.log('Saving profile:', editingProfile)

//     const { error } = await supabase
//       .from('users')
//       .update({
//         name: editingProfile.name,
//         role: editingProfile.role,
//         skills: editingProfile.skills,
//         interests: editingProfile.interests,
//         availability: editingProfile.availability,
//         language: editingProfile.language,
//         bio: editingProfile.bio,
//       })
//       .eq('id', user.id)

//     if (error) alert('Error updating profile: ' + error.message)
//     else {
//       setProfile(editingProfile) // update displayed profile
//       alert('Profile updated successfully!')
//     }
//   }

//   return (
//     <div>
//       <h1>Your Profile</h1>

//       <img
//         src={user?.imageUrl}
//         alt="Profile"
//         width={80}
//         style={{ borderRadius: '50%' }}
//       />

//       <div>
//         <label>Name:</label>
//         <input
//           value={editingProfile?.name || ''}
//           onChange={e => setEditingProfile({ ...editingProfile, name: e.target.value })}
//         />
//       </div>

//       <div>
//         <label>Role:</label>
//         <input
//           value={editingProfile?.role || ''}
//           onChange={e => setEditingProfile({ ...editingProfile, role: e.target.value })}
//         />
//       </div>

//       <div>
//         <label>Skills (comma-separated):</label>
//         <input
//           value={editingProfile?.skills?.join(', ') || ''}
//           onChange={e =>
//             setEditingProfile({
//               ...editingProfile,
//               skills: e.target.value.split(',').map((s: string) => s.trim()),
//             })
//           }
//         />
//       </div>

//       <div>
//         <label>Interests (comma-separated):</label>
//         <input
//           value={editingProfile?.interests?.join(', ') || ''}
//           onChange={e =>
//             setEditingProfile({
//               ...editingProfile,
//               interests: e.target.value.split(',').map((s: string) => s.trim()),
//             })
//           }
//         />
//       </div>

//       <div>
//         <label>Availability:</label>
//         <input
//           value={editingProfile?.availability || ''}
//           onChange={e => setEditingProfile({ ...editingProfile, availability: e.target.value })}
//         />
//       </div>

//       <div>
//         <label>Language:</label>
//         <input
//           value={editingProfile?.language || ''}
//           onChange={e => setEditingProfile({ ...editingProfile, language: e.target.value })}
//         />
//       </div>

//       <div>
//         <label>Bio:</label>
//         <textarea
//           value={editingProfile?.bio || ''}
//           onChange={e => setEditingProfile({ ...editingProfile, bio: e.target.value })}
//         />
//       </div>

//       <button onClick={handleSave}>Save Profile</button>
//     </div>
//   )
// }

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { supabase } from '../lib/supabase'
import IconButton from '../components/IconButton'
import { Save } from 'lucide-react'

export default function Profile() {
  const { user, isLoaded } = useUser()

  const [profile, setProfile] = useState<any>(null)
  const [editingProfile, setEditingProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Fetch profile
  useEffect(() => {
    if (!isLoaded || !user) return

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) {
        console.error(error)
      } else {
        setProfile(data)
        setEditingProfile(data)
      }

      setLoading(false)
    }

    fetchProfile()
  }, [isLoaded, user])

  if (!isLoaded || loading) return <p>Loading...</p>

  const handleSave = async () => {
    if (!user || !editingProfile) return

    const { error } = await supabase
      .from('profiles')
      .update({
        name: editingProfile.name,
        role: editingProfile.role,
        skills: editingProfile.skills,
        interests: editingProfile.interests,
        availability: editingProfile.availability,
        bio: editingProfile.bio,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    if (error) {
      alert('Error updating profile: ' + error.message)
    } else {
      setProfile(editingProfile)
      alert('Profile updated successfully!')
    }
  }

  return (
    <div>
      <h1>Your Profile</h1>

      <img
        src={user?.imageUrl}
        alt="Profile"
        width={80}
        style={{ borderRadius: '50%' }}
      />

      <div>
        <label>Name:</label>
        <input
          value={editingProfile?.name || ''}
          onChange={e =>
            setEditingProfile({ ...editingProfile, name: e.target.value })
          }
        />
      </div>

      <div>
        <label>Role:</label>
        <input
          value={editingProfile?.role || ''}
          onChange={e =>
            setEditingProfile({ ...editingProfile, role: e.target.value })
          }
        />
      </div>

      <div>
        <label>Skills (comma-separated):</label>
        <input
          value={editingProfile?.skills?.join(', ') || ''}
          onChange={e =>
            setEditingProfile({
              ...editingProfile,
              skills: e.target.value.split(',').map(s => s.trim()),
            })
          }
        />
      </div>

      <div>
        <label>Interests (comma-separated):</label>
        <input
          value={editingProfile?.interests?.join(', ') || ''}
          onChange={e =>
            setEditingProfile({
              ...editingProfile,
              interests: e.target.value.split(',').map(s => s.trim()),
            })
          }
        />
      </div>

      <div>
        <label>Availability:</label>
        <input
          value={editingProfile?.availability || ''}
          onChange={e =>
            setEditingProfile({
              ...editingProfile,
              availability: e.target.value,
            })
          }
        />
      </div>

      <div>
        <label>Bio:</label>
        <textarea
          value={editingProfile?.bio || ''}
          onChange={e =>
            setEditingProfile({ ...editingProfile, bio: e.target.value })
          }
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <IconButton onClick={handleSave}>
          <Save size={14} />
          <span>Save Profile</span>
        </IconButton>
      </div>
    </div>
  )
}
