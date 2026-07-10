'use client'

import { useState } from 'react'
import { FileText, Lock, TrendingUp, FileCheck, AlertTriangle, Download, Loader2, Calendar } from 'lucide-react'
import { UpgradeModal } from '@/components/UpgradeModal'

// ── Date helpers ────────────────────────────────────────────────────────────
function fmt(d: Date) {
  return d.toISOString().slice(0, 10) // "YYYY-MM-DD"
}

function startOfWeek(d: Date) {
  const day = d.getDay() // 0=Sun
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Mon
  return new Date(d.getFullYear(), d.getMonth(), diff)
}

function prettyRange(start: Date, end: Date) {
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  return `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', opts)}`
}

function getPresets() {
  const now  = new Date()
  const y    = now.getFullYear()
  const m    = now.getMonth()
  const d    = now.getDate()

  const thisWeekStart = startOfWeek(now)
  const thisWeekEnd   = new Date(thisWeekStart); thisWeekEnd.setDate(thisWeekStart.getDate() + 6)

  const lastWeekStart = new Date(thisWeekStart); lastWeekStart.setDate(thisWeekStart.getDate() - 7)
  const lastWeekEnd   = new Date(thisWeekStart); lastWeekEnd.setDate(thisWeekStart.getDate() - 1)

  const thisMonthStart = new Date(y, m, 1)
  const thisMonthEnd   = new Date(y, m + 1, 0)

  const lastMonthStart = new Date(y, m - 1, 1)
  const lastMonthEnd   = new Date(y, m, 0)

  const last3Start = new Date(y, m - 2, 1)
  const last3End   = new Date(y, m + 1, 0)

  const last6Start = new Date(y, m - 5, 1)
  const last6End   = new Date(y, m + 1, 0)

  const thisYearStart = new Date(y, 0, 1)
  const today = new Date(y, m, d)

  return [
    { key: 'this-week',   label: 'This Week',      start: thisWeekStart,  end: thisWeekEnd  },
    { key: 'last-week',   label: 'Last Week',      start: lastWeekStart,  end: lastWeekEnd  },
    { key: 'this-month',  label: 'This Month',     start: thisMonthStart, end: thisMonthEnd },
    { key: 'last-month',  label: 'Last Month',     start: lastMonthStart, end: lastMonthEnd },
    { key: 'last-3',      label: 'Last 3 Months',  start: last3Start,     end: last3End     },
    { key: 'last-6',      label: 'Last 6 Months',  start: last6Start,     end: last6End     },
    { key: 'this-year',   label: 'This Year',      start: thisYearStart,  end: today        },
  ]
}

// ── Component ───────────────────────────────────────────────────────────────
interface Props {
  plan: string
  totalDocs: number
  doneDocs: number
  anomalyDocs: number
}

export function ReportsClient({ plan, totalDocs, doneDocs, anomalyDocs }: Props) {
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [loading, setLoading]         = useState(false)
  const [selectedKey, setSelectedKey] = useState<string>('this-month')
  const [customStart, setCustomStart] = useState('')
  const [customEnd,   setCustomEnd]   = useState('')
  const [error, setError]             = useState<string | null>(null)

  const isLocked  = plan === 'free'
  const presets   = getPresets()
  const isCustom  = selectedKey === 'custom'

  function getRange(): { startDate: string; endDate: string; label: string } | null {
    if (isCustom) {
      if (!customStart || !customEnd) return null
      if (customEnd < customStart) return null
      const s = new Date(customStart)
      const e = new Date(customEnd)
      return { startDate: customStart, endDate: customEnd, label: prettyRange(s, e) }
    }
    const p = presets.find((x) => x.key === selectedKey)
    if (!p) return null
    return { startDate: fmt(p.start), endDate: fmt(p.end), label: p.label }
  }

  async function downloadReport() {
    if (isLocked) { setShowUpgrade(true); return }
    const range = getRange()
    if (!range) { setError('Please select a valid date range'); return }
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/reports/monthly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(range),
      })
      if (!res.ok) {
        const err = await res.json()
        setError(err.error ?? 'Failed to generate report')
        return
      }
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `datafyle-report.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('Failed to generate report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const range      = getRange()
  const rangeLabel = range?.label ?? (isCustom ? 'Select dates above' : '')

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <FileText size={22} className="text-[#2563EB]" />
          <h1 className="text-2xl font-bold text-[#1E293B]">Reports</h1>
          {isLocked && (
            <span className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-700">
              <Lock size={11} /> Starter+
            </span>
          )}
        </div>
        <p className="text-slate-500 text-sm">
          Download a PDF report for any time period — weekly, monthly, or custom.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Documents',        value: totalDocs,   icon: FileText,      color: 'text-[#2563EB]', bg: 'bg-[#EFF6FF]' },
          { label: 'Successfully Processed', value: doneDocs,    icon: FileCheck,     color: 'text-[#22C55E]', bg: 'bg-green-50'  },
          { label: 'Anomalies Detected',     value: anomalyDocs, icon: AlertTriangle, color: 'text-[#F59E0B]', bg: 'bg-amber-50'  },
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

      {/* Report builder */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center gap-2">
          <TrendingUp size={16} className="text-[#2563EB]" />
          <h2 className="font-semibold text-[#1E293B] text-sm">Generate Report</h2>
        </div>

        <div className="p-5 space-y-5">
          {/* Quick presets */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Quick Presets</p>
            <div className="flex flex-wrap gap-2">
              {presets.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSelectedKey(key)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${
                    selectedKey === key
                      ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-sm'
                      : 'bg-white text-slate-600 border-[#E2E8F0] hover:border-[#2563EB] hover:text-[#2563EB]'
                  }`}
                >
                  {label}
                </button>
              ))}
              <button
                onClick={() => setSelectedKey('custom')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${
                  isCustom
                    ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-sm'
                    : 'bg-white text-slate-600 border-[#E2E8F0] hover:border-[#2563EB] hover:text-[#2563EB]'
                }`}
              >
                Custom Range
              </button>
            </div>
          </div>

          {/* Custom date inputs */}
          {isCustom && (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1.5">From</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] text-[#1E293B]"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1.5">To</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="date"
                    value={customEnd}
                    min={customStart}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 text-sm border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] text-[#1E293B]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Selected range label */}
          {rangeLabel && (
            <div className="flex items-center gap-2 px-3 py-2 bg-[#EFF6FF] rounded-lg border border-blue-100">
              <Calendar size={13} className="text-[#2563EB] shrink-0" />
              <span className="text-sm text-[#2563EB] font-medium">{rangeLabel}</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}

          {/* Download button */}
          <button
            onClick={downloadReport}
            disabled={loading || (isCustom && (!customStart || !customEnd))}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Generating PDF…</>
            ) : (
              <><Download size={16} /> Download PDF Report</>
            )}
          </button>
          {isLocked && (
            <p className="text-xs text-slate-400 mt-1">Starter plan or higher required to download reports.</p>
          )}
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgrade}
        feature="Reports"
        requiredPlan="starter"
        onClose={() => setShowUpgrade(false)}
      />
    </div>
  )
}
