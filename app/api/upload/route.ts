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

    // Monthly limit: count docs uploaded THIS month only (auto-resets each month)
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisMonthCount = await prisma.document.count({
      where: { userId: user.id, createdAt: { gte: startOfMonth } },
    })
    const effectiveLimit = getDocsLimit(user.plan)
    if (thisMonthCount >= effectiveLimit) {
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
