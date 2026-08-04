import type { Metadata } from 'next'
import PrivacyClient from './PrivacyClient'

export const metadata: Metadata = {
  title: 'Privacy Policy — Datafyle',
  description: 'How Datafyle collects, uses, and protects your data.',
}

export default function PrivacyPage() {
  return <PrivacyClient />
}
