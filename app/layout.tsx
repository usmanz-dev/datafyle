import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Datafyle — AI Document Processing',
  description: 'Upload any document. AI extracts all data. Download Excel.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.className}>
        <body className="min-h-full flex flex-col">{children}</body>
      </html>
    </ClerkProvider>
  )
}
