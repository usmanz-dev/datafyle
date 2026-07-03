import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — Datafyle',
  description: 'How Datafyle collects, uses, and protects your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link href="/" className="text-xs text-[#2563EB] font-medium hover:underline mb-3 inline-block">
            ← Datafyle
          </Link>
          <h1 className="text-3xl font-bold text-[#1E293B]">Privacy Policy</h1>
          <p className="text-slate-500 mt-2 text-sm">Last updated: January 2026</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 prose prose-slate prose-sm max-w-none">
        <div className="space-y-10 text-[#1E293B]">

          <section>
            <h2 className="text-xl font-bold text-[#1E293B] mb-3">1. Who We Are</h2>
            <p className="text-slate-600 leading-relaxed">
              Datafyle (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) operates the Datafyle AI document processing platform at datafyle.com.
              We are committed to protecting the personal data of our users. This Privacy Policy explains what information we collect,
              how we use it, and your rights regarding your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1E293B] mb-3">2. Information We Collect</h2>
            <p className="text-slate-600 leading-relaxed mb-3">We collect the following categories of data:</p>
            <ul className="space-y-2 text-slate-600 list-disc pl-5">
              <li><strong className="text-[#1E293B]">Account data:</strong> Name, email address, and authentication credentials provided when you sign up via Clerk.</li>
              <li><strong className="text-[#1E293B]">Document data:</strong> Files you upload for processing (invoices, receipts, statements). These are stored on Cloudflare R2 infrastructure.</li>
              <li><strong className="text-[#1E293B]">Extracted data:</strong> Structured data extracted by AI from your documents (vendor names, amounts, dates, line items).</li>
              <li><strong className="text-[#1E293B]">Billing data:</strong> Subscription and payment information processed by Paddle. We do not store credit card numbers.</li>
              <li><strong className="text-[#1E293B]">Usage data:</strong> Number of documents processed, feature usage, and error logs for platform improvement.</li>
              <li><strong className="text-[#1E293B]">Technical data:</strong> IP addresses, browser type, device identifiers, and request logs for security and rate limiting.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1E293B] mb-3">3. How We Use Your Data</h2>
            <ul className="space-y-2 text-slate-600 list-disc pl-5">
              <li>To provide the document processing service you subscribed to.</li>
              <li>To improve AI extraction accuracy using aggregated, anonymised patterns (never individual document content).</li>
              <li>To send transactional emails (account creation, payment confirmations, anomaly alerts).</li>
              <li>To enforce usage limits and subscription plans.</li>
              <li>To comply with legal obligations and prevent fraudulent activity.</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-3">
              <strong className="text-[#1E293B]">We never sell your data.</strong> Your documents are never used to train AI models.
              Your data is never shared with third parties except as described in Section 4.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1E293B] mb-3">4. Third-Party Services</h2>
            <p className="text-slate-600 leading-relaxed mb-3">We use the following trusted third-party services:</p>
            <ul className="space-y-2 text-slate-600 list-disc pl-5">
              <li><strong className="text-[#1E293B]">Clerk</strong> — Authentication and user identity management.</li>
              <li><strong className="text-[#1E293B]">Cloudflare R2</strong> — Encrypted file storage for uploaded documents.</li>
              <li><strong className="text-[#1E293B]">Supabase (PostgreSQL)</strong> — Relational database for extracted data and user records.</li>
              <li><strong className="text-[#1E293B]">Anthropic Claude</strong> — AI model used to extract structured data from documents. Documents are processed under Anthropic&apos;s data handling terms.</li>
              <li><strong className="text-[#1E293B]">Google Cloud Vision</strong> — OCR for image-based documents.</li>
              <li><strong className="text-[#1E293B]">Paddle</strong> — Payment processing and subscription management.</li>
              <li><strong className="text-[#1E293B]">Resend</strong> — Transactional email delivery.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1E293B] mb-3">5. Data Security</h2>
            <p className="text-slate-600 leading-relaxed">
              All data is encrypted in transit using TLS 1.2+. Documents are encrypted at rest on Cloudflare R2.
              Database connections use SSL. We apply rate limiting and authentication to all API endpoints.
              Employees do not have routine access to customer documents.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1E293B] mb-3">6. Data Retention</h2>
            <ul className="space-y-2 text-slate-600 list-disc pl-5">
              <li>Documents and extracted data are retained for the duration of your account.</li>
              <li>You can delete individual documents at any time from your dashboard.</li>
              <li>On account deletion, all your data is permanently deleted within 30 days.</li>
              <li>Billing records are retained for 7 years as required by tax law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1E293B] mb-3">7. Your Rights (GDPR / UK GDPR)</h2>
            <p className="text-slate-600 leading-relaxed mb-3">You have the right to:</p>
            <ul className="space-y-2 text-slate-600 list-disc pl-5">
              <li><strong className="text-[#1E293B]">Access</strong> — Request a copy of all personal data we hold about you.</li>
              <li><strong className="text-[#1E293B]">Rectification</strong> — Correct inaccurate personal data.</li>
              <li><strong className="text-[#1E293B]">Erasure</strong> — Request deletion of your data (&ldquo;right to be forgotten&rdquo;).</li>
              <li><strong className="text-[#1E293B]">Portability</strong> — Export your data in a machine-readable format.</li>
              <li><strong className="text-[#1E293B]">Objection</strong> — Object to processing for direct marketing.</li>
              <li><strong className="text-[#1E293B]">Restriction</strong> — Request we restrict processing in certain circumstances.</li>
            </ul>
            <p className="text-slate-600 leading-relaxed mt-3">
              To exercise any of these rights, email us at <strong className="text-[#1E293B]">privacy@datafyle.com</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1E293B] mb-3">8. Cookies</h2>
            <p className="text-slate-600 leading-relaxed">
              We use only essential cookies required for authentication (set by Clerk) and session management.
              We do not use advertising cookies or third-party tracking pixels.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1E293B] mb-3">9. Changes to This Policy</h2>
            <p className="text-slate-600 leading-relaxed">
              We may update this policy. Material changes will be notified via email to registered users at least 14 days before taking effect.
              Continued use of Datafyle after the effective date constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1E293B] mb-3">10. Contact</h2>
            <p className="text-slate-600 leading-relaxed">
              For privacy questions or to exercise your rights:<br />
              <strong className="text-[#1E293B]">Email:</strong> privacy@datafyle.com<br />
              <strong className="text-[#1E293B]">Website:</strong> datafyle.com
            </p>
          </section>

        </div>
      </div>

      <div className="border-t border-[#E2E8F0] py-8 text-center">
        <Link href="/" className="text-sm text-[#2563EB] hover:underline">← Back to Datafyle</Link>
        <span className="mx-3 text-slate-200">|</span>
        <Link href="/terms" className="text-sm text-[#2563EB] hover:underline">Terms of Service</Link>
      </div>
    </div>
  )
}
