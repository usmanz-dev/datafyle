'use client'

import { useState, useEffect, useRef, Fragment } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Menu, X, Upload, Brain, Download, Shield,
  FileText, FileSpreadsheet, Image as LucideImage, Code, AlignLeft,
  Check, ChevronDown, Star, ArrowRight, TrendingUp,
  AlertCircle, Clock, DollarSign, FolderOpen,
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

// ─── CountStat ────────────────────────────────────────────────────────────────
function CountStat({ target, format, label }: {
  target: number
  format: (n: number) => string
  label: string
}) {
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
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, absolutely. Cancel from your account settings at any time. You keep your plan until the billing period ends, then move to Free. No fees, no questions asked.',
  },
  {
    q: 'Is my data secure?',
    a: "Documents are encrypted in transit (TLS) and at rest on Cloudflare R2 (enterprise-grade storage). Your data is never shared or used to train AI models.",
  },
  {
    q: 'What happens when I reach my document limit?',
    a: "You'll see a warning at 90%. At 100% uploads pause until the next billing cycle or you upgrade. All existing documents remain accessible.",
  },
  {
    q: 'Can I change plans at any time?',
    a: "Yes. Upgrade instantly — new plan activates immediately. Downgrading takes effect at the end of the billing period.",
  },
  {
    q: 'Do you store my documents permanently?',
    a: 'Documents are stored while your account is active. On account closure, files are deleted within 30 days. You can delete individual files anytime.',
  },
]

const PLANS = [
  {
    id: 'free', name: 'Free', price: 0,
    docs: '10 docs/month', seats: '1 seat',
    popular: false, dark: false,
    border: 'border-[#E2E8F0]', bg: 'bg-white',
    textColor: 'text-[#1E293B]', subColor: 'text-slate-500', checkColor: 'text-[#22C55E]',
    features: ['Excel Export', 'Confidence Score', 'Up to 10 documents/month', '1 user seat'],
    buttonLabel: 'Get Started Free',
    buttonStyle: 'bg-slate-100 text-slate-600 hover:bg-slate-200',
    buttonHref: '/sign-up',
  },
  {
    id: 'starter', name: 'Starter', price: 49,
    docs: '500 docs/month', seats: '2 seats',
    popular: false, dark: false,
    border: 'border-[#2563EB]', bg: 'bg-white',
    textColor: 'text-[#1E293B]', subColor: 'text-slate-500', checkColor: 'text-[#22C55E]',
    features: ['Everything in Free', 'Monthly PDF Report', 'Anomaly Detector', 'Team Access (2 seats)'],
    buttonLabel: 'Get Started',
    buttonStyle: 'border-2 border-[#2563EB] text-[#2563EB] bg-white hover:bg-[#EFF6FF]',
    buttonHref: '/pricing',
  },
  {
    id: 'professional', name: 'Professional', price: 149,
    docs: '3,000 docs/month', seats: '5 seats',
    popular: true, dark: false,
    border: 'border-[#2563EB]', bg: 'bg-[#EFF6FF]',
    textColor: 'text-[#1E293B]', subColor: 'text-blue-600', checkColor: 'text-[#2563EB]',
    features: ['Everything in Starter', 'Google Sheets Export', 'Smart Memory (vendor AI)', 'Batch Upload (500+ files)', '5 team seats'],
    buttonLabel: 'Get Started',
    buttonStyle: 'bg-[#2563EB] text-white hover:bg-blue-700 shadow-md',
    buttonHref: '/pricing',
  },
  {
    id: 'business', name: 'Business', price: 349,
    docs: '10,000 docs/month', seats: '15 seats',
    popular: false, dark: false,
    border: 'border-purple-400', bg: 'bg-white',
    textColor: 'text-[#1E293B]', subColor: 'text-slate-500', checkColor: 'text-[#22C55E]',
    features: ['Everything in Professional', 'All features included', '15 team seats', 'Priority support'],
    buttonLabel: 'Get Started',
    buttonStyle: 'border-2 border-purple-500 text-purple-600 bg-white hover:bg-purple-50',
    buttonHref: '/pricing',
  },
  {
    id: 'enterprise', name: 'Enterprise', price: 599,
    docs: '20,000 docs/month', seats: '50 seats',
    popular: false, dark: true,
    border: 'border-amber-400', bg: 'bg-[#0F172A]',
    textColor: 'text-white', subColor: 'text-slate-400', checkColor: 'text-amber-400',
    features: ['Everything in Business', 'All features included', '50 team seats', 'Dedicated support'],
    buttonLabel: 'Get Started',
    buttonStyle: 'bg-amber-400 text-[#0F172A] hover:bg-amber-300 font-bold',
    buttonHref: '/pricing',
  },
]

