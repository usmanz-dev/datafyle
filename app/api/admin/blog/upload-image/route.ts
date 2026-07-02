import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { uploadFile } from '@/lib/r2'

export async function POST(req: NextRequest) {
  try {
    const clerk = await currentUser()
    const email = clerk?.emailAddresses?.[0]?.emailAddress ?? ''
    if (!email || email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const fd = await req.formData()
    const file = fd.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be under 5MB' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const key = `blog/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())
    const url = await uploadFile(buffer, key, file.type)

    return NextResponse.json({ url })
  } catch (err) {
    console.error('Blog image upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
