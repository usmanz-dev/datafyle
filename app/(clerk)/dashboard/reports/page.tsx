import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ReportsClient } from './ReportsClient'

export default async function ReportsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) redirect('/sign-in')

  const totalDocs = await prisma.document.count({ where: { userId: user.id } })

  const doneDocs = await prisma.document.count({
    where: { userId: user.id, status: 'done' },
  })

  const anomalyResult = await prisma.$queryRaw<[{ count: bigint }]>`
    SELECT COUNT(*) as count FROM "Document"
    WHERE "userId" = ${user.id} AND "anomalyData" IS NOT NULL
  `
  const anomalyDocs = Number(anomalyResult[0]?.count ?? 0)

  return (
    <ReportsClient
      plan={user.plan}
      totalDocs={totalDocs}
      doneDocs={doneDocs}
      anomalyDocs={anomalyDocs}
    />
  )
}
