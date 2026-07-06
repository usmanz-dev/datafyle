'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check, Minus, ChevronDown, Loader2, Zap, Users, FileSpreadsheet,
  Shield, Brain, Upload, Menu, X, ArrowRight,
} from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────────────────

const MONTHLY = { free: 0, starter: 49, professional: 149, business: 349, enterprise: 599 }
const ANNUAL  = { free: 0, starter: 39, professional: 119, business: 279, enterprise: 479 }

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    docs: '10 docs / mo',
    seats: '1 seat',
    popular: false,
    accentClass: 'bg-slate-200',
    features: ['Excel Export', 'Confidence Score', '10 documents/month', '1 user seat'],
    btnVariant: 'gray',
    btnLabel: 'Get Started Free',
    btnHref: '/sign-up',
  },
  {
    id: 'starter',
    name: 'Starter',
    docs: '500 docs / mo',
    seats: '2 seats',
    popular: false,
    accentClass: 'bg-[#2563EB]',
    features: ['Everything in Free', 'Monthly PDF Report', 'Anomaly Detector', 'Team Access (2 seats)'],
    btnVariant: 'blue-outline',
    btnLabel: 'Get Started',
  },
  {
    id: 'professional',
    name: 'Professional',
    docs: '3,000 docs / mo',
    seats: '5 seats',
    popular: true,
    accentClass: 'bg-linear-to-r from-[#2563EB] to-[#4F46E5]',
    features: ['Everything in Starter', 'Google Sheets Export', 'Smart Memory (AI)', 'Batch Upload', '5 team seats'],
    btnVariant: 'blue-solid',
    btnLabel: 'Get Started',
  },
  {
    id: 'business',
    name: 'Business',
    docs: '10,000 docs / mo',
    seats: '15 seats',
    popular: false,
    accentClass: 'bg-purple-500',
    features: ['Everything in Pro', 'All features included', '15 team seats', 'Priority support'],
    btnVariant: 'purple-outline',
    btnLabel: 'Get Started',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    docs: '20,000 docs / mo',
    seats: '50 seats',
    popular: false,
    accentClass: 'bg-linear-to-r from-amber-400 to-orange-400',
    features: ['Everything in Business', 'Dedicated support', '50 team seats', 'Custom onboarding'],
    btnVariant: 'gold-solid',
    btnLabel: 'Contact Sales',
  },
]

const FEATURES_TABLE = [
  { label: 'Documents/month',    icon: FileSpreadsheet, free: '10',    starter: '500',    pro: '3,000', biz: '10,000', ent: '20,000' },
  { label: 'Team seats',         icon: Users,           free: '1',     starter: '2',      pro: '5',     biz: '15',     ent: '50' },
  { label: 'Excel Export',       icon: FileSpreadsheet, free: true,    starter: true,     pro: true,    biz: true,     ent: true },
  { label: 'Confidence Score',   icon: Zap,             free: true,    starter: true,     pro: true,    biz: true,     ent: true },
  { label: 'Anomaly Detector',   icon: Shield,          free: false,   starter: true,     pro: true,    biz: true,     ent: true },
  { label: 'Monthly PDF Report', icon: FileSpreadsheet, free: false,   starter: true,     pro: true,    biz: true,     ent: true },
  { label: 'Team Access',        icon: Users,           free: false,   starter: true,     pro: true,    biz: true,     ent: true },
  { label: 'Google Sheets',      icon: FileSpreadsheet, free: false,   starter: false,    pro: true,    biz: true,     ent: true },
  { label: 'Smart Memory (AI)',  icon: Brain,           free: false,   starter: false,    pro: true,    biz: true,     ent: true },
  { label: 'Batch Upload',       icon: Upload,          free: false,   starter: false,    pro: true,    biz: true,     ent: true },
  { label: 'Priority Support',   icon: Shield,          free: false,   starter: false,    pro: false,   biz: true,     ent: true },
  { label: 'Dedicated Support',  icon: Users,           free: false,   starter: false,    pro: false,   biz: false,    ent: true },
]

