import type { Metadata } from 'next'
import LandingPage from './LandingPage'

export const metadata: Metadata = {
  title: 'Datafyle — AI Invoice & Document Data Extraction for Accounting Firms',
  description:
    'Upload invoices, receipts, and documents — AI extracts every field in 10 seconds. Export to Excel or Google Sheets. Built for accounting firms. Start free, from $49/month.',
  alternates: {
    canonical: 'https://datafyle.com',
  },
  keywords: [
    'AI invoice processing',
    'invoice data extraction',
    'document automation for accountants',
    'AI bookkeeping software',
    'invoice OCR',
    'accounting document processing',
    'replace bookkeeper with AI',
    'Excel data extraction',
    'automated invoice processing UK',
    'accounting AI software',
  ],
  openGraph: {
    title: 'Datafyle — AI Invoice & Document Data Extraction',
    description: 'Upload any invoice or document. AI extracts all fields in 10 seconds. Export to Excel instantly. Start free.',
    type: 'website',
    url: 'https://datafyle.com',
    siteName: 'Datafyle',
    images: [{ url: 'https://datafyle.com/images/datafyle-ai-invoice-data-extraction.png', width: 1200, height: 630, alt: 'Datafyle AI Invoice Data Extraction' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Datafyle — AI Invoice & Document Data Extraction',
    description: 'Upload any document. AI extracts all data in 10 seconds. Start free.',
    images: ['https://datafyle.com/images/datafyle-ai-invoice-data-extraction.png'],
  },
}

export default function Home() {
  return <LandingPage />
}
