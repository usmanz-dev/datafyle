import type { Metadata } from 'next'
import TermsClient from './TermsClient'

export const metadata: Metadata = {
  title: 'Terms of Service — Datafyle',
  description: 'Terms and conditions for using the Datafyle AI document processing platform.',
}

export default function TermsPage() {
  return <TermsClient />
}
