import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, User, LogOut } from 'lucide-react'
import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'
import React from 'react'

export default function NavBar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{ padding: '1rem', borderBottom: '1px solid #eee' }}
    >
      <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Home size={18} />
          <strong>Mentor Me</strong>
        </Link>

        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Profile</Link>

        <div style={{ marginLeft: 'auto' }}>
          <SignedIn>
            <UserButton />
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <motion.span whileHover={{ scale: 1.05 }} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <User size={16} />
                Sign in
              </motion.span>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
    </motion.header>
  )
}
