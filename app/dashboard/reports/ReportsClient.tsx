'use client'

import { FileText, Lock, TrendingUp, FileCheck, AlertTriangle } from 'lucide-react'
import { ReportButton } from '@/components/ReportButton'
import { UpgradeModal } from '@/components/UpgradeModal'
import { useState } from 'react'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function getRecentMonths(count = 6) {
  const months = []
  const now = new Date()
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({ month: d.getMonth() + 1, year: d.getFullYear(), label: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}` })
  }
  return months
}

interface Props {
  plan: string
  totalDocs: number
  doneDocs: number
  anomalyDocs: number
}

export function ReportsClient({ plan, totalDocs, doneDocs, anomalyDocs }: Props) {
  const [showUpgrade, setShowUpgrade] = useState(false)
  const isLocked = plan === 'free'
  const months = getRecentMonths(6)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <FileText size={22} className="text-[#2563EB]" />
          <h1 className="text-2xl font-bold text-[#1E293B]">Monthly Reports</h1>
          {isLocked && (
            <span className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-700">
              <Lock size={11} /> Starter+
            </span>
          )}
        </div>
        <p className="text-slate-500 text-sm">
          Download a full PDF summary of your document processing activity for any month.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Documents', value: totalDocs, icon: FileText, color: 'text-[#2563EB]', bg: 'bg-[#EFF6FF]' },
          { label: 'Successfully Processed', value: doneDocs, icon: FileCheck, color: 'text-[#22C55E]', bg: 'bg-green-50' },
          { label: 'Anomalies Detected', value: anomalyDocs, icon: AlertTriangle, color: 'text-[#F59E0B]', bg: 'bg-amber-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-2xl font-bold text-[#1E293B]">{value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Monthly report cards */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[#2563EB]" />
            <h2 className="font-semibold text-[#1E293B] text-sm">Available Reports</h2>
          </div>
          {!isLocked && <ReportButton />}
        </div>

        <div className="divide-y divide-[#E2E8F0]">
          {months.map(({ month, year, label }) => (
            <div key={`${year}-${month}`} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center">
                  <FileText size={15} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1E293B]">{label}</p>
                  <p className="text-xs text-slate-400">Monthly activity report</p>
                </div>
              </div>

              {isLocked ? (
                <button
                  onClick={() => setShowUpgrade(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium text-slate-500 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-colors"
                >
                  <Lock size={12} /> Upgrade to Download
                </button>
              ) : (
                <ReportButton />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade modal */}
      <UpgradeModal
        isOpen={showUpgrade}
        feature="Monthly Reports"
        requiredPlan="starter"
        onClose={() => setShowUpgrade(false)}
      />
    </div>
  )
}
