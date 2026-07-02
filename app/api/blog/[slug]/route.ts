import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const post = await prisma.blogPost.findUnique({
      where: { slug, published: true },
    })
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(post)
  } catch (err) {
    console.error('Blog slug GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}
