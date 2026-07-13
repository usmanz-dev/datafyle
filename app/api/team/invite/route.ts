import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendTeamInviteEmail } from '@/lib/emails'

const SEAT_LIMITS: Record<string, number> = {
  free: 1, starter: 2, professional: 5, business: 15, enterprise: 50,
}

const schema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'member']),
})

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 })

    if (user.plan === 'free') {
      return NextResponse.json({ error: 'Upgrade to Starter to invite team members' }, { status: 403 })
    }

    const body = schema.safeParse(await req.json())
    if (!body.success) {
      return NextResponse.json({ error: body.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 })
    }

    const { email, role } = body.data

    if (email === user.email) {
      return NextResponse.json({ error: 'You cannot invite yourself' }, { status: 400 })
    }

    // Find or create team for this user
    let team = await prisma.team.findFirst({
      where: { ownerId: user.id },
      include: {
        members: { where: { status: { in: ['accepted', 'pending'] } } },
      },
    })

    if (!team) {
      team = await prisma.team.create({
        data: {
          name: `${user.name ?? user.email.split('@')[0]}'s Team`,
          ownerId: user.id,
          plan: user.plan,
          members: {
            create: {
              userId: user.id,
              inviteEmail: user.email,
              role: 'admin',
              status: 'accepted',
              joinedAt: new Date(),
            },
          },
        },
        include: {
          members: { where: { status: { in: ['accepted', 'pending'] } } },
        },
      })
    }

    // Already a member or pending invite
    if (team.members.some((m) => m.inviteEmail === email)) {
      return NextResponse.json(
        { error: 'This person is already a team member or has a pending invite' },
        { status: 400 }
      )
    }

    // Seat limit check
    const seatLimit = SEAT_LIMITS[user.plan] ?? 1
    if (team.members.length >= seatLimit) {
      return NextResponse.json({ error: 'seats_full' }, { status: 403 })
    }

    // Create invite record
    const member = await prisma.teamMember.create({
      data: {
        teamId: team.id,
        inviteEmail: email,
        role,
        status: 'pending',
      },
    })

    // Send invite email
    const inviteUrl   = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://datafyle.com'}/team/accept?memberId=${member.id}`
    const inviterName = user.name ?? user.email

    let emailSent  = false
    let emailError: string | null = null
    try {
      await sendTeamInviteEmail(email, inviterName, team.name, role, inviteUrl)
      emailSent = true
    } catch (e) {
      emailError = e instanceof Error ? e.message : String(e)
      console.error('Team invite email failed:', emailError)
    }

    return NextResponse.json({ success: true, memberId: member.id, emailSent, emailError })
  } catch (error) {
    console.error('Team invite error:', error)
    return NextResponse.json({ error: 'Failed to send invite' }, { status: 500 })
  }
}
