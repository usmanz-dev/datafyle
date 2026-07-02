'use client'

import { useState, useRef, useEffect } from 'react'
import { FileDown, ChevronDown, Loader2 } from 'lucide-react'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function getRecentMonths(count = 4) {
  const months = []
  const now = new Date()
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({ month: d.getMonth() + 1, year: d.getFullYear() })
  }
  return months
}

interface ReportButtonProps {
  onLocked?: () => void
}

export function ReportButton({ onLocked }: ReportButtonProps = {}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function downloadReport(month: number, year: number) {
    const key = `${year}-${month}`
    setLoading(key)
    setOpen(false)
    try {
      const res = await fetch('/api/reports/monthly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month, year }),
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error ?? 'Failed to generate report')
        return
      }
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `datafyle-${year}-${String(month).padStart(2, '0')}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Failed to generate report. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  const months = getRecentMonths(4)
  const isLoading = loading !== null

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { if (onLocked) { onLocked(); return } if (!isLoading) setOpen((o) => !o) }}
        disabled={isLoading}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#1E293B] hover:bg-[#F8FAFC] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin text-[#2563EB]" />
        ) : (
          <FileDown size={16} className="text-[#2563EB]" />
        )}
        {isLoading ? 'Generating PDF...' : 'Monthly Report'}
        {!isLoading && <ChevronDown size={14} className="text-slate-400" />}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E2E8F0] rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="px-3 py-2 bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <p className="text-xs font-medium text-slate-500">Select month</p>
          </div>
          {months.map(({ month, year }) => (
            <button
              key={`${year}-${month}`}
              onClick={() => downloadReport(month, year)}
              className="w-full text-left px-4 py-2.5 text-sm text-[#1E293B] hover:bg-[#F8FAFC] transition-colors flex items-center justify-between"
            >
              <span>{MONTH_NAMES[month - 1]} {year}</span>
              <FileDown size={14} className="text-slate-400" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
