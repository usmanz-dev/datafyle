'use client'

import Script from 'next/script'

declare global {
  interface Window {
    Paddle?: {
      Initialize: (opts: { token: string }) => void
      Checkout: {
        open: (opts: {
          transactionId: string
          settings?: { successUrl?: string }
        }) => void
      }
    }
  }
}

export function PaddleInit() {
  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
  if (!token) return null
  return (
    <Script
      src="https://cdn.paddle.com/paddle/v2/paddle.js"
      strategy="afterInteractive"
      onLoad={() => {
        window.Paddle?.Initialize({ token })
      }}
    />
  )
}
