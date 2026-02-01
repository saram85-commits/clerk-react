import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Menu, X } from 'lucide-react'
import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'
import { useState } from 'react'
import '../styles/navbar.css'

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <motion.header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <nav className="navbar-content">
        <Link to="/" className="logo">
          <motion.div whileHover={{ scale: 1.05 }} className="logo-inner">
            <Zap size={24} />
            <strong>Mentor Me</strong>
          </motion.div>
        </Link>

        <div className={`navbar-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <SignedIn>
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
          </SignedIn>
        </div>

        <div className="navbar-actions">
          <div className="user-section">
            <SignedIn>
              <UserButton />
            </SignedIn>

            <SignedOut>
              <SignInButton>
                <motion.button className="btn-signin" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Sign in
                </motion.button>
              </SignInButton>
            </SignedOut>
          </div>

          <motion.button
            className="mobile-menu-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>
      </nav>
    </motion.header>
  )
}

