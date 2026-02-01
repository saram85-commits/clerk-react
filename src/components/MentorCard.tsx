import { motion } from 'framer-motion'
import { Star, MapPin, Briefcase, MessageCircle, Plus } from 'lucide-react'
import '../styles/mentorcard.css'

interface MentorCardProps {
  id?: string
  user_id?: string
  name: string
  title?: string
  specialization?: string
  location?: string
  rating?: number
  reviewCount?: number
  image?: string
  bio?: string
  skills?: string[]
  availability?: string
  score?: number
  onConnect?: () => void
  isConnected?: boolean
}

export default function MentorCard({
  id,
  user_id,
  name,
  title = 'Mentor',
  specialization = 'Professional',
  location = 'Online',
  rating = 5,
  reviewCount = 0,
  image,
  bio,
  skills = [],
  availability = 'Available',
  score,
  onConnect,
  isConnected = false,
}: MentorCardProps) {
  return (
    <motion.div
      className="mentor-card"
      whileHover={{ y: -8, boxShadow: '0 12px 24px rgba(99, 102, 241, 0.15)' }}
      transition={{ duration: 0.3 }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mentor-header">
        <div className="mentor-avatar">
          {image ? (
            <img src={image} alt={name} />
          ) : (
            <div className="avatar-placeholder">{name.charAt(0)}</div>
          )}
        </div>
        <div className={`mentor-badge-online ${availability === 'Available' ? 'available' : 'busy'}`}>
          {availability}
        </div>
      </div>

      <div className="mentor-content">
        <h3 className="mentor-name">{name}</h3>
        <p className="mentor-title">{title}</p>

        <div className="mentor-specialization">
          <Briefcase size={16} />
          <span>{specialization}</span>
        </div>

        <div className="mentor-location">
          <MapPin size={16} />
          <span>{location}</span>
        </div>

        <div className="mentor-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.floor(rating) ? '#f59e0b' : '#e5e7eb'}
                color={i < Math.floor(rating) ? '#f59e0b' : '#e5e7eb'}
              />
            ))}
          </div>
          <span className="rating-text">
            {rating} ({reviewCount} reviews)
          </span>
        </div>

        {bio && <p className="mentor-bio">{bio}</p>}

        {skills.length > 0 && (
          <div className="mentor-skills">
            <p className="skills-label">Skills:</p>
            <div className="skills-tags">
              {skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
              {skills.length > 3 && <span className="skill-tag more">+{skills.length - 3}</span>}
            </div>
          </div>
        )}

        <div className="mentor-actions">
          <motion.button
            className={`btn-connect ${isConnected ? 'connected' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onConnect}
          >
            {isConnected ? (
              <>
                <MessageCircle size={16} />
                <span>Message</span>
              </>
            ) : (
              <>
                <Plus size={16} />
                <span>Connect</span>
              </>
            )}
          </motion.button>

          <motion.button className="btn-learn-more" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            View Profile
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
