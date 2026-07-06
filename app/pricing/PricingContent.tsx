'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check, Minus, ChevronDown, Loader2, Zap, Users, FileSpreadsheet,
  Shield, Brain, Upload, ArrowRight,
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

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#0F172A] overflow-hidden pt-12 pb-24 px-4">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.35) 0%, transparent 70%)' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {/* Centered logo linking back to landing page */}
          <div className="flex justify-center mb-10">
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Image src="/images/datafyle.png" alt="" width={22} height={22} className="w-5 h-5 object-contain brightness-0 invert" />
              </div>
              <span className="font-bold text-[18px] text-white tracking-tight">
                Data<span className="text-blue-300">fyle</span>
              </span>
            </Link>
          </div>

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

      {/* ── BACK TO HOME ──────────────────────────────────────────────────────── */}
      <footer className="py-8 px-4 bg-[#F8FAFC] border-t border-[#E2E8F0] text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-[#2563EB] transition-colors">
          ← Back to Datafyle
        </Link>
        <p className="text-xs text-slate-400 mt-2">© 2026 Datafyle. All rights reserved. · <Link href="/privacy" className="hover:text-[#2563EB] transition-colors">Privacy</Link> · <Link href="/terms" className="hover:text-[#2563EB] transition-colors">Terms</Link></p>
      </footer>
    </div>
  )
}

