'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Page Error]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-5">
        <span className="text-red-500 text-2xl font-bold">!</span>
      </div>
      <h1 className="text-xl font-bold text-[#1E293B] mb-2">Something went wrong</h1>
      <p className="text-sm text-slate-500 mb-8 max-w-sm">
        An unexpected error occurred. This has been logged. Please try again or go back to the homepage.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors min-h-[44px]"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 border border-[#E2E8F0] text-slate-600 text-sm font-semibold rounded-lg hover:bg-[#F8FAFC] transition-colors min-h-[44px] inline-flex items-center"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
