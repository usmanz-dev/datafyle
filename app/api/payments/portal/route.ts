import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(_req: NextRequest) {
  const { userId: clerkId } = await auth()
  if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { subscription: true },
  })

  if (!user || !user.subscription) {
    return NextResponse.json({ error: 'No active subscription found' }, { status: 404 })
  }

  const paddleCustomerId = user.subscription.paddleCustomerId
  if (!paddleCustomerId) {
    return NextResponse.json({ error: 'Customer ID not yet available. Please try again in a minute.' }, { status: 404 })
  }

  const apiKey = process.env.PADDLE_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'Paddle not configured' }, { status: 500 })

  const res = await fetch(`https://api.paddle.com/customers/${paddleCustomerId}/portal-sessions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const detail = (body as { error?: { detail?: string } })?.error?.detail ?? 'Paddle error'
    return NextResponse.json({ error: detail }, { status: 502 })
  }

  const body = await res.json() as { data?: { urls?: { general?: { overview?: string } } } }
  const portalUrl = body?.data?.urls?.general?.overview

  if (!portalUrl) {
    return NextResponse.json({ error: 'No portal URL returned' }, { status: 502 })
  }

  return NextResponse.json({ url: portalUrl })
}
