import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { uploadFile } from '@/lib/r2'
import { getDocsLimit } from '@/lib/plans'

const ALLOWED_EXTENSIONS = new Set([
  'pdf', 'docx', 'doc', 'xlsx', 'xls', 'csv', 'txt', 'xml', 'jpg', 'jpeg', 'png',
])

const MAX_SIZE = 26214400 // 25MB

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Check if user is in a team (as owner or member)
    const [ownedTeam, memberTeam] = await Promise.all([
      prisma.team.findFirst({ where: { ownerId: user.id } }),
      prisma.teamMember.findFirst({
        where: { userId: user.id, status: 'accepted' },
        include: { team: true },
      }),
    ])

    const activeTeam = ownedTeam ?? memberTeam?.team ?? null
    const ownerId = activeTeam?.ownerId ?? user.id

    let effectiveLimit: number
    let monthlyCount: number

    if (activeTeam) {
      // Shared pool — use team owner's plan limit
      const owner = await prisma.user.findUnique({ where: { id: ownerId }, select: { plan: true } })
      effectiveLimit = getDocsLimit(owner?.plan ?? user.plan)

      // Count ALL team member docs this month
      const teamMembers = await prisma.teamMember.findMany({
        where: { teamId: activeTeam.id, status: 'accepted', userId: { not: null } },
        select: { userId: true },
      })
      const allTeamUserIds = teamMembers.map((m) => m.userId!)
      monthlyCount = await prisma.document.count({
        where: { userId: { in: allTeamUserIds }, createdAt: { gte: startOfMonth } },
      })
    } else {
      effectiveLimit = getDocsLimit(user.plan)
      monthlyCount = await prisma.document.count({
        where: { userId: user.id, createdAt: { gte: startOfMonth } },
      })
    }

    if (monthlyCount >= effectiveLimit) {
      return NextResponse.json({ error: 'limit', upgrade: true }, { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json({ error: 'File type not supported' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Max file size is 25MB' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const key = `${userId}/${Date.now()}-${file.name}`
    const fileUrl = await uploadFile(buffer, key, file.type)

    const document = await prisma.document.create({
      data: {
        userId: user.id,
        fileName: file.name,
        fileType: ext,
        fileUrl,
        fileSize: file.size,
        status: 'pending',
        uploadedByName: user.name ?? null,
      },
    })

    return NextResponse.json({ success: true, documentId: document.id, fileUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed', detail: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
