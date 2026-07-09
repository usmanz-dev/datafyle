import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { PublicNav } from '@/components/PublicNav'
import { PublicFooter } from '@/components/PublicFooter'
import { MouseBlobClient } from '@/components/MouseBlobClient'
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <MouseBlobClient />
      <PublicNav />

      <main className="flex-1">
        {/* Header */}
        <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h1 className="text-3xl font-bold text-[#1E293B]">Blog</h1>
            <p className="text-slate-500 mt-2">Accounting automation tips, guides, and industry insights.</p>
          </div>
        </div>

        {/* Posts with filter + pagination */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          {posts.length === 0 ? (
            <p className="text-slate-400 text-center py-20 text-sm">No posts yet. Check back soon!</p>
          ) : (
            <BlogClient posts={serialised} />
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
