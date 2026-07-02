'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Eye, Plus } from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
  tags: string[]
  published: boolean
  publishedAt: string | null
  createdAt: string
}

export function BlogListClient({ posts }: { posts: Post[] }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)

  async function deletePost(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      router.refresh()
    } catch {
      alert('Failed to delete post')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[#1E293B]">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors min-h-10"
        >
          <Plus size={16} />
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm px-8 py-16 text-center">
          <p className="text-sm text-slate-400">No blog posts yet.</p>
          <Link href="/admin/blog/new" className="mt-3 inline-block text-sm text-[#2563EB] font-medium hover:underline">
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <th className="text-left px-4 py-3 font-medium text-[#1E293B]">Title</th>
                <th className="text-left px-4 py-3 font-medium text-[#1E293B]">Tags</th>
                <th className="text-left px-4 py-3 font-medium text-[#1E293B]">Status</th>
                <th className="text-left px-4 py-3 font-medium text-[#1E293B]">Date</th>
                <th className="px-4 py-3 w-28" />
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#1E293B] max-w-xs truncate">{post.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5 font-mono">/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((t) => (
                        <span key={t} className="px-2 py-0.5 bg-[#EFF6FF] text-[#2563EB] text-xs rounded-full">
                          {t}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {post.published ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                    {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 justify-end">
                      {post.published && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-1.5 text-slate-400 hover:text-[#2563EB] rounded hover:bg-[#EFF6FF] transition-colors"
                          title="View live"
                        >
                          <Eye size={15} />
                        </Link>
                      )}
                      <Link
                        href={`/admin/blog/edit/${post.id}`}
                        className="p-1.5 text-slate-400 hover:text-[#1E293B] rounded hover:bg-[#F8FAFC] transition-colors"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => deletePost(post.id, post.title)}
                        disabled={deleting === post.id}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
