'use client'

import { Shield, Mail } from 'lucide-react'
import { PublicNav } from '@/components/PublicNav'
import { PublicFooter } from '@/components/PublicFooter'
import { MouseBlobClient } from '@/components/MouseBlobClient'
import { useLanguage } from '@/lib/i18n/context'

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8">
      <div className="flex items-start gap-4 mb-5">
        <span className="shrink-0 w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] text-sm font-bold flex items-center justify-center">{num}</span>
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

export default function PrivacyClient() {
  const { t } = useLanguage()
  const p = t.pages.privacy
  const s = t.pages

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <MouseBlobClient />
      <PublicNav />
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
              <Shield size={20} className="text-[#2563EB]" />
            </div>
            <span className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">{s.legal}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1E293B] mb-3">{p.title}</h1>
          <p className="text-slate-500 text-sm">{s.lastUpdated} January 2026</p>
          <p className="text-slate-600 mt-4 max-w-2xl leading-relaxed text-sm">{p.desc}</p>
        </div>
      </div>
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="space-y-4">
          <Section num="1" title={p.s1}>
            <P>Datafyle (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) operates the AI document processing platform at datafyle.com. We are committed to protecting the personal data of our users. This Privacy Policy explains what information we collect, how we use it, and your rights.</P>
          </Section>
          <Section num="2" title={p.s2}>
            <P>We collect the following categories of data:</P>
            <div className="mt-4">
              <UL items={[
                <><strong className="text-[#1E293B]">Account data:</strong> Name, email address, and authentication credentials provided when you sign up via Clerk.</>,
                <><strong className="text-[#1E293B]">Document data:</strong> Files you upload for processing (invoices, receipts, statements). Stored on Cloudflare R2 infrastructure.</>,
                <><strong className="text-[#1E293B]">Extracted data:</strong> Structured data extracted by AI from your documents — vendor names, amounts, dates, line items.</>,
                <><strong className="text-[#1E293B]">Billing data:</strong> Subscription and payment information processed by Paddle. We do not store credit card numbers.</>,
                <><strong className="text-[#1E293B]">Usage data:</strong> Number of documents processed, feature usage, and error logs for platform improvement.</>,
                <><strong className="text-[#1E293B]">Technical data:</strong> IP addresses, browser type, device identifiers, and request logs for security and rate limiting.</>,
              ]} />
            </div>
          </Section>
          <Section num="3" title={p.s3}>
            <div className="mb-4">
              <UL items={[
                'To provide the document processing service you subscribed to.',
                'To improve AI extraction accuracy using aggregated, anonymised patterns — never individual document content.',
                'To send transactional emails (account creation, payment confirmations, anomaly alerts).',
                'To enforce usage limits and subscription plans.',
                'To comply with legal obligations and prevent fraudulent activity.',
              ]} />
            </div>
            <div className="mt-5 p-4 bg-[#EFF6FF] rounded-lg border border-blue-100">
              <p className="text-sm text-[#1E293B] font-semibold">🔒 We never sell your data. Your documents are never used to train AI models. Your data is never shared with third parties except as described below.</p>
            </div>
          </Section>
          <Section num="4" title={p.s4}>
            <P>We use the following trusted third-party services to operate the platform:</P>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {[
                { name: 'Clerk', desc: 'Authentication and user identity management' },
                { name: 'Cloudflare R2', desc: 'Encrypted file storage for uploaded documents' },
                { name: 'Supabase (PostgreSQL)', desc: 'Relational database for extracted data and user records' },
                { name: 'Anthropic Claude', desc: 'AI model used to extract structured data from documents' },
                { name: 'Google Cloud Vision', desc: 'OCR processing for image-based documents' },
                { name: 'Paddle', desc: 'Payment processing and subscription management' },
                { name: 'Resend', desc: 'Transactional email delivery' },
              ].map(({ name, desc }) => (
                <div key={name} className="flex gap-3 p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                  <div className="w-2 h-2 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-[#1E293B]">{name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
          <Section num="5" title={p.s5}>
            <P>All data is encrypted in transit using TLS 1.2+. Documents are encrypted at rest on Cloudflare R2. Database connections use SSL. We apply rate limiting and authentication to all API endpoints. Employees do not have routine access to customer documents.</P>
          </Section>
          <Section num="6" title={p.s6}>
            <UL items={[
              'Documents and extracted data are retained for the duration of your account.',
              'You can delete individual documents at any time from your dashboard.',
              'On account deletion, all your data is permanently deleted within 30 days.',
              'Billing records are retained for 7 years as required by tax law.',
            ]} />
          </Section>
          <Section num="7" title={p.s7}>
            <P>You have the following rights regarding your personal data:</P>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {[
                { right: 'Access', desc: 'Request a copy of all personal data we hold about you' },
                { right: 'Rectification', desc: 'Correct any inaccurate personal data' },
                { right: 'Erasure', desc: 'Request deletion of your data ("right to be forgotten")' },
                { right: 'Portability', desc: 'Export your data in a machine-readable format' },
                { right: 'Objection', desc: 'Object to processing for direct marketing purposes' },
                { right: 'Restriction', desc: 'Request we restrict processing in certain circumstances' },
              ].map(({ right, desc }) => (
                <div key={right} className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                  <p className="text-sm font-semibold text-[#1E293B]">{right}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-600 mt-4">To exercise any of these rights, email <a href="mailto:privacy@datafyle.com" className="text-[#2563EB] hover:underline font-medium">privacy@datafyle.com</a>.</p>
          </Section>
          <Section num="8" title={p.s8}>
            <P>We use only essential cookies required for authentication (set by Clerk) and session management. We do not use advertising cookies or third-party tracking pixels.</P>
          </Section>
          <Section num="9" title={p.s9}>
            <P>We may update this policy periodically. Material changes will be notified via email to registered users at least 14 days before taking effect. Continued use of Datafyle after the effective date constitutes acceptance of the updated policy.</P>
          </Section>
          <Section num="10" title={p.s10}>
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-[#2563EB] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-slate-600">For privacy questions or to exercise your rights:</p>
                <a href="mailto:privacy@datafyle.com" className="text-sm text-[#2563EB] hover:underline font-medium mt-1 inline-block">privacy@datafyle.com</a>
              </div>
            </div>
          </Section>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}
