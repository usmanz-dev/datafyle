import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { BlogClient } from './BlogClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog — Accounting Automation Tips',
  description: 'Accounting automation tips, guides, and industry insights from Datafyle.',
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true, title: true, slug: true, tags: true,
      featuredImage: true, seoDescription: true, publishedAt: true, featured: true,
    },
  })

  const serialised = posts.map((p) => ({
    ...p,
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
  }))

  return <BlogClient posts={serialised} />
}
