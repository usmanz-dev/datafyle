'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  FileText, FileSpreadsheet, FileCode2, Image as ImageIcon, File,
  AlertTriangle, Trash2, Eye, Search, Loader2, Upload,
  TrendingUp, FileCheck, Zap, BarChart3, ChevronLeft, ChevronRight,
  CheckSquare, Square, Download, Users,
} from 'lucide-react'
import { UploadZone } from '@/components/UploadZone'
import { ReportButton } from '@/components/ReportButton'
import { DocumentDetail, type DocRow } from '@/components/DocumentDetail'
import { UpgradeModal } from '@/components/UpgradeModal'
import { hasFeature } from '@/lib/plans'

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
    case 'pdf':             return { Icon: FileText,       color: 'text-red-500' }
    case 'docx': case 'doc': return { Icon: FileText,     color: 'text-blue-500' }
    case 'xlsx': case 'xls': return { Icon: FileSpreadsheet, color: 'text-green-600' }
    case 'csv':             return { Icon: FileSpreadsheet, color: 'text-emerald-500' }
    case 'txt':             return { Icon: FileText,       color: 'text-slate-400' }
    case 'xml':             return { Icon: FileCode2,      color: 'text-orange-500' }
    case 'jpg': case 'jpeg': case 'png': return { Icon: ImageIcon, color: 'text-purple-500' }
    default:                return { Icon: File,           color: 'text-slate-400' }
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
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
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
  const [showUpload, setShowUpload] = useState(false)
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

  // greeting based on local time
  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening')
  }, [])

  // Poll for status updates when docs are pending/processing
  const fetchDocs = useCallback(async () => {
    const res = await fetch('/api/documents')
    if (res.ok) {
      const data = await res.json()
      setDocs(data.documents)
    }
  }, [])

  useEffect(() => {
    const hasPending = docs.some((d) => d.status === 'pending' || d.status === 'processing')
    if (!hasPending) return
    const id = setInterval(fetchDocs, 3000)
    return () => clearInterval(id)
  }, [docs, fetchDocs])

  // ── Search + member filter ─────────────────────────────────────────────────
  const filtered = docs.filter((d) => {
    if (memberFilter && d.userId !== memberFilter) return false
    if (!search) return true
    const q = search.toLowerCase()
    const vendor = (d.extractedData as ExtractedData | null)?.vendor?.value?.toLowerCase() ?? ''
    return d.fileName.toLowerCase().includes(q) || vendor.includes(q)
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageDocs = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function onSearchChange(val: string) {
    setSearch(val)
    setPage(1)
    setSelected(new Set())
  }

  function onMemberFilterChange(val: string) {
    setMemberFilter(val || null)
    setPage(1)
    setSelected(new Set())
  }

  // Build member filter options (self + team members, excluding duplicates)
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
    if (selected.size === pageDocs.length && pageDocs.length > 0) {
      setSelected(new Set())
    } else {
      setSelected(new Set(pageDocs.map((d) => d.id)))
    }
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

  // ── Export helpers ─────────────────────────────────────────────────────────
  async function downloadExcel(ids: string[], filename = 'datafyle-export.xlsx') {
    const res = await fetch('/api/export/excel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentIds: ids }),
    })
    if (!res.ok) throw new Error('Export failed')
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  async function exportSelected() {
    setExporting(true)
    try { await downloadExcel([...selected]) }
    catch { alert('Export failed. Please try again.') }
    finally { setExporting(false) }
  }

  async function exportAll() {
    setExporting(true)
    try { await downloadExcel(docs.map((d) => d.id)) }
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

  // ── Document deleted from detail panel ──────────────────────────────────────
  function handleDocumentDeleted(id: string) {
    setDocs((prev) => prev.filter((d) => d.id !== id))
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n })
    setViewDoc(null)
  }

  // ── Usage bar ──────────────────────────────────────────────────────────────
  const usagePct = user.docsLimit > 0 ? Math.round((user.docsUsed / user.docsLimit) * 100) : 0
  const barColor =
    usagePct >= 90 ? '#EF4444' : usagePct >= 75 ? '#F59E0B' : '#2563EB'
  const atLimit = usagePct >= 100

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = [
    {
      label: 'Total Processed',
      value: user.totalDocsProcessed.toLocaleString(),
      icon: FileCheck,
      border: 'border-l-[#2563EB]',
    },
    {
      label: 'This Month',
      value: initialStats.thisMonthCount.toLocaleString(),
      icon: TrendingUp,
      border: 'border-l-[#2563EB]',
    },
    {
      label: 'Fields Extracted',
      value: initialStats.fieldsExtracted.toLocaleString(),
      icon: Zap,
      border: 'border-l-[#2563EB]',
    },
    {
      label: 'Anomalies',
      value: initialStats.anomaliesCount.toLocaleString(),
      icon: BarChart3,
      border: initialStats.anomaliesCount > 0 ? 'border-l-[#EF4444]' : 'border-l-[#22C55E]',
    },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-[#1E293B]">
              {greeting}{firstName ? `, ${firstName}` : ''}!
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">Here's what's happening with your documents.</p>
          </div>
          <div className="flex items-center gap-3">
            <ReportButton
              onLocked={!hasFeature(user.plan, 'monthly_report')
                ? () => setUpgradeModal({ feature: 'Monthly PDF Report', requiredPlan: 'starter' })
                : undefined}
            />
            <button
              onClick={() => {
                if (atLimit) {
                  setUpgradeModal({ feature: 'Document uploads', requiredPlan: user.plan === 'free' ? 'starter' : user.plan })
                  return
                }
                setShowUpload((v) => !v)
              }}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors min-h-11 ${
                atLimit
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-[#2563EB] text-white hover:bg-blue-700'
              }`}
            >
              <Upload size={16} />
              {atLimit ? 'Limit Reached' : 'Upload Documents'}
            </button>
          </div>
        </div>

        {/* ── Usage bar ──────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#1E293B]">
              Documents used:{' '}
              <strong>{user.docsUsed.toLocaleString()}</strong> / {user.docsLimit.toLocaleString()} this month
            </span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold" style={{ color: barColor }}>{usagePct}%</span>
              {usagePct > 80 && (
                <a href="/pricing" className="text-xs text-[#2563EB] font-medium hover:underline">
                  Upgrade Plan
                </a>
              )}
            </div>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(usagePct, 100)}%`, backgroundColor: barColor }}
            />
          </div>
        </div>

        {/* ── Stats ──────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map(({ label, value, icon: Icon, border }) => (
            <div
              key={label}
              className={`bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-4 border-l-4 ${border}`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{label}</p>
                <Icon size={16} className="text-slate-300" />
              </div>
              <p className="text-2xl font-bold text-[#1E293B]">{value}</p>
            </div>
          ))}
        </div>

        {/* ── Upload zone (collapsible) ───────────────────────────────────────── */}
        {showUpload && (
          <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm p-5 mb-6">
            <h2 className="text-sm font-semibold text-[#1E293B] mb-4">Upload Documents</h2>
            <UploadZone
              onUploadComplete={() => {
                fetchDocs()
                setShowUpload(false)
              }}
            />
          </div>
        )}

        {/* ── Documents table ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] shadow-sm overflow-hidden">
          {/* Table toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 border-b border-[#E2E8F0]">
            <div className="relative flex-1 max-w-xs">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by filename or vendor…"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] min-h-10"
              />
            </div>
            {isTeamAdmin && filterOptions.length > 1 && (
              <div className="relative">
                <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select
                  value={memberFilter ?? ''}
                  onChange={(e) => onMemberFilterChange(e.target.value)}
                  className="pl-8 pr-8 py-2 text-sm border border-[#E2E8F0] rounded-lg bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] min-h-10 appearance-none cursor-pointer"
                >
                  <option value="">All Members</option>
                  {filterOptions.map((m) => (
                    <option key={m.userId} value={m.userId}>{m.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex items-center gap-2 ml-auto flex-wrap">
              {selected.size > 0 ? (
                <button
                  onClick={exportSelected}
                  disabled={exporting}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-[#2563EB] text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 min-h-10"
                >
                  {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                  Export {selected.size} selected
                </button>
              ) : (
                <button
                  onClick={exportAll}
                  disabled={exporting || docs.length === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-white border border-[#E2E8F0] text-[#1E293B] rounded-lg hover:bg-[#F8FAFC] transition-colors disabled:opacity-50 shadow-sm min-h-10"
                >
                  {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} className="text-[#2563EB]" />}
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
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-white border border-[#E2E8F0] text-[#1E293B] rounded-lg hover:bg-[#F8FAFC] transition-colors disabled:opacity-50 shadow-sm min-h-10"
              >
                {sheetsExporting ? (
                  <Loader2 size={14} className="animate-spin text-green-600" />
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                    <rect width="24" height="24" rx="4" fill="#34A853" />
                    <path d="M5 7h14M5 12h14M5 17h14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
                {selected.size > 0 ? `Sheets (${selected.size})` : 'Google Sheets'}
              </button>
              <span className="text-xs text-slate-400">
                {filtered.length} document{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="px-4 py-3 w-10">
                    <button onClick={toggleAll} className="text-slate-400 hover:text-slate-600 transition-colors">
                      {selected.size === pageDocs.length && pageDocs.length > 0
                        ? <CheckSquare size={16} className="text-[#2563EB]" />
                        : <Square size={16} />}
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-[#1E293B] min-w-45">File</th>
                  <th className="text-left px-4 py-3 font-medium text-[#1E293B]">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-[#1E293B]">Vendor</th>
                  <th className="text-right px-4 py-3 font-medium text-[#1E293B]">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-[#1E293B]">Status</th>
                  <th className="px-4 py-3 w-8" title="Anomaly" />
                  <th className="text-left px-4 py-3 font-medium text-[#1E293B]">Uploaded By</th>
                  <th className="text-left px-4 py-3 font-medium text-[#1E293B]">Date</th>
                  <th className="px-4 py-3 w-24" />
                </tr>
              </thead>
              <tbody>
                {pageDocs.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <FileText size={40} className="text-slate-200" />
                        <p className="text-sm text-slate-400 font-medium">
                          {search ? 'No documents match your search' : 'Upload your first document to get started'}
                        </p>
                        {!search && (
                          <button
                            onClick={() => setShowUpload(true)}
                            className="text-sm text-[#2563EB] font-medium hover:underline"
                          >
                            Upload now
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  pageDocs.map((doc) => {
                    const data = doc.extractedData as ExtractedData | null
                    const anomaly = doc.anomalyData as AnomalyData | null
                    const { Icon, color } = fileIcon(doc.fileType)
                    const vendor = data?.vendor?.value ?? '—'
                    const amount = data?.totalAmount?.value
                    const currency = data?.currency?.value ?? ''
                    const isSelected = selected.has(doc.id)

                    return (
                      <tr
                        key={doc.id}
                        className={`border-b border-[#E2E8F0] last:border-0 transition-colors ${
                          isSelected ? 'bg-[#EFF6FF]' : 'hover:bg-[#F8FAFC]'
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="px-4 py-3">
                          <button
                            onClick={() => toggleSelect(doc.id)}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {isSelected
                              ? <CheckSquare size={16} className="text-[#2563EB]" />
                              : <Square size={16} />}
                          </button>
                        </td>

                        {/* File name */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Icon size={16} className={`shrink-0 ${color}`} />
                            <span className="text-[#1E293B] font-medium truncate max-w-40" title={doc.fileName}>
                              {doc.fileName.length > 30
                                ? doc.fileName.slice(0, 27) + '…'
                                : doc.fileName}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 pl-6">{formatBytes(doc.fileSize)}</p>
                        </td>

                        {/* Type */}
                        <td className="px-4 py-3">
                          <span className={`inline-block text-xs font-medium px-2 py-1 rounded uppercase tracking-wide ${typeBadge(doc.fileType)}`}>
                            {doc.fileType}
                          </span>
                        </td>

                        {/* Vendor */}
                        <td className="px-4 py-3 text-[#1E293B] max-w-30 truncate" title={vendor !== '—' ? vendor : undefined}>
                          {vendor}
                        </td>

                        {/* Amount */}
                        <td className="px-4 py-3 text-right text-[#1E293B] font-medium tabular-nums">
                          {amount != null
                            ? `${currency ? currency + ' ' : ''}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            : '—'}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <StatusBadge status={doc.status} />
                        </td>

                        {/* Anomaly */}
                        <td className="px-4 py-3">
                          {anomaly?.isAnomaly && (
                            <span title={anomaly.severity ?? 'Anomaly detected'}>
                              <AlertTriangle
                                size={16}
                                className={
                                  anomaly.severity === 'CRITICAL' ? 'text-red-500' :
                                  anomaly.severity === 'HIGH' ? 'text-orange-500' : 'text-yellow-500'
                                }
                              />
                            </span>
                          )}
                        </td>

                        {/* Uploaded by */}
                        <td className="px-4 py-3 text-slate-500 text-sm max-w-25 truncate">
                          {doc.uploadedByName ?? 'You'}
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3 text-slate-500 text-sm whitespace-nowrap">
                          {formatDate(doc.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setViewDoc(doc)}
                              className="p-2 rounded-lg hover:bg-[#EFF6FF] text-slate-400 hover:text-[#2563EB] transition-colors"
                              title="View details"
                              disabled={doc.status !== 'done'}
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => deleteDoc(doc.id)}
                              disabled={deleting === doc.id}
                              className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
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
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
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
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const p = i + 1
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 text-xs rounded-lg font-medium transition-colors ${
                        page === p
                          ? 'bg-[#2563EB] text-white'
                          : 'text-slate-500 hover:bg-white'
                      }`}
                    >
                      {p}
                    </button>
                  )
                })}
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
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Done
        </span>
      )
    case 'processing':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
          <Loader2 size={11} className="animate-spin" />
          Processing
        </span>
      )
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
          <Loader2 size={11} className="animate-spin" />
          Pending
        </span>
      )
    case 'failed':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-red-100 text-red-600">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Failed
        </span>
      )
    default:
      return <span className="text-xs text-slate-400">{status}</span>
  }
}
