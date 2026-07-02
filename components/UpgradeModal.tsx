'use client'

import { Lock, ArrowRight, X } from 'lucide-react'
import Link from 'next/link'
import { PLAN_NAMES } from '@/lib/plans'

interface Props {
  isOpen: boolean
  onClose: () => void
  feature: string
  requiredPlan: string
}

export function UpgradeModal({ isOpen, onClose, feature, requiredPlan }: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="w-12 h-12 bg-[#EFF6FF] rounded-xl flex items-center justify-center mb-4">
          <Lock size={22} className="text-[#2563EB]" />
        </div>

        <h2 className="text-base font-bold text-[#1E293B] mb-1.5">{feature} requires an upgrade</h2>
        <p className="text-sm text-slate-500 mb-5">
          Upgrade to{' '}
          <strong className="text-[#1E293B]">{PLAN_NAMES[requiredPlan] ?? requiredPlan}</strong>{' '}
          or higher to unlock this feature.
        </p>

        <Link
          href="/pricing"
          onClick={onClose}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Upgrade Now
          <ArrowRight size={15} />
        </Link>
        <button
          onClick={onClose}
          className="mt-2.5 w-full py-2 text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}
