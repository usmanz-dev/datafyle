'use client'

import dynamic from 'next/dynamic'

const MarkdownPreview = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => ({ default: mod.default.Markdown })),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-slate-100 rounded w-full" />
        <div className="h-4 bg-slate-100 rounded w-5/6" />
        <div className="h-4 bg-slate-100 rounded w-3/4" />
        <div className="h-4 bg-slate-100 rounded w-full" />
        <div className="h-4 bg-slate-100 rounded w-4/5" />
      </div>
    ),
  }
)

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div data-color-mode="light">
      <MarkdownPreview
        source={content}
        style={{ background: 'transparent', color: '#1E293B', fontSize: '16px', lineHeight: '1.7' }}
      />
    </div>
  )
}
