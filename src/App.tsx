import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { motion } from 'framer-motion'

import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import { useEnsureUser } from './hooks/useEnsureUser'
import NavBar from './components/NavBar'
import './App.css'

function App() {
  useEnsureUser()

  return (
    <BrowserRouter>
      <NavBar />

      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SignedOut>
                  <Home />
                </SignedOut>

                <SignedIn>
                  <Navigate to="/dashboard" replace />
                </SignedIn>
              </>
            }
          />

          <Route
            path="/dashboard"
            element={
              <SignedIn>
                <Dashboard />
              </SignedIn>
            }
          />

          <Route
            path="/profile"
            element={
              <SignedIn>
                <Profile />
              </SignedIn>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.main>
    </BrowserRouter>
  )
}

export default App
