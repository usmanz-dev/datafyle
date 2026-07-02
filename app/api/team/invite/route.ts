import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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
    const inviteUrl = `https://datafyle.com/team/accept?memberId=${member.id}`
    const teamName = team.name
    const inviterName = user.name ?? user.email

    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'noreply@datafyle.com',
        to: email,
        subject: `You've been invited to join ${teamName} on Datafyle`,
        html: `
          <div style="font-family: Inter, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1E293B;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="display: inline-flex; align-items: center; justify-content: center; background: #2563EB; color: white; width: 44px; height: 44px; border-radius: 50%; font-weight: 700; font-size: 13px; letter-spacing: -0.5px;">DF</div>
              <p style="margin: 12px 0 0; font-size: 18px; font-weight: 700; color: #1E293B;">Datafyle</p>
            </div>
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 32px; margin-bottom: 24px;">
              <h1 style="font-size: 22px; font-weight: 700; margin: 0 0 12px;">You've been invited!</h1>
              <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 24px;">
                <strong>${inviterName}</strong> has invited you to join <strong>${teamName}</strong> on Datafyle — AI-powered document processing for accounting teams.
              </p>
              <div style="text-align: center;">
                <a href="${inviteUrl}" style="display: inline-block; background: #2563EB; color: white; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
                  Accept Invitation
                </a>
              </div>
            </div>
            <p style="font-size: 13px; color: #94A3B8; text-align: center; margin: 0;">
              If you didn't expect this invitation, you can safely ignore this email.<br />
              This invite link expires in 7 days.
            </p>
            <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
            <p style="font-size: 12px; color: #CBD5E1; text-align: center; margin: 0;">
              Datafyle · AI Document Processing · datafyle.com
            </p>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('Failed to send invite email:', emailErr)
      // Invite is created — don't fail the request if email fails
    }

    return NextResponse.json({ success: true, memberId: member.id })
  } catch (error) {
    console.error('Team invite error:', error)
    return NextResponse.json({ error: 'Failed to send invite' }, { status: 500 })
  }
}
