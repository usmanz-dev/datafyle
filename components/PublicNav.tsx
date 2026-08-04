'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useAuth } from '@clerk/nextjs'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

const DESKTOP_NAV = [
  { href: '/#about',        label: 'About' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#features',     label: 'Features' },
  { href: '/#calculator',   label: 'Savings Calculator' },
  { href: '/#faq',          label: 'FAQ' },
  { href: '/contact',       label: 'Contact' },
]

const MOBILE_NAV = [
  { href: '/#about',        label: 'About Us' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#features',     label: 'Features' },
  { href: '/#calculator',   label: 'Savings Calculator' },
  { href: '/#file-types',   label: 'File Types' },
  { href: '/pricing',       label: 'Pricing' },
  { href: '/contact',       label: 'Contact' },
  { href: '/#faq',          label: 'FAQ' },
]

export function PublicNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { isSignedIn } = useAuth()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 overflow-hidden ${
          scrolled || menuOpen
            ? 'bg-white/90 backdrop-blur-sm border-b border-[#E2E8F0] shadow-sm'
            : 'border-b border-white/10'
        }`}
      >
        {/* Gradient + dots — visible only when not scrolled */}
        {!scrolled && !menuOpen && (
          <>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1a3060 50%, #0F172A 100%)' }} />
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 70% 300% at 50% -30%, rgba(37,99,235,0.6) 0%, transparent 65%)' }} />
            <div className="absolute inset-0 pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          </>
        )}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${!scrolled && !menuOpen ? 'bg-white/15' : 'bg-[#2563EB]'}`}>
              <Image src="/images/datafyle.png" alt="" width={22} height={22} className="w-5 h-5 object-contain brightness-0 invert" priority />
            </div>
            <span className={`font-bold text-[18px] tracking-tight transition-colors ${!scrolled && !menuOpen ? 'text-white' : 'text-[#1E293B]'}`}>
              Data<span className={!scrolled && !menuOpen ? 'text-blue-300' : 'text-[#2563EB]'}>fyle</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1 flex-1">
            {DESKTOP_NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  scrolled
                    ? 'text-[#1E293B] hover:text-[#2563EB] hover:bg-[#EFF6FF]'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/pricing"
              className={`ml-1 px-4 py-2 rounded-lg text-sm font-bold border-2 transition-all duration-200 ${
                scrolled
                  ? 'border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white'
                  : 'border-white/50 text-white hover:border-white hover:bg-white/15'
              }`}
            >
              Pricing
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            <LanguageSwitcher variant={scrolled || menuOpen ? 'navbar-light' : 'navbar-dark'} />
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors min-h-11"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className={`text-sm font-medium transition-colors duration-300 ${scrolled ? 'text-[#1E293B] hover:text-[#2563EB]' : 'text-white/80 hover:text-white'}`}
                >
                  Login
                </Link>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors min-h-11"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            className={`md:hidden p-2 transition-colors duration-300 ${scrolled || menuOpen ? 'text-[#1E293B] hover:text-[#2563EB]' : 'text-white hover:text-white/70'}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Spacer so fixed nav doesn't overlap content */}
      <div className="h-16" />

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white flex flex-col pt-16 overflow-y-auto"
          >
            <div className="flex flex-col flex-1 px-6 py-8 gap-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-3">Navigation</p>
              {MOBILE_NAV.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-base font-semibold text-[#1E293B] hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-all"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />
                  {label}
                </Link>
              ))}
              <div className="mt-6 pt-6 border-t border-[#E2E8F0] flex flex-col gap-3">
                {isSignedIn ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center py-3.5 bg-[#2563EB] text-white text-base font-bold rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/sign-in"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center py-3.5 rounded-xl text-base font-semibold text-[#1E293B] border-2 border-[#E2E8F0] hover:border-[#2563EB] hover:text-[#2563EB] transition-all"
                    >
                      Login
                    </Link>
                    <Link
                      href="/sign-up"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center py-3.5 bg-[#2563EB] text-white text-base font-bold rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      Get Started Free
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
