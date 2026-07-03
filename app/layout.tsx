import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'
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
    'invoice processing',
    'document automation',
    'accounting AI',
    'data entry automation',
    'invoice extraction',
    'bookkeeping automation',
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.className}>
        <body className="min-h-full flex flex-col">
          {children}
          <Toaster position="top-right" richColors />
        </body>
      </html>
    </ClerkProvider>
  )
}
