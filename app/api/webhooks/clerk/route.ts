import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ClerkUserCreatedEvent {
  type: string
  data: {
    id: string
    email_addresses: Array<{ email_address: string }>
    first_name: string | null
    last_name: string | null
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.CLERK_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Missing webhook secret' }, { status: 400 })
  }

  const svixId = req.headers.get('svix-id')
  const svixTimestamp = req.headers.get('svix-timestamp')
  const svixSignature = req.headers.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  const body = await req.text()

  let event: ClerkUserCreatedEvent
  try {
    const wh = new Webhook(secret)
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as ClerkUserCreatedEvent
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 })
  }

  if (event.type !== 'user.created') {
    return NextResponse.json({ received: true })
  }

  try {
    const { id: clerkId, email_addresses, first_name, last_name } = event.data
    const email = email_addresses[0]?.email_address
    if (!email) {
      return NextResponse.json({ error: 'No email found' }, { status: 400 })
    }

    const nameParts = [first_name, last_name].filter(Boolean)
    const name = nameParts.length > 0 ? nameParts.join(' ') : null

    await prisma.user.create({
      data: {
        clerkId,
        email,
        name,
        plan: 'free',
        docsLimit: 10,
        docsUsed: 0,
      },
    })

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'noreply@datafyle.com',
      to: email,
      subject: 'Welcome to Datafyle!',
      text: 'You have 10 free documents to try. Upload your first invoice at datafyle.com/dashboard',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Clerk webhook error:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 400 })
  }
}
