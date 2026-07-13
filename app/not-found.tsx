import Link from 'next/link'
import { ArrowRight, FileX } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-[#EFF6FF] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FileX size={40} className="text-[#2563EB]" />
        </div>
        <h1 className="text-6xl font-black text-[#1E293B] mb-2">404</h1>
        <h2 className="text-xl font-bold text-[#1E293B] mb-3">Page not found</h2>
        <p className="text-slate-500 text-base mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-blue-700 transition-all min-h-[48px]"
          >
            Go Home <ArrowRight size={16} />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#E2E8F0] text-[#1E293B] font-medium rounded-xl hover:bg-[#F8FAFC] transition-all min-h-[48px]"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
