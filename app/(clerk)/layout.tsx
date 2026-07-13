import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'

export default function ClerkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      {children}
      <Toaster position="top-right" richColors />
    </ClerkProvider>
  )
}