const STEPS = [
  { icon: <Upload size={40} className="text-[#2563EB]" />, num: '1', title: 'Upload Your Documents', desc: 'PDF, Word, Excel, CSV, images — any format' },
  { icon: <Brain size={40} className="text-[#2563EB]" />, num: '2', title: 'AI Reads Everything', desc: 'Claude AI extracts vendor, amount, date, line items' },
  { icon: <Download size={40} className="text-[#2563EB]" />, num: '3', title: 'Get Clean Data', desc: 'Download Excel file or sync to Google Sheets' },
]

const FEATURES = [
  { icon: <TrendingUp size={28} className="text-[#2563EB]" />, title: 'Confidence Score', desc: 'Know exactly how accurate each field is' },
  { icon: <AlertCircle size={28} className="text-[#F59E0B]" />, title: 'Anomaly Detector', desc: 'Catches duplicate invoices automatically' },
  { icon: <Brain size={28} className="text-[#2563EB]" />, title: 'Smart Memory', desc: 'Learns vendor patterns over time' },
  { icon: <FolderOpen size={28} className="text-[#22C55E]" />, title: 'All File Types', desc: 'PDF Word Excel CSV XML TXT Images' },
  { icon: <FileSpreadsheet size={28} className="text-[#2563EB]" />, title: 'Google Sheets', desc: 'Auto-sync data to your spreadsheet' },
  { icon: <FileText size={28} className="text-[#2563EB]" />, title: 'Monthly Reports', desc: 'One-click PDF reports for clients' },
]

const FILE_TYPES = [
  { label: 'PDF',   icon: <FileText size={34} className="text-red-500" />,       bg: 'bg-red-50' },
  { label: 'Excel', icon: <FileSpreadsheet size={34} className="text-green-600" />, bg: 'bg-green-50' },
  { label: 'Word',  icon: <FileText size={34} className="text-blue-600" />,      bg: 'bg-blue-50' },
  { label: 'CSV',   icon: <AlignLeft size={34} className="text-teal-600" />,     bg: 'bg-teal-50' },
  { label: 'XML',   icon: <Code size={34} className="text-purple-600" />,        bg: 'bg-purple-50' },
  { label: 'TXT',   icon: <AlignLeft size={34} className="text-slate-500" />,    bg: 'bg-slate-100' },
  { label: 'JPG',   icon: <LucideImage size={34} className="text-orange-500" />, bg: 'bg-orange-50' },
  { label: 'PNG',   icon: <LucideImage size={34} className="text-pink-500" />,   bg: 'bg-pink-50' },
]

