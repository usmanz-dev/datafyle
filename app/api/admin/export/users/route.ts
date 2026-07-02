import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

function escapeCSV(value: string | null | undefined): string {
  if (value == null) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function fmtDate(date: Date | null): string {
  if (!date) return ''
  return date.toISOString().slice(0, 10)
}

export async function GET(req: NextRequest) {
  try {
    // Admin check
    const clerk = await currentUser()
    const email = clerk?.emailAddresses?.[0]?.emailAddress ?? ''
    if (!email || email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const filter = req.nextUrl.searchParams.get('filter') ?? 'all'

    let whereClause = {}
    if (filter === 'paid') {
      whereClause = {
        plan: { not: 'free' },
        subscription: { status: 'active' },
      }
    } else if (filter === 'cancelled') {
      whereClause = { cancelledAt: { not: null } }
    } else if (filter === 'free') {
      whereClause = { plan: 'free' }
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      select: {
        email: true,
        name: true,
        plan: true,
        createdAt: true,
        paidAt: true,
        cancelledAt: true,
        previousPlan: true,
        docsUsed: true,
        totalDocsProcessed: true,
      },
    })

    const headers = [
      'email', 'name', 'plan', 'signupDate', 'paidDate',
      'cancelledDate', 'previousPlan', 'docsUsed', 'totalDocsProcessed',
    ]

    const rows = users.map((u) => [
      escapeCSV(u.email),
      escapeCSV(u.name),
      escapeCSV(u.plan),
      escapeCSV(fmtDate(u.createdAt)),
      escapeCSV(fmtDate(u.paidAt)),
      escapeCSV(fmtDate(u.cancelledAt)),
      escapeCSV(u.previousPlan),
      String(u.docsUsed),
      String(u.totalDocsProcessed),
    ])

    const csv = [
      headers.join(','),
      ...rows.map((r) => r.join(',')),
    ].join('\n')

    const today = new Date().toISOString().slice(0, 10)

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="datafyle-users-${filter}-${today}.csv"`,
      },
    })
  } catch (error) {
    console.error('CSV export error:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
