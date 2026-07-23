import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Datafyle refund policy — 7-day money-back guarantee for all paid plans.',
}

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-[#E2E8F0]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <Link href="/" className="font-bold text-[18px] text-[#1E293B] tracking-tight">
            Data<span className="text-[#2563EB]">fyle</span>
          </Link>
          <Link href="/" className="text-sm text-slate-500 hover:text-[#2563EB] transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">

        {/* Title */}
        <div className="mb-12">
          <span className="inline-block px-3 py-1 bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold rounded-full mb-4 uppercase tracking-wider">
            Legal
          </span>
          <h1 className="text-4xl font-bold text-[#1E293B] mb-4">Refund Policy</h1>
          <p className="text-slate-500 text-sm">Last updated: July 2026</p>
        </div>

        {/* Highlight box */}
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-6 mb-10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-[#1E293B] font-bold text-lg mb-1">7-Day Money-Back Guarantee</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                We offer a full refund within <strong>7 days</strong> of your initial purchase — no questions asked.
                If Datafyle is not the right fit for your business, we will refund you completely.
              </p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-10 text-[#1E293B]">

          <section>
            <h2 className="text-xl font-bold mb-3">1. Eligibility for a Refund</h2>
            <p className="text-slate-600 leading-relaxed mb-3">
              You are eligible for a full refund if all of the following conditions are met:
            </p>
            <ul className="space-y-2 text-slate-600">
              {[
                'Your refund request is submitted within 7 days of your initial subscription payment.',
                'This is your first purchase on Datafyle (refunds apply to first-time payments only).',
                'You contact us at support@datafyle.com with your account email and reason for the refund.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#DCFCE7] text-[#166534] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="border-t border-[#E2E8F0]" />

          <section>
            <h2 className="text-xl font-bold mb-3">2. No Refund After 7 Days</h2>
            <p className="text-slate-600 leading-relaxed">
              After the 7-day window has passed, we are unable to issue refunds for any reason,
              including but not limited to: unused documents, partial usage of the plan, or
              dissatisfaction with the service. We encourage you to evaluate Datafyle thoroughly
              within the first 7 days of your subscription.
            </p>
          </section>

          <div className="border-t border-[#E2E8F0]" />

          <section>
            <h2 className="text-xl font-bold mb-3">3. Renewals</h2>
            <p className="text-slate-600 leading-relaxed">
              Monthly and annual subscription renewals are <strong>non-refundable</strong>.
              You may cancel your subscription at any time before the next billing date to avoid
              future charges. Cancellation takes effect at the end of your current billing period —
              you retain full access until then.
            </p>
          </section>

          <div className="border-t border-[#E2E8F0]" />

          <section>
            <h2 className="text-xl font-bold mb-3">4. Plan Downgrades</h2>
            <p className="text-slate-600 leading-relaxed">
              Downgrading your plan mid-cycle does not entitle you to a partial refund for the
              difference in price. The downgrade will take effect at the start of your next
              billing cycle.
            </p>
          </section>

          <div className="border-t border-[#E2E8F0]" />

          <section>
            <h2 className="text-xl font-bold mb-3">5. How to Request a Refund</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              To request a refund, email us at:
            </p>
            <a
              href="mailto:support@datafyle.com"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#2563EB] text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              support@datafyle.com
            </a>
            <p className="text-slate-500 text-sm mt-4 leading-relaxed">
              Please include your account email address and a brief reason for the refund.
              We aim to respond to all refund requests within <strong>1 business day</strong>.
              Approved refunds are processed within <strong>5–10 business days</strong> depending on your payment provider.
            </p>
          </section>

          <div className="border-t border-[#E2E8F0]" />

          <section>
            <h2 className="text-xl font-bold mb-3">6. Changes to This Policy</h2>
            <p className="text-slate-600 leading-relaxed">
              We reserve the right to update this refund policy at any time. Changes will be
              posted on this page with an updated date. Continued use of Datafyle after changes
              are posted constitutes acceptance of the revised policy.
            </p>
          </section>

          <div className="border-t border-[#E2E8F0]" />

          {/* Contact box */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-6">
            <h2 className="text-lg font-bold text-[#1E293B] mb-2">Questions?</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              If you have any questions about our refund policy, please contact us at{' '}
              <a href="mailto:support@datafyle.com" className="text-[#2563EB] font-medium hover:underline">
                support@datafyle.com
              </a>
              . We are happy to help.
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#E2E8F0] mt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-400 text-sm">© 2026 Datafyle. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/privacy" className="text-slate-400 hover:text-[#2563EB] transition-colors">Privacy Policy</Link>
            <span className="text-slate-200">·</span>
            <Link href="/terms" className="text-slate-400 hover:text-[#2563EB] transition-colors">Terms of Service</Link>
            <span className="text-slate-200">·</span>
            <Link href="/contact" className="text-slate-400 hover:text-[#2563EB] transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
