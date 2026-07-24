import type { Metadata } from 'next'
import Link from 'next/link'
import { RotateCcw } from 'lucide-react'
import { PublicNav } from '@/components/PublicNav'
import { PublicFooter } from '@/components/PublicFooter'
import { MouseBlobClient } from '@/components/MouseBlobClient'

export const metadata: Metadata = {
  title: 'Refund Policy — Datafyle',
  description: '7-day money-back guarantee. Datafyle refund policy for all paid plans.',
}

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8">
      <div className="flex items-start gap-4 mb-5">
        <span className="shrink-0 w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] text-sm font-bold flex items-center justify-center">
          {num}
        </span>
        <h2 className="text-lg font-bold text-[#1E293B] pt-1">{title}</h2>
      </div>
      <div className="pl-12">{children}</div>
    </div>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-slate-600 leading-relaxed text-sm">{children}</p>
}

function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-sm text-slate-600">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <MouseBlobClient />
      <PublicNav />

      {/* Hero */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
              <RotateCcw size={20} className="text-[#2563EB]" />
            </div>
            <span className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">Legal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1E293B] mb-3">Refund Policy</h1>
          <p className="text-slate-500 text-sm">Last updated: July 2026</p>
          <p className="text-slate-600 mt-4 max-w-2xl leading-relaxed text-sm">
            We offer a 7-day money-back guarantee on all paid plans. If Datafyle is not the right fit
            for your business, contact us within 7 days of your purchase and we will refund you in full.
          </p>
        </div>
      </div>

      {/* Sections */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="space-y-4">

          {/* Guarantee highlight */}
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center shrink-0">
              <RotateCcw size={18} className="text-white" />
            </div>
            <div>
              <p className="text-[#1E293B] font-bold text-base mb-1">7-Day Money-Back Guarantee</p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Not happy? Email us at{' '}
                <a href="mailto:support@datafyle.com" className="text-[#2563EB] font-medium hover:underline">
                  support@datafyle.com
                </a>{' '}
                within 7 days of your first payment and we will issue a full refund — no questions asked.
              </p>
            </div>
          </div>

          <Section num="1" title="Eligibility for a Refund">
            <div className="space-y-4">
              <P>You are eligible for a full refund if all of the following conditions are met:</P>
              <UL items={[
                'Your refund request is submitted within 7 days of your initial subscription payment.',
                'This is your first purchase on Datafyle — refunds apply to first-time payments only.',
                'You contact us at support@datafyle.com with your account email and reason for the refund.',
              ]} />
            </div>
          </Section>

          <Section num="2" title="No Refund After 7 Days">
            <P>
              After the 7-day window has passed, we are unable to issue refunds for any reason —
              including unused documents, partial usage of the plan, or dissatisfaction with the service.
              We encourage you to evaluate Datafyle thoroughly within the first 7 days of your subscription.
            </P>
          </Section>

          <Section num="3" title="Subscription Renewals">
            <div className="space-y-4">
              <P>
                Monthly and annual subscription renewals are non-refundable. You may cancel your
                subscription at any time before the next billing date to avoid future charges.
              </P>
              <P>
                Cancellation takes effect at the end of your current billing period — you retain
                full access to Datafyle until then.
              </P>
            </div>
          </Section>

          <Section num="4" title="Plan Downgrades">
            <P>
              Downgrading your plan mid-cycle does not entitle you to a partial refund for the
              price difference. The downgrade will take effect at the start of your next billing cycle.
            </P>
          </Section>

          <Section num="5" title="How to Request a Refund">
            <div className="space-y-4">
              <P>To request a refund, email us with the following information:</P>
              <UL items={[
                'Your Datafyle account email address.',
                'The date of your purchase.',
                'A brief reason for requesting the refund (optional but appreciated).',
              ]} />
              <div className="pt-2">
                <a
                  href="mailto:support@datafyle.com"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  support@datafyle.com
                </a>
              </div>
              <P>
                We aim to respond to all refund requests within 1 business day. Approved refunds
                are processed within 5–10 business days depending on your payment provider.
              </P>
            </div>
          </Section>

          <Section num="6" title="Changes to This Policy">
            <P>
              We reserve the right to update this refund policy at any time. Changes will be posted
              on this page with an updated date. Continued use of Datafyle after changes are posted
              constitutes your acceptance of the revised policy.
            </P>
          </Section>

          {/* Contact box */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8">
            <h2 className="text-base font-bold text-[#1E293B] mb-2">Questions about our refund policy?</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Contact us at{' '}
              <a href="mailto:support@datafyle.com" className="text-[#2563EB] font-medium hover:underline">
                support@datafyle.com
              </a>{' '}
              — we reply within 1 business day. You can also visit our{' '}
              <Link href="/contact" className="text-[#2563EB] font-medium hover:underline">
                Contact page
              </Link>
              .
            </p>
          </div>

        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
