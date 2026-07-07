'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

export function PublicFooter() {
  return (
    <>
      {/* ── FINAL CTA ──────────────────────────────────────────────────────────── */}
      <section className="relative py-24 px-4 bg-black overflow-hidden">
        {/* Blue gradient aura */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(37,99,235,0.25) 0%, transparent 70%)' }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="relative z-10 max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Stop Wasting 8 Hours a Day on Data Entry</h2>
          <p className="text-slate-400 mb-8 text-lg">Join 50+ accounting firms already saving time with Datafyle</p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#2563EB] text-white text-lg font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg hover:-translate-y-0.5 min-h-14"
          >
            Get Started Now — It&apos;s Free
            <ArrowRight size={20} />
          </Link>
          <p className="mt-4 text-sm text-slate-500">No credit card • Free 10 documents • Setup in 3 minutes</p>
        </motion.div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────────── */}
      <footer className="relative bg-black overflow-hidden pt-20 pb-10 px-4">
        {/* Blue gradient aura at bottom edge */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: '320px', background: 'radial-gradient(ellipse 100% 70% at 50% 105%, rgba(37,99,235,0.55) 0%, rgba(37,99,235,0.15) 50%, transparent 72%)' }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">

            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Image src="/images/datafyle.png" alt="" width={22} height={22} className="w-5 h-5 object-contain brightness-0 invert" />
                </div>
                <span className="font-bold text-[18px] text-white tracking-tight">Data<span className="text-blue-400">fyle</span></span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-2">
                AI-powered document processing for accounting and bookkeeping firms.
              </p>
              <p className="text-slate-500 text-xs leading-relaxed mb-6">
                Trusted by 50+ firms in UK, US &amp; Australia.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-2">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white hover:scale-110 transition-all duration-200">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white hover:scale-110 transition-all duration-200">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-[#E1306C] hover:border-[#E1306C] hover:text-white hover:scale-110 transition-all duration-200">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-[#1DA1F2] hover:border-[#1DA1F2] hover:text-white hover:scale-110 transition-all duration-200">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                  </svg>
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok"
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white hover:border-white hover:text-black hover:scale-110 transition-all duration-200">
                  <svg width="13" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.58a8.32 8.32 0 0 0 4.87 1.56V6.64a4.85 4.85 0 0 1-1.1.05z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-5 text-xs uppercase tracking-widest">Product</h4>
              <ul className="space-y-3">
                <li><Link href="/#about"        className="text-slate-400 hover:text-white text-sm transition-colors">About Us</Link></li>
                <li><Link href="/#how-it-works" className="text-slate-400 hover:text-white text-sm transition-colors">How It Works</Link></li>
                <li><Link href="/#features"     className="text-slate-400 hover:text-white text-sm transition-colors">Features</Link></li>
                <li><Link href="/#calculator"   className="text-slate-400 hover:text-white text-sm transition-colors">Savings Calculator</Link></li>
                <li><Link href="/#file-types"   className="text-slate-400 hover:text-white text-sm transition-colors">Supported Files</Link></li>
                <li><Link href="/pricing"        className="text-slate-400 hover:text-white text-sm transition-colors">Pricing</Link></li>
                <li><Link href="/#faq"           className="text-slate-400 hover:text-white text-sm transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-5 text-xs uppercase tracking-widest">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/blog"    className="text-slate-400 hover:text-white text-sm transition-colors">Blog</Link></li>
                <li><Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms"   className="text-slate-400 hover:text-white text-sm transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Get Started */}
            <div>
              <h4 className="text-white font-semibold mb-5 text-xs uppercase tracking-widest">Get Started</h4>
              <ul className="space-y-3">
                <li><Link href="/sign-up"   className="text-slate-400 hover:text-white text-sm transition-colors">Create Free Account</Link></li>
                <li><Link href="/sign-in"   className="text-slate-400 hover:text-white text-sm transition-colors">Sign In</Link></li>
                <li><Link href="/pricing"   className="text-slate-400 hover:text-white text-sm transition-colors">View Pricing</Link></li>
                <li><Link href="/dashboard" className="text-slate-400 hover:text-white text-sm transition-colors">Dashboard</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">© 2026 Datafyle. All rights reserved.</p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse shrink-0" />
                <span className="text-slate-500 text-xs">99.7% uptime</span>
              </div>
              <span className="text-slate-700 hidden sm:inline">·</span>
              <Link href="/privacy" className="text-slate-500 text-xs hover:text-white transition-colors">Privacy</Link>
              <span className="text-slate-700">·</span>
              <Link href="/terms"   className="text-slate-500 text-xs hover:text-white transition-colors">Terms</Link>
              <span className="text-slate-700">·</span>
              <Link href="/blog"    className="text-slate-500 text-xs hover:text-white transition-colors">Blog</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
