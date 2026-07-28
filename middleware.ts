import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/pricing(.*)',
  '/blog(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/privacy(.*)',
  '/terms(.*)',
  '/refund(.*)',
  '/contact(.*)',
  '/api/webhooks/(.*)',
  '/api/inngest(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jts|map|jpg|jpeg|gif|png|svg|ico|webp|woff2?|ttf|eot)).*)',
    '/(api|trpc)(.*)',
  ],
}
