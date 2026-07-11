'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Menu, X, Mail, Clock, MapPin, CheckCircle2,
  Loader2, Send, ArrowRight, ChevronDown,
} from 'lucide-react'

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { href: '/',         label: 'Home'    },
    { href: '/#features',label: 'Features'},
    { href: '/pricing',  label: 'Pricing' },
    { href: '/contact',  label: 'Contact' },
  ]

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

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            {links.map(({ href, label }) => (
              <Link key={href} href={href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  label === 'Contact'
                    ? scrolled ? 'text-[#2563EB] font-semibold' : 'text-white font-semibold'
                    : scrolled ? 'text-[#1E293B] hover:text-[#2563EB] hover:bg-[#EFF6FF]' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}>
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link href="/sign-in" className={`text-sm font-medium transition-colors ${scrolled ? 'text-[#1E293B] hover:text-[#2563EB]' : 'text-white/80 hover:text-white'}`}>Login</Link>
            <Link href="/sign-up" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors min-h-[44px]">
              Get Started Free
            </Link>
          </div>

          <button className={`md:hidden p-2 transition-colors ${scrolled || menuOpen ? 'text-[#1E293B]' : 'text-white'}`} onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-white flex flex-col pt-16 overflow-y-auto">
          <div className="flex flex-col px-6 py-8 gap-1">
            {links.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                className="px-4 py-3.5 rounded-xl text-base font-medium text-[#1E293B] hover:bg-[#EFF6FF] hover:text-[#2563EB] transition-colors">
                {label}
              </Link>
            ))}
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/sign-in" onClick={() => setMenuOpen(false)} className="px-4 py-3.5 rounded-xl text-base font-medium text-center border-2 border-[#E2E8F0] text-[#1E293B] hover:border-[#2563EB]">Login</Link>
              <Link href="/sign-up" onClick={() => setMenuOpen(false)} className="px-4 py-3.5 rounded-xl text-base font-bold text-center bg-[#2563EB] text-white hover:bg-blue-700">Get Started Free</Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
const INQUIRY_TYPES = [
  { value: 'general',     label: 'General Question'   },
  { value: 'sales',       label: 'Sales / Pricing'    },
  { value: 'technical',   label: 'Technical Support'  },
  { value: 'enterprise',  label: 'Enterprise Plan'    },
  { value: 'partnership', label: 'Partnership'        },
]

const TEAM_SIZES = ['1–5', '6–20', '21–50', '51–200', '200+']

type Stage = 'idle' | 'sending' | 'sent' | 'error'

function ContactForm() {
  const [form, setForm] = useState({
    name: '', email: '', company: '', phone: '',
    teamSize: '', inquiryType: 'general', message: '',
  })
  const [stage, setStage] = useState<Stage>('idle')
  const [errMsg, setErrMsg] = useState('')

  function set(field: string, val: string) {
    setForm(prev => ({ ...prev, [field]: val }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStage('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setErrMsg(data.error ?? 'Something went wrong.'); setStage('error'); return }
      setStage('sent')
    } catch {
      setErrMsg('Network error. Please check your connection and try again.')
      setStage('error')
    }
  }

  if (stage === 'sent') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center gap-5 py-16 text-center">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border-4 border-green-100">
          <CheckCircle2 size={36} className="text-green-500" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-[#1E293B] mb-2">Message Sent!</h3>
          <p className="text-slate-500 max-w-sm">
            Thanks for reaching out. We&apos;ve received your message and will reply to <strong>{form.email}</strong> within 24 hours.
          </p>
        </div>
        <button onClick={() => { setForm({ name:'',email:'',company:'',phone:'',teamSize:'',inquiryType:'general',message:'' }); setStage('idle') }}
          className="mt-2 px-6 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
          Send Another Message
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name <span className="text-red-400">*</span></label>
          <input type="text" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith"
            className="w-full px-4 py-3 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all min-h-[48px]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Work Email <span className="text-red-400">*</span></label>
          <input type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@company.com"
            className="w-full px-4 py-3 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all min-h-[48px]" />
        </div>
      </div>

      {/* Company + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Company Name</label>
          <input type="text" value={form.company} onChange={e => set('company', e.target.value)} placeholder="Smith & Co Accountants"
            className="w-full px-4 py-3 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all min-h-[48px]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone <span className="text-slate-400 font-normal">(optional)</span></label>
          <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 (555) 000-0000"
            className="w-full px-4 py-3 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all min-h-[48px]" />
        </div>
      </div>

      {/* Team size + Inquiry type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Team Size</label>
          <div className="relative">
            <select value={form.teamSize} onChange={e => set('teamSize', e.target.value)}
              className="w-full px-4 py-3 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all min-h-[48px] appearance-none cursor-pointer pr-10">
              <option value="">Select team size</option>
              {TEAM_SIZES.map(s => <option key={s} value={s}>{s} people</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Inquiry Type <span className="text-red-400">*</span></label>
          <div className="relative">
            <select required value={form.inquiryType} onChange={e => set('inquiryType', e.target.value)}
              className="w-full px-4 py-3 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all min-h-[48px] appearance-none cursor-pointer pr-10">
              {INQUIRY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Message <span className="text-red-400">*</span></label>
        <textarea required value={form.message} onChange={e => set('message', e.target.value)} rows={5}
          placeholder="Tell us about your firm, how many documents you process each month, and what you're looking to achieve with Datafyle…"
          className="w-full px-4 py-3 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all resize-none" />
        <p className="text-right text-[11px] text-slate-300 mt-1">{form.message.length}/3000</p>
      </div>

      {stage === 'error' && (
        <div className="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <X size={15} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{errMsg}</p>
        </div>
      )}

      <button type="submit" disabled={stage === 'sending' || !form.name || !form.email || !form.message}
        className="w-full inline-flex items-center justify-center gap-2 py-4 bg-[#2563EB] text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-sm hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 min-h-[52px]">
        {stage === 'sending'
          ? <><Loader2 size={16} className="animate-spin" /> Sending Message…</>
          : <><Send size={15} /> Send Message</>}
      </button>
      <p className="text-center text-xs text-slate-400">We respond to every message within 24 hours</p>
    </form>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="relative bg-black overflow-hidden pt-20 pb-10 px-4">
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: '320px', background: 'radial-gradient(ellipse 100% 70% at 50% 105%, rgba(37,99,235,0.55) 0%, rgba(37,99,235,0.15) 50%, transparent 72%)' }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Image src="/images/datafyle.png" alt="" width={22} height={22} className="w-5 h-5 object-contain brightness-0 invert" />
              </div>
              <span className="font-bold text-[18px] text-white tracking-tight">Data<span className="text-blue-400">fyle</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">AI-powered document processing for accounting and bookkeeping firms.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-5 text-xs uppercase tracking-widest">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/#features" className="text-slate-400 hover:text-white text-sm transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-slate-400 hover:text-white text-sm transition-colors">Pricing</Link></li>
              <li><Link href="/#faq" className="text-slate-400 hover:text-white text-sm transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-5 text-xs uppercase tracking-widest">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/blog" className="text-slate-400 hover:text-white text-sm transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-slate-400 hover:text-white text-sm transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-5 text-xs uppercase tracking-widest">Get Started</h4>
            <ul className="space-y-3">
              <li><Link href="/sign-up" className="text-slate-400 hover:text-white text-sm transition-colors">Create Free Account</Link></li>
              <li><Link href="/sign-in" className="text-slate-400 hover:text-white text-sm transition-colors">Sign In</Link></li>
              <li><Link href="/pricing" className="text-slate-400 hover:text-white text-sm transition-colors">View Pricing</Link></li>
            </ul>
          </div>
        </div>
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
            <Link href="/terms" className="text-slate-500 text-xs hover:text-white transition-colors">Terms</Link>
            <span className="text-slate-700">·</span>
            <Link href="/contact" className="text-slate-500 text-xs hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ContactClient() {
  const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }
  const [mouse, setMouse] = useState({ x: -500, y: -500 })

  useEffect(() => {
    const handler = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return (
    <div className="min-h-screen bg-white">

      {/* ── Mouse glow ──────────────────────────────────────────────────────── */}
      <div
        className="pointer-events-none fixed inset-0 z-[999]"
        style={{
          background: `radial-gradient(500px circle at ${mouse.x}px ${mouse.y}px, rgba(37,99,235,0.10) 0%, rgba(37,99,235,0.04) 35%, transparent 65%)`,
        }}
      />

      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-4 bg-[#0F172A] overflow-hidden">
        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        {/* Blue aura */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(37,99,235,0.30) 0%, transparent 70%)' }} />

        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5 }}
          className="relative z-10 max-w-2xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-blue-300 border border-white/10 mb-6">
            <Mail size={12} /> Get in Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-5">
            Let&apos;s Talk About<br />
            <span className="text-[#2563EB]">Your Firm&apos;s Needs</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Whether you&apos;re exploring Datafyle, need help with your account, or want to discuss an enterprise deal — our team replies within 24 hours.
          </p>
        </motion.div>
      </section>

      {/* ── Contact section ──────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

            {/* Left — info */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }}
              className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-[#1E293B] mb-4 leading-tight">
                  We&apos;d Love to<br />Hear From You
                </h2>
                <p className="text-slate-500 text-base leading-relaxed">
                  Datafyle helps accounting and bookkeeping firms eliminate manual data entry with AI. If you&apos;re processing invoices, receipts, or financial documents — we built this for you.
                </p>
              </div>

              {/* Info cards */}
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-[#2563EB]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1E293B]">Fast Response</p>
                    <p className="text-sm text-slate-500 mt-0.5">We reply to every message within 24 hours on business days.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-[#2563EB]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1E293B]">Direct Email</p>
                    <p className="text-sm text-slate-500 mt-0.5">Prefer email? Reach us at <a href="mailto:hello@datafyle.com" className="text-[#2563EB] hover:underline">hello@datafyle.com</a></p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-[#2563EB]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1E293B]">Serving Globally</p>
                    <p className="text-sm text-slate-500 mt-0.5">Trusted by accounting firms in the UK, US, and Australia.</p>
                  </div>
                </div>
              </div>

              {/* Trust */}
              <div className="p-5 bg-[#EFF6FF] border border-blue-100 rounded-2xl">
                <p className="text-xs font-bold text-[#2563EB] uppercase tracking-wide mb-3">Trusted by firms worldwide</p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  {[
                    { num: '50+',   label: 'Accounting Firms',     sub: 'actively using Datafyle'              },
                    { num: '12K+',  label: 'Documents Processed',  sub: 'invoices, receipts & more'            },
                    { num: '4.9★',  label: 'Average Rating',       sub: 'across Capterra, G2 & Trustpilot'    },
                    { num: '99.7%', label: 'Platform Uptime',      sub: 'SLA-backed reliability'               },
                  ].map(({ num, label, sub }) => (
                    <div key={label} className="py-1">
                      <p className="text-xl font-black text-[#1E293B]">{num}</p>
                      <p className="text-[11px] font-semibold text-slate-600 mt-0.5">{label}</p>
                      <p className="text-[10px] text-slate-400">{sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-3 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-[#1E293B]">Send Us a Message</h3>
                <p className="text-sm text-slate-500 mt-1">Fill in the details below and we&apos;ll get back to you shortly.</p>
              </div>
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="relative py-24 px-4 bg-black overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(37,99,235,0.25) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Stop Wasting 8 Hours a Day on Data Entry</h2>
          <p className="text-slate-400 mb-8 text-lg">Join 50+ accounting firms already saving time with Datafyle</p>
          <Link href="/sign-up" className="inline-flex items-center gap-2 px-8 py-4 bg-[#2563EB] text-white text-lg font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg hover:-translate-y-0.5 min-h-[56px]">
            Get Started Now — It&apos;s Free
            <ArrowRight size={20} />
          </Link>
          <p className="mt-4 text-sm text-slate-500">No credit card • Free 10 documents • Setup in 3 minutes</p>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
