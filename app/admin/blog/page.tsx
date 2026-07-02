import { prisma } from '@/lib/prisma'
import { BlogListClient } from './BlogListClient'

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, title: true, slug: true, tags: true,
      published: true, publishedAt: true, createdAt: true,
    },
  })

  return (
    <div className="p-8">
      <BlogListClient
        posts={posts.map((p) => ({
          ...p,
          publishedAt: p.publishedAt?.toISOString() ?? null,
          createdAt:   p.createdAt.toISOString(),
        }))}
      />
    </div>
  )
}
