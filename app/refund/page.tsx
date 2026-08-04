import type { Metadata } from 'next'
import RefundClient from './RefundClient'

export const metadata: Metadata = {
  title: 'Refund Policy — Datafyle',
  description: '7-day money-back guarantee. Datafyle refund policy for all paid plans.',
}

export default function RefundPage() {
  return <RefundClient />
}
