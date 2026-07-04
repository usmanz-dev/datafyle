import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export async function GET() {
  const results: Record<string, string> = {}

  // Env vars
  results.DATABASE_URL = process.env.DATABASE_URL ? 'SET' : 'MISSING'
  results.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY ? 'SET' : 'MISSING'
  results.CLOUDFLARE_R2_ENDPOINT = process.env.CLOUDFLARE_R2_ENDPOINT ? 'SET' : 'MISSING'
  results.CLOUDFLARE_R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET ? 'SET' : 'MISSING'
  results.CLOUDFLARE_R2_ACCESS_KEY = process.env.CLOUDFLARE_R2_ACCESS_KEY ? 'SET' : 'MISSING'
  results.CLOUDFLARE_R2_SECRET_KEY = process.env.CLOUDFLARE_R2_SECRET_KEY ? 'SET' : 'MISSING'
  results.CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY ? 'SET' : 'MISSING'
  results.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'SET' : 'MISSING'

  // DB connection
  try {
    await prisma.$queryRaw`SELECT 1`
    results.DB_CONNECTION = 'OK'
  } catch (e) {
    results.DB_CONNECTION = 'FAILED: ' + (e instanceof Error ? e.message : String(e))
  }

  // Clerk auth check
  try {
    const { userId } = await auth()
    results.CLERK_AUTH = userId ? `OK - userId: ${userId}` : 'NOT LOGGED IN'
  } catch (e) {
    results.CLERK_AUTH = 'FAILED: ' + (e instanceof Error ? e.message : String(e))
  }

  // DB user lookup (only if logged in)
  try {
    const { userId } = await auth()
    if (userId) {
      const user = await prisma.user.findUnique({ where: { clerkId: userId } })
      results.USER_IN_DB = user ? `FOUND - plan: ${user.plan}` : 'NOT FOUND (webhook issue)'
    } else {
      results.USER_IN_DB = 'SKIPPED (not logged in)'
    }
  } catch (e) {
    results.USER_IN_DB = 'FAILED: ' + (e instanceof Error ? e.message : String(e))
  }

  // R2 connection test
  try {
    const client = new S3Client({
      region: 'auto',
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY!,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY!,
      },
    })
    await client.send(new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET,
      Key: '_debug_test.txt',
      Body: Buffer.from('test'),
      ContentType: 'text/plain',
    }))
    results.R2_UPLOAD = 'OK'
  } catch (e) {
    results.R2_UPLOAD = 'FAILED: ' + (e instanceof Error ? e.message : String(e))
  }

  return NextResponse.json(results)
}