const FAQS = [
  { q: 'Can I cancel anytime?', a: 'Yes, absolutely. Cancel your subscription at any time from your account settings. You keep your current plan until the end of the billing period, then automatically move to the Free plan. No cancellation fees, no questions asked.' },
  { q: 'Is my data secure?', a: "Your documents are encrypted in transit (TLS) and at rest. Files are stored on Cloudflare R2 (enterprise-grade object storage). We never share your data with third parties. Each customer's data is isolated — your documents are never used to train AI models." },
  { q: 'What happens when I reach my document limit?', a: "You'll see a warning when you hit 90% of your limit. At 100%, uploads are temporarily blocked until the next billing cycle or until you upgrade. All your existing documents and extracted data remain fully accessible." },
  { q: 'Can I change plans at any time?', a: "Yes. Upgrade instantly — your new plan activates immediately and you're billed the difference. Downgrading takes effect at the end of your current billing period. You can upgrade or downgrade as many times as you need." },
  { q: 'Do you store my documents permanently?', a: 'Documents are stored for as long as your account is active. If you close your account, files are deleted within 30 days. You can also delete individual documents at any time from your dashboard.' },
]

// ─── Navbar ───────────────────────────────────────────────────────────────────

function PricingNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const NAV_LINKS = [
    { href: '/#about',        label: 'About' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/#features',     label: 'Features' },
    { href: '/#faq',          label: 'FAQ' },
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen ? 'backdrop-blur-sm bg-white/90 border-b border-[#E2E8F0] shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
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
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  scrolled ? 'text-[#1E293B] hover:text-[#2563EB] hover:bg-[#EFF6FF]' : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {label}
              </Link>
            ))}
            {/* Pricing — active state since we're on this page */}
            <span className={`ml-1 px-4 py-2 rounded-lg text-sm font-bold border-2 cursor-default ${
              scrolled
                ? 'bg-[#2563EB] border-[#2563EB] text-white'
                : 'bg-white/20 border-white/80 text-white'
            }`}>
              Pricing
            </span>
          </div>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link href="/sign-in" className={`text-sm font-medium transition-colors ${scrolled ? 'text-[#1E293B] hover:text-[#2563EB]' : 'text-white/80 hover:text-white'}`}>
              Login
            </Link>
            <Link href="/sign-up" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors min-h-11">
              Get Started
            </Link>
          </div>

          <button
            className={`md:hidden p-2 transition-colors ${scrolled || menuOpen ? 'text-[#1E293B]' : 'text-white'}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white flex flex-col pt-16 overflow-y-auto"
          >
            <div className="flex flex-col flex-1 px-6 py-8 gap-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-3">Navigation</p>
              {NAV_LINKS.map(({ href, label }) => (
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
              <div className="flex items-center gap-3 px-3 py-3.5 rounded-xl bg-[#EFF6FF]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />
                <span className="text-base font-bold text-[#2563EB]">Pricing</span>
              </div>
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

// ─── Plan Button ──────────────────────────────────────────────────────────────

function PlanButton({ variant, onClick, loading, href, label }: {
  variant: string; onClick?: () => void; loading?: boolean; href?: string; label: string
}) {
  const base = 'inline-flex items-center justify-center gap-2 w-full rounded-xl font-semibold text-sm transition-all min-h-[46px] cursor-pointer disabled:opacity-60'
  const styles: Record<string, string> = {
    'gray':           `${base} bg-[#F8FAFC] text-slate-600 hover:bg-slate-100 border border-[#E2E8F0]`,
    'blue-outline':   `${base} border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white`,
    'blue-solid':     `${base} bg-[#2563EB] text-white hover:bg-blue-700 shadow-lg shadow-blue-200`,
    'purple-outline': `${base} border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white`,
    'gold-solid':     `${base} bg-amber-400 text-[#0F172A] hover:bg-amber-300 font-bold`,
  }
  const cls = styles[variant] ?? styles['blue-solid']
  if (href) return <Link href={href} className={cls}>{label}</Link>
  return (
    <button onClick={onClick} disabled={loading} className={cls}>
      {loading ? <Loader2 size={16} className="animate-spin" /> : label}
    </button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PricingContent() {
  const [annual, setAnnual] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const prices = annual ? ANNUAL : MONTHLY

  async function handleCheckout(plan: string) {
    setLoading(plan)
    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json() as { checkoutUrl?: string; error?: string }
      if (res.status === 401) { window.location.href = `/sign-up?redirect=/pricing`; return }
      if (!res.ok) { alert(data.error ?? 'Failed to start checkout. Please try again.'); return }
      window.location.href = data.checkoutUrl!
    } catch {
      alert('Checkout failed. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  function cellValue(val: boolean | string) {
    if (val === true)  return <Check size={16} className="text-[#22C55E] mx-auto" strokeWidth={2.5} />
    if (val === false) return <Minus size={15} className="text-slate-300 mx-auto" />
    return <span className="text-xs font-semibold text-[#1E293B]">{val}</span>
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      <PricingNavbar />

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#0F172A] overflow-hidden pt-32 pb-24 px-4">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.35) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 text-xs font-bold text-[#3B82F6] bg-[#2563EB]/15 border border-[#2563EB]/30 px-3 py-1.5 rounded-full uppercase tracking-widest mb-6">
              Transparent Pricing
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-4">
              Simple pricing that scales<br className="hidden sm:block" /> with your firm
            </h1>
            <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
              Start free. No credit card required. Upgrade when you need to.
            </p>

            {/* Monthly / Annual toggle */}
            <div className="inline-flex bg-white/10 rounded-2xl p-1 border border-white/15">
              <button
                onClick={() => setAnnual(false)}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  !annual ? 'bg-white text-[#1E293B] shadow-sm' : 'text-white/50 hover:text-white/80'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  annual ? 'bg-white text-[#1E293B] shadow-sm' : 'text-white/50 hover:text-white/80'
                }`}
              >
                Annual
                <span className="text-xs font-bold px-2 py-0.5 bg-[#22C55E] text-white rounded-full">Save 20%</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PLAN CARDS ────────────────────────────────────────────────────────── */}
      <section className="px-4 pb-10 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto -mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 items-start">
            {PLANS.map((plan, idx) => {
              const price = prices[plan.id as keyof typeof prices] ?? 0
              const isPro = plan.id === 'professional'
              const isEnt = plan.id === 'enterprise'

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: idx * 0.07 }}
                  className={`relative flex flex-col rounded-2xl border overflow-hidden transition-all duration-300
                    ${isPro
                      ? 'border-[#2563EB] shadow-2xl shadow-blue-200/70 xl:-translate-y-4 xl:scale-[1.03] z-10'
                      : isEnt
                        ? 'border-slate-700 shadow-md hover:shadow-lg hover:-translate-y-0.5'
                        : 'border-[#E2E8F0] shadow-sm hover:shadow-md hover:-translate-y-0.5'
                    }
                    ${isEnt ? 'bg-[#0F172A]' : 'bg-white'}
                  `}
                >
                  {/* Top accent bar */}
                  <div className={`h-1 ${plan.accentClass}`} />

                  <div className="flex flex-col flex-1 p-6">
                    {/* Popular badge */}
                    {plan.popular && (
                      <div className="mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#22C55E] text-white text-xs font-bold rounded-full">
                          ★ Most Popular
                        </span>
                      </div>
                    )}

                    {/* Plan name */}
                    <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${
                      isEnt ? 'text-amber-400' : isPro ? 'text-[#2563EB]' : 'text-slate-400'
                    }`}>
                      {plan.name}
                    </p>

                    {/* Price */}
                    <div className="flex items-end gap-1 mb-1">
                      <span className={`text-4xl font-black leading-none ${isEnt ? 'text-white' : 'text-[#1E293B]'}`}>
                        {price === 0 ? 'Free' : `$${price}`}
                      </span>
                      {price > 0 && (
                        <span className="text-sm mb-1 text-slate-400">/mo</span>
                      )}
                    </div>
                    {annual && price > 0 && (
                      <p className="text-xs text-[#22C55E] font-semibold mb-1">Billed ${price * 12}/yr</p>
                    )}

                    {/* Usage pills */}
                    <div className="flex flex-wrap gap-1.5 mt-3 mb-5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                        isEnt ? 'bg-white/10 text-slate-300' : isPro ? 'bg-[#EFF6FF] text-[#2563EB]' : 'bg-[#F8FAFC] text-slate-500'
                      }`}>
                        {plan.docs}
                      </span>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                        isEnt ? 'bg-white/10 text-slate-300' : isPro ? 'bg-[#EFF6FF] text-[#2563EB]' : 'bg-[#F8FAFC] text-slate-500'
                      }`}>
                        {plan.seats}
                      </span>
                    </div>

                    {/* Divider */}
                    <div className={`h-px mb-5 ${isEnt ? 'bg-white/10' : 'bg-[#F1F5F9]'}`} />

                    {/* Features */}
                    <ul className="space-y-2.5 flex-1 mb-6">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <Check
                            size={14}
                            className={`mt-0.5 shrink-0 ${
                              isEnt ? 'text-amber-400' : isPro ? 'text-[#2563EB]' : 'text-[#22C55E]'
                            }`}
                            strokeWidth={3}
                          />
                          <span className={`text-sm ${isEnt ? 'text-slate-300' : 'text-[#1E293B]'}`}>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <PlanButton
                      variant={plan.btnVariant}
                      href={plan.btnHref}
                      label={plan.btnLabel}
                      loading={loading === plan.id}
                      onClick={plan.btnHref ? undefined : () => handleCheckout(plan.id)}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>

          <p className="text-center text-sm text-slate-400 mt-6">
            +$19/month per extra seat on any paid plan · Cancel anytime · No credit card required for Free
          </p>
        </div>
      </section>

      {/* ── TRUST STRIP ───────────────────────────────────────────────────────── */}
      <section className="px-4 py-10 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '50+',   label: 'Accounting firms' },
              { value: '12K+',  label: 'Documents processed' },
              { value: '4.9 ★', label: 'Average rating' },
              { value: '99.7%', label: 'Platform uptime' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-[#E2E8F0] py-5 px-4 text-center shadow-sm">
                <p className="text-2xl font-black text-[#1E293B] mb-0.5">{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARE PLANS ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] bg-[#EFF6FF] border border-[#2563EB]/20 px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">
              Plan Comparison
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] mb-3">Compare Plans</h2>
            <p className="text-slate-500 text-base">Find the right fit for your firm&apos;s size and workflow.</p>
          </motion.div>

          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ minWidth: '640px' }}>
                <thead>
                  <tr>
                    <th className="text-left px-6 py-5 font-semibold text-[#1E293B] border-b border-[#E2E8F0] bg-[#F8FAFC]" style={{ width: '200px' }}>
                      Feature
                    </th>
                    {[
                      { name: 'Free',         price: 'Free',    type: '' },
                      { name: 'Starter',      price: '$49/mo',  type: '' },
                      { name: 'Professional', price: '$149/mo', type: 'pro' },
                      { name: 'Business',     price: '$349/mo', type: '' },
                      { name: 'Enterprise',   price: '$599/mo', type: 'ent' },
                    ].map(({ name, price, type }) => (
                      <th
                        key={name}
                        className={`text-center px-4 py-5 border-b ${
                          type === 'pro' ? 'bg-[#2563EB] border-[#2563EB]'
                          : type === 'ent' ? 'bg-[#0F172A] border-slate-700'
                          : 'bg-[#F8FAFC] border-[#E2E8F0]'
                        }`}
                      >
                        <span className={`block text-sm font-bold ${type ? 'text-white' : 'text-[#1E293B]'}`}>{name}</span>
                        <span className={`block text-xs font-medium mt-0.5 ${type === 'pro' ? 'text-blue-200' : type === 'ent' ? 'text-slate-400' : 'text-slate-400'}`}>{price}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FEATURES_TABLE.map((row, idx) => (
                    <tr key={row.label} className={`border-b border-[#F1F5F9] last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]/50'}`}>
                      <td className="px-6 py-4 text-[#1E293B] font-medium">
                        <div className="flex items-center gap-2">
                          <row.icon size={13} className="text-slate-400 shrink-0" />
                          {row.label}
                        </div>
                      </td>
                      {[row.free, row.starter, row.pro, row.biz, row.ent].map((val, ci) => (
                        <td key={ci} className={`px-4 py-4 text-center ${ci === 2 ? 'bg-[#EFF6FF]/60' : ci === 4 ? 'bg-[#0F172A]/4' : ''}`}>
                          {cellValue(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-[#F8FAFC]">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 text-xs font-bold text-[#2563EB] bg-[#EFF6FF] border border-[#2563EB]/20 px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1E293B] mb-3">Frequently Asked Questions</h2>
            <p className="text-slate-500 text-base">Everything you need to know before getting started.</p>
          </motion.div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#F8FAFC] transition-colors"
                >
                  <span className="font-semibold text-[#1E293B] text-sm pr-4">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="px-6 pb-5 pt-1">
                        <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl font-bold text-[#1E293B] mb-3">Ready to save 8 hours a day?</h2>
            <p className="text-slate-500 text-base mb-8">
              Join 50+ accounting firms already using Datafyle to automate document processing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#2563EB] text-white font-bold rounded-xl hover:bg-blue-700 transition-colors text-sm min-h-13 w-full sm:w-auto">
                Start Free — No Card Required
                <ArrowRight size={16} />
              </Link>
              <Link href="/sign-in" className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-[#E2E8F0] text-[#1E293B] font-semibold rounded-xl hover:border-[#2563EB] hover:text-[#2563EB] transition-all text-sm min-h-13 w-full sm:w-auto">
                Already have an account?
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────────── */}
      <footer className="relative bg-black overflow-hidden pt-20 pb-10 px-4">
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: '320px', background: 'radial-gradient(ellipse 100% 70% at 50% 105%, rgba(37,99,235,0.55) 0%, rgba(37,99,235,0.15) 50%, transparent 72%)' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
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
              <p className="text-slate-400 text-sm leading-relaxed mb-2">AI-powered document processing for accounting and bookkeeping firms.</p>
              <p className="text-slate-500 text-xs leading-relaxed mb-6">Trusted by 50+ firms in UK, US &amp; Australia.</p>
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
                <li><Link href="/#about" className="text-slate-400 hover:text-white text-sm transition-colors">About Us</Link></li>
                <li><Link href="/#how-it-works" className="text-slate-400 hover:text-white text-sm transition-colors">How It Works</Link></li>
                <li><Link href="/#features" className="text-slate-400 hover:text-white text-sm transition-colors">Features</Link></li>
                <li><Link href="/#calculator" className="text-slate-400 hover:text-white text-sm transition-colors">Savings Calculator</Link></li>
                <li><Link href="/pricing" className="text-white text-sm font-medium">Pricing</Link></li>
                <li><Link href="/#faq" className="text-slate-400 hover:text-white text-sm transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-5 text-xs uppercase tracking-widest">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/blog" className="text-slate-400 hover:text-white text-sm transition-colors">Blog</Link></li>
                <li><Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            {/* Get Started */}
            <div>
              <h4 className="text-white font-semibold mb-5 text-xs uppercase tracking-widest">Get Started</h4>
              <ul className="space-y-3">
                <li><Link href="/sign-up" className="text-slate-400 hover:text-white text-sm transition-colors">Create Free Account</Link></li>
                <li><Link href="/sign-in" className="text-slate-400 hover:text-white text-sm transition-colors">Sign In</Link></li>
                <li><Link href="/pricing" className="text-slate-400 hover:text-white text-sm transition-colors">View Pricing</Link></li>
                <li><Link href="/dashboard" className="text-slate-400 hover:text-white text-sm transition-colors">Dashboard</Link></li>
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
              <Link href="/blog" className="text-slate-500 text-xs hover:text-white transition-colors">Blog</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
