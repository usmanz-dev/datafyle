import type { Metadata } from 'next'
import { PricingContent } from './PricingContent'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Pricing — Start Free From $49/month',
  description:
    'Simple, transparent pricing for accounting firms. Start free with 10 documents/month. Upgrade to process thousands.',
}

export default function PricingPage() {
  return <PricingContent />
}
