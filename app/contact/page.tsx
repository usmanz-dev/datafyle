import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact Us — Datafyle',
  description: 'Get in touch with the Datafyle team. We reply within 24 hours. Sales, support, partnerships, and enterprise inquiries welcome.',
}

export default function ContactPage() {
  return <ContactClient />
}
