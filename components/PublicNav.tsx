import Link from 'next/link'
import Image from 'next/image'

export function PublicNav() {
  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/8 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Image src="/images/datafyle.png" alt="" width={22} height={22} className="w-5 h-5 object-contain brightness-0 invert" />
          </div>
          <span className="font-bold text-[18px] text-white tracking-tight">
            Data<span className="text-blue-400">fyle</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/pricing" className="hidden sm:block text-sm font-medium text-white/70 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/sign-in" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
            Login
          </Link>
          <Link href="/sign-up" className="inline-flex items-center px-4 py-2 bg-[#2563EB] text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors min-h-[40px]">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  )
}
