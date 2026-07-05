'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams, useRouter as useNextRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  FileText, FileSpreadsheet, FileCode2, Image as ImageIcon, File,
  AlertTriangle, Trash2, Eye, Search, Loader2,
  TrendingUp, FileCheck, Zap, BarChart3, ChevronLeft, ChevronRight,
  CheckSquare, Square, Download, Users, Activity, ShieldCheck,
  CloudUpload,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie,
} from 'recharts'
import { UploadZone } from '@/components/UploadZone'
import { ReportButton } from '@/components/ReportButton'
import { DocumentDetail, type DocRow } from '@/components/DocumentDetail'
import { UpgradeModal } from '@/components/UpgradeModal'
import { hasFeature, PLAN_NAMES } from '@/lib/plans'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExtractedData {
  vendor?: { value?: string | null; confidence?: number }
  totalAmount?: { value?: number | null; confidence?: number }
  currency?: { value?: string | null; confidence?: number }
  [key: string]: unknown
}

interface AnomalyData {
  isAnomaly: boolean
  severity: 'CRITICAL' | 'HIGH' | 'LOW' | null
}

interface Props {
  firstName: string | null
  user: {
    id: string
    plan: string
    docsUsed: number
    docsLimit: number
    totalDocsProcessed: number
  }
  initialStats: {
    thisMonthCount: number
    anomaliesCount: number
    fieldsExtracted: number
  }
  initialDocuments: DocRow[]
  isTeamAdmin: boolean
  teamMembers: { userId: string; name: string }[]
  currentUserId: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fileIcon(type: string) {
  switch (type) {
    case 'pdf':               return { Icon: FileText,        color: 'text-red-500' }
    case 'docx': case 'doc':  return { Icon: FileText,        color: 'text-blue-500' }
    case 'xlsx': case 'xls':  return { Icon: FileSpreadsheet, color: 'text-green-600' }
    case 'csv':               return { Icon: FileSpreadsheet, color: 'text-emerald-500' }
    case 'txt':               return { Icon: FileText,        color: 'text-slate-400' }
    case 'xml':               return { Icon: FileCode2,       color: 'text-orange-500' }
    case 'jpg': case 'jpeg': case 'png': return { Icon: ImageIcon, color: 'text-purple-500' }
    default:                  return { Icon: File,            color: 'text-slate-400' }
  }
}

function typeBadge(type: string) {
  const map: Record<string, string> = {
    pdf:  'bg-red-50 text-red-600',
    docx: 'bg-blue-50 text-blue-600',
    doc:  'bg-blue-50 text-blue-600',
    xlsx: 'bg-green-50 text-green-700',
    xls:  'bg-green-50 text-green-700',
    csv:  'bg-emerald-50 text-emerald-700',
    txt:  'bg-slate-50 text-slate-500',
    xml:  'bg-orange-50 text-orange-600',
    jpg:  'bg-purple-50 text-purple-600',
    jpeg: 'bg-purple-50 text-purple-600',
    png:  'bg-purple-50 text-purple-600',
  }
  return map[type] ?? 'bg-slate-50 text-slate-500'
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const PAGE_SIZE = 20

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardClient({ firstName, user, initialStats, initialDocuments, isTeamAdmin, teamMembers, currentUserId }: Props) {
  const [docs, setDocs] = useState<DocRow[]>(initialDocuments)
  const [search, setSearch] = useState('')
  const [memberFilter, setMemberFilter] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [viewDoc, setViewDoc] = useState<DocRow | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [greeting, setGreeting] = useState('Good morning')
  const [exporting, setExporting] = useState(false)
  const [sheetsExporting, setSheetsExporting] = useState(false)
  const [upgradeModal, setUpgradeModal] = useState<{ feature: string; requiredPlan: string } | null>(null)

  const searchParams = useSearchParams()
  const nextRouter   = useNextRouter()

  // Show success toast after Paddle checkout redirect
  useEffect(() => {
    if (searchParams.get('success') !== '1') return
    const plan = searchParams.get('plan') ?? ''
    const planLabel = PLAN_NAMES[plan] ?? 'Paid'
    toast.success(`Welcome to Datafyle ${planLabel}!`, {
      description: 'Your subscription is now active. Start uploading documents.',
      duration: 6000,
    })
    const url = new URL(window.location.href)
    url.searchParams.delete('success')
    url.searchParams.delete('plan')
    nextRouter.replace(url.pathname + (url.search || ''))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening')
  }, [])

  const fetchDocs = useCallback(async () => {
    const res = await fetch('/api/documents')
    if (res.ok) {
      const data = await res.json()
      setDocs(data.documents)
    }
  }, [])

  // Poll while any doc is pending/processing
  useEffect(() => {
    const hasPending = docs.some((d) => d.status === 'pending' || d.status === 'processing')
    if (!hasPending) return
    const id = setInterval(fetchDocs, 3000)
    return () => clearInterval(id)
  }, [docs, fetchDocs])

  // ── Usage ──────────────────────────────────────────────────────────────────
  const usagePct = user.docsLimit > 0 ? Math.round((user.docsUsed / user.docsLimit) * 100) : 0
  const barColor = usagePct >= 90 ? '#EF4444' : usagePct >= 75 ? '#F59E0B' : '#2563EB'
  const atLimit  = usagePct >= 100

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = [
    {
      label: 'Total Processed',
      value: user.totalDocsProcessed.toLocaleString(),
      sub: 'all time',
      icon: FileCheck,
      accent: '#2563EB',
      bg: 'bg-[#EFF6FF]',
    },
    {
      label: 'This Month',
      value: initialStats.thisMonthCount.toLocaleString(),
      sub: 'documents',
      icon: TrendingUp,
      accent: '#2563EB',
      bg: 'bg-[#EFF6FF]',
    },
    {
      label: 'Fields Extracted',
      value: initialStats.fieldsExtracted.toLocaleString(),
      sub: 'data points',
      icon: Zap,
      accent: '#22C55E',
      bg: 'bg-green-50',
    },
    {
      label: 'Anomalies',
      value: initialStats.anomaliesCount.toLocaleString(),
      sub: initialStats.anomaliesCount === 0 ? 'all clear' : 'detected',
      icon: AlertTriangle,
      accent: initialStats.anomaliesCount > 0 ? '#EF4444' : '#22C55E',
      bg: initialStats.anomaliesCount > 0 ? 'bg-red-50' : 'bg-green-50',
    },
  ]

  // ── Chart data ─────────────────────────────────────────────────────────────
  const weeklyData = useMemo(() => {
    const days: { day: string; docs: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const label   = d.toLocaleDateString('en-US', { weekday: 'short' })
      const dateStr = d.toISOString().slice(0, 10)
      const count   = initialDocuments.filter(
        (doc) => doc.createdAt.slice(0, 10) === dateStr && doc.status === 'done'
      ).length
      days.push({ day: label, docs: count })
    }
    return days
  }, [initialDocuments])

  const typeData = useMemo(() => {
    const counts: Record<string, number> = {}
    initialDocuments.forEach((doc) => {
      const t = doc.fileType.toUpperCase()
      counts[t] = (counts[t] ?? 0) + 1
    })
    const colors = ['#2563EB', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value], i) => ({ name, value, color: colors[i] }))
  }, [initialDocuments])

