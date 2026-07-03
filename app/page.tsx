import type { Metadata } from 'next'
import LandingPage from './LandingPage'

export const metadata: Metadata = {
  title: 'Datafyle — AI Document Processing for Accounting Firms',
  description:
    'Upload any invoice or document. AI extracts all data in 10 seconds. Replace your $2,500/month bookkeeper with Datafyle at $49/month.',
  openGraph: {
    title: 'Datafyle — AI Document Processing',
    description: 'Upload any document. AI extracts all data. Download Excel.',
    type: 'website',
  },
}

export default function Home() {
  return <LandingPage />
}
