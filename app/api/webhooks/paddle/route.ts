import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendWelcomePaidEmail, sendCancellationEmail } from '@/lib/emails/paddleEmails'

const PLAN_DOCS: Record<string, number> = {
  starter: 500, professional: 3000, business: 10000, enterprise: 20000,
}

function verifyPaddleSignature(rawBody: string, signatureHeader: string, secret: string): boolean {
  try {
    // Paddle-Signature format: "ts=TIMESTAMP;h1=HMAC_HEX"
    const parts = Object.fromEntries(
      signatureHeader.split(';').map((p) => p.split('=', 2) as [string, string])
    )
    if (!parts.ts || !parts.h1) return false

    const signedPayload = `${parts.ts}:${rawBody}`
    const computed = crypto
      .createHmac('sha256', secret)
      .update(signedPayload, 'utf8')
      .digest('hex')

    // timingSafeEqual needs equal-length buffers
    const a = Buffer.from(parts.h1.toLowerCase(), 'hex')
    const b = Buffer.from(computed.toLowerCase(), 'hex')
    if (a.length !== b.length) return false

    return crypto.timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET
  if (!secret) {
    console.error('PADDLE_WEBHOOK_SECRET not set')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  const rawBody = await req.text()
  const signatureHeader = req.headers.get('paddle-signature') ?? ''

  if (!verifyPaddleSignature(rawBody, signatureHeader, secret)) {
    console.error('Invalid Paddle webhook signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let event: {
    event_type: string
    data: {
      id?: string
      status?: string
      customer_id?: string
      next_billed_at?: string | null
      custom_data?: { userId?: string; plan?: string; userEmail?: string } | null
      scheduled_change?: { action?: string } | null
      items?: { price?: { id?: string } }[]
    }
  }

  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { event_type, data } = event
  const customData = data?.custom_data

  try {
    // ── subscription.created / subscription.activated ────────────────────────
    if (event_type === 'subscription.created' || event_type === 'subscription.activated') {
      const planName = customData?.plan ?? 'starter'
      const paddleSubId = data.id ?? ''
      const renewsAt = data.next_billed_at ? new Date(data.next_billed_at) : null

      let user = null

      // Try to find user by userId in custom_data
      if (customData?.userId) {
        user = await prisma.user.findUnique({ where: { id: customData.userId } })
      }

      // Fallback: find by email in custom_data
      if (!user && customData?.userEmail) {
        user = await prisma.user.findUnique({ where: { email: customData.userEmail } })
      }

      if (!user) {
        console.error('Paddle webhook: user not found', { customData })
        return NextResponse.json({ received: true }) // don't retry
      }

      const docsLimit = PLAN_DOCS[planName] ?? 500

      // Update user plan + paidAt
      await prisma.user.update({
        where: { id: user.id },
        data: {
          plan: planName,
          paidAt: user.paidAt ?? new Date(),
          docsLimit,
          cancelledAt: null,
        },
      })

      // Upsert subscription record
      await prisma.subscription.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          paddleSubId,
          plan: planName,
          status: 'active',
          renewsAt,
        },
        update: {
          paddleSubId,
          plan: planName,
          status: 'active',
          renewsAt,
        },
      })

      // Send welcome email (fire-and-forget — don't block webhook response)
      sendWelcomePaidEmail(user.email, planName, user.name).catch((e) =>
        console.error('Failed to send welcome email:', e)
      )
    }

    // ── subscription.cancelled ───────────────────────────────────────────────
    else if (event_type === 'subscription.cancelled') {
      const paddleSubId = data.id ?? ''

      const sub = await prisma.subscription.findFirst({
        where: { paddleSubId },
        include: { user: true },
      })

      if (sub) {
        const previousPlan = sub.user.plan

        await prisma.user.update({
          where: { id: sub.userId },
          data: {
            cancelledAt: new Date(),
            previousPlan,
            plan: 'free',
            docsLimit: 10,
          },
        })

        await prisma.subscription.update({
          where: { id: sub.id },
          data: { status: 'cancelled' },
        })

        sendCancellationEmail(sub.user.email, previousPlan, sub.user.name).catch((e) =>
          console.error('Failed to send cancellation email:', e)
        )
      }
    }

    // ── subscription.updated ─────────────────────────────────────────────────
    else if (event_type === 'subscription.updated') {
      const paddleSubId = data.id ?? ''
      const renewsAt = data.next_billed_at ? new Date(data.next_billed_at) : undefined
      const newPlan = customData?.plan

      const sub = await prisma.subscription.findFirst({ where: { paddleSubId } })

      if (sub) {
        await prisma.subscription.update({
          where: { id: sub.id },
          data: {
            ...(newPlan ? { plan: newPlan } : {}),
            ...(renewsAt ? { renewsAt } : {}),
          },
        })

        if (newPlan) {
          await prisma.user.update({
            where: { id: sub.userId },
            data: {
              plan: newPlan,
              docsLimit: PLAN_DOCS[newPlan] ?? 500,
            },
          })
        }
      }
    }
  } catch (err) {
    console.error('Paddle webhook processing error:', err)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
