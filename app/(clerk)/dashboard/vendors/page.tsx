import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { VendorsClient } from './VendorsClient'
import { Lock } from 'lucide-react'

const PRO_PLANS = ['professional', 'business', 'enterprise']

export default async function VendorsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) redirect('/sign-in')

  if (!PRO_PLANS.includes(user.plan)) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-md mx-auto mt-20 text-center">
          <div className="bg-[#EFF6FF] rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Lock size={36} className="text-[#2563EB]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1E293B] mb-3">Professional Feature</h2>
          <p className="text-slate-500 mb-6 leading-relaxed">
            Vendor Intelligence shows spending patterns, amount trends, and anomaly history across all your vendors.
            Available on Professional, Business, and Enterprise plans.
          </p>
          <a
            href="/pricing"
            className="inline-block bg-[#2563EB] text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Upgrade to Professional
          </a>
          <p className="text-xs text-slate-400 mt-3">Current plan: {user.plan}</p>
        </div>
      </div>
    )
  }

  const vendors = await prisma.vendorPattern.findMany({
    where: { userId: user.id },
    orderBy: { invoiceCount: 'desc' },
  })

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1E293B]">Vendor Intelligence</h1>
          <p className="text-slate-500 mt-1">
            {vendors.length} vendor{vendors.length !== 1 ? 's' : ''} tracked — click any row to see trends and history
          </p>
        </div>
        <VendorsClient vendors={vendors.map(v => ({
          ...v,
          lastSeen: v.lastSeen.toISOString(),
        }))} />
      </div>
    </div>
  )
}
