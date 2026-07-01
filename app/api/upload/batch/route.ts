import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { uploadFile } from '@/lib/r2'

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

    const formData = await req.formData()
    const files = formData.getAll('files') as File[]

    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const remaining = user.docsLimit - user.docsUsed
    if (files.length > remaining) {
      return NextResponse.json(
        {
          error: 'limit',
          upgrade: true,
          message: `You can only upload ${remaining} more document(s) on your current plan`,
        },
        { status: 403 }
      )
    }

    const documentIds: string[] = []
    let totalUploaded = 0

    for (const file of files) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
      if (!ALLOWED_EXTENSIONS.has(ext) || file.size > MAX_SIZE) continue

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
      totalUploaded++
    }

    return NextResponse.json({ success: true, documentIds, totalUploaded })
  } catch (error) {
    console.error('Batch upload error:', error)
    return NextResponse.json({ error: 'Batch upload failed' }, { status: 500 })
  }
}
