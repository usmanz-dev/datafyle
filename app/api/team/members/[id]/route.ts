import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 })

    const { id } = await params

    const member = await prisma.teamMember.findUnique({
      where: { id },
      include: { team: true },
    })

    if (!member) return NextResponse.json({ error: 'Member not found' }, { status: 404 })

    // Only the team owner can remove members
    if (member.team.ownerId !== user.id) {
      return NextResponse.json({ error: 'Only the team admin can remove members' }, { status: 403 })
    }

    // Cannot remove self
    if (member.userId === user.id) {
      return NextResponse.json({ error: 'Cannot remove yourself from the team' }, { status: 400 })
    }

    await prisma.teamMember.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Remove member error:', error)
    return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 })
  }
}
