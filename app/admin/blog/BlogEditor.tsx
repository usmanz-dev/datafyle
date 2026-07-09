'use client'

import { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { X, ImageIcon, Loader2, Save, Globe } from 'lucide-react'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export interface BlogPostData {
  id?: string
  title: string
  slug: string
  content: string
  tags: string[]
  featuredImage: string | null
  seoTitle: string | null
  seoDescription: string | null
  published: boolean
}

export function BlogEditor({ initial }: { initial: BlogPostData }) {
  const router = useRouter()
  const [title, setTitle]               = useState(initial.title)
  const [slug, setSlug]                 = useState(initial.slug)
  const [content, setContent]           = useState(initial.content)
  const [tags, setTags]                 = useState<string[]>(initial.tags)
  const [tagInput, setTagInput]         = useState('')
  const [featuredImage, setFeaturedImage] = useState<string | null>(initial.featuredImage)
  const [seoTitle, setSeoTitle]         = useState(initial.seoTitle ?? '')
  const [seoDesc, setSeoDesc]           = useState(initial.seoDescription ?? '')
  const [saving, setSaving]             = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError]               = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isEdit = !!initial.id

  function onTitleChange(val: string) {
    setTitle(val)
    if (!isEdit) setSlug(slugify(val))
  }

  function addTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
      if (!tags.includes(t)) setTags([...tags, t])
      setTagInput('')
    }
  }

  function removeTag(t: string) {
    setTags(tags.filter((x) => x !== t))
  }

  async function uploadImage(file: File) {
    setUploadingImage(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/blog/upload-image', { method: 'POST', body: fd })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Upload failed')
      }
      const { url } = await res.json()
      setFeaturedImage(url)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Image upload failed')
    } finally {
      setUploadingImage(false)
    }
  }

  async function save(publish: boolean) {
    setError(null)
    if (!title.trim()) { setError('Title is required'); return }
    if (!slug.trim())  { setError('Slug is required');  return }

    setSaving(true)
    try {
      const method = isEdit ? 'PUT' : 'POST'
      const url    = isEdit ? `/api/admin/blog/${initial.id}` : '/api/admin/blog'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          slug:  slug.trim(),
          content,
          tags,
          featuredImage:  featuredImage ?? null,
          seoTitle:       seoTitle.trim() || null,
          seoDescription: seoDesc.trim()  || null,
          published: publish,
        }),
      })

      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Save failed'); return }

      router.push('/admin/blog')
      router.refresh()
    } catch {
      setError('Save failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-[#1E293B] mb-1.5">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Post title…"
          className="w-full px-4 py-3 text-[#1E293B] text-lg font-medium border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
          Slug
          <span className="ml-2 text-xs font-normal text-slate-400">
            datafyle.com/blog/<span className="text-slate-600 font-mono">{slug || 'your-post-slug'}</span>
          </span>
        </label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
          placeholder="post-slug"
          className="w-full px-4 py-2 text-[#1E293B] text-sm font-mono border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] min-h-10"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-[#1E293B] mb-1.5">Tags</label>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#EFF6FF] text-[#2563EB] text-xs rounded-full font-medium"
              >
                {t}
                <button onClick={() => removeTag(t)} className="ml-0.5 hover:text-blue-900">
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        )}
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={addTag}
          placeholder="Type a tag and press Enter…"
          className="w-full px-4 py-2 text-[#1E293B] text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] min-h-10"
        />
      </div>

      {/* Featured Image */}
      <div>
        <label className="block text-sm font-medium text-[#1E293B] mb-1.5">Featured Image</label>
        {featuredImage ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={featuredImage} alt="Featured" className="w-full h-48 object-cover rounded-lg border border-[#E2E8F0]" />
            <button
              onClick={() => setFeaturedImage(null)}
              className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm border border-[#E2E8F0] hover:bg-red-50 transition-colors"
            >
              <X size={14} className="text-slate-500" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
            className="w-full flex items-center justify-center h-32 border-2 border-dashed border-[#E2E8F0] rounded-lg hover:border-[#2563EB] hover:bg-[#EFF6FF] transition-colors disabled:opacity-60 cursor-pointer"
          >
            {uploadingImage ? (
              <Loader2 size={20} className="animate-spin text-[#2563EB]" />
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-slate-400">
                <ImageIcon size={24} />
                <span className="text-sm">Click to upload image</span>
                <span className="text-xs">Recommended: 1280 × 720px · Max 5MB</span>
              </div>
            )}
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f) }}
        />
      </div>

      {/* Content */}
      <div data-color-mode="light">
        <label className="block text-sm font-medium text-[#1E293B] mb-1.5">Content (Markdown)</label>
        <MDEditor
          value={content}
          onChange={(val) => setContent(val ?? '')}
          height={420}
          preview="live"
        />
      </div>

      {/* SEO */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
            SEO Title
            <span className={`ml-2 text-xs font-normal ${seoTitle.length > 60 ? 'text-red-500' : 'text-slate-400'}`}>
              {seoTitle.length}/60
            </span>
          </label>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="SEO-optimised title (leave blank to use post title)"
            className="w-full px-4 py-2 text-[#1E293B] text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] min-h-10"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-1.5">
            Meta Description
            <span className={`ml-2 text-xs font-normal ${seoDesc.length > 160 ? 'text-red-500' : 'text-slate-400'}`}>
              {seoDesc.length}/160
            </span>
          </label>
          <textarea
            value={seoDesc}
            onChange={(e) => setSeoDesc(e.target.value)}
            placeholder="Short description for search engines (recommended: 120–160 characters)"
            rows={3}
            className="w-full px-4 py-2 text-[#1E293B] text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] resize-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-[#E2E8F0]">
        <button
          onClick={() => save(false)}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-white border border-[#E2E8F0] text-[#1E293B] rounded-lg hover:bg-[#F8FAFC] transition-colors disabled:opacity-50 min-h-11 shadow-sm"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          Save Draft
        </button>
        <button
          onClick={() => save(true)}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#2563EB] text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 min-h-11"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Globe size={15} />}
          Publish Now
        </button>
        <button
          onClick={() => router.push('/admin/blog')}
          disabled={saving}
          className="ml-auto text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
