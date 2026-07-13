'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export function NavigationLoader() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  // Hide when navigation completes (pathname changes)
  useEffect(() => {
    setLoading(false)
  }, [pathname])

  // Safety fallback — hide after 8s if navigation somehow stalls
  useEffect(() => {
    if (!loading) return
    const timer = setTimeout(() => setLoading(false), 8000)
    return () => clearTimeout(timer)
  }, [loading])

  // Intercept internal link clicks and show loader immediately
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Skip modifier-key clicks (new tab, etc.)
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return

      const anchor = (e.target as Element).closest('a[href]') as HTMLAnchorElement | null
      if (!anchor) return

      const hrefAttr = anchor.getAttribute('href') || ''

      // Skip hash-only jumps (#section or /#section)
      if (hrefAttr.startsWith('#')) return
      if (hrefAttr.startsWith('/#')) return

      // Skip non-internal links
      if (!hrefAttr.startsWith('/')) return

      // Parse destination and skip external
      let dest: URL
      try { dest = new URL(hrefAttr, window.location.href) }
      catch { return }
      if (dest.origin !== window.location.origin) return

      // Skip same page (only hash change)
      if (dest.pathname === window.location.pathname) return

      setLoading(true)
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [pathname])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-8">
        <Image
          src="/images/datafyle-ai-invoice-data-extraction.png"
          alt="Datafyle"
          width={200}
          height={52}
          className="h-12 w-auto object-contain"
          priority
        />
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce [animation-delay:300ms]" />
        </div>
      </div>

      {/* Sliding progress bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100 overflow-hidden">
        <div
          className="h-full w-48 bg-[#2563EB] rounded-full"
          style={{ animation: 'slideBar 1.4s ease-in-out infinite' }}
        />
      </div>

      <style>{`
        @keyframes slideBar {
          0%   { transform: translateX(-200px); }
          100% { transform: translateX(100vw); }
        }
      `}</style>
    </div>
  )
}
