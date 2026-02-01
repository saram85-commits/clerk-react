// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'
// import { ClerkProvider } from '@clerk/clerk-react'

// // Import your Publishable Key
// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// if (!PUBLISHABLE_KEY) {
//   throw new Error('Add your Clerk Publishable Key to the .env file')
// }

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
//       <App />
//     </ClerkProvider>
//   </StrictMode>,
// )
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App'

// import { useAuth } from '@clerk/clerk-react'
// import { createSupabaseClient } from './lib/supabase'

// const { getToken } = useAuth()
// const supabase = createSupabaseClient(() =>
//   getToken({ template: 'supabase' })
// )


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
)