const REVIEWS = [
  { name: 'Sarah K.', company: 'Thompson & Associates', location: 'London', quote: 'Datafyle saved us 40 hours per month. Our team now focuses on real accounting.' },
  { name: 'Michael R.', company: 'CFO', location: 'Chicago', quote: 'Replaced our $2,800/month data entry person. Faster and zero errors.' },
  { name: 'Emma P.', company: 'Edinburgh Bookkeeping Ltd', location: 'Edinburgh', quote: 'The anomaly detector caught a $3,400 duplicate invoice. Paid for itself instantly.' },
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

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || menuOpen
            ? 'backdrop-blur-sm bg-white/80 border-b border-[#E2E8F0] shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold tracking-tight">DF</span>
            </div>
            <span className={`font-bold text-lg transition-colors duration-300 ${scrolled || menuOpen ? 'text-[#1E293B]' : 'text-white'}`}>Datafyle</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/pricing" className={`text-sm font-medium transition-colors duration-300 ${scrolled || menuOpen ? 'text-[#1E293B] hover:text-[#2563EB]' : 'text-white/80 hover:text-white'}`}>
              Pricing
            </Link>
            <Link href="/sign-in" className={`text-sm font-medium transition-colors duration-300 ${scrolled || menuOpen ? 'text-[#1E293B] hover:text-[#2563EB]' : 'text-white/80 hover:text-white'}`}>
              Login
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors min-h-[44px]"
            >
              Get Started
            </Link>
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

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white flex flex-col pt-16"
          >
            <div className="flex flex-col items-center justify-center flex-1 gap-10">
              <Link href="/pricing" onClick={() => setMenuOpen(false)} className="text-2xl font-semibold text-[#1E293B] hover:text-[#2563EB] transition-colors">
                Pricing
              </Link>
              <Link href="/sign-in" onClick={() => setMenuOpen(false)} className="text-2xl font-semibold text-[#1E293B] hover:text-[#2563EB] transition-colors">
                Login
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center px-10 py-4 bg-[#2563EB] text-white text-xl font-bold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Get Started Free
              </Link>
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

  // ── Hero dark-tech effects ──────────────────────────────────────────────────
  const blobRef     = useRef<HTMLDivElement>(null)
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const mouseRef    = useRef({ x: -9999, y: -9999 })
  const animRef     = useRef<number | undefined>(undefined)
  const rectRef     = useRef<DOMRect | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      rectRef.current = canvas.getBoundingClientRect()
    }
    resize()

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      if (blobRef.current) {
        blobRef.current.style.transform = `translate(${e.clientX - 240}px, ${e.clientY - 240}px)`
      }
    }

    const draw = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)
      const rect = rectRef.current
      const mx = rect ? mouseRef.current.x - rect.left : -9999
      const my = rect ? mouseRef.current.y - rect.top  : -9999
      const spacing = 28
      for (let cx = spacing / 2; cx < w; cx += spacing) {
        for (let cy = spacing / 2; cy < h; cy += spacing) {
          const dist = Math.hypot(cx - mx, cy - my)
          const lit  = Math.max(0, 1 - dist / 100)
          ctx.beginPath()
          ctx.arc(cx, cy, 1 + lit * 2, 0, Math.PI * 2)
          ctx.fillStyle = lit > 0.05
            ? `rgba(59,130,246,${0.12 + lit * 0.6})`
            : `rgba(255,255,255,0.07)`
          ctx.fill()
        }
      }
      animRef.current = requestAnimationFrame(draw)
    }
    draw()

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('resize', resize, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
      if (animRef.current !== undefined) cancelAnimationFrame(animRef.current)
    }
  }, [])

  let calcPlan = 'Starter'; let calcPrice = 49
  if (docs > 10000)     { calcPlan = 'Enterprise';    calcPrice = 599 }
  else if (docs > 3000) { calcPlan = 'Business';      calcPrice = 349 }
  else if (docs > 500)  { calcPlan = 'Professional';  calcPrice = 149 }

  const monthlySaving = Math.max(0, staffCost - calcPrice)
  const yearlySaving  = monthlySaving * 12
  const hoursSaved    = Math.round(docs * 0.083)

  const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-4 text-center bg-black overflow-hidden">

        {/* Top-edge aura canopy */}
        <div
          className="absolute top-0 left-0 right-0 h-175 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 100% 75% at 50% -5%, rgba(37,99,235,0.65) 0%, rgba(37,99,235,0.18) 55%, transparent 78%)' }}
        />

        {/* Mouse-tracking blob */}
        <div
          ref={blobRef}
          className="fixed top-0 left-0 pointer-events-none z-0"
          style={{
            width: 480, height: 480, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)',
            filter: 'blur(55px)',
            transform: 'translate(-240px,-240px)',
            willChange: 'transform',
          }}
        />

        {/* Interactive dot-grid canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto w-full pt-24 pb-20">

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-slate-400 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse shrink-0" />
            Trusted by 1,200+ accounting firms worldwide
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.65 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          >
            <span className="text-white">Your bookkeeper costs </span>
            <span style={{
              background: 'linear-gradient(135deg, #93c5fd 0%, #3b82f6 40%, #2563EB 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>$2,500/month.</span>
            <br className="hidden sm:block" />
            <span className="text-white"> Datafyle costs </span>
            <span style={{
              background: 'linear-gradient(135deg, #93c5fd 0%, #3b82f6 40%, #2563EB 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>$49.</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.38, duration: 0.6 }}
            className="text-base sm:text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Instant Data Extraction From Your Business Documents. Automatically parse important data
            from messy PDFs, Word, CSV, XLS, TXT, and images. Extract everything down to granular
            line-items in 10 seconds and seamlessly sync to Excel, Google Sheets, QuickBooks, or Xero.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2563EB] text-white text-base font-bold rounded-xl min-h-[56px] w-full sm:w-auto transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_36px_rgba(37,99,235,0.55)]"
            >
              Get Started Free
              <ArrowRight size={18} />
            </Link>
            <a
              href="/#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-slate-300 hover:text-white text-base font-medium rounded-xl border border-white/10 hover:border-white/25 min-h-[56px] w-full sm:w-auto transition-all duration-300 hover:bg-white/5"
            >
              Watch Demo
            </a>
          </motion.div>

          {/* Micro-trust */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.68, duration: 0.5 }}
            className="mt-5 text-sm text-slate-500"
          >
            No credit card required &bull; Free 10 documents
          </motion.p>
        </div>

      </section>

      {/* ── TRUST BAR ───────────────────────────────────────────────────────── */}
      <section className="py-14 bg-[#F8FAFC] border-y border-[#E2E8F0]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[#E2E8F0]">
            <CountStat target={1200}  format={(n) => `${Math.floor(n).toLocaleString()}+`} label="Accounting Firms" />
            <CountStat target={850}   format={(n) => `${Math.floor(n)}K+`}                  label="Documents Processed" />
            <CountStat target={4.9}   format={(n) => `${n.toFixed(1)}★`}                    label="Star Rating" />
            <CountStat target={99.7}  format={(n) => `${n.toFixed(1)}%`}                    label="Uptime" />
          </div>
        </div>
      </section>

      {/* ── PROBLEM VS SOLUTION ─────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-[#1E293B] text-center mb-14"
          >
            The Old Way vs The Datafyle Way
          </motion.h2>

          <div className="grid md:grid-cols-[1fr,56px,1fr] gap-6 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-8"
            >
              <h3 className="text-xl font-bold text-red-700 mb-6">⚠ The Old Way</h3>
              <ul className="space-y-4">
                {['8 hours/day manually entering invoice data', '$2,500/month bookkeeper salary', '47 errors per month average', 'Data stuck in paper files', 'Staff sick days = work piles up'].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-red-500 font-bold text-lg leading-5">✗</span>
                    <span className="text-slate-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <div className="hidden md:flex items-center justify-center">
              <span className="text-3xl font-black text-[#2563EB]">→</span>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="bg-[#EFF6FF] border border-[#2563EB]/30 rounded-2xl p-8"
            >
              <h3 className="text-xl font-bold text-[#2563EB] mb-6">✓ The Datafyle Way</h3>
              <ul className="space-y-4">
                {['10 seconds per document', '$49/month all-in', '97%+ AI accuracy', 'Clean Excel data instantly', 'Works 24/7, never sick'].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check size={18} className="text-[#22C55E] shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── THE NUMBERS ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-[#1E293B] text-center mb-14"
          >
            The Numbers Don&apos;t Lie
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Clock size={22} className="text-[#2563EB]" />, label: 'Time',
                before: '8 hours/day', after: '10 seconds',
                barEnd: '100%', barDelay: 0,
              },
              {
                icon: <DollarSign size={22} className="text-[#2563EB]" />, label: 'Monthly Cost',
                before: '$2,500/month', after: '$49/month',
                barEnd: '98%', barDelay: 0.1,
              },
              {
                icon: <Shield size={22} className="text-[#2563EB]" />, label: 'Accuracy',
                before: '47 errors/month', after: '~0 errors',
                barEnd: '97%', barDelay: 0.2,
              },
            ].map((card, i) => (
              <motion.div
                key={card.label}
                variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8"
              >
                <div className="flex items-center gap-2 mb-4">
                  {card.icon}
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
                </div>
                <p className="text-base text-slate-400 line-through mb-1">{card.before}</p>
                <p className="text-3xl font-black text-[#22C55E] mb-6">{card.after}</p>
                <div className="bg-[#F8FAFC] rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-red-400 to-[#22C55E]"
                    initial={{ width: '3%' }}
                    whileInView={{ width: card.barEnd }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: card.barDelay }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-[#1E293B] text-center mb-14"
          >
            Three Steps. That&apos;s It.
          </motion.h2>
          <div className="grid md:grid-cols-[1fr,40px,1fr,40px,1fr] gap-4 items-start">
            {STEPS.map((step, i) => (
              <Fragment key={step.num}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.2 }}
                  className="text-center bg-[#F8FAFC] rounded-2xl p-8 border border-[#E2E8F0]"
                >
                  <div className="flex justify-center mb-4">{step.icon}</div>
                  <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white text-sm font-bold flex items-center justify-center mx-auto mb-3">
                    {step.num}
                  </div>
                  <h3 className="font-bold text-[#1E293B] mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500">{step.desc}</p>
                </motion.div>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:flex items-center justify-center pt-10">
                    <ArrowRight size={26} className="text-[#2563EB]" />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-[#1E293B] text-center mb-14"
          >
            Everything You Need
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: (i % 3) * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8 cursor-default hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">{f.icon}</div>
                <h3 className="font-bold text-[#1E293B] mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAVE CALCULATOR ─────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true }} transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] text-center mb-3">
              Calculate Your Monthly Savings
            </h2>
            <p className="text-center text-slate-500 mb-10">Enter your current costs below</p>

            <div className="bg-white rounded-2xl border-2 border-[#2563EB] shadow-xl p-8">
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-[#1E293B] mb-2">Monthly staff cost</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">$</span>
                    <input
                      type="number"
                      value={staffCost}
                      onChange={(e) => setStaffCost(Number(e.target.value) || 0)}
                      className="w-full pl-8 pr-4 py-3 border border-[#E2E8F0] rounded-lg text-[#1E293B] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] min-h-[44px]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1E293B] mb-2">Monthly documents</label>
                  <input
                    type="number"
                    value={docs}
                    onChange={(e) => setDocs(Number(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg text-[#1E293B] font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] min-h-[44px]"
                  />
                </div>
              </div>

              <div className="bg-[#F0FDF4] border border-[#22C55E]/30 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-3 mb-5">
                  <Check size={20} className="text-[#22C55E] mt-0.5 shrink-0" strokeWidth={2.5} />
                  <p className="text-sm font-semibold text-[#1E293B]">
                    With Datafyle {calcPlan} (${calcPrice}/mo) you save:
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-black text-[#22C55E]">${monthlySaving.toLocaleString()}</div>
                    <div className="text-xs text-slate-500 mt-1">Monthly saving</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-[#22C55E]">${yearlySaving.toLocaleString()}</div>
                    <div className="text-xs text-slate-500 mt-1">Yearly saving</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-[#22C55E]">~{hoursSaved}h</div>
                    <div className="text-xs text-slate-500 mt-1">Hours saved/month</div>
                  </div>
                </div>
              </div>

              <Link
                href="/pricing"
                className="flex items-center justify-center gap-2 w-full py-4 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-blue-700 transition-colors text-base min-h-[52px]"
              >
                Start Saving ${monthlySaving.toLocaleString()} This Month
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FILE TYPES ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-[#1E293B] text-center mb-12"
          >
            Works With All Your Files
          </motion.h2>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-6 justify-items-center">
            {FILE_TYPES.map((ft, i) => (
              <motion.div
                key={ft.label}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex flex-col items-center gap-2"
              >
                <div className={`w-16 h-16 rounded-xl ${ft.bg} flex items-center justify-center`}>
                  {ft.icon}
                </div>
                <span className="text-xs font-bold text-[#1E293B]">{ft.label}</span>
                <Check size={13} className="text-[#22C55E]" strokeWidth={2.5} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-[#1E293B] text-center mb-14"
          >
            Trusted by Accounting Firms Worldwide
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-8 shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {Array(5).fill(null).map((_, j) => (
                    <Star key={j} size={17} className="text-[#F59E0B] fill-[#F59E0B]" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{r.quote}&rdquo;
                </p>
                <div>
                  <p className="font-bold text-[#1E293B] text-sm">{r.name}</p>
                  <p className="text-xs text-slate-500">{r.company} · {r.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] mb-3">Start Free, Upgrade When Ready</h2>
            <p className="text-slate-500">No contracts. Cancel anytime.</p>
          </motion.div>

          <div className="flex gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-5 lg:overflow-visible">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
                className={`relative flex flex-col rounded-xl border-2 p-6 shrink-0 w-64 lg:w-auto ${plan.border} ${plan.bg} ${
                  plan.popular ? 'shadow-xl ring-2 ring-[#2563EB]/20 lg:-translate-y-2' : 'shadow-sm'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-block px-3 py-1 bg-[#22C55E] text-white text-xs font-bold rounded-full shadow-sm whitespace-nowrap">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className={`mb-5 ${plan.popular ? 'mt-2' : ''}`}>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{plan.name}</p>
                  <div className="flex items-end gap-1">
                    <span className={`text-3xl font-bold ${plan.textColor}`}>
                      {plan.price === 0 ? 'Free' : `$${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className={`text-sm mb-1 ${plan.subColor}`}>/month</span>
                    )}
                  </div>
                  <p className={`text-sm mt-2 ${plan.subColor}`}>{plan.docs} · {plan.seats}</p>
                </div>
                <div className={`h-px mb-5 ${plan.dark ? 'bg-white/10' : 'bg-[#E2E8F0]'}`} />
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check size={14} className={`mt-0.5 shrink-0 ${plan.checkColor}`} strokeWidth={2.5} />
                      <span className={`text-sm ${plan.textColor}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.buttonHref}
                  className={`inline-flex items-center justify-center w-full py-3 rounded-lg font-semibold text-sm transition-all min-h-[44px] ${plan.buttonStyle}`}
                >
                  {plan.buttonLabel}
                </Link>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm text-slate-400 mt-6">
            +$19/month per extra seat ·{' '}
            <Link href="/pricing" className="text-[#2563EB] hover:underline">See full comparison →</Link>
          </p>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold text-[#1E293B] text-center mb-12"
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#F0F4FF] transition-colors"
                >
                  <span className="font-semibold text-[#1E293B] text-sm pr-4">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-[#0F172A]">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible"
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Stop Wasting 8 Hours a Day on Data Entry
          </h2>
          <p className="text-slate-400 mb-8 text-lg">
            Join 1,200+ accounting firms already saving time with Datafyle
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#2563EB] text-white text-lg font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg hover:-translate-y-0.5 min-h-[56px]"
          >
            Get Started Now — It&apos;s Free
            <ArrowRight size={20} />
          </Link>
          <p className="mt-4 text-sm text-slate-500">
            No credit card • Free 10 documents • Setup in 3 minutes
          </p>
        </motion.div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0F172A] border-t border-white/10 py-14 px-4">
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
              <li><a href="/#how-it-works" className="text-slate-400 hover:text-white text-sm transition-colors">How It Works</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              <li><Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">Terms of Service</Link></li>
              <li><Link href="/blog" className="text-slate-400 hover:text-white text-sm transition-colors">Blog</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-5xl mx-auto pt-8 border-t border-white/10 text-center">
          <p className="text-slate-500 text-sm">Copyright 2026 Datafyle. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
