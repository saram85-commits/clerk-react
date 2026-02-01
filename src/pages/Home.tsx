import { SignInButton, SignUpButton } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { Sparkles, Users, BookOpen, Trophy, ArrowRight, Zap } from 'lucide-react'
import '../styles/home.css'

export default function Home() {
  const features = [
    {
      icon: <Users size={28} />,
      title: 'Connect with Mentors',
      description: 'Find experienced mentors who are passionate about guiding the next generation.',
    },
    {
      icon: <BookOpen size={28} />,
      title: 'Learn & Grow',
      description: 'Get personalized guidance for your career and life choices.',
    },
    {
      icon: <Trophy size={28} />,
      title: 'Achieve Goals',
      description: 'Reach your potential with support from experts in your field.',
    },
    {
      icon: <Zap size={28} />,
      title: 'Fast Connections',
      description: 'Quickly find and connect with mentors that match your goals.',
    },
  ]

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>Welcome to Your Mentorship Journey</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, color: '#111827', marginBottom: 0, marginTop: 0 }}
          >
            Find Your Perfect <span className="gradient-text">Mentor</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ fontSize: '1.25rem', color: '#6b7280', lineHeight: 1.6, marginBottom: 0 }}
          >
            Connect with experienced professionals who can guide you through your career and life choices. Get personalized mentorship from industry experts.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}
          >
            <SignUpButton>
              <button className="btn-primary">
                Get Started
                <ArrowRight size={18} />
              </button>
            </SignUpButton>

            <SignInButton>
              <button className="btn-secondary">Sign In</button>
            </SignInButton>
          </motion.div>
        </div>

        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.3 }}
          className="hero-illustration"
        >
          <div className="illustration-placeholder">
            <Users size={0} strokeWidth={0} />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Why Choose Mentor Me?</h2>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              variants={item}
              whileHover={{ y: -8 }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to Start Your Mentorship?</h2>
        <p>Join hundreds of students and mentors building meaningful connections</p>

        <motion.div whileHover={{ scale: 1.02 }}>
          <SignUpButton>
            <button className="btn-primary">Create Account</button>
          </SignUpButton>
        </motion.div>
      </section>
    </div>
  )
}


