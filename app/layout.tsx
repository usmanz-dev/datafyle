import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { NavigationLoader } from '@/components/NavigationLoader'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Datafyle — AI Document Processing for Accountants',
    template: '%s | Datafyle',
  },
  description:
    'Upload invoices and documents. AI extracts all data in 10 seconds. Replace your $2,500/month bookkeeper with Datafyle at $49/month.',
  keywords: [
    'AI invoice processing',
    'invoice data extraction software',
    'document automation for accountants',
    'AI bookkeeping software',
    'invoice OCR software',
    'accounting document processing',
    'automated data entry accounting',
    'replace bookkeeper with AI',
    'Excel data extraction from PDF',
    'invoice processing software UK',
    'accounting AI tools',
    'PDF invoice to Excel',
    'bookkeeping automation software',
    'AI document processing SaaS',
  ],
  openGraph: {
    title: 'Datafyle — Stop Wasting Hours on Manual Data Entry',
    description: 'AI extracts data from any document in 10 seconds. Start free.',
    url: 'https://datafyle.com',
    siteName: 'Datafyle',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Datafyle AI',
    creator: '@datafyle',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/images/datafyle-favicon.ico',
    shortcut: '/images/datafyle-favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-full flex flex-col">
        <NavigationLoader />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
