import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { PublicNav } from '@/components/PublicNav'
import { PublicFooter } from '@/components/PublicFooter'
import { MouseBlobClient } from '@/components/MouseBlobClient'

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
      featuredImage: true, seoDescription: true, publishedAt: true,
    },
  })

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

        {/* Posts */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          {posts.length === 0 ? (
            <p className="text-slate-400 text-center py-20 text-sm">No posts yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block bg-white rounded-xl border border-[#E2E8F0] overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  {post.featuredImage ? (
                    <div className="aspect-video overflow-hidden bg-[#F8FAFC]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-linear-to-br from-[#EFF6FF] to-[#F8FAFC] flex items-center justify-center">
                      <span className="text-4xl font-bold text-[#2563EB]/20">DF</span>
                    </div>
                  )}
                  <div className="p-5">
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        {post.tags.slice(0, 3).map((t) => (
                          <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <h2 className="font-bold text-[#1E293B] text-lg leading-snug group-hover:text-[#2563EB] transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    {post.seoDescription && (
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2">{post.seoDescription}</p>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-xs text-slate-400">
                        {new Date(post.publishedAt!).toLocaleDateString('en-US', {
                          month: 'long', day: 'numeric', year: 'numeric',
                        })}
                      </p>
                      <span className="text-xs text-[#2563EB] font-medium group-hover:underline">Read More →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
