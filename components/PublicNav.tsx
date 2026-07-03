import Link from 'next/link'

export function PublicNav() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[#E2E8F0] shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold tracking-tight">DF</span>
          </div>
          <span className="text-[#1E293B] font-bold text-lg">Datafyle</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/pricing"
            className="hidden sm:block text-sm font-medium text-[#1E293B] hover:text-[#2563EB] transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/sign-in"
            className="text-sm font-medium text-[#1E293B] hover:text-[#2563EB] transition-colors"
          >
            Login
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex items-center px-4 py-2 bg-[#2563EB] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors min-h-[40px]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  )
}
