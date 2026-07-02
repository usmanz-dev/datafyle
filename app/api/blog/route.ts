import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true, title: true, slug: true, tags: true,
        featuredImage: true, seoDescription: true, publishedAt: true,
      },
    })
    return NextResponse.json(posts)
  } catch (err) {
    console.error('Blog GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}
