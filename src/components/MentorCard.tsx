import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import React from 'react'

type Mentor = {
  id?: string
  user_id?: string
  name?: string
  skills?: string[]
  interests?: string[]
  availability?: string
  bio?: string
  score?: number
}

export default function MentorCard({ mentor, onRequest }: { mentor: Mentor; onRequest: (id?: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        border: '1px solid #ddd',
        padding: '1rem',
        marginBottom: '1rem',
        borderRadius: '8px',
        background: 'white',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, fontWeight: 600 }}>{mentor.name || 'Unnamed'}</p>
          <p style={{ margin: 0, color: '#6b7280' }}>{mentor.availability || 'Not set'}</p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0 }}>Score: {mentor.score ?? 0}</p>
        </div>
      </div>

      <p style={{ marginTop: 8 }}>{mentor.bio || 'No bio'}</p>

      <p style={{ margin: '0.25rem 0' }}><strong>Skills:</strong> {mentor.skills?.join(', ') || 'None'}</p>
      <p style={{ margin: '0.25rem 0' }}><strong>Interests:</strong> {mentor.interests?.join(', ') || 'None'}</p>

      <motion.button
        onClick={() => onRequest(mentor.user_id)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        style={{
          display: 'inline-flex',
          gap: 8,
          alignItems: 'center',
          padding: '0.5rem 0.75rem',
          borderRadius: 8,
          border: 'none',
          background: '#2563eb',
          color: 'white',
          cursor: 'pointer',
          marginTop: 8,
        }}
      >
        <Send size={16} />
        Request Mentorship
      </motion.button>
    </motion.div>
  )
}
