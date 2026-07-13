'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Dashboard Error]', error)
  }, [error])

  return (
    <div className="flex-1 bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-10 text-center max-w-sm w-full">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={24} className="text-[#EF4444]" />
        </div>
        <h2 className="text-lg font-bold text-[#1E293B] mb-2">Dashboard Error</h2>
        <p className="text-sm text-slate-500 mb-6">
          Something went wrong loading your dashboard. Your data is safe.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors min-h-[44px]"
          >
            <RefreshCw size={16} />
            Retry
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full py-2.5 border border-[#E2E8F0] text-slate-600 text-sm font-semibold rounded-lg hover:bg-[#F8FAFC] transition-colors min-h-[44px]"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
