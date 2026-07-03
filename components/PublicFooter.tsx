import Link from 'next/link'

export function PublicFooter() {
  return (
    <footer className="bg-[#0F172A] border-t border-white/10 py-12 px-4">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 mb-10">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">DF</span>
            </div>
            <span className="text-white font-bold text-lg">Datafyle</span>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            AI Document Processing for Accounting Firms
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Product</h4>
          <ul className="space-y-2.5">
            <li><Link href="/pricing" className="text-slate-400 hover:text-white text-sm transition-colors">Pricing</Link></li>
            <li><Link href="/#how-it-works" className="text-slate-400 hover:text-white text-sm transition-colors">How It Works</Link></li>
            <li><Link href="/sign-up" className="text-slate-400 hover:text-white text-sm transition-colors">Get Started Free</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
          <ul className="space-y-2.5">
            <li><Link href="/blog" className="text-slate-400 hover:text-white text-sm transition-colors">Blog</Link></li>
            <li><Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-5xl mx-auto pt-8 border-t border-white/10 text-center">
        <p className="text-slate-500 text-sm">Copyright 2026 Datafyle. All rights reserved.</p>
      </div>
    </footer>
  )
}
