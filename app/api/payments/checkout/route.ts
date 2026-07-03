import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { createCheckoutUrl } from '@/lib/paddle'
import { z } from 'zod'

const schema = z.object({
  plan: z.enum(['starter', 'professional', 'business', 'enterprise']),
})

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = schema.safeParse(await req.json())
    if (!body.success) {
      return NextResponse.json({ error: body.error.issues[0]?.message ?? 'Invalid plan' }, { status: 400 })
    }

    const { plan } = body.data

    // Get user email from Clerk
    const clerk = await currentUser()
    const email = clerk?.emailAddresses?.[0]?.emailAddress
    if (!email) {
      return NextResponse.json({ error: 'No email found on account' }, { status: 400 })
    }

    // Get internal user ID from DB
    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true, plan: true },
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.plan === plan) {
      return NextResponse.json({ error: 'You are already on this plan' }, { status: 400 })
    }

    const checkoutUrl = await createCheckoutUrl(plan, user.id, email)

    return NextResponse.json({ checkoutUrl })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create checkout'
    console.error('Checkout error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
