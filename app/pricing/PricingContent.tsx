'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Minus, ChevronDown, Loader2, Zap, Users, FileSpreadsheet, Shield, Brain, Upload } from 'lucide-react'

// ─── Pricing data ────────────────────────────────────────────────────────────

const MONTHLY = { free: 0, starter: 49, professional: 149, business: 349, enterprise: 599 }
const ANNUAL  = { free: 0, starter: 39, professional: 119, business: 279, enterprise: 479 }

const PLANS = [
  {
    id:         'free',
    name:       'Free',
    docs:       '10 docs/month',
    seats:      '1 seat',
    highlight:  false,
    popular:    false,
    dark:       false,
    border:     'border-[#E2E8F0]',
    bg:         'bg-white',
    textColor:  'text-[#1E293B]',
    subColor:   'text-slate-500',
    features: [
      'Excel Export',
      'Confidence Score',
      'Up to 10 documents/month',
      '1 user seat',
    ],
    button: {
      label:   'Get Started Free',
      variant: 'gray',
      href:    '/sign-up',
    },
  },
  {
    id:         'starter',
    name:       'Starter',
    docs:       '500 docs/month',
    seats:      '2 seats',
    highlight:  false,
    popular:    false,
    dark:       false,
    border:     'border-[#2563EB]',
    bg:         'bg-white',
    textColor:  'text-[#1E293B]',
    subColor:   'text-slate-500',
    features: [
      'Everything in Free',
      'Monthly PDF Report',
      'Anomaly Detector',
      'Team Access (2 seats)',
    ],
    button: {
      label:   'Get Started Now',
      variant: 'blue-outline',
    },
  },
  {
    id:         'professional',
    name:       'Professional',
    docs:       '3,000 docs/month',
    seats:      '5 seats',
    highlight:  true,
    popular:    true,
    dark:       false,
    border:     'border-[#2563EB]',
    bg:         'bg-[#EFF6FF]',
    textColor:  'text-[#1E293B]',
    subColor:   'text-blue-600',
    features: [
      'Everything in Starter',
      'Google Sheets Export',
      'Smart Memory (vendor AI)',
      'Batch Upload (500+ files)',
      '5 team seats',
    ],
    button: {
      label:   'Get Started Now',
      variant: 'blue-solid',
    },
  },
  {
    id:         'business',
    name:       'Business',
    docs:       '10,000 docs/month',
    seats:      '15 seats',
    highlight:  false,
    popular:    false,
    dark:       false,
    border:     'border-purple-400',
    bg:         'bg-white',
    textColor:  'text-[#1E293B]',
    subColor:   'text-slate-500',
    features: [
      'Everything in Professional',
      'All features included',
      '15 team seats',
      'Priority support',
    ],
    button: {
      label:   'Get Started Now',
      variant: 'purple-outline',
    },
  },
  {
    id:         'enterprise',
    name:       'Enterprise',
    docs:       '20,000 docs/month',
    seats:      '50 seats',
    highlight:  false,
    popular:    false,
    dark:       true,
    border:     'border-amber-400',
    bg:         'bg-[#0F172A]',
    textColor:  'text-white',
    subColor:   'text-slate-400',
    features: [
      'Everything in Business',
      'All features included',
      '50 team seats',
      'Dedicated support',
    ],
    button: {
      label:   'Get Started Now',
      variant: 'gold-solid',
    },
  },
]

// ─── Feature table data ───────────────────────────────────────────────────────

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

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, absolutely. Cancel your subscription at any time from your account settings. You keep your current plan until the end of the billing period, then automatically move to the Free plan. No cancellation fees, no questions asked.',
  },
  {
    q: 'Is my data secure?',
    a: 'Your documents are encrypted in transit (TLS) and at rest. Files are stored on Cloudflare R2 (enterprise-grade object storage). We never share your data with third parties. Each customer\'s data is isolated — your documents are never used to train AI models.',
  },
  {
    q: 'What happens when I reach my document limit?',
    a: 'You\'ll see a warning when you hit 90% of your limit. At 100%, uploads are temporarily blocked until the next billing cycle or until you upgrade. All your existing documents and extracted data remain fully accessible.',
  },
  {
    q: 'Can I change plans at any time?',
    a: 'Yes. Upgrade instantly — your new plan activates immediately and you\'re billed the difference. Downgrading takes effect at the end of your current billing period. You can upgrade or downgrade as many times as you need.',
  },
  {
    q: 'Do you store my documents permanently?',
    a: 'Documents are stored for as long as your account is active. If you close your account, files are deleted within 30 days. You can also delete individual documents at any time from your dashboard. We never delete your data without your action.',
  },
]

