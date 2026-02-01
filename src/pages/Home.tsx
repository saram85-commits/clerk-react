import { SignInButton, SignUpButton } from '@clerk/clerk-react'
import IconButton from '../components/IconButton'
import { UserPlus, LogIn } from 'lucide-react'

export default function Home() {
  return (
    <div style={{ maxWidth: 720 }}>
      <h1>Welcome to Mentor Me</h1>

      <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
        <SignInButton>
          <IconButton>
            <LogIn size={16} />
            <span>Sign in</span>
          </IconButton>
        </SignInButton>

        <SignUpButton>
          <IconButton>
            <UserPlus size={16} />
            <span>Sign up</span>
          </IconButton>
        </SignUpButton>
      </div>
    </div>
  )
}
