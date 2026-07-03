import type { Metadata } from 'next'
import { PricingContent } from './PricingContent'

export const metadata: Metadata = {
  title: 'Pricing — Datafyle',
  description:
    'Simple, transparent pricing for accounting firms. Start free with 10 documents/month. Upgrade to process thousands.',
}

export default function PricingPage() {
  return <PricingContent />
}
