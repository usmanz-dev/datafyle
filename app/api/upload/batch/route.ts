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
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 })

    // Monthly limit check (same as single upload)
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const thisMonthCount = await prisma.document.count({
      where: { userId: user.id, createdAt: { gte: startOfMonth } },
    })
    const effectiveLimit = getDocsLimit(user.plan)
    const remaining = effectiveLimit - thisMonthCount

    if (remaining <= 0) {
      return NextResponse.json({ error: 'limit', upgrade: true, message: 'Monthly limit reached' }, { status: 403 })
    }

    const formData = await req.formData()
    const files = formData.getAll('files') as File[]

    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const filesToProcess = files.slice(0, remaining)
    const skipped = files.length - filesToProcess.length

    const documentIds: string[] = []
    const errors: string[] = []

    for (const file of filesToProcess) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        errors.push(`${file.name}: unsupported file type`)
        continue
      }
      if (file.size > MAX_SIZE) {
        errors.push(`${file.name}: exceeds 25MB limit`)
        continue
      }

      try {
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
        documentIds.push(document.id)
      } catch {
        errors.push(`${file.name}: upload failed`)
      }
    }

    return NextResponse.json({ success: true, documentIds, totalUploaded: documentIds.length, skipped, errors })
  } catch (error) {
    console.error('Batch upload error:', error)
    return NextResponse.json({ error: 'Batch upload failed' }, { status: 500 })
  }
}
