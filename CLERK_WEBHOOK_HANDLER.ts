/**
 * CLERK WEBHOOK HANDLER
 * 
 * This file handles webhooks from Clerk to automatically sync users to Supabase
 * 
 * Usage:
 * 1. Add this to your backend (Node.js/Express/Vercel Function)
 * 2. Set up webhook in Clerk Dashboard → Settings → Webhooks
 * 3. Point webhook to your backend URL
 * 4. Subscribe to: user.created, user.updated, user.deleted
 */

import { Webhook } from 'svix'
import { supabase } from './src/lib/supabase'
import type { Request, Response } from 'express'

// Webhook event type
interface WebhookEvent {
  type: 'user.created' | 'user.updated' | 'user.deleted' | string
  data: any
}

// Get from environment variables
const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET || ''

/**
 * Express middleware to handle Clerk webhooks
 */
export async function handleClerkWebhook(req: Request, res: Response) {
  // Verify webhook signature
  const wh = new Webhook(CLERK_WEBHOOK_SECRET)

  let evt: WebhookEvent
  try {
    evt = wh.verify(JSON.stringify(req.body), req.headers) as WebhookEvent
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return res.status(400).json({ error: 'Invalid webhook signature' })
  }

  try {
    // Handle different event types
    switch (evt.type) {
      case 'user.created':
        await handleUserCreated(evt.data)
        break

      case 'user.updated':
        await handleUserUpdated(evt.data)
        break

      case 'user.deleted':
        await handleUserDeleted(evt.data)
        break

      default:
        console.log(`Unhandled event type: ${evt.type}`)
    }

    return res.status(200).json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return res.status(500).json({ error: 'Webhook processing failed' })
  }
}

/**
 * Handle user.created event
 */
async function handleUserCreated(user: any) {
  console.log('User created:', user.id)

  const email = user.email_addresses?.[0]?.email_address || ''
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ')

  try {
    // Insert user into Supabase
    const { error } = await supabase.from('users').insert({
      id: user.id,
      email,
      full_name: fullName,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error('Error inserting user:', error)
      throw error
    }

    // Create default profile
    await createDefaultProfile(user.id, fullName)

    console.log('User synced successfully:', user.id)
  } catch (error) {
    console.error('Exception in handleUserCreated:', error)
    throw error
  }
}

/**
 * Handle user.updated event
 */
async function handleUserUpdated(user: any) {
  console.log('User updated:', user.id)

  const email = user.email_addresses?.[0]?.email_address || ''
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ')

  try {
    // Update user in Supabase
    const { error } = await supabase.from('users').update({
      email,
      full_name: fullName,
    }).eq('id', user.id)

    if (error) {
      console.error('Error updating user:', error)
      throw error
    }

    console.log('User updated successfully:', user.id)
  } catch (error) {
    console.error('Exception in handleUserUpdated:', error)
    throw error
  }
}

/**
 * Handle user.deleted event
 */
async function handleUserDeleted(user: any) {
  console.log('User deleted:', user.id)

  try {
    // Optionally delete user data (consider soft delete instead)
    // For now, just log it
    console.log('User deletion acknowledged:', user.id)

    // Uncomment to actually delete:
    // const { error } = await supabase
    //   .from('users')
    //   .delete()
    //   .eq('id', user.id)

    // if (error) throw error
  } catch (error) {
    console.error('Exception in handleUserDeleted:', error)
    throw error
  }
}

/**
 * Create default profile for new user
 */
async function createDefaultProfile(userId: string, fullName: string) {
  try {
    const { error } = await supabase.from('profiles').insert({
      user_id: userId,
      name: fullName,
      title: '',
      bio: '',
      skills: [],
      interests: [],
      availability: 'Available',
      location: '',
      role: 'mentee',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (error) {
      console.error('Error creating default profile:', error)
      // Don't throw - user creation shouldn't fail if profile fails
    }
  } catch (error) {
    console.error('Exception creating default profile:', error)
  }
}

// ============================================
// EXAMPLE: Express Route Handler
// ============================================

/*
// Express example
import express from 'express'

const app = express()

// Raw body for webhook verification
app.post(
  '/api/webhooks/clerk',
  express.raw({ type: 'application/json' }),
  handleClerkWebhook
)

app.listen(3001, () => {
  console.log('Webhook server running on port 3001')
})
*/

// ============================================
// EXAMPLE: Vercel Function
// ============================================

/*
// pages/api/webhooks/clerk.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Get raw body
  const chunks = []
  for await (const chunk of req) {
    chunks.push(chunk)
  }
  const rawBody = Buffer.concat(chunks).toString('utf-8')

  // Create fake request object for handler
  const fakeReq = {
    body: JSON.parse(rawBody),
    headers: req.headers,
  }

  return handleClerkWebhook(fakeReq, res)
}
*/

// ============================================
// ENVIRONMENT VARIABLES NEEDED
// ============================================

/*
Add to your .env or .env.local:

CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Get CLERK_WEBHOOK_SECRET from:
1. Clerk Dashboard → Settings → Webhooks
2. Create new endpoint
3. Click "Signing Secret" to reveal whsec_... value
*/

// ============================================
// WEBHOOK SETUP INSTRUCTIONS
// ============================================

/*
1. Go to Clerk Dashboard
2. Navigate to: Settings → Webhooks
3. Click "Add Endpoint"
4. Enter your endpoint URL:
   - Local: http://localhost:3001/api/webhooks/clerk (with ngrok tunnel)
   - Production: https://your-domain.com/api/webhooks/clerk
5. Select events:
   ☑ user.created
   ☑ user.updated
   ☑ user.deleted
6. Copy the signing secret and add to environment variables
7. Click "Create"

Test the webhook:
1. In Clerk Dashboard, go to Webhooks
2. Find your endpoint
3. Click "Test Endpoint"
4. Check if your backend logs show the test event
*/

export default {
  handleClerkWebhook,
  handleUserCreated,
  handleUserUpdated,
  handleUserDeleted,
}
