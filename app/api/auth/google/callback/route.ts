import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const clerkId = searchParams.get('state')
  const error = searchParams.get('error')

  const origin = new URL(req.url).origin

  if (error || !code || !clerkId) {
    return NextResponse.redirect(`${origin}/dashboard?sheets=error`)
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        grant_type: 'authorization_code',
      }),
    })

    const tokens = await tokenRes.json()

    if (!tokens.access_token) {
      console.error('[Google OAuth] Token exchange failed:', tokens)
      return NextResponse.redirect(`${origin}/dashboard?sheets=error`)
    }

    const user = await prisma.user.findUnique({ where: { clerkId } })
    if (!user) return NextResponse.redirect(`${origin}/dashboard?sheets=error`)

    await prisma.userToken.upsert({
      where: { userId_provider: { userId: user.id, provider: 'google' } },
      create: {
        userId: user.id,
        provider: 'google',
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? '',
        expiresAt: new Date(Date.now() + (tokens.expires_in ?? 3600) * 1000),
      },
      update: {
        accessToken: tokens.access_token,
        ...(tokens.refresh_token ? { refreshToken: tokens.refresh_token } : {}),
        expiresAt: new Date(Date.now() + (tokens.expires_in ?? 3600) * 1000),
      },
    })

    return NextResponse.redirect(`${origin}/dashboard?sheets=connected`)
  } catch (err) {
    console.error('[Google OAuth callback]', err)
    return NextResponse.redirect(`${origin}/dashboard?sheets=error`)
  }
}
