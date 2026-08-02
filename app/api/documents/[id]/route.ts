import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(_req: NextRequest) {
  return NextResponse.json({ error: 'Document deletion is disabled' }, { status: 403 })
}
