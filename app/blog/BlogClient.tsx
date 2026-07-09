'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

const PAGE_SIZE = 9

type Filter = 'newest' | 'oldest' | 'featured'

interface Post {
  id: string
  title: string
  slug: string
  tags: string[]
  featuredImage: string | null
  seoDescription: string | null
  publishedAt: string | null
  featured: boolean
}

export function BlogClient({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState<Filter>('newest')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const sorted = [...posts]
    .filter((p) => filter === 'featured' ? p.featured : true)
    .sort((a, b) => {
      const ta = new Date(a.publishedAt ?? 0).getTime()
      const tb = new Date(b.publishedAt ?? 0).getTime()
      return filter === 'oldest' ? ta - tb : tb - ta
    })

  const shown  = sorted.slice(0, visible)
  const hasMore = visible < sorted.length
  const remaining = sorted.length - visible

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {([
          { key: 'newest',   label: 'Newest First' },
          { key: 'oldest',   label: 'Oldest First' },
          { key: 'featured', label: '⭐ Featured'   },
        ] as { key: Filter; label: string }[]).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => { setFilter(key); setVisible(PAGE_SIZE) }}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
              filter === key
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'bg-white border border-[#E2E8F0] text-slate-600 hover:border-[#2563EB] hover:text-[#2563EB]'
            }`}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-400 font-medium">
          {sorted.length} article{sorted.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Grid */}
      {shown.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 text-sm">
            {filter === 'featured' ? 'No featured articles yet.' : 'No articles found.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block bg-white rounded-xl border border-[#E2E8F0] overflow-hidden hover:shadow-md transition-all duration-200"
            >
              {/* Image */}
              {post.featuredImage ? (
                <div className="aspect-video overflow-hidden bg-[#F8FAFC] relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {post.featured && (
                    <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 bg-amber-400 text-white rounded-full uppercase tracking-wide">
                      ⭐ Featured
                    </span>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-[#EFF6FF] to-[#F8FAFC] flex items-center justify-center relative">
                  <span className="text-4xl font-bold text-[#2563EB]/20">DF</span>
                  {post.featured && (
                    <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 bg-amber-400 text-white rounded-full uppercase tracking-wide">
                      ⭐ Featured
                    </span>
                  )}
                </div>
              )}

              {/* Content */}
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
                <h2 className="font-bold text-[#1E293B] text-base leading-snug group-hover:text-[#2563EB] transition-colors line-clamp-2">
                  {post.title}
                </h2>
                {post.seoDescription && (
                  <p className="text-sm text-slate-500 mt-2 line-clamp-2">{post.seoDescription}</p>
                )}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-xs text-slate-400">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : ''}
                  </p>
                  <span className="text-xs text-[#2563EB] font-medium group-hover:underline">Read More →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Show More button */}
      {hasMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-[#E2E8F0] text-slate-700 text-sm font-semibold rounded-xl hover:border-[#2563EB] hover:text-[#2563EB] transition-all shadow-sm"
          >
            <ChevronDown size={15} />
            Show More ({remaining} remaining)
          </button>
        </div>
      )}
    </div>
  )
}
