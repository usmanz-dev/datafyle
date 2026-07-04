import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const results: Record<string, string> = {}

  // Check env vars
  results.DATABASE_URL = process.env.DATABASE_URL ? 'SET' : 'MISSING'
  results.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY ? 'SET' : 'MISSING'
  results.CLOUDFLARE_R2_ENDPOINT = process.env.CLOUDFLARE_R2_ENDPOINT ? 'SET' : 'MISSING'
  results.CLOUDFLARE_R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET ? 'SET' : 'MISSING'
  results.CLOUDFLARE_R2_ACCESS_KEY = process.env.CLOUDFLARE_R2_ACCESS_KEY ? 'SET' : 'MISSING'
  results.CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY ? 'SET' : 'MISSING'

  // Test DB connection
  try {
    await prisma.$queryRaw`SELECT 1`
    results.DB_CONNECTION = 'OK'
  } catch (e) {
    results.DB_CONNECTION = 'FAILED: ' + (e instanceof Error ? e.message : String(e))
  }

  return NextResponse.json(results)
}
