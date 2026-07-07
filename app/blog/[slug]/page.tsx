import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { MarkdownContent } from './MarkdownContent'
import { PublicNav } from '@/components/PublicNav'
import { PublicFooter } from '@/components/PublicFooter'
import { MouseBlobClient } from '@/components/MouseBlobClient'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
    select: { title: true, seoTitle: true, seoDescription: true },
  })
  if (!post) return {}
  return {
    title: post.seoTitle ?? `${post.title} — Datafyle Blog`,
    description: post.seoDescription ?? undefined,
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({ where: { slug, published: true } })
  if (!post) notFound()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <MouseBlobClient />
      <PublicNav />


      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          {/* Breadcrumb */}
          <Link
            href="/blog"
            className="text-xs text-[#2563EB] font-medium hover:underline mb-6 inline-block"
          >
            ← Back to Blog
          </Link>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((t) => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] font-medium">
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1E293B] leading-tight mb-3">
            {post.title}
          </h1>

          {/* Date */}
          <p className="text-sm text-slate-400 mb-8">
            {new Date(post.publishedAt!).toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric',
            })}
          </p>

          {/* Featured image */}
          {post.featuredImage && (
            <div className="mb-8 rounded-xl overflow-hidden border border-[#E2E8F0]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full object-cover max-h-80"
              />
            </div>
          )}

          {/* Content */}
          <MarkdownContent content={post.content} />

          {/* CTA */}
          <div className="mt-12 pt-6 border-t border-[#E2E8F0] flex items-center justify-between">
            <Link href="/blog" className="text-sm text-[#2563EB] font-medium hover:underline">
              ← All Posts
            </Link>
            <Link href="/sign-up" className="text-sm text-slate-500 hover:text-[#2563EB] transition-colors">
              Try Datafyle free →
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
