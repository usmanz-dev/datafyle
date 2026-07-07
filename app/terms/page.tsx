import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Mail } from 'lucide-react'
import { PublicNav } from '@/components/PublicNav'
import { PublicFooter } from '@/components/PublicFooter'
import { MouseBlobClient } from '@/components/MouseBlobClient'

export const metadata: Metadata = {
  title: 'Terms of Service — Datafyle',
  description: 'Terms and conditions for using the Datafyle AI document processing platform.',
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

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <MouseBlobClient />
      <PublicNav />

      {/* Hero */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
              <FileText size={20} className="text-[#2563EB]" />
            </div>
            <span className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider">Legal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1E293B] mb-3">Terms of Service</h1>
          <p className="text-slate-500 text-sm">Last updated: January 2026</p>
          <p className="text-slate-600 mt-4 max-w-2xl leading-relaxed text-sm">
            These terms govern your use of the Datafyle platform. By using our service,
            you agree to these terms. Please read them carefully before signing up.
          </p>
        </div>
      </div>

      {/* Sections */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="space-y-4">

          <Section num="1" title="Agreement to Terms">
            <P>
              By accessing or using Datafyle (&ldquo;Service&rdquo;), you agree to be bound by these Terms of Service
              (&ldquo;Terms&rdquo;). If you do not agree, do not use the Service. These Terms apply to all users,
              including free and paid subscribers.
            </P>
          </Section>

          <Section num="2" title="Description of Service">
            <P>
              Datafyle is an AI-powered document processing platform that extracts structured data from invoices,
              receipts, and other business documents. The Service uses AI models to extract data including vendor
              names, amounts, dates, and line items, and provides outputs in Excel, Google Sheets, and PDF formats.
            </P>
          </Section>

          <Section num="3" title="Accounts and Eligibility">
            <UL items={[
              'You must be at least 18 years old to create an account.',
              'You are responsible for maintaining the security of your account credentials.',
              'You must not create accounts on behalf of others without authorisation.',
              'One account is required per user. Team plans allow multiple seats under one billing account.',
            ]} />
          </Section>

          <Section num="4" title="Subscriptions and Billing">
            <UL items={[
              'Paid plans are billed monthly or annually via Paddle. Payment is charged immediately upon plan selection — there are no free trials.',
              'You may cancel at any time. Your plan remains active until the end of the billing period; you then revert to the Free plan.',
              'Upgrades take effect immediately. Downgrades take effect at the end of the current billing period.',
              'Annual plans are non-refundable except where required by applicable law.',
              'We reserve the right to change pricing with 30 days’ notice to existing subscribers.',
              'Document limits reset at the start of each billing cycle. Unused documents do not roll over.',
            ]} />
            <div className="mt-5 p-4 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-sm text-amber-800 font-medium">
                ⚡ No free trials — subscriptions are charged immediately upon plan selection.
              </p>
            </div>
          </Section>

          <Section num="5" title="Acceptable Use">
            <P>You agree not to:</P>
            <div className="mt-4">
              <UL items={[
                'Upload documents containing illegal content, malware, or content that violates third-party intellectual property rights.',
                'Attempt to reverse-engineer, scrape, or abuse the AI models or API infrastructure.',
                'Use the Service to process documents on behalf of others without their authorisation.',
                'Circumvent rate limits, usage limits, or authentication systems.',
                'Resell or sublicense access to the Service without written agreement from Datafyle.',
              ]} />
            </div>
          </Section>

          <Section num="6" title="AI Accuracy and Limitations">
            <P>
              The AI extraction provided by Datafyle achieves high accuracy but is not infallible.
              You are responsible for verifying extracted data before using it in financial records,
              tax filings, or other critical applications. Datafyle provides confidence scores to help
              you identify fields requiring manual review. We do not accept liability for errors arising
              from unchecked AI output.
            </P>
          </Section>

          <Section num="7" title="Intellectual Property">
            <P>
              You retain all rights to your documents and the data within them. By uploading documents,
              you grant Datafyle a limited licence to process them solely for the purpose of providing
              the Service. Datafyle retains all rights to the platform, software, AI models, and
              infrastructure. You may not copy, modify, or distribute the Datafyle software.
            </P>
          </Section>

          <Section num="8" title="Data and Privacy">
            <P>
              Your use of the Service is also governed by our{' '}
              <Link href="/privacy" className="text-[#2563EB] hover:underline font-medium">
                Privacy Policy
              </Link>
              , which is incorporated into these Terms by reference. We process your data in accordance
              with GDPR and UK GDPR where applicable.
            </P>
          </Section>

          <Section num="9" title="Limitation of Liability">
            <P>
              To the maximum extent permitted by law, Datafyle&apos;s total liability for any claim
              arising from these Terms or your use of the Service shall not exceed the amount you paid
              in the 3 months immediately preceding the claim. We are not liable for indirect,
              consequential, incidental, or punitive damages, or loss of profits or data.
            </P>
          </Section>

          <Section num="10" title="Service Availability">
            <P>
              We aim for 99.7% uptime. We may perform scheduled maintenance with reasonable notice
              and cannot guarantee uninterrupted access. We are not liable for losses arising from
              downtime beyond our reasonable control.
            </P>
          </Section>

          <Section num="11" title="Termination">
            <P>
              We may suspend or terminate your account immediately if you breach these Terms or engage
              in fraudulent activity. You may terminate your account at any time via your account
              settings. On termination, your data is deleted within 30 days per our Privacy Policy.
            </P>
          </Section>

          <Section num="12" title="Changes to Terms">
            <P>
              We may update these Terms. Material changes will be notified by email at least 14 days
              before taking effect. Continued use of the Service after the effective date constitutes
              acceptance of the updated Terms.
            </P>
          </Section>

          <Section num="13" title="Governing Law">
            <P>
              These Terms are governed by the laws of England and Wales. Any disputes shall be subject
              to the exclusive jurisdiction of the courts of England and Wales.
            </P>
          </Section>

          <Section num="14" title="Contact Us">
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-[#2563EB] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-slate-600">For questions about these Terms:</p>
                <a href="mailto:legal@datafyle.com" className="text-sm text-[#2563EB] hover:underline font-medium mt-1 inline-block">
                  legal@datafyle.com
                </a>
              </div>
            </div>
          </Section>

        </div>

      </main>

      <PublicFooter />
    </div>
  )
}
