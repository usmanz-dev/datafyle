'use client'

import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import {
  CreditCard, FileText, ArrowRight, CheckCircle2,
  Calendar, TrendingUp, Mail,
} from 'lucide-react'
import { PLAN_NAMES } from '@/lib/plans'

const PLAN_PRICES: Record<string, string> = {
  free:         '$0/month',
  starter:      '$49/month',
  professional: '$149/month',
  business:     '$349/month',
  enterprise:   '$599/month',
}

const PLAN_FEATURES: Record<string, string[]> = {
  free:         ['Excel export', 'Confidence score', '10 documents/month', '1 user seat'],
  starter:      ['Monthly PDF report', 'Anomaly detector', 'Team access (2 seats)', '500 documents/month'],
  professional: ['Google Sheets sync', 'Smart Memory (vendor AI)', 'Batch upload', '5 team seats', '3,000 documents/month'],
  business:     ['All features', '15 team seats', 'Priority support', '10,000 documents/month'],
  enterprise:   ['All features', '50 team seats', 'Dedicated support', '20,000 documents/month'],
}

const PLAN_COLOR: Record<string, string> = {
  free:         'bg-slate-100 text-slate-600',
  starter:      'bg-blue-100 text-blue-700',
  professional: 'bg-indigo-100 text-indigo-700',
  business:     'bg-purple-100 text-purple-700',
  enterprise:   'bg-amber-100 text-amber-700',
}

interface Props {
  profile: { name: string; email: string; imageUrl: string | null }
  plan: string
  docsUsed: number
  docsLimit: number
  totalDocsProcessed: number
  paidAt: string | null
  cancelledAt: string | null
  renewsAt: string | null
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export function SettingsClient({
  profile, plan, docsUsed, docsLimit, totalDocsProcessed,
  paidAt, cancelledAt, renewsAt,
}: Props) {
  const usagePct = docsLimit > 0 ? Math.round((docsUsed / docsLimit) * 100) : 0
  const barColor  = usagePct >= 90 ? '#EF4444' : usagePct >= 75 ? '#F59E0B' : '#2563EB'
  const isPaid    = plan !== 'free'
  const features  = PLAN_FEATURES[plan] ?? PLAN_FEATURES.free

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-xl font-bold text-[#1E293B] mb-6">Settings</h1>

        {/* ── Profile ──────────────────────────────────────────────────────── */}
        <section className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-5 mb-4">
          <h2 className="text-sm font-semibold text-[#1E293B] mb-4">Account</h2>
          <div className="flex items-center gap-4">
            <UserButton />
            <div className="min-w-0">
              <p className="font-medium text-[#1E293B] truncate">{profile.name || 'Your Account'}</p>
              <p className="text-sm text-slate-500 truncate">{profile.email}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Manage your name, photo, and password via the avatar menu above.
          </p>
        </section>

        {/* ── Plan & usage ─────────────────────────────────────────────────── */}
        <section className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#1E293B]">Plan &amp; Usage</h2>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${PLAN_COLOR[plan] ?? PLAN_COLOR.free}`}>
              {PLAN_NAMES[plan] ?? plan}
            </span>
          </div>

          {/* Usage bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-[#1E293B]">
                <strong>{docsUsed.toLocaleString()}</strong>
                {' / '}
                {docsLimit.toLocaleString()} documents this month
              </span>
              <span className="font-semibold text-sm" style={{ color: barColor }}>{usagePct}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(usagePct, 100)}%`, backgroundColor: barColor }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1.5">Resets on the 1st of each month</p>
          </div>

          {/* All-time stat */}
          <div className="flex items-center gap-2 py-2.5 border-t border-[#E2E8F0]">
            <TrendingUp size={15} className="text-slate-400 shrink-0" />
            <span className="text-sm text-slate-500">
              <strong className="text-[#1E293B]">{totalDocsProcessed.toLocaleString()}</strong> documents processed all time
            </span>
          </div>

          {/* Plan price */}
          <div className="flex items-center gap-2 py-2.5 border-t border-[#E2E8F0]">
            <CreditCard size={15} className="text-slate-400 shrink-0" />
            <span className="text-sm text-slate-500">
              Current plan: <strong className="text-[#1E293B]">{PLAN_PRICES[plan] ?? plan}</strong>
            </span>
          </div>

          {/* Renewal / paid date */}
          {isPaid && renewsAt && (
            <div className="flex items-center gap-2 py-2.5 border-t border-[#E2E8F0]">
              <Calendar size={15} className="text-slate-400 shrink-0" />
              <span className="text-sm text-slate-500">
                {cancelledAt
                  ? `Access ends ${fmt(cancelledAt)}`
                  : `Renews ${fmt(renewsAt)}`}
              </span>
            </div>
          )}
          {isPaid && paidAt && !renewsAt && (
            <div className="flex items-center gap-2 py-2.5 border-t border-[#E2E8F0]">
              <Calendar size={15} className="text-slate-400 shrink-0" />
              <span className="text-sm text-slate-500">Member since {fmt(paidAt)}</span>
            </div>
          )}

          {/* Features */}
          <div className="mt-3 pt-3 border-t border-[#E2E8F0]">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Included in your plan</p>
            <ul className="space-y-1">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-[#1E293B]">
                  <CheckCircle2 size={14} className="text-[#22C55E] shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Upgrade CTA */}
          {plan !== 'enterprise' && (
            <Link
              href="/pricing"
              className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isPaid ? 'Change Plan' : 'Upgrade Plan'}
              <ArrowRight size={15} />
            </Link>
          )}
        </section>

        {/* ── Documents ────────────────────────────────────────────────────── */}
        <section className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-5 mb-4">
          <h2 className="text-sm font-semibold text-[#1E293B] mb-3">Documents</h2>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FileText size={15} className="text-slate-400 shrink-0" />
            <span>All your documents are stored securely and can be accessed from the <Link href="/dashboard" className="text-[#2563EB] hover:underline">dashboard</Link>.</span>
          </div>
        </section>

        {/* ── Cancel / support ─────────────────────────────────────────────── */}
        <section className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-5">
          <h2 className="text-sm font-semibold text-[#1E293B] mb-3">Support &amp; Billing</h2>
          <div className="flex items-start gap-2 text-sm text-slate-500">
            <Mail size={15} className="text-slate-400 shrink-0 mt-0.5" />
            <span>
              To cancel your subscription or request a refund, email{' '}
              <a href="mailto:support@datafyle.com" className="text-[#2563EB] hover:underline">
                support@datafyle.com
              </a>
              . We process all requests within 1 business day.
            </span>
          </div>
        </section>
      </div>
    </div>
  )
}
