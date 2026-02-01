import { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { Check, X, Edit2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import '../styles/profile.css'

interface UserProfile {
  user_id?: string
  name?: string
  title?: string
  bio?: string
  skills?: string[]
  interests?: string[]
  availability?: string
  location?: string
  role?: string
}

export default function Profile() {
  const { user, isLoaded } = useUser()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isLoaded || !user) return

    const fetchProfile = async () => {
      try {
        // Ensure user exists
        await supabase.from('users').upsert({
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          full_name: user.fullName,
        })

        // Fetch profile
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()

        if (error) {
          console.error('Error fetching profile:', error)
        } else if (data) {
          setProfile(data)
          setEditingProfile(data)
        } else {
          // Create default profile
          const newProfile: UserProfile = {
            user_id: user.id,
            name: user.fullName || '',
            title: 'Student',
            bio: '',
            skills: [],
            interests: [],
            availability: 'Available',
            location: '',
            role: 'mentee',
          }
          setProfile(newProfile)
          setEditingProfile(newProfile)
        }
      } catch (error) {
        console.error('Profile error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [isLoaded, user])

  const handleSave = async () => {
    if (!user || !editingProfile) return

    setSaving(true)
    try {
      const { error } = await supabase.from('profiles').upsert({
        user_id: user.id,
        ...editingProfile,
        updated_at: new Date().toISOString(),
      })

      if (error) {
        alert('Error updating profile: ' + error.message)
      } else {
        setProfile(editingProfile)
        setIsEditing(false)
        alert('Profile updated successfully!')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingProfile(profile)
    setIsEditing(false)
  }

  if (!isLoaded || loading) {
    return (
      <div className="profile-loading">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="loader" />
        <p>Loading your profile...</p>
      </div>
    )
  }

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <motion.div style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem', background: 'linear-gradient(135deg, #818cf8 0%, #8b5cf6 100%)', borderRadius: '16px', marginBottom: '2rem', color: 'white' }} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="profile-avatar">
          {user?.imageUrl ? <img src={user.imageUrl} alt={user.firstName || 'User'} /> : <div className="avatar-placeholder">{user?.firstName?.charAt(0)}</div>}
        </div>

        <div className="profile-info">
          <h1>{user?.fullName}</h1>
          <p className="profile-email">{user?.primaryEmailAddress?.emailAddress}</p>
        </div>

        {!isEditing && (
          <motion.button
            className="btn-edit"
            as="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
          >
            <Edit2 size={18} />
            Edit Profile
          </motion.button>
        )}
      </motion.div>

      {/* Profile Content */}
      <motion.div className="profile-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} as="div">
        <div className="form-grid">
          {/* Title/Role */}
          <div className="form-group">
            <label htmlFor="title">Professional Title</label>
            {isEditing ? (
              <input
                id="title"
                type="text"
                value={editingProfile?.title || ''}
                onChange={(e) => setEditingProfile({ ...editingProfile, title: e.target.value })}
                placeholder="e.g., Software Engineer, Designer"
              />
            ) : (
              <p className="form-value">{profile?.title || 'Not specified'}</p>
            )}
          </div>

          {/* Location */}
          <div className="form-group">
            <label htmlFor="location">Location</label>
            {isEditing ? (
              <input
                id="location"
                type="text"
                value={editingProfile?.location || ''}
                onChange={(e) => setEditingProfile({ ...editingProfile, location: e.target.value })}
                placeholder="City, Country"
              />
            ) : (
              <p className="form-value">{profile?.location || 'Not specified'}</p>
            )}
          </div>

          {/* Availability */}
          <div className="form-group">
            <label htmlFor="availability">Availability</label>
            {isEditing ? (
              <select
                id="availability"
                value={editingProfile?.availability || 'Available'}
                onChange={(e) => setEditingProfile({ ...editingProfile, availability: e.target.value })}
              >
                <option>Available</option>
                <option>Busy</option>
                <option>Not Available</option>
              </select>
            ) : (
              <p className="form-value">{profile?.availability || 'Not specified'}</p>
            )}
          </div>

          {/* Role */}
          <div className="form-group">
            <label htmlFor="role">Role</label>
            {isEditing ? (
              <select
                id="role"
                value={editingProfile?.role || 'mentee'}
                onChange={(e) => setEditingProfile({ ...editingProfile, role: e.target.value })}
              >
                <option value="mentee">Mentee (Student / New Comer)</option>
                <option value="mentor">Mentor</option>
                
              </select>
            ) : (
              <p className="form-value">{profile?.role === 'mentee' ? 'Student' : profile?.role === 'mentor' ? 'Mentor' : 'Both'}</p>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="form-group full-width">
          <label htmlFor="bio">Bio</label>
          {isEditing ? (
            <textarea
              id="bio"
              value={editingProfile?.bio || ''}
              onChange={(e) => setEditingProfile({ ...editingProfile, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              rows={5}
            />
          ) : (
            <p className="form-value">{profile?.bio || 'No bio yet'}</p>
          )}
        </div>

        {/* Skills */}
        <div className="form-group full-width">
          <label htmlFor="skills">Skills (comma-separated)</label>
          {isEditing ? (
            <input
              id="skills"
              type="text"
              value={editingProfile?.skills?.join(', ') || ''}
              onChange={(e) =>
                setEditingProfile({
                  ...editingProfile,
                  skills: e.target.value.split(',').map((s) => s.trim()),
                })
              }
              placeholder="React, Node.js, Python, Design, etc."
            />
          ) : (
            <div className="skills-display">
              {profile?.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill, index) => (
                  <span key={index} className="skill-badge">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="form-value">No skills added yet</p>
              )}
            </div>
          )}
        </div>

        {/* Interests */}
        <div className="form-group full-width">
          <label htmlFor="interests">Interests (comma-separated)</label>
          {isEditing ? (
            <input
              id="interests"
              type="text"
              value={editingProfile?.interests?.join(', ') || ''}
              onChange={(e) =>
                setEditingProfile({
                  ...editingProfile,
                  interests: e.target.value.split(',').map((s) => s.trim()),
                })
              }
              placeholder="Web Development, AI, Startup, etc."
            />
          ) : (
            <div className="skills-display">
              {profile?.interests && profile.interests.length > 0 ? (
                profile.interests.map((interest, index) => (
                  <span key={index} className="interest-badge">
                    {interest}
                  </span>
                ))
              ) : (
                <p className="form-value">No interests added yet</p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <motion.div
            className="form-actions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.button className="btn-save" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSave} disabled={saving}>
              <Check size={18} />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </motion.button>

            <motion.button className="btn-cancel" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleCancel} disabled={saving}>
              <X size={18} />
              <span>Cancel</span>
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
