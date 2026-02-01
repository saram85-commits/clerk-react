import { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { Search, Filter, Users, Briefcase, TrendingUp } from 'lucide-react'
import { supabase } from '../lib/supabase'
import MentorCard from '../components/MentorCard'
import '../styles/dashboard.css'

interface Mentor {
  id?: string
  user_id?: string
  name: string
  title?: string
  specialization?: string
  location?: string
  rating?: number
  reviewCount?: number
  bio?: string
  skills?: string[]
  availability?: string
  score?: number
}

export default function Dashboard() {
  const { user, isLoaded } = useUser()
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all')
  const [connectedMentors, setConnectedMentors] = useState<string[]>([])

  // Mock mentor data for demonstration
  const mockMentors: Mentor[] = [
    {
      id: '1',
      user_id: 'user_1',
      name: 'Sarah Johnson',
      title: 'Senior Software Engineer',
      specialization: 'Guiding Students in Tech Careers',
      location: 'ON, CA',
      rating: 5,
      reviewCount: 48,
      bio: 'Passionate about helping junior developers grow their skills in full-stack development and cloud technologies.',
      skills: ['React', 'Node.js', 'AWS', 'TypeScript'],
      availability: 'Available',
      score: 5,
    },
    {
      id: '2',
      user_id: 'user_2',
      name: 'Michael Chen',
      title: 'Peer Mentor',
      specialization: 'Guiding International Students',
      location: 'Toronto, ON',
      rating: 4.8,
      reviewCount: 35,
      bio: 'Upper year university student helping international students navigate Canadian culture and academic systems.',
      skills: ['Cultural Adaptation', 'Academic Navigation', 'Community Resources'],
      availability: 'Available',
      score: 3,
    },
    {
      id: '3',
      user_id: 'user_3',
      name: 'Emma Rodriguez',
      title: 'Phd. In Psychology',
      specialization: 'Behavioral Science Mentor',
      location: 'Montreal, QC',
      rating: 4.9,
      reviewCount: 42,
      bio: 'Helping people navigate their mental health journey and providing insights into behavioral patterns.',
      skills: ['Mental Health Awareness', 'Behavioral Insights', 'Counseling Techniques'],
      availability: 'Available',
      score: 2,
    },
    {
      id: '4',
      user_id: 'user_4',
      name: 'David Kim',
      title: 'Language Tutor (ESL)',
      specialization: 'English as Second Language',
      location: 'Calgary, AB',
      rating: 5,
      reviewCount: 29,
      bio: 'Helping immigrants and newcomers improve their English skills and adapt to Canadian culture.',
      skills: ['English Language', 'Cultural Adaptation', 'Communication Skills'],
      availability: 'Available',
      score: 4,
    },
    {
      id: '5',
      user_id: 'user_5',
      name: 'Lisa Wang',
      title: 'Information and Referral Specialist',
      specialization: 'Navigating Community Resources',
      location: 'Online',
      rating: 4.7,
      reviewCount: 31,
      bio: 'Offers guidance on navigating local services, and refers newcomers to community, legal, or financial resources.',
      skills: ['Community Navigation', 'Legal Resources', 'Financial Literacy'],
      availability: 'Available',
      score: 1,
    },
    {
      id: '6',
      user_id: 'user_6',
      name: 'Alex Thompson',
      title: 'DevOps Engineer',
      specialization: 'Infrastructure',
      location: 'Chicago, IL',
      rating: 4.8,
      reviewCount: 26,
      bio: 'Guide developers through DevOps practices, CI/CD pipelines, and cloud infrastructure.',
      skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS'],
      availability: 'Available',
      score: 0,
    },
  ]

  useEffect(() => {
    if (!isLoaded || !user) return

    const loadDashboard = async () => {
      try {
        // Ensure user exists in USERS table
        await supabase.from('users').upsert({
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          full_name: user.fullName,
        })

        // Using mock data for demonstration
        // In production, fetch from Supabase
        setMentors(mockMentors)
        setFilteredMentors(mockMentors)
      } catch (error) {
        console.error('Dashboard error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [user, isLoaded])

  useEffect(() => {
    let filtered = mentors

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (mentor) =>
          mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mentor.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mentor.bio?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by specialization
    if (selectedSpecialization !== 'all') {
      filtered = filtered.filter((mentor) => mentor.specialization === selectedSpecialization)
    }

    // Sort by score (best matches first)
    filtered.sort((a, b) => (b.score || 0) - (a.score || 0))

    setFilteredMentors(filtered)
  }, [searchQuery, selectedSpecialization, mentors])

  const requestMentorship = async (mentorId: string) => {
    if (!user) return

    try {
      await supabase.from('matches').insert({
        mentor_id: mentorId,
        mentee_id: user.id,
        status: 'pending',
      })

      setConnectedMentors([...connectedMentors, mentorId])
      alert('Mentorship request sent successfully!')
    } catch (error) {
      console.error('Error sending request:', error)
      alert('Failed to send mentorship request')
    }
  }

  const specs = [...new Set(mentors.map((m) => m.specialization).filter((s): s is string => !!s))]

  if (!isLoaded || loading) {
    return (
      <div className="dashboard-loading">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="loader" />
        <p>Finding perfect mentors for you...</p>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2rem', flexWrap: 'wrap' }}>
        <div>
          <h1>Welcome back, {user?.firstName}!</h1>
          <p>Discover mentors that match your goals and interests</p>
        </div>

        <div className="stats">
          <div className="stat-card">
            <Users size={24} />
            <div>
              <p className="stat-value">{mentors.length}</p>
              <p className="stat-label">Mentors Available</p>
            </div>
          </div>
          <div className="stat-card">
            <Briefcase size={24} />
            <div>
              <p className="stat-value">{specs.length}</p>
              <p className="stat-label">Fields of Expertise</p>
            </div>
          </div>
          <div className="stat-card">
            <TrendingUp size={24} />
            <div>
              <p className="stat-value">{connectedMentors.length}</p>
              <p className="stat-label">Connections Made</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search mentors by name, title, or expertise..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-pills">
          <button className={`filter-pill ${selectedSpecialization === 'all' ? 'active' : ''}`} onClick={() => setSelectedSpecialization('all')}>
            <Filter size={16} />
            <span>All Fields</span>
          </button>
          {specs.map((spec) => (
            <button
              key={spec}
              className={`filter-pill ${selectedSpecialization === spec ? 'active' : ''}`}
              onClick={() => setSelectedSpecialization(spec || 'all')}
            >
              {spec}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Mentors Grid */}
      <motion.section className="mentors-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        {filteredMentors.length === 0 ? (
          <div className="no-mentors">
            <p>No mentors found matching your search. Try adjusting your filters!</p>
          </div>
        ) : (
          <div className="mentors-grid">
            {filteredMentors.map((mentor, index) => (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <MentorCard
                  {...mentor}
                  isConnected={connectedMentors.includes(mentor.id || '')}
                  onConnect={() => requestMentorship(mentor.user_id || mentor.id || '')}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  )
}
