import Link from 'next/link'
import Image from 'next/image'

export function PublicFooter() {
  return (
    <footer className="relative bg-black overflow-hidden pt-16 pb-8 px-4">
      {/* Blue gradient aura at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '300px',
          background: 'radial-gradient(ellipse 100% 70% at 50% 105%, rgba(37,99,235,0.50) 0%, rgba(37,99,235,0.12) 50%, transparent 72%)',
        }}
      />
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto grid md:grid-cols-3 gap-10 mb-10">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Image src="/images/datafyle.png" alt="" width={22} height={22} className="w-5 h-5 object-contain brightness-0 invert" />
            </div>
            <span className="font-bold text-[18px] text-white tracking-tight">
              Data<span className="text-blue-400">fyle</span>
            </span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            AI Document Processing for Accounting Firms
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">Product</h4>
          <ul className="space-y-2.5">
            <li><Link href="/pricing" className="text-slate-400 hover:text-white text-sm transition-colors">Pricing</Link></li>
            <li><Link href="/#how-it-works" className="text-slate-400 hover:text-white text-sm transition-colors">How It Works</Link></li>
            <li><Link href="/sign-up" className="text-slate-400 hover:text-white text-sm transition-colors">Get Started Free</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">Company</h4>
          <ul className="space-y-2.5">
            <li><Link href="/blog" className="text-slate-400 hover:text-white text-sm transition-colors">Blog</Link></li>
            <li><Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto pt-8 border-t border-white/10 text-center">
        <p className="text-slate-600 text-sm">© 2026 Datafyle. All rights reserved.</p>
      </div>
    </footer>
  )
}
