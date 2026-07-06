'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Menu, X, Upload, Brain, Download, Shield,
  FileText, FileSpreadsheet, Image as LucideImage, Code, AlignLeft,
  Check, ChevronDown, Star, ArrowRight, TrendingUp,
  AlertCircle, Clock, DollarSign, FolderOpen, Plus, Minus,
} from 'lucide-react'

// ─── Counter hook ─────────────────────────────────────────────────────────────
function useCounter(target: number, inView: boolean, duration = 1800) {
  const [count, setCount] = useState(0)
  const startedRef = useRef(false)
  useEffect(() => {
    if (!inView || startedRef.current) return
    startedRef.current = true
    const t0 = Date.now()
    const id = setInterval(() => {
      const p = Math.min((Date.now() - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(eased * target)
      if (p >= 1) { clearInterval(id); setCount(target) }
    }, 16)
    return () => clearInterval(id)
  }, [inView, target, duration])
  return count
}

function CountStat({ target, format, label }: { target: number; format: (n: number) => string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const count = useCounter(target, inView)
  return (
    <div ref={ref} className="text-center px-4">
      <div className="text-3xl sm:text-4xl font-bold text-[#1E293B] mb-1">{format(count)}</div>
      <div className="text-sm text-slate-500 font-medium">{label}</div>
    </div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: 'Can I cancel anytime?', a: 'Yes, absolutely. Cancel from your account settings at any time. You keep your plan until the billing period ends, then move to Free. No fees, no questions asked.' },
  { q: 'Is my data secure?', a: 'Documents are encrypted in transit (TLS) and at rest on Cloudflare R2 (enterprise-grade storage). Your data is never shared or used to train AI models.' },
  { q: 'What happens when I reach my document limit?', a: "You'll see a warning at 90%. At 100% uploads pause until the next billing cycle or you upgrade. All existing documents remain accessible." },
  { q: 'Can I change plans at any time?', a: 'Yes. Upgrade instantly — new plan activates immediately. Downgrading takes effect at the end of the billing period.' },
  { q: 'Do you store my documents permanently?', a: 'Documents are stored while your account is active. On account closure, files are deleted within 30 days. You can delete individual files anytime.' },
]

const PLANS = [
  {
    id: 'free', name: 'Free', price: 0, docs: '10 docs/month', seats: '1 seat', popular: false, dark: false,
    border: 'border-[#E2E8F0]', bg: 'bg-white', textColor: 'text-[#1E293B]', subColor: 'text-slate-500',
    checkColor: 'text-[#2563EB]', features: ['Excel Export', 'Confidence Score', 'Up to 10 documents/month', '1 user seat'],
    buttonLabel: 'Get Started Free', buttonStyle: 'bg-slate-100 text-slate-600 hover:bg-slate-200', buttonHref: '/sign-up',
  },
  {
    id: 'starter', name: 'Starter', price: 49, docs: '500 docs/month', seats: '2 seats', popular: false, dark: false,
    border: 'border-[#E2E8F0]', bg: 'bg-white', textColor: 'text-[#1E293B]', subColor: 'text-slate-500',
    checkColor: 'text-[#2563EB]', features: ['Everything in Free', 'Monthly PDF Report', 'Anomaly Detector', 'Team Access (2 seats)'],
    buttonLabel: 'Get Started', buttonStyle: 'border-2 border-[#2563EB] text-[#2563EB] bg-white hover:bg-[#EFF6FF]', buttonHref: '/pricing',
  },
  {
    id: 'professional', name: 'Professional', price: 149, docs: '3,000 docs/month', seats: '5 seats', popular: true, dark: false,
    border: 'border-[#2563EB]', bg: 'bg-[#2563EB]', textColor: 'text-white', subColor: 'text-blue-200',
    checkColor: 'text-white', features: ['Everything in Starter', 'Google Sheets Export', 'Smart Memory (vendor AI)', 'Batch Upload (500+ files)', '5 team seats'],
    buttonLabel: 'Get Started', buttonStyle: 'bg-white text-[#2563EB] hover:bg-blue-50 font-bold shadow-md', buttonHref: '/pricing',
  },
  {
    id: 'business', name: 'Business', price: 349, docs: '10,000 docs/month', seats: '15 seats', popular: false, dark: false,
    border: 'border-[#E2E8F0]', bg: 'bg-white', textColor: 'text-[#1E293B]', subColor: 'text-slate-500',
    checkColor: 'text-[#2563EB]', features: ['Everything in Professional', 'All features included', '15 team seats', 'Priority support'],
    buttonLabel: 'Get Started', buttonStyle: 'border-2 border-[#1E293B] text-[#1E293B] bg-white hover:bg-slate-50', buttonHref: '/pricing',
  },
  {
    id: 'enterprise', name: 'Enterprise', price: 599, docs: '20,000 docs/month', seats: '50 seats', popular: false, dark: true,
    border: 'border-[#1E293B]', bg: 'bg-[#0F172A]', textColor: 'text-white', subColor: 'text-slate-400',
    checkColor: 'text-[#2563EB]', features: ['Everything in Business', 'All features included', '50 team seats', 'Dedicated support'],
    buttonLabel: 'Contact Sales', buttonStyle: 'bg-[#2563EB] text-white hover:bg-blue-600 font-bold', buttonHref: '/pricing',
  },
]

const FILE_TYPES = [
  { label: 'PDF',   icon: FileText,        color: 'text-red-500',    bg: 'bg-red-50',     border: 'border-red-100' },
  { label: 'Excel', icon: FileSpreadsheet, color: 'text-green-600',  bg: 'bg-green-50',   border: 'border-green-100' },
  { label: 'Word',  icon: FileText,        color: 'text-blue-600',   bg: 'bg-blue-50',    border: 'border-blue-100' },
  { label: 'CSV',   icon: AlignLeft,       color: 'text-teal-600',   bg: 'bg-teal-50',    border: 'border-teal-100' },
  { label: 'XML',   icon: Code,            color: 'text-purple-600', bg: 'bg-purple-50',  border: 'border-purple-100' },
  { label: 'TXT',   icon: AlignLeft,       color: 'text-slate-500',  bg: 'bg-slate-100',  border: 'border-slate-200' },
  { label: 'JPG',   icon: LucideImage,     color: 'text-orange-500', bg: 'bg-orange-50',  border: 'border-orange-100' },
  { label: 'PNG',   icon: LucideImage,     color: 'text-pink-500',   bg: 'bg-pink-50',    border: 'border-pink-100' },
]

const REVIEWS = [
  {
    name: 'Sarah Mitchell',
    title: 'Senior Bookkeeper',
    company: 'Thompson & Partners CPA',
    location: 'London, UK',
    initials: 'SM',
    grad: 'from-[#2563EB] to-[#4F46E5]',
    platform: 'Capterra',
    platformColor: 'bg-orange-50 text-orange-600 border-orange-200',
    date: 'Nov 2025',
    stars: 5,
    quote: 'We handle roughly 650 invoices a month across 12 client accounts. Before Datafyle, two of us spent nearly two full days on data entry alone. Now the same volume takes about 90 minutes — and the Confidence Score tells me exactly which fields to check, so I\'m not reading every single line.',
  },
  {
    name: 'James O\'Brien',
    title: 'Practice Manager',
    company: 'O\'Brien Accounting Ltd',
    location: 'Dublin, Ireland',
    initials: 'JO',
    grad: 'from-[#2563EB] to-[#06B6D4]',
    platform: 'G2',
    platformColor: 'bg-red-50 text-red-600 border-red-200',
    date: 'Oct 2025',
    stars: 5,
    quote: 'The anomaly detector flagged a £4,200 duplicate payment from one of our biggest suppliers in the very first month. We would never have caught it manually until reconciliation — by which point the money would already be gone. That one catch alone covered two years of the subscription.',
  },
  {
    name: 'Marcus Chen',
    title: 'Senior Accountant',
    company: 'Pacific Rim Advisory',
    location: 'Sydney, Australia',
    initials: 'MC',
    grad: 'from-[#7C3AED] to-[#2563EB]',
    platform: 'Trustpilot',
    platformColor: 'bg-green-50 text-green-700 border-green-200',
    date: 'Dec 2025',
    stars: 5,
    quote: 'I was paying an offshore data entry team AU$1,800 per month to key in invoices. Datafyle replaced that entirely and handles three times the volume faster. Smart Memory now recognises all our regular vendors and gets every field right the first time — no corrections needed.',
  },
  {
    name: 'Rebecca Walsh',
    title: 'Founder & Lead Bookkeeper',
    company: 'Walsh & Co Bookkeeping',
    location: 'Chicago, US',
    initials: 'RW',
    grad: 'from-[#0F172A] to-[#2563EB]',
    platform: 'Capterra',
    platformColor: 'bg-orange-50 text-orange-600 border-orange-200',
    date: 'Jan 2026',
    stars: 5,
    quote: 'Our volume spikes at tax season — sometimes 400+ documents in a single week. I was dreading it this year. Datafyle processed the whole batch without dropping a single file, and the Excel export saved me around 11 hours. First tax season I haven\'t lost a full weekend.',
  },
]

const FEATURES = [
  { icon: TrendingUp,    num: '01', gradient: 'from-[#2563EB] to-[#4F46E5]', title: 'Confidence Score',  desc: 'Every extracted field shows a color-coded accuracy score — green, yellow, or red — so you always know how reliable the data is.', stat: '97%+ field accuracy' },
  { icon: AlertCircle,  num: '02', gradient: 'from-[#F59E0B] to-[#EF4444]', title: 'Anomaly Detector',  desc: 'Automatically flags duplicate invoices, suspicious amount spikes, and future-dated entries before they reach your books.', stat: 'Catches every duplicate' },
  { icon: Brain,        num: '03', gradient: 'from-[#2563EB] to-[#4F46E5]', title: 'Smart Memory',       desc: 'Datafyle learns your vendor patterns over time. Accuracy improves automatically — no configuration required.', stat: 'Gets smarter every use' },
  { icon: FolderOpen,   num: '04', gradient: 'from-[#2563EB] to-[#4F46E5]', title: 'All File Types',     desc: 'PDF, Word, Excel, CSV, XML, TXT, JPG, PNG — upload any format up to 25MB without converting or reformatting first.', stat: '10 formats supported' },
  { icon: FileSpreadsheet, num: '05', gradient: 'from-[#2563EB] to-[#4F46E5]', title: 'Google Sheets', desc: 'Push extracted data straight into your existing Google Sheets. No copy-pasting, no formatting — it just appears, ready to use.', stat: 'Real-time sync' },
  { icon: FileText,     num: '06', gradient: 'from-[#2563EB] to-[#4F46E5]', title: 'Monthly Reports',    desc: 'Generate a branded PDF report for every client in one click — structured, professional, and ready to send instantly.', stat: '1-click PDF export' },
]

// ─── Nav section data ─────────────────────────────────────────────────────────
const DESKTOP_NAV = [
  { href: '#about',        label: 'About' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#features',     label: 'Features' },
  { href: '#pricing',      label: 'Pricing' },
  { href: '#faq',          label: 'FAQ' },
]

const MOBILE_NAV = [
  { href: '#about',        label: 'About Us' },
  { href: '#comparison',   label: 'Why Datafyle' },
  { href: '#results',      label: 'Results' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#features',     label: 'Features' },
  { href: '#calculator',   label: 'Calculator' },
  { href: '#file-types',   label: 'File Types' },
  { href: '#reviews',      label: 'Reviews' },
  { href: '#pricing',      label: 'Pricing' },
  { href: '#faq',          label: 'FAQ' },
]

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault()
    setMenuOpen(false)
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || menuOpen ? 'backdrop-blur-sm bg-white/80 border-b border-[#E2E8F0] shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${!scrolled && !menuOpen ? 'bg-white/15' : 'bg-[#2563EB]'}`}>
              <Image src="/images/datafyle.png" alt="" width={22} height={22} className="w-5 h-5 object-contain brightness-0 invert" priority />
            </div>
            <span className={`font-bold text-[18px] tracking-tight transition-colors ${!scrolled && !menuOpen ? 'text-white' : 'text-[#1E293B]'}`}>
              Data<span className={!scrolled && !menuOpen ? 'text-blue-300' : 'text-[#2563EB]'}>fyle</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1 flex-1">
            {DESKTOP_NAV.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => handleNavClick(e, href)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${scrolled ? 'text-[#1E293B] hover:text-[#2563EB] hover:bg-[#EFF6FF]' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
              >
                {label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link href="/sign-in" className={`text-sm font-medium transition-colors duration-300 ${scrolled ? 'text-[#1E293B] hover:text-[#2563EB]' : 'text-white/80 hover:text-white'}`}>Login</Link>
            <Link href="/sign-up" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors min-h-[44px]">
              Get Started
            </Link>
          </div>

          <button className={`md:hidden p-2 transition-colors duration-300 ${scrolled || menuOpen ? 'text-[#1E293B] hover:text-[#2563EB]' : 'text-white hover:text-white/70'}`} onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white flex flex-col pt-16 overflow-y-auto">
            <div className="flex flex-col flex-1 px-6 py-8 gap-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-3">Sections</p>
              {MOBILE_NAV.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={(e) => handleNavClick(e, href)}
                  className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-base font-semibold text-[#1E293B] hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-all"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />
                  {label}
                </a>
              ))}
              <div className="mt-6 pt-6 border-t border-[#E2E8F0] flex flex-col gap-3">
                <Link href="/sign-in" onClick={() => setMenuOpen(false)} className="flex items-center justify-center py-3.5 rounded-xl text-base font-semibold text-[#1E293B] border-2 border-[#E2E8F0] hover:border-[#2563EB] hover:text-[#2563EB] transition-all">
                  Login
                </Link>
                <Link href="/sign-up" onClick={() => setMenuOpen(false)} className="flex items-center justify-center py-3.5 bg-[#2563EB] text-white text-base font-bold rounded-xl hover:bg-blue-700 transition-colors">
                  Get Started Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [staffCost, setStaffCost] = useState(2500)
  const [docs, setDocs] = useState(500)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const blobRef   = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef  = useRef({ x: -9999, y: -9999 })
  const animRef   = useRef<number | undefined>(undefined)
  const rectRef   = useRef<DOMRect | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; rectRef.current = canvas.getBoundingClientRect() }
    resize()
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      if (blobRef.current) blobRef.current.style.transform = `translate(${e.clientX - 240}px, ${e.clientY - 240}px)`
    }
    const draw = () => {
      const w = canvas.offsetWidth; const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)
      const rect = rectRef.current
      const mx = rect ? mouseRef.current.x - rect.left : -9999
      const my = rect ? mouseRef.current.y - rect.top  : -9999
      const spacing = 28
      for (let cx = spacing / 2; cx < w; cx += spacing) {
        for (let cy = spacing / 2; cy < h; cy += spacing) {
          const dist = Math.hypot(cx - mx, cy - my)
          const lit  = Math.max(0, 1 - dist / 100)
          ctx.beginPath(); ctx.arc(cx, cy, 1 + lit * 2, 0, Math.PI * 2)
          ctx.fillStyle = lit > 0.05 ? `rgba(59,130,246,${0.12 + lit * 0.6})` : `rgba(255,255,255,0.07)`
          ctx.fill()
        }
      }
      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('resize', resize, { passive: true })
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('resize', resize); if (animRef.current !== undefined) cancelAnimationFrame(animRef.current) }
  }, [])

  let calcPlan = 'Starter'; let calcPrice = 49
  if (docs > 10000) { calcPlan = 'Enterprise'; calcPrice = 599 }
  else if (docs > 3000) { calcPlan = 'Business'; calcPrice = 349 }
  else if (docs > 500)  { calcPlan = 'Professional'; calcPrice = 149 }

  const monthlySaving    = Math.max(0, staffCost - calcPrice)
  const yearlySaving     = monthlySaving * 12
  const hoursSavedPerWeek = Math.max(1, Math.round((docs * 0.083) / 4.33))

  const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* ── HERO (unchanged) ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-4 text-center bg-black overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-175 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 100% 75% at 50% -5%, rgba(37,99,235,0.65) 0%, rgba(37,99,235,0.18) 55%, transparent 78%)' }} />
        <div ref={blobRef} className="fixed top-0 left-0 pointer-events-none z-0"
          style={{ width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)', filter: 'blur(55px)', transform: 'translate(-240px,-240px)', willChange: 'transform' }} />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
        <div className="relative z-10 max-w-4xl mx-auto w-full pt-24 pb-20">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-slate-400 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse shrink-0" />
            Trusted by 1,200+ accounting firms worldwide
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.65 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <span className="text-white">Your bookkeeper costs </span>
            <span style={{ background: 'linear-gradient(135deg, #93c5fd 0%, #3b82f6 40%, #2563EB 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>$2,500/month.</span>
            <br className="hidden sm:block" />
            <span className="text-white"> Datafyle costs </span>
            <span style={{ background: 'linear-gradient(135deg, #93c5fd 0%, #3b82f6 40%, #2563EB 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>$49.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38, duration: 0.6 }}
            className="text-base sm:text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop wasting hours on manual data entry. Upload any invoice, receipt, or statement —
            PDF, Word, image, or CSV — and let AI extract every field and line-item in under 10 seconds.
            Your data, clean and ready in Excel or Google Sheets.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2563EB] text-white text-base font-bold rounded-xl min-h-[56px] w-full sm:w-auto transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(37,99,235,0.55)]">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <a href="/#how-it-works" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-slate-300 hover:text-white text-base font-medium rounded-xl border border-white/10 hover:border-white/25 min-h-[56px] w-full sm:w-auto transition-all duration-300 hover:bg-white/5">
              Watch Demo
            </a>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.68, duration: 0.5 }} className="mt-5 text-sm text-slate-500">
            No credit card required &bull; Free 10 documents
          </motion.p>
        </div>
      </section>

      {/* ── TRUST BAR ───────────────────────────────────────────────────────── */}
      <section className="py-14 bg-[#F8FAFC] border-y border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[#E2E8F0]">
            <CountStat target={1200} format={(n) => `${Math.floor(n).toLocaleString()}+`} label="Accounting Firms" />
            <CountStat target={850}  format={(n) => `${Math.floor(n)}K+`}                 label="Documents Processed" />
            <CountStat target={4.9}  format={(n) => `${n.toFixed(1)}★`}                   label="Star Rating" />
            <CountStat target={99.7} format={(n) => `${n.toFixed(1)}%`}                   label="Uptime" />
          </div>
        </div>
      </section>

      {/* ── ABOUT US ────────────────────────────────────────────────────────── */}
      <section id="about" className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-3 py-1.5 rounded-full uppercase tracking-widest mb-6">
                About Datafyle
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] mb-6 leading-tight">
                Built for accounting teams who are done with manual data entry
              </h2>
              <p className="text-slate-500 text-base leading-relaxed mb-5">
                We watched bookkeepers spend entire days typing the same invoice data into spreadsheets — numbers from paper, then into Excel, then into accounting software. Three steps, all manual, all error-prone.
              </p>
              <p className="text-slate-500 text-base leading-relaxed mb-8">
                Datafyle replaces that entire workflow. Upload any document and our AI extracts every field instantly — vendor, amount, date, line items, tax — all captured in under 10 seconds and exported to Excel or Google Sheets.
              </p>
              <ul className="space-y-3.5 mb-10">
                {[
                  'Trusted by 1,200+ accounting firms in UK, US & Australia',
                  'Processes 850,000+ documents every month',
                  '97%+ AI extraction accuracy across all file types',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={11} className="text-[#2563EB]" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-slate-600 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/sign-up" className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-blue-700 transition-all text-sm min-h-[48px] hover:-translate-y-0.5 hover:shadow-lg">
                Try Datafyle Free <ArrowRight size={16} />
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative">
              <div className="absolute -inset-4 bg-[#2563EB]/5 rounded-3xl -rotate-1 hidden lg:block" />
              <div className="absolute -inset-4 bg-[#2563EB]/3 rounded-3xl rotate-2 hidden lg:block" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#E2E8F0]">
                <Image
                  src="/images/ai-invoice-processing-software.webp"
                  alt="Datafyle AI invoice data extraction"
                  width={700}
                  height={500}
                  className="w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg border border-[#E2E8F0] px-4 py-3 hidden lg:flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#EFF6FF] rounded-lg flex items-center justify-center shrink-0">
                  <Check size={16} className="text-[#2563EB]" strokeWidth={3} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1E293B] leading-none">97%+ Accuracy</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">AI-powered extraction</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM VS SOLUTION ─────────────────────────────────────────────── */}
      <section id="comparison" className="py-24 px-4 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] mb-3">The Old Way vs The Datafyle Way</h2>
            <p className="text-slate-500 text-base">Same documents. Completely different experience.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-lg border border-[#E2E8F0]">
            {/* Old Way */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="bg-white p-10 border-r border-[#E2E8F0]">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <span className="text-red-500 text-lg font-black">✗</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Manual Process</p>
                  <h3 className="text-lg font-bold text-[#1E293B]">The Old Way</h3>
                </div>
              </div>
              <ul className="space-y-5">
                {[
                  { label: '8 hours/day', sub: 'manually entering invoice data' },
                  { label: '$2,500/month', sub: 'bookkeeper salary' },
                  { label: '47 errors/month', sub: 'average manual mistakes' },
                  { label: 'Data stuck', sub: 'in paper files and email chains' },
                  { label: 'Work stops', sub: 'when staff are sick or on leave' },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-red-500 text-xs font-black">✗</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#1E293B] text-sm">{item.label}</span>
                      <span className="text-slate-500 text-sm"> — {item.sub}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Datafyle Way */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="bg-[#EFF6FF] p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563EB]/10 rounded-full -translate-y-8 translate-x-8 pointer-events-none" />
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center">
                  <Check size={18} className="text-white" strokeWidth={3} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest">AI-Powered</p>
                  <h3 className="text-lg font-bold text-[#1E293B]">The Datafyle Way</h3>
                </div>
              </div>
              <ul className="space-y-5">
                {[
                  { label: '10 seconds', sub: 'per document, any format' },
                  { label: '$49/month', sub: 'everything included' },
                  { label: '97%+ accuracy', sub: 'AI extraction, near-zero errors' },
                  { label: 'Clean Excel data', sub: 'instantly ready for your tools' },
                  { label: 'Works 24/7', sub: 'never sick, never on leave' },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={11} className="text-white" strokeWidth={3} />
                    </div>
                    <div>
                      <span className="font-bold text-[#1E293B] text-sm">{item.label}</span>
                      <span className="text-slate-500 text-sm"> — {item.sub}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── THE NUMBERS ─────────────────────────────────────────────────────── */}
      <section id="results" className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] mb-3">The Numbers Don&apos;t Lie</h2>
            <p className="text-slate-500 text-base">Real results from firms using Datafyle every day.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Clock,      label: 'Time Per Document', before: '8 hours/day', after: '10 seconds',  metric: '2,880×', metricLabel: 'faster' },
              { icon: DollarSign, label: 'Monthly Cost',       before: '$2,500/month', after: '$49/month',  metric: '98%',    metricLabel: 'cost reduction' },
              { icon: Shield,     label: 'Data Accuracy',      before: '47 errors/month', after: '~0 errors', metric: '97%+', metricLabel: 'AI accuracy' },
            ].map((card, i) => (
              <motion.div key={card.label} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="h-1.5 bg-[#2563EB]" />
                <div className="p-8">
                  <div className="flex items-center gap-2.5 mb-6">
                    <div className="w-9 h-9 bg-[#EFF6FF] rounded-xl flex items-center justify-center">
                      <card.icon size={18} className="text-[#2563EB]" />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
                  </div>
                  <div className="mb-6">
                    <p className="text-sm text-slate-400 line-through mb-1">{card.before}</p>
                    <p className="text-2xl font-black text-[#1E293B]">{card.after}</p>
                  </div>
                  <div className="flex items-baseline gap-1.5 pt-5 border-t border-[#F8FAFC]">
                    <span className="text-3xl font-black text-[#2563EB]">{card.metric}</span>
                    <span className="text-sm text-slate-500 font-medium">{card.metricLabel}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-4 bg-[#0F172A] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(37,99,235,0.12) 0%, transparent 70%)' }} />
        <div className="max-w-5xl mx-auto relative">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] bg-[#2563EB]/10 border border-[#2563EB]/20 px-3 py-1.5 rounded-full uppercase tracking-widest mb-5">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Three Steps. That&apos;s It.</h2>
            <p className="text-slate-400 text-base">From upload to Excel in under 10 seconds.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 relative">


            {[
              { icon: Upload,   num: '01', title: 'Upload Your Documents', desc: 'PDF, Word, Excel, CSV, or images — any format up to 25MB. Drag & drop or click to browse.', delay: 0 },
              { icon: Brain,    num: '02', title: 'AI Reads Everything',    desc: 'Claude AI extracts vendor, amount, date, and every line item — in under 10 seconds flat.', delay: 0.15 },
              { icon: Download, num: '03', title: 'Get Clean Data',         desc: 'Download your structured Excel file or sync directly to Google Sheets — ready to use instantly.', delay: 0.3 },
            ].map((step) => (
              <motion.div key={step.num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: step.delay }}
                className="relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/8 hover:border-[#2563EB]/40 transition-all group">
                {/* Step number badge with pulse */}
                <div className="flex justify-between items-start mb-6">
                  <motion.div
                    animate={{ scale: [1, 1.12, 1], boxShadow: ['0 0 0 0 rgba(37,99,235,0)', '0 0 0 8px rgba(37,99,235,0.15)', '0 0 0 0 rgba(37,99,235,0)'] }}
                    transition={{ repeat: Infinity, duration: 2.5, delay: step.delay }}
                    className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white text-xs font-black">
                    {step.num}
                  </motion.div>
                </div>
                {/* Icon with float animation */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: step.delay, ease: 'easeInOut' }}
                  className="w-14 h-14 bg-[#2563EB]/15 rounded-2xl flex items-center justify-center mb-6">
                  <step.icon size={26} className="text-[#2563EB]" />
                </motion.div>
                <h3 className="font-bold text-white text-base mb-3">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-4 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-3 py-1.5 rounded-full uppercase tracking-widest mb-5">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] mb-3">
              Everything You Need,{' '}
              <span style={{ background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                In One Place
              </span>
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">Purpose-built for accounting firms — not a generic document tool.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="relative bg-white rounded-2xl p-7 border border-[#E2E8F0] shadow-sm hover:shadow-xl hover:shadow-blue-50 hover:border-[#2563EB]/25 transition-all duration-300 overflow-hidden group cursor-default"
              >
                {/* Large faded number in background */}
                <span className="absolute top-3 right-5 text-7xl font-black text-slate-100 select-none leading-none pointer-events-none">
                  {f.num}
                </span>

                {/* Gradient icon box */}
                <div className={`relative w-12 h-12 rounded-2xl bg-linear-to-br ${f.gradient} flex items-center justify-center mb-6 shadow-md`}>
                  <f.icon size={22} className="text-white" />
                </div>

                {/* Content */}
                <h3 className="font-bold text-[#1E293B] text-base mb-2.5">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">{f.desc}</p>

                {/* Stat pill */}
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />
                  <span className="text-xs font-semibold text-[#2563EB]">{f.stat}</span>
                </div>

                {/* Animated bottom accent line on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-[#2563EB] to-[#4F46E5] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT VISUAL ──────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-[#F8FAFC] border-y border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-3 py-1.5 rounded-full uppercase tracking-widest mb-5">
                See the Output
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1E293B] mb-5 leading-snug">
                Clean, structured Excel data — ready the moment extraction completes
              </h2>
              <p className="text-slate-500 text-base leading-relaxed mb-6">
                Every document produces a 3-sheet Excel workbook: a summary row, all line items, and flagged anomalies.
                No reformatting. No cleanup. Just data you can use immediately.
              </p>
              <ul className="space-y-3">
                {['Summary sheet with one row per document', 'Line items sheet with full detail', 'Anomaly sheet with flagged issues'].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <Check size={15} className="text-[#2563EB] shrink-0" strokeWidth={2.5} />
                    <span className="text-sm text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="rounded-2xl overflow-hidden shadow-xl border border-[#E2E8F0]">
              <Image
                src="/images/ai-bookkeeping-automation-software.webp"
                alt="AI bookkeeping automation software output"
                width={700}
                height={450}
                className="w-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SAVE CALCULATOR ─────────────────────────────────────────────────── */}
      <section id="calculator" className="relative py-24 px-4 bg-black overflow-hidden">

        {/* Blue gradient aura — centered */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(37,99,235,0.22) 0%, rgba(37,99,235,0.06) 55%, transparent 75%)' }} />

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative z-10 max-w-6xl mx-auto">

          {/* Header */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] bg-[#2563EB]/10 border border-[#2563EB]/20 px-3 py-1.5 rounded-full uppercase tracking-widest mb-5">
              Savings Calculator
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              See Exactly How Much You&apos;ll Save
            </h2>
            <p className="text-slate-400 text-base">Enter your numbers. Get your savings instantly.</p>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr,500px] gap-10 items-center">

            {/* Left — social proof */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <p className="text-slate-300 text-lg leading-relaxed mb-10">
                Accounting firms that switch to Datafyle stop paying $2,400+ every month for manual data entry work — and get those hours back for actual client work.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-10">
                {[
                  { value: '1,200+', label: 'Firms using Datafyle' },
                  { value: '$28K+',  label: 'Average annual saving' },
                  { value: '40h',    label: 'Avg hours saved/week' },
                ].map((s) => (
                  <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                    <div className="text-2xl font-black text-white mb-1">{s.value}</div>
                    <div className="text-[11px] text-slate-400 leading-snug">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <div className="flex -space-x-2">
                  {['SK', 'MR', 'EP', 'JL'].map((init) => (
                    <div key={init} className="w-8 h-8 rounded-full bg-[#2563EB] border-2 border-black flex items-center justify-center text-white text-[10px] font-bold">{init}</div>
                  ))}
                </div>
                <span>Joined by 47+ firms this month alone</span>
              </div>
            </motion.div>

            {/* Right — Calculator card */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden">

              {/* Card header */}
              <div className="bg-[#2563EB] px-7 py-5">
                <h3 className="text-white font-bold text-base">Your Current Situation</h3>
                <p className="text-blue-200 text-sm mt-0.5">Fill in your numbers below</p>
              </div>

              <div className="p-7">
                {/* Inputs */}
                <div className="space-y-4 mb-7">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Monthly staff / bookkeeper cost</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2563EB] font-black text-sm">$</span>
                      <input
                        type="number" value={staffCost}
                        onChange={(e) => setStaffCost(Number(e.target.value) || 0)}
                        className="w-full pl-9 pr-4 py-3.5 border-2 border-[#E2E8F0] rounded-xl text-[#1E293B] font-bold text-base focus:outline-none focus:border-[#2563EB] transition-colors min-h-[52px]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Documents processed per month</label>
                    <input
                      type="number" value={docs}
                      onChange={(e) => setDocs(Number(e.target.value) || 0)}
                      className="w-full px-4 py-3.5 border-2 border-[#E2E8F0] rounded-xl text-[#1E293B] font-bold text-base focus:outline-none focus:border-[#2563EB] transition-colors min-h-[52px]"
                    />
                  </div>
                </div>

                {/* Plan match */}
                <div className="flex items-center justify-between bg-[#EFF6FF] border border-[#2563EB]/20 rounded-xl px-4 py-3 mb-5">
                  <span className="text-sm font-semibold text-[#1E293B]">Best plan for you</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-[#2563EB]">{calcPlan}</span>
                    <span className="text-xs bg-[#2563EB] text-white font-bold px-2 py-0.5 rounded-full">${calcPrice}/mo</span>
                  </div>
                </div>

                {/* Results */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-[#F8FAFC] rounded-xl p-4 text-center border border-[#E2E8F0]">
                    <div className="text-xl font-black text-[#2563EB] tabular-nums">${monthlySaving.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400 font-semibold mt-1 uppercase tracking-wide">Saved/month</div>
                  </div>
                  <div className="bg-[#F8FAFC] rounded-xl p-4 text-center border border-[#E2E8F0]">
                    <div className="text-xl font-black text-[#2563EB] tabular-nums">${yearlySaving.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400 font-semibold mt-1 uppercase tracking-wide">Saved/year</div>
                  </div>
                  <div className="bg-[#F8FAFC] rounded-xl p-4 text-center border border-[#E2E8F0]">
                    <div className="text-xl font-black text-[#2563EB] tabular-nums">{hoursSavedPerWeek}h</div>
                    <div className="text-[10px] text-slate-400 font-semibold mt-1 uppercase tracking-wide">Freed/week</div>
                  </div>
                </div>

                <Link href="/pricing"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-blue-700 transition-all text-sm min-h-[52px] hover:-translate-y-0.5 hover:shadow-lg">
                  Start Saving ${monthlySaving.toLocaleString()} This Month
                  <ArrowRight size={16} />
                </Link>

                <p className="text-center text-xs text-slate-400 mt-3">No credit card required · Cancel anytime</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FILE TYPES ──────────────────────────────────────────────────────── */}
      <section id="file-types" className="py-24 px-4 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] mb-3">Works With All Your Files</h2>
            <p className="text-slate-500 text-base">Upload any format — Datafyle handles it automatically.</p>
          </motion.div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 mb-16">
            {FILE_TYPES.map((ft, i) => (
              <motion.div key={ft.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex flex-col items-center gap-2.5">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2.8, delay: i * 0.25, ease: 'easeInOut' }}
                  className={`w-16 h-16 rounded-xl ${ft.bg} border ${ft.border} flex items-center justify-center shadow-sm`}>
                  <ft.icon size={30} className={ft.color} />
                </motion.div>
                <span className="text-xs font-bold text-[#1E293B]">{ft.label}</span>
                <div className="w-4 h-4 rounded-full bg-[#EFF6FF] flex items-center justify-center">
                  <Check size={10} className="text-[#2563EB]" strokeWidth={3} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Second webp image as a visual below file types */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden shadow-lg border border-[#E2E8F0]">
            <Image
              src="/images/automated-document-extraction-tool.webp"
              alt="Automated Document Extraction Tool"
              width={1200}
              height={400}
              className="w-full object-cover"
            />
            
          </motion.div>
        </div>
      </section>

      {/* ── REVIEWS ─────────────────────────────────────────────────────────── */}
      <section id="reviews" className="py-24 px-4 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] mb-4">What Our Customers Actually Say</h2>

            {/* Aggregate rating */}
            <div className="flex items-center justify-center gap-2 mb-5">
              <div className="flex gap-0.5">
                {Array(5).fill(null).map((_, j) => <Star key={j} size={18} className="text-[#F59E0B] fill-[#F59E0B]" />)}
              </div>
              <span className="font-bold text-[#1E293B] text-base">4.9</span>
              <span className="text-slate-400 text-sm">· Based on 1,200+ verified reviews</span>
            </div>

            {/* Platform badges */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {[
                { name: 'Capterra',   color: 'bg-orange-50 text-orange-600 border-orange-200' },
                { name: 'G2',         color: 'bg-red-50 text-red-600 border-red-200' },
                { name: 'Trustpilot', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
              ].map((p) => (
                <span key={p.name} className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${p.color}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {p.name}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Review cards — 2×2 grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {REVIEWS.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-lg hover:border-[#2563EB]/20 transition-all duration-300 p-7 flex flex-col"
              >
                {/* Top row: stars + platform badge */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex gap-0.5">
                    {Array(r.stars).fill(null).map((_, j) => <Star key={j} size={14} className="text-[#F59E0B] fill-[#F59E0B]" />)}
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${r.platformColor}`}>
                    {r.platform}
                  </span>
                </div>

                {/* Big opening quote mark */}
                <div className="text-5xl font-black text-[#2563EB]/15 leading-none mb-2 select-none">&ldquo;</div>

                {/* Quote */}
                <p className="text-[#1E293B] text-sm leading-relaxed flex-1 mb-6">{r.quote}</p>

                {/* Divider */}
                <div className="h-px bg-[#F1F5F9] mb-5" />

                {/* Author row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Gradient avatar */}
                    <div className={`w-10 h-10 rounded-full bg-linear-to-br ${r.grad} flex items-center justify-center text-white text-xs font-black shrink-0`}>
                      {r.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-[#1E293B] text-sm">{r.name}</p>
                        {/* Verified tick */}
                        <div className="w-4 h-4 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0">
                          <Check size={9} className="text-white" strokeWidth={3} />
                        </div>
                      </div>
                      <p className="text-xs text-slate-400">{r.title} · {r.company}</p>
                      <p className="text-xs text-slate-300">{r.location}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-300 font-medium shrink-0">{r.date}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom trust note */}
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center text-sm text-slate-400 mt-10"
          >
            All reviews are from verified customers on third-party platforms. No incentives were offered.
          </motion.p>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-4 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] mb-3">Start Free, Upgrade When Ready</h2>
            <p className="text-slate-500 text-base">No contracts. No hidden fees. Cancel anytime.</p>
          </motion.div>

          <div className="flex gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-5 lg:overflow-visible">
            {PLANS.map((plan, i) => (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
                className={`relative flex flex-col rounded-2xl border-2 p-7 shrink-0 w-64 lg:w-auto transition-all ${plan.border} ${plan.bg} ${plan.popular ? 'shadow-2xl ring-4 ring-[#2563EB]/20 lg:-translate-y-3 scale-[1.02]' : 'shadow-sm hover:shadow-md'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-white text-[#2563EB] text-xs font-black rounded-full shadow-lg border-2 border-[#2563EB]/20 whitespace-nowrap">
                      ★ Most Popular
                    </span>
                  </div>
                )}
                <div className={`mb-6 ${plan.popular ? 'mt-3' : ''}`}>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${plan.popular ? 'text-blue-200' : 'text-slate-400'}`}>{plan.name}</p>
                  <div className="flex items-end gap-1">
                    <span className={`text-4xl font-black ${plan.textColor}`}>{plan.price === 0 ? 'Free' : `$${plan.price}`}</span>
                    {plan.price > 0 && <span className={`text-sm mb-1.5 ${plan.subColor}`}>/mo</span>}
                  </div>
                  <p className={`text-xs mt-2 ${plan.subColor}`}>{plan.docs} · {plan.seats}</p>
                </div>
                <div className={`h-px mb-6 ${plan.popular ? 'bg-white/20' : 'bg-[#E2E8F0]'}`} />
                <ul className="space-y-3 flex-1 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check size={14} className={`mt-0.5 shrink-0 ${plan.checkColor}`} strokeWidth={2.5} />
                      <span className={`text-sm ${plan.textColor}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.buttonHref} className={`inline-flex items-center justify-center w-full py-3.5 rounded-xl font-bold text-sm transition-all min-h-[48px] ${plan.buttonStyle}`}>
                  {plan.buttonLabel}
                </Link>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm text-slate-400 mt-8">
            +$19/month per extra seat ·{' '}
            <Link href="/pricing" className="text-[#2563EB] hover:underline font-medium">See full plan comparison →</Link>
          </p>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] mb-3">Frequently Asked Questions</h2>
            <p className="text-slate-500 text-base">Everything you need to know before getting started.</p>
          </motion.div>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
                className={`rounded-xl border overflow-hidden transition-all ${openFaq === i ? 'border-[#2563EB]/30 shadow-sm' : 'border-[#E2E8F0]'}`}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={`w-full flex items-center justify-between px-6 py-4.5 text-left transition-colors ${openFaq === i ? 'bg-[#EFF6FF]' : 'bg-white hover:bg-[#F8FAFC]'}`}>
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className={`text-xs font-black w-6 shrink-0 tabular-nums ${openFaq === i ? 'text-[#2563EB]' : 'text-slate-300'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`font-semibold text-sm pr-4 ${openFaq === i ? 'text-[#2563EB]' : 'text-[#1E293B]'}`}>{faq.q}</span>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${openFaq === i ? 'bg-[#2563EB] text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {openFaq === i ? <Minus size={12} strokeWidth={3} /> : <Plus size={12} strokeWidth={3} />}
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden">
                      <div className="px-6 pb-5 pt-1 ml-10">
                        <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-[#0F172A]">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }} className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Stop Wasting 8 Hours a Day on Data Entry</h2>
          <p className="text-slate-400 mb-8 text-lg">Join 1,200+ accounting firms already saving time with Datafyle</p>
          <Link href="/sign-up" className="inline-flex items-center gap-2 px-8 py-4 bg-[#2563EB] text-white text-lg font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg hover:-translate-y-0.5 min-h-[56px]">
            Get Started Now — It&apos;s Free
            <ArrowRight size={20} />
          </Link>
          <p className="mt-4 text-sm text-slate-500">No credit card • Free 10 documents • Setup in 3 minutes</p>
        </motion.div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="relative bg-black overflow-hidden py-16 px-4">

        {/* Blue gradient aura at bottom edge of footer */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: '320px', background: 'radial-gradient(ellipse 100% 70% at 50% 105%, rgba(37,99,235,0.55) 0%, rgba(37,99,235,0.15) 50%, transparent 72%)' }}
        />

        {/* Static dot grid — matches hero canvas style */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Image src="/images/datafyle.png" alt="" width={22} height={22} className="w-5 h-5 object-contain brightness-0 invert" />
                </div>
                <span className="font-bold text-[18px] text-white tracking-tight">Data<span className="text-blue-400">fyle</span></span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                AI Document Processing for Accounting Firms
              </p>
              <p className="text-slate-500 text-xs leading-relaxed">
                Trusted by 1,200+ firms in UK, US &amp; Australia.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-5 text-xs uppercase tracking-widest">Product</h4>
              <ul className="space-y-3">
                <li><Link href="/pricing" className="text-slate-400 hover:text-white text-sm transition-colors">Pricing</Link></li>
                <li><a href="/#how-it-works" className="text-slate-400 hover:text-white text-sm transition-colors">How It Works</a></li>
                <li><Link href="/sign-up" className="text-slate-400 hover:text-white text-sm transition-colors">Get Started Free</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-5 text-xs uppercase tracking-widest">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">Terms of Service</Link></li>
                <li><Link href="/blog" className="text-slate-400 hover:text-white text-sm transition-colors">Blog</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-slate-500 text-sm">© 2026 Datafyle. All rights reserved.</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse shrink-0" />
              <span className="text-slate-500 text-xs">99.7% uptime</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