  const successRate = useMemo(() => {
    if (initialDocuments.length === 0) return 100
    const done = initialDocuments.filter((d) => d.status === 'done').length
    return Math.round((done / initialDocuments.length) * 100)
  }, [initialDocuments])

  // ── Search / filter ────────────────────────────────────────────────────────
  const filtered = docs.filter((d) => {
    if (memberFilter && d.userId !== memberFilter) return false
    if (!search) return true
    const q = search.toLowerCase()
    const vendor = (d.extractedData as ExtractedData | null)?.vendor?.value?.toLowerCase() ?? ''
    return d.fileName.toLowerCase().includes(q) || vendor.includes(q)
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageDocs   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function onSearchChange(val: string)       { setSearch(val);       setPage(1); setSelected(new Set()) }
  function onMemberFilterChange(val: string) { setMemberFilter(val || null); setPage(1); setSelected(new Set()) }

  const filterOptions = isTeamAdmin
    ? [
        { userId: currentUserId, name: 'My Documents' },
        ...teamMembers.filter((m) => m.userId !== currentUserId),
      ]
    : []

  // ── Selection ──────────────────────────────────────────────────────────────
  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (selected.size === pageDocs.length && pageDocs.length > 0) setSelected(new Set())
    else setSelected(new Set(pageDocs.map((d) => d.id)))
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  async function deleteDoc(id: string) {
    if (!confirm('Delete this document?')) return
    setDeleting(id)
    try {
      await fetch(`/api/documents/${id}`, { method: 'DELETE' })
      setDocs((prev) => prev.filter((d) => d.id !== id))
      setSelected((prev) => { const n = new Set(prev); n.delete(id); return n })
    } finally {
      setDeleting(null)
    }
  }

  // ── Export ─────────────────────────────────────────────────────────────────
  async function downloadExcel(ids: string[], filename = 'datafyle-export.xlsx') {
    const res = await fetch('/api/export/excel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentIds: ids }),
    })
    if (!res.ok) throw new Error('Export failed')
    const blob = await res.blob()
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  function buildFilename(ids: string[]) {
    const date = new Date().toISOString().slice(0, 10)
    if (ids.length === 1) {
      const doc  = docs.find((d) => d.id === ids[0])
      const base = doc ? doc.fileName.replace(/\.[^.]+$/, '') : 'document'
      return `${base}-extracted.xlsx`
    }
    return `datafyle-export-${date}.xlsx`
  }

  async function exportSelected() {
    setExporting(true)
    try { await downloadExcel([...selected], buildFilename([...selected])) }
    catch { alert('Export failed. Please try again.') }
    finally { setExporting(false) }
  }

  async function exportAll() {
    setExporting(true)
    try { await downloadExcel(docs.map((d) => d.id), buildFilename(docs.map((d) => d.id))) }
    catch { alert('Export failed. Please try again.') }
    finally { setExporting(false) }
  }

  async function exportSheets() {
    setSheetsExporting(true)
    try {
      const ids = selected.size > 0 ? [...selected] : docs.map((d) => d.id)
      const res = await fetch('/api/export/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentIds: ids }),
      })
      const data = await res.json()
      if (!res.ok) { alert(data.error ?? 'Google Sheets export failed'); return }
      window.open(data.spreadsheetUrl, '_blank')
    } catch {
      alert('Google Sheets export failed. Please try again.')
    } finally {
      setSheetsExporting(false)
    }
  }

  function handleDocumentDeleted(id: string) {
    setDocs((prev) => prev.filter((d) => d.id !== id))
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n })
    setViewDoc(null)
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#1E293B]">
              {greeting}{firstName ? `, ${firstName}` : ''}!
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">Here&apos;s your document processing overview.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Usage pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] shadow-sm">
              <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${Math.min(usagePct, 100)}%`, backgroundColor: barColor }}
                />
              </div>
              <span className="text-xs font-semibold" style={{ color: barColor }}>{usagePct}%</span>
              <span className="text-xs text-slate-400">{user.docsUsed}/{user.docsLimit}</span>
            </div>
            <ReportButton
              onLocked={!hasFeature(user.plan, 'monthly_report')
                ? () => setUpgradeModal({ feature: 'Monthly PDF Report', requiredPlan: 'starter' })
                : undefined}
            />
          </div>
        </div>

        {/* ── 1. Stats cards ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, sub, icon: Icon, accent, bg }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon size={18} style={{ color: accent }} />
                </div>
                <span className="text-xs text-slate-300 font-medium group-hover:text-slate-400 transition-colors">&mdash;</span>
              </div>
              <p className="text-2xl font-bold text-[#1E293B] tabular-nums">{value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
              <p className="text-[11px] text-slate-300 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* ── 2. Upload zone ───────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                <CloudUpload size={14} className="text-[#2563EB]" />
              </div>
              <h2 className="text-sm font-semibold text-[#1E293B]">Upload Documents</h2>
            </div>
            <span className="text-xs text-slate-400">PDF · Word · Excel · CSV · Images · XML · TXT</span>
          </div>
          <div className="p-5">
            <UploadZone
              atLimit={atLimit}
              onUploadComplete={() => fetchDocs()}
              onUpgradePlan={() =>
                setUpgradeModal({
                  feature: 'Document uploads',
                  requiredPlan: user.plan === 'free' ? 'starter' : user.plan,
                })
              }
            />
          </div>
        </div>

        {/* ── 3. Charts row ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Weekly activity bar chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                <Activity size={14} className="text-[#2563EB]" />
              </div>
              <h2 className="text-sm font-semibold text-[#1E293B]">Weekly Activity</h2>
              <span className="ml-auto text-xs text-slate-400">Docs processed per day</span>
            </div>
            {weeklyData.some((d) => d.docs > 0) ? (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={weeklyData} barSize={28}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis hide allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: '#EFF6FF' }}
                    contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12 }}
                    formatter={(v) => [Number(v ?? 0), 'Documents']}
                  />
                  <Bar dataKey="docs" fill="#2563EB" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-44 flex flex-col items-center justify-center text-slate-400 gap-2">
                <BarChart3 size={32} className="text-slate-200" />
                <p className="text-sm">Upload documents to see activity</p>
              </div>
            )}
          </div>

          {/* Right column: success rate + usage + doc types */}
          <div className="flex flex-col gap-4">

            {/* Success rate */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
                  <ShieldCheck size={14} className="text-[#22C55E]" />
                </div>
                <h2 className="text-sm font-semibold text-[#1E293B]">Success Rate</h2>
              </div>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-3xl font-bold text-[#1E293B]">{successRate}%</span>
                <span className="text-xs text-slate-400 mb-1">successful</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${successRate}%`,
                    backgroundColor: successRate >= 90 ? '#22C55E' : successRate >= 70 ? '#F59E0B' : '#EF4444',
                  }}
                />
              </div>
            </div>

            {/* Monthly usage */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-[#1E293B]">Monthly Usage</h2>
                <span className="text-xs font-bold" style={{ color: barColor }}>{usagePct}%</span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-xl font-bold text-[#1E293B]">{user.docsUsed.toLocaleString()}</span>
                <span className="text-xs text-slate-400">/ {user.docsLimit.toLocaleString()} docs</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(usagePct, 100)}%`, backgroundColor: barColor }}
                />
              </div>
              {usagePct > 80 && (
                <a href="/pricing" className="mt-2 inline-block text-xs text-[#2563EB] font-medium hover:underline">
                  Upgrade Plan →
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Document types donut */}
        {typeData.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                <FileText size={14} className="text-[#2563EB]" />
              </div>
              <h2 className="text-sm font-semibold text-[#1E293B]">Document Types</h2>
              <span className="ml-auto text-xs text-slate-400">{initialDocuments.length} total</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={typeData.map((d) => ({ ...d, fill: d.color }))}
                    cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                    paddingAngle={3} dataKey="value"
                  />
                  <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2.5">
                {typeData.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-sm text-slate-600 flex-1">{name}</span>
                    <span className="text-sm font-semibold text-[#1E293B] tabular-nums">{value}</span>
                    <span className="text-xs text-slate-300 w-10 text-right">
                      {Math.round((value / initialDocuments.length) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 4. Documents table ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center">
                <FileText size={14} className="text-slate-500" />
              </div>
              <h2 className="text-sm font-semibold text-[#1E293B]">Documents</h2>
            </div>
            <div className="relative flex-1 max-w-xs sm:ml-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by filename or vendor…"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] min-h-10"
              />
            </div>
            {isTeamAdmin && filterOptions.length > 1 && (
              <div className="relative">
                <Users size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select
                  value={memberFilter ?? ''}
                  onChange={(e) => onMemberFilterChange(e.target.value)}
                  className="pl-8 pr-8 py-2 text-sm border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] min-h-10 appearance-none cursor-pointer"
                >
                  <option value="">All Members</option>
                  {filterOptions.map((m) => (
                    <option key={m.userId} value={m.userId}>{m.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex items-center gap-2 ml-auto flex-wrap">
              <span className="text-xs text-slate-400 hidden sm:inline">
                {filtered.length} doc{filtered.length !== 1 ? 's' : ''}
              </span>
              {selected.size > 0 ? (
                <button
                  onClick={exportSelected}
                  disabled={exporting}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#2563EB] text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 min-h-10"
                >
                  {exporting ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                  Export {selected.size}
                </button>
              ) : (
                <button
                  onClick={exportAll}
                  disabled={exporting || docs.length === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white border border-[#E2E8F0] text-[#1E293B] rounded-xl hover:bg-[#F8FAFC] transition-colors disabled:opacity-50 shadow-sm min-h-10"
                >
                  {exporting ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} className="text-[#2563EB]" />}
                  Export All
                </button>
              )}
              <button
                onClick={() => {
                  if (!hasFeature(user.plan, 'google_sheets')) {
                    setUpgradeModal({ feature: 'Google Sheets Export', requiredPlan: 'professional' })
                    return
                  }
                  exportSheets()
                }}
                disabled={sheetsExporting || docs.length === 0}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white border border-[#E2E8F0] text-[#1E293B] rounded-xl hover:bg-[#F8FAFC] transition-colors disabled:opacity-50 shadow-sm min-h-10"
              >
                {sheetsExporting ? (
                  <Loader2 size={13} className="animate-spin text-green-600" />
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="shrink-0">
                    <rect width="24" height="24" rx="4" fill="#34A853" />
                    <path d="M5 7h14M5 12h14M5 17h14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
                {selected.size > 0 ? `Sheets (${selected.size})` : 'Google Sheets'}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="px-5 py-3 w-10">
                    <button onClick={toggleAll} className="text-slate-400 hover:text-slate-600 transition-colors">
                      {selected.size === pageDocs.length && pageDocs.length > 0
                        ? <CheckSquare size={16} className="text-[#2563EB]" />
                        : <Square size={16} />}
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">File</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Vendor</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 w-8 hidden md:table-cell" />
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">By</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Date</th>
                  <th className="px-4 py-3 w-20" />
                </tr>
              </thead>
              <tbody>
                {pageDocs.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center">
                          <FileText size={28} className="text-slate-200" />
                        </div>
                        <p className="text-sm text-slate-400 font-medium">
                          {search ? 'No documents match your search' : 'No documents yet — upload one above'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pageDocs.map((doc) => {
                    const data    = doc.extractedData as ExtractedData | null
                    const anomaly = doc.anomalyData as AnomalyData | null
                    const { Icon, color } = fileIcon(doc.fileType)
                    const vendor   = data?.vendor?.value ?? '—'
                    const amount   = data?.totalAmount?.value
                    const currency = data?.currency?.value ?? ''
                    const isSelected = selected.has(doc.id)

                    return (
                      <tr
                        key={doc.id}
                        className={`border-b border-[#E2E8F0] last:border-0 transition-colors ${
                          isSelected ? 'bg-[#EFF6FF]' : 'hover:bg-[#F8FAFC]'
                        }`}
                      >
                        <td className="px-5 py-3.5">
                          <button onClick={() => toggleSelect(doc.id)} className="text-slate-400 hover:text-slate-600 transition-colors">
                            {isSelected
                              ? <CheckSquare size={16} className="text-[#2563EB]" />
                              : <Square size={16} />}
                          </button>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <Icon size={16} className={`shrink-0 ${color}`} />
                            <span className="text-[#1E293B] font-medium truncate max-w-40" title={doc.fileName}>
                              {doc.fileName.length > 30 ? doc.fileName.slice(0, 27) + '…' : doc.fileName}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 pl-6">{formatBytes(doc.fileSize)}</p>
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide ${typeBadge(doc.fileType)}`}>
                            {doc.fileType}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-[#1E293B] max-w-32 truncate hidden md:table-cell" title={vendor !== '—' ? vendor : undefined}>
                          {vendor}
                        </td>
                        <td className="px-4 py-3.5 text-right text-[#1E293B] font-semibold tabular-nums hidden md:table-cell">
                          {amount != null
                            ? `${currency ? currency + ' ' : ''}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            : '—'}
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={doc.status} />
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          {anomaly?.isAnomaly && (
                            <span title={anomaly.severity ?? 'Anomaly detected'}>
                              <AlertTriangle
                                size={15}
                                className={
                                  anomaly.severity === 'CRITICAL' ? 'text-red-500' :
                                  anomaly.severity === 'HIGH' ? 'text-orange-500' : 'text-yellow-500'
                                }
                              />
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-slate-400 text-xs max-w-24 truncate hidden md:table-cell">
                          {doc.uploadedByName ?? 'You'}
                        </td>
                        <td className="px-4 py-3.5 text-slate-400 text-xs whitespace-nowrap hidden md:table-cell">
                          {formatDate(doc.createdAt)}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setViewDoc(doc)}
                              disabled={doc.status !== 'done'}
                              className="p-2 rounded-lg hover:bg-[#EFF6FF] text-slate-300 hover:text-[#2563EB] transition-colors disabled:cursor-not-allowed"
                              title="View extracted data"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => deleteDoc(doc.id)}
                              disabled={deleting === doc.id}
                              className="p-2 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-colors"
                              title="Delete"
                            >
                              {deleting === doc.id
                                ? <Loader2 size={15} className="animate-spin" />
                                : <Trash2 size={15} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
              <p className="text-xs text-slate-500">
                Page {page} of {totalPages} · {filtered.length} documents
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg hover:bg-white disabled:opacity-40 text-slate-500 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 text-xs rounded-lg font-medium transition-colors ${
                      page === p ? 'bg-[#2563EB] text-white' : 'text-slate-500 hover:bg-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg hover:bg-white disabled:opacity-40 text-slate-500 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      <DocumentDetail
        doc={viewDoc}
        onClose={() => setViewDoc(null)}
        onDelete={handleDocumentDeleted}
      />

      <UpgradeModal
        isOpen={upgradeModal !== null}
        onClose={() => setUpgradeModal(null)}
        feature={upgradeModal?.feature ?? ''}
        requiredPlan={upgradeModal?.requiredPlan ?? 'starter'}
      />
    </div>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'done':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />Done
        </span>
      )
    case 'processing':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
          <Loader2 size={11} className="animate-spin" />Processing
        </span>
      )
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
          <Loader2 size={11} className="animate-spin" />Pending
        </span>
      )
    case 'failed':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-600">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />Failed
        </span>
      )
    default:
      return <span className="text-xs text-slate-400">{status}</span>
  }
}
