import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service — Datafyle',
  description: 'Terms and conditions for using the Datafyle AI document processing platform.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link href="/" className="text-xs text-[#2563EB] font-medium hover:underline mb-3 inline-block">
            ← Datafyle
          </Link>
          <h1 className="text-3xl font-bold text-[#1E293B]">Terms of Service</h1>
          <p className="text-slate-500 mt-2 text-sm">Last updated: January 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="space-y-10 text-[#1E293B]">

          <section>
            <h2 className="text-xl font-bold text-[#1E293B] mb-3">1. Agreement</h2>
            <p className="text-slate-600 leading-relaxed">
              By accessing or using Datafyle (&ldquo;Service&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;).
              If you do not agree, do not use the Service. These Terms apply to all users, including free and paid subscribers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1E293B] mb-3">2. Description of Service</h2>
            <p className="text-slate-600 leading-relaxed">
              Datafyle is an AI-powered document processing platform that extracts structured data from invoices, receipts, and other
              business documents. The Service uses AI models to extract data including vendor names, amounts, dates, and line items,
              and provides outputs in Excel, Google Sheets, and PDF formats.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1E293B] mb-3">3. Accounts and Eligibility</h2>
            <ul className="space-y-2 text-slate-600 list-disc pl-5">
              <li>You must be at least 18 years old to create an account.</li>
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You must not create accounts on behalf of others without authorisation.</li>
              <li>One account is required per user. Team plans allow multiple seats under one billing account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1E293B] mb-3">4. Subscriptions and Billing</h2>
            <ul className="space-y-2 text-slate-600 list-disc pl-5">
              <li>Paid plans are billed monthly or annually via Paddle. Payment is charged immediately upon plan selection — there are no free trials.</li>
              <li>You may cancel at any time. Your plan remains active until the end of the billing period; you then revert to the Free plan.</li>
              <li>Upgrades take effect immediately. Downgrades take effect at the end of the current billing period.</li>
              <li>Annual plans are non-refundable except where required by applicable law.</li>
              <li>We reserve the right to change pricing with 30 days&apos; notice to existing subscribers.</li>
              <li>Document limits reset at the start of each billing cycle. Unused documents do not roll over.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1E293B] mb-3">5. Acceptable Use</h2>
            <p className="text-slate-600 leading-relaxed mb-3">You agree not to:</p>
            <ul className="space-y-2 text-slate-600 list-disc pl-5">
              <li>Upload documents containing illegal content, malware, or content that violates third-party intellectual property rights.</li>
              <li>Attempt to reverse-engineer, scrape, or abuse the AI models or API infrastructure.</li>
              <li>Use the Service to process documents on behalf of others without their authorisation.</li>
              <li>Circumvent rate limits, usage limits, or authentication systems.</li>
              <li>Resell or sublicense access to the Service without written agreement from Datafyle.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1E293B] mb-3">6. AI Accuracy and Limitations</h2>
            <p className="text-slate-600 leading-relaxed">
              The AI extraction provided by Datafyle achieves high accuracy but is not infallible. You are responsible for verifying
              extracted data before using it in financial records, tax filings, or other critical applications. Datafyle provides
              confidence scores to help you identify fields requiring review. We do not accept liability for errors arising from
              unchecked AI output.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1E293B] mb-3">7. Intellectual Property</h2>
            <p className="text-slate-600 leading-relaxed">
              You retain all rights to your documents and the data within them. By uploading documents, you grant Datafyle a limited
              licence to process them solely for the purpose of providing the Service. Datafyle retains all rights to the platform,
              software, AI models, and infrastructure. You may not copy, modify, or distribute the Datafyle software.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1E293B] mb-3">8. Data and Privacy</h2>
            <p className="text-slate-600 leading-relaxed">
              Your use of the Service is also governed by our <Link href="/privacy" className="text-[#2563EB] hover:underline">Privacy Policy</Link>,
              which is incorporated into these Terms by reference.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1E293B] mb-3">9. Limitation of Liability</h2>
            <p className="text-slate-600 leading-relaxed">
              To the maximum extent permitted by law, Datafyle&apos;s total liability for any claim arising from these Terms or your use
              of the Service shall not exceed the amount you paid in the 3 months immediately preceding the claim.
              We are not liable for indirect, consequential, incidental, or punitive damages, or loss of profits or data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1E293B] mb-3">10. Service Availability</h2>
            <p className="text-slate-600 leading-relaxed">
              We aim for 99.7% uptime. We may perform scheduled maintenance with reasonable notice and cannot guarantee uninterrupted
              access. We are not liable for losses arising from downtime beyond our reasonable control.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1E293B] mb-3">11. Termination</h2>
            <p className="text-slate-600 leading-relaxed">
              We may suspend or terminate your account immediately if you breach these Terms or engage in fraudulent activity.
              You may terminate your account at any time via your account settings. On termination, your data is deleted within 30 days
              per our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1E293B] mb-3">12. Changes to Terms</h2>
            <p className="text-slate-600 leading-relaxed">
              We may update these Terms. Material changes will be notified by email at least 14 days before taking effect.
              Continued use of the Service after the effective date constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1E293B] mb-3">13. Governing Law</h2>
            <p className="text-slate-600 leading-relaxed">
              These Terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction
              of the courts of England and Wales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1E293B] mb-3">14. Contact</h2>
            <p className="text-slate-600 leading-relaxed">
              For questions about these Terms:<br />
              <strong className="text-[#1E293B]">Email:</strong> legal@datafyle.com<br />
              <strong className="text-[#1E293B]">Website:</strong> datafyle.com
            </p>
          </section>

        </div>
      </div>

      <div className="border-t border-[#E2E8F0] py-8 text-center">
        <Link href="/" className="text-sm text-[#2563EB] hover:underline">← Back to Datafyle</Link>
        <span className="mx-3 text-slate-200">|</span>
        <Link href="/privacy" className="text-sm text-[#2563EB] hover:underline">Privacy Policy</Link>
      </div>
    </div>
  )
}