// ─── Button component ─────────────────────────────────────────────────────────

function PlanButton({
  variant,
  onClick,
  loading,
  href,
  label,
}: {
  variant: string
  onClick?: () => void
  loading?: boolean
  href?: string
  label: string
}) {
  const base = 'inline-flex items-center justify-center gap-2 w-full rounded-lg font-semibold text-sm transition-all min-h-11 cursor-pointer disabled:opacity-60'

  const styles: Record<string, string> = {
    'gray':          `${base} bg-slate-100 text-slate-600 hover:bg-slate-200`,
    'blue-outline':  `${base} border-2 border-[#2563EB] text-[#2563EB] bg-white hover:bg-[#EFF6FF]`,
    'blue-solid':    `${base} bg-[#2563EB] text-white hover:bg-blue-700 shadow-md py-3`,
    'purple-outline':`${base} border-2 border-purple-500 text-purple-600 bg-white hover:bg-purple-50`,
    'gold-solid':    `${base} bg-amber-400 text-[#0F172A] hover:bg-amber-300 font-bold`,
  }

  const cls = styles[variant] ?? styles['blue-solid']

  if (href) {
    return (
      <Link href={href} className={cls}>
        {label}
      </Link>
    )
  }

  return (
    <button onClick={onClick} disabled={loading} className={cls}>
      {loading ? <Loader2 size={16} className="animate-spin" /> : label}
    </button>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function PricingContent() {
  const [annual, setAnnual]     = useState(false)
  const [loading, setLoading]   = useState<string | null>(null)
  const [openFaq, setOpenFaq]   = useState<number | null>(null)

  const prices = annual ? ANNUAL : MONTHLY

  async function handleCheckout(plan: string) {
    setLoading(plan)
    try {
      const res = await fetch('/api/payments/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ plan }),
      })
      const data = await res.json() as { checkoutUrl?: string; error?: string }

      if (res.status === 401) {
        window.location.href = `/sign-up?redirect=/pricing`
        return
      }
      if (!res.ok) {
        alert(data.error ?? 'Failed to start checkout. Please try again.')
        return
      }
      window.location.href = data.checkoutUrl!
    } catch {
      alert('Checkout failed. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  function cellValue(val: boolean | string) {
    if (val === true)  return <Check size={17} className="text-[#22C55E] mx-auto" strokeWidth={2.5} />
    if (val === false) return <Minus size={16} className="text-slate-300 mx-auto" />
    return <span className="text-xs font-medium text-[#1E293B]">{val}</span>
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="pt-16 pb-10 text-center px-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#1E293B] tracking-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-3 text-lg text-slate-500">
          Start free. Upgrade when you need to.
        </p>

        {/* Toggle */}
        <div className="mt-8 inline-flex items-center gap-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5">
          <button
            onClick={() => setAnnual(false)}
            className={`text-sm font-semibold px-3 py-1.5 rounded-lg transition-all ${
              !annual ? 'bg-white text-[#1E293B] shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Monthly
          </button>
          <div
            role="switch"
            aria-checked={annual}
            onClick={() => setAnnual((a) => !a)}
            className={`relative w-10 h-5 rounded-full cursor-pointer transition-colors ${
              annual ? 'bg-[#2563EB]' : 'bg-slate-200'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                annual ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
          <button
            onClick={() => setAnnual(true)}
            className={`text-sm font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
              annual ? 'bg-white text-[#1E293B] shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Annual
            <span className="text-xs font-bold px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* ── Plan cards ──────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <div className="flex gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-5 lg:overflow-visible">
          {PLANS.map((plan) => {
            const price = prices[plan.id as keyof typeof prices] ?? 0

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-xl border-2 p-6 shrink-0 w-64 lg:w-auto transition-all ${plan.border} ${plan.bg} ${
                  plan.highlight ? 'shadow-xl ring-2 ring-[#2563EB]/20 lg:-translate-y-2' : 'shadow-sm'
                }`}
              >
                {/* Most Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-block px-3 py-1 bg-[#22C55E] text-white text-xs font-bold rounded-full shadow-sm whitespace-nowrap">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan name + price */}
                <div className={`mb-5 ${plan.popular ? 'mt-2' : ''}`}>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${plan.dark ? 'text-slate-400' : 'text-slate-400'}`}>
                    {plan.name}
                  </p>
                  <div className="flex items-end gap-1">
                    <span className={`text-4xl font-bold ${plan.textColor}`}>
                      {price === 0 ? 'Free' : `$${price}`}
                    </span>
                    {price > 0 && (
                      <span className={`text-sm mb-1.5 ${plan.subColor}`}>
                        /month
                      </span>
                    )}
                  </div>
                  {annual && price > 0 && (
                    <p className="text-xs text-green-600 font-medium mt-0.5">
                      Billed ${price * 12}/year
                    </p>
                  )}
                  <p className={`text-sm mt-3 ${plan.subColor}`}>
                    {plan.docs} · {plan.seats}
                  </p>
                </div>

                {/* Divider */}
                <div className={`h-px mb-5 ${plan.dark ? 'bg-white/10' : 'bg-[#E2E8F0]'}`} />

                {/* Features */}
                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check
                        size={15}
                        className={`mt-0.5 shrink-0 ${plan.dark ? 'text-amber-400' : plan.highlight ? 'text-[#2563EB]' : 'text-[#22C55E]'}`}
                        strokeWidth={2.5}
                      />
                      <span className={`text-sm ${plan.textColor}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA button */}
                <PlanButton
                  variant={plan.button.variant}
                  href={plan.button.href}
                  label={plan.button.label}
                  loading={loading === plan.id}
                  onClick={plan.button.href ? undefined : () => handleCheckout(plan.id)}
                />
              </div>
            )
          })}
        </div>

        {/* Extra seat note */}
        <p className="text-center text-sm text-slate-400 mt-4">
          +$19/month per extra seat on any paid plan
        </p>
      </div>

      {/* ── Feature comparison table ─────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="text-2xl font-bold text-[#1E293B] text-center mb-8">
          Compare Plans
        </h2>

        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  <th className="text-left px-5 py-4 font-semibold text-[#1E293B] w-48">Feature</th>
                  {['Free', 'Starter', 'Professional', 'Business', 'Enterprise'].map((name, i) => (
                    <th
                      key={name}
                      className={`text-center px-4 py-4 font-semibold text-sm ${
                        i === 2
                          ? 'bg-[#EFF6FF] text-[#2563EB]'
                          : 'text-[#1E293B]'
                      }`}
                    >
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURES_TABLE.map((row, idx) => (
                  <tr
                    key={row.label}
                    className={`border-b border-[#E2E8F0] last:border-0 ${
                      idx % 2 === 0 ? 'bg-[#F8FAFC]' : 'bg-white'
                    }`}
                  >
                    <td className="px-5 py-3.5 text-[#1E293B] font-medium flex items-center gap-2">
                      <row.icon size={14} className="text-slate-400 shrink-0" />
                      {row.label}
                    </td>
                    {[row.free, row.starter, row.pro, row.biz, row.ent].map((val, ci) => (
                      <td
                        key={ci}
                        className={`px-4 py-3.5 text-center ${ci === 2 ? 'bg-[#EFF6FF]/60' : ''}`}
                      >
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

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-20">
        <h2 className="text-2xl font-bold text-[#1E293B] text-center mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#F8FAFC] transition-colors"
              >
                <span className="font-semibold text-[#1E293B] text-sm pr-4">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-slate-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
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

        {/* Bottom CTA */}
        <div className="mt-12 text-center p-8 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
          <p className="font-bold text-[#1E293B] text-lg mb-1.5">Still have questions?</p>
          <p className="text-sm text-slate-500 mb-5">
            Start free — no credit card required. Upgrade when you&apos;re ready.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#2563EB] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  )
}
