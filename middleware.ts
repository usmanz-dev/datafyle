import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse, type NextRequest } from 'next/server'

// ─── Rate limiter (in-memory, per Edge worker instance) ────────────────────────
const WINDOW_MS = 60_000

interface RateEntry { count: number; resetAt: number }
const ipStore = new Map<string, RateEntry>()

function checkLimit(key: string, limit: number): boolean {
  const now = Date.now()
  const e = ipStore.get(key)
  if (!e || now > e.resetAt) {
    ipStore.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  if (e.count >= limit) return true
  e.count++
  return false
}

// ─── Security headers ──────────────────────────────────────────────────────────
const SEC: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}

// ─── Route matchers ───────────────────────────────────────────────────────────
const isProtected = createRouteMatcher(['/dashboard(.*)', '/settings(.*)'])
const isAdmin     = createRouteMatcher(['/admin(.*)'])

// ─── Middleware ───────────────────────────────────────────────────────────────
export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { pathname } = req.nextUrl
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
          ?? req.headers.get('x-real-ip')
          ?? 'unknown'

  // Stricter rate limit for upload routes (20/min), global 100/min
  const isUpload = pathname.startsWith('/api/upload')
  const limit    = isUpload ? 20 : 100
  const key      = `${isUpload ? 'ul' : 'gl'}:${ip}`

  if (checkLimit(key, limit)) {
    const res = NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { status: 429 }
    )
    Object.entries(SEC).forEach(([k, v]) => res.headers.set(k, v))
    return res
  }

  // Protect routes — throws redirect if unauthenticated
  if (isProtected(req) || isAdmin(req)) {
    await auth.protect()
  }

  const res = NextResponse.next()
  Object.entries(SEC).forEach(([k, v]) => res.headers.set(k, v))
  return res
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
    '/(api|trpc)(.*)',
  ],
}
