'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams, useRouter as useNextRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  FileText, FileSpreadsheet, FileCode2, Image as ImageIcon, File,
  AlertTriangle, Eye, Search, Loader2,
  TrendingUp, FileCheck, Zap, BarChart3, ChevronLeft, ChevronRight,
  CheckSquare, Square, Download, Users, Activity, ShieldCheck,
  CloudUpload, Calendar, ArrowUpRight,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie,
} from 'recharts'
import { UploadZone } from '@/components/UploadZone'
import { BatchUploadZone } from '@/components/BatchUploadZone'
import { ReportButton } from '@/components/ReportButton'
import { DocumentDetail, type DocRow } from '@/components/DocumentDetail'
import { UpgradeModal } from '@/components/UpgradeModal'
import { hasFeature, PLAN_NAMES } from '@/lib/plans'
import { useLanguage } from '@/lib/i18n/context'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

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
    case 'pdf':               return { Icon: FileText,        color: 'text-red-500',     bg: 'bg-red-50' }
    case 'docx': case 'doc':  return { Icon: FileText,        color: 'text-blue-500',    bg: 'bg-blue-50' }
    case 'xlsx': case 'xls':  return { Icon: FileSpreadsheet, color: 'text-green-600',   bg: 'bg-green-50' }
    case 'csv':               return { Icon: FileSpreadsheet, color: 'text-emerald-500', bg: 'bg-emerald-50' }
    case 'txt':               return { Icon: FileText,        color: 'text-slate-400',   bg: 'bg-slate-50' }
    case 'xml':               return { Icon: FileCode2,       color: 'text-orange-500',  bg: 'bg-orange-50' }
    case 'jpg': case 'jpeg': case 'png': return { Icon: ImageIcon, color: 'text-purple-500', bg: 'bg-purple-50' }
    default:                  return { Icon: File,            color: 'text-slate-400',   bg: 'bg-slate-50' }
  }
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

export function DashboardClient({
  firstName, user, initialStats, initialDocuments,
  isTeamAdmin, teamMembers, currentUserId,
}: Props) {
  const { t } = useLanguage()
  const [docs, setDocs] = useState<DocRow[]>(initialDocuments)
  const [search, setSearch] = useState('')
  const [memberFilter, setMemberFilter] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [viewDoc, setViewDoc] = useState<DocRow | null>(null)
  const [exporting, setExporting] = useState(false)
  const [upgradeModal, setUpgradeModal] = useState<{ feature: string; requiredPlan: string } | null>(null)
  const [batchMode, setBatchMode]       = useState(false)
  const [pendingUpgrade, setPendingUpgrade] = useState<string | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [upgradeBannerDismissed, setUpgradeBannerDismissed] = useState(false)

  const searchParams = useSearchParams()
  const nextRouter   = useNextRouter()

  useEffect(() => {
    const sheets = searchParams.get('sheets')
    const success = searchParams.get('success')
    const plan = searchParams.get('plan') ?? ''

    if (success === '1') {
      toast.success(`Welcome to Datafyle ${PLAN_NAMES[plan] ?? 'Paid'}!`, {
        description: 'Your subscription is now active.',
        duration: 6000,
      })
    } else if (sheets === 'connected') {
      toast.success('Google Account connected!', {
        description: 'You can now export documents to Google Sheets.',
        duration: 5000,
      })
    } else if (sheets === 'error') {
      toast.error('Google connection failed', {
        description: 'Please try connecting your Google account again.',
        duration: 5000,
      })
    }

    if (success || sheets) {
      const url = new URL(window.location.href)
      url.searchParams.delete('success')
      url.searchParams.delete('plan')
      url.searchParams.delete('sheets')
      nextRouter.replace(url.pathname + (url.search || ''))
    }

    // Show upgrade banner if user came from pricing page
    const pendingPlan = localStorage.getItem('pendingPlan')
    const pendingAt = localStorage.getItem('pendingPlanAt')
    const isRecent = pendingAt && Date.now() - parseInt(pendingAt) < 10 * 60 * 1000
    if (pendingPlan && isRecent && user.plan === 'free') {
      setPendingUpgrade(pendingPlan)
    }
    localStorage.removeItem('pendingPlan')
    localStorage.removeItem('pendingPlanAt')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const greetingText = useMemo(() => {
    const h = new Date().getHours()
    return h < 12 ? t.dashboard.morning : h < 17 ? t.dashboard.afternoon : t.dashboard.evening
  }, [t])

  const fetchDocs = useCallback(async () => {
    const res = await fetch('/api/documents')
    if (res.ok) setDocs((await res.json()).documents)
  }, [])

  useEffect(() => {
    if (!docs.some((d) => d.status === 'pending' || d.status === 'processing')) return
    const id = setInterval(fetchDocs, 3000)
    return () => clearInterval(id)
  }, [docs, fetchDocs])

  async function handlePendingCheckout() {
    if (!pendingUpgrade) return
    if (!window.Paddle) {
      toast.error('Payment system not ready. Please refresh and try again.')
      return
    }
    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: pendingUpgrade }),
      })
      const data = await res.json() as { transactionId?: string; error?: string }
      if (data.transactionId) {
        window.Paddle.Checkout.open({
          transactionId: data.transactionId,
          settings: {
            successUrl: `https://www.datafyle.com/dashboard?success=1&plan=${pendingUpgrade}`,
          },
        })
      } else {
        toast.error(data.error ?? 'Checkout failed. Please try again.')
      }
    } catch {
      toast.error('Checkout failed. Please try again.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  // ── Computed ───────────────────────────────────────────────────────────────
  const usagePct  = user.docsLimit > 0 ? Math.round((user.docsUsed / user.docsLimit) * 100) : 0
  const barColor  = usagePct >= 90 ? '#EF4444' : usagePct >= 75 ? '#F59E0B' : '#22C55E'
  const atLimit   = usagePct >= 100
  const todayLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const stats = [
    { label: t.dashboard.totalProcessed, value: user.totalDocsProcessed, icon: FileCheck,    accent: '#2563EB', bg: 'bg-blue-50',  trend: null },
    { label: t.dashboard.thisMonth,      value: initialStats.thisMonthCount, icon: TrendingUp, accent: '#8B5CF6', bg: 'bg-violet-50', trend: null },
    { label: t.dashboard.fieldsExtracted, value: initialStats.fieldsExtracted, icon: Zap,     accent: '#22C55E', bg: 'bg-green-50', trend: null },
    {
      label: t.dashboard.anomalies,
      value: initialStats.anomaliesCount,
      icon: AlertTriangle,
      accent: initialStats.anomaliesCount > 0 ? '#EF4444' : '#22C55E',
      bg:    initialStats.anomaliesCount > 0 ? 'bg-red-50' : 'bg-green-50',
      trend: null,
    },
  ]

  const weeklyData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return {
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        docs: initialDocuments.filter(
          (doc) => doc.createdAt.slice(0, 10) === d.toISOString().slice(0, 10) && doc.status === 'done'
        ).length,
      }
    })
  }, [initialDocuments])

  const typeData = useMemo(() => {
    const counts: Record<string, number> = {}
    initialDocuments.forEach((doc) => { const t = doc.fileType.toUpperCase(); counts[t] = (counts[t] ?? 0) + 1 })
    const colors = ['#2563EB', '#8B5CF6', '#22C55E', '#F59E0B', '#EF4444', '#06B6D4']
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6)
      .map(([name, value], i) => ({ name, value, color: colors[i] }))
  }, [initialDocuments])

  const successRate = useMemo(() => {
    if (!initialDocuments.length) return 100
    return Math.round((initialDocuments.filter((d) => d.status === 'done').length / initialDocuments.length) * 100)
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

  const filterOptions = isTeamAdmin
    ? [{ userId: currentUserId, name: 'My Documents' }, ...teamMembers.filter((m) => m.userId !== currentUserId)]
    : []

  function toggleSelect(id: string) {
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function toggleAll() {
    setSelected(selected.size === pageDocs.length && pageDocs.length > 0 ? new Set() : new Set(pageDocs.map((d) => d.id)))
  }

async function downloadExcel(ids: string[], filename = 'datafyle-export.xlsx') {
    const res = await fetch('/api/export/excel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ documentIds: ids }) })
    if (!res.ok) throw new Error('Export failed')
    const blob = await res.blob()
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: filename })
    a.click(); URL.revokeObjectURL(a.href)
  }

  function buildFilename(ids: string[]) {
    if (ids.length === 1) {
      const base = docs.find((d) => d.id === ids[0])?.fileName.replace(/\.[^.]+$/, '') ?? 'document'
      return `${base}-extracted.xlsx`
    }
    return `datafyle-export-${new Date().toISOString().slice(0, 10)}.xlsx`
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

// ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Pending upgrade banner ──────────────────────────────────────────── */}
      {pendingUpgrade && (
        <div className="bg-[#2563EB] text-white px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2.5">
              <Zap size={16} className="shrink-0" />
              <span className="text-sm font-medium">
                Complete your upgrade to <span className="font-bold capitalize">{pendingUpgrade}</span> plan
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPendingUpgrade(null)}
                className="text-xs text-blue-200 hover:text-white transition-colors"
              >
                Dismiss
              </button>
              <button
                onClick={handlePendingCheckout}
                disabled={checkoutLoading}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white text-[#2563EB] text-xs font-bold rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-60"
              >
                {checkoutLoading ? <Loader2 size={12} className="animate-spin" /> : null}
                {checkoutLoading ? 'Loading...' : 'Complete Upgrade →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Free plan upgrade banner ────────────────────────────────────────── */}
      {user.plan === 'free' && !upgradeBannerDismissed && (
        <div className="bg-linear-to-r from-[#1E293B] to-[#2563EB] text-white px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <Zap size={14} className="text-yellow-300" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  You&apos;re on the <span className="text-yellow-300">Free plan</span> — limited to {user.docsLimit} docs/month
                </p>
                <p className="text-xs text-blue-200 hidden sm:block">
                  Upgrade to Starter ($49/mo) for 500 docs, anomaly detection, and team features
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setUpgradeBannerDismissed(true)}
                className="text-xs text-blue-300 hover:text-white transition-colors"
              >
                Dismiss
              </button>
              <a
                href="/pricing"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-[#2563EB] text-xs font-bold rounded-xl hover:bg-blue-50 transition-colors"
              >
                <ArrowUpRight size={13} />
                Upgrade Now
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Top header bar ──────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100 sticky top-14 md:top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1d4ed8] flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">{firstName?.[0]?.toUpperCase() ?? 'U'}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {greetingText}{firstName ? `, ${firstName}` : ''}
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar size={10} />
                {todayLabel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Usage indicator */}
            <div className="hidden sm:flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{user.docsUsed.toLocaleString()} / {user.docsLimit.toLocaleString()} docs</span>
                <span className="text-xs font-semibold" style={{ color: barColor }}>{usagePct}%</span>
              </div>
              <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(usagePct, 100)}%`, backgroundColor: barColor }} />
              </div>
            </div>

            <LanguageSwitcher variant="dashboard" />
            <ReportButton
              onLocked={!hasFeature(user.plan, 'monthly_report')
                ? () => setUpgradeModal({ feature: 'Monthly PDF Report', requiredPlan: 'starter' })
                : undefined}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* ── 1. KPI cards ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, accent, bg }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all duration-200 group">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon size={18} style={{ color: accent }} />
                </div>
                <ArrowUpRight size={14} className="text-slate-200 group-hover:text-slate-400 transition-colors" />
              </div>
              <p className="text-2xl font-bold text-slate-800 tabular-nums">{value.toLocaleString()}</p>
              <p className="text-xs text-slate-400 font-medium mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* ── 2. Upload zone ───────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                <CloudUpload size={15} className="text-[#2563EB]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{t.dashboard.uploadTitle}</p>
                <p className="text-xs text-slate-400">{t.dashboard.uploadSub}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Single / Batch toggle — Pro+ only */}
              {hasFeature(user.plan, 'batch') ? (
                <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-0.5">
                  <button
                    onClick={() => setBatchMode(false)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      !batchMode ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {t.dashboard.singleUpload}
                  </button>
                  <button
                    onClick={() => setBatchMode(true)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      batchMode ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {t.dashboard.batchUpload}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setUpgradeModal({ feature: 'Batch Upload', requiredPlan: 'professional' })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-violet-50 text-violet-600 border border-violet-100 rounded-xl hover:bg-violet-100 transition-colors"
                >
                  <Zap size={11} />
                  Batch Upload
                </button>
              )}
              {atLimit && (
                <span className="text-xs font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-full">Limit reached</span>
              )}
            </div>
          </div>
          <div className="p-5">
            {batchMode && hasFeature(user.plan, 'batch') ? (
              <BatchUploadZone
                atLimit={atLimit}
                onBatchComplete={fetchDocs}
                onUpgradePlan={() => setUpgradeModal({ feature: 'Document uploads', requiredPlan: user.plan === 'free' ? 'starter' : user.plan })}
              />
            ) : (
              <UploadZone
                atLimit={atLimit}
                onUploadComplete={() => fetchDocs()}
                onUpgradePlan={() => setUpgradeModal({ feature: 'Document uploads', requiredPlan: user.plan === 'free' ? 'starter' : user.plan })}
              />
            )}
          </div>
        </div>

        {/* ── 3. Documents table ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-slate-50">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                  <FileText size={15} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{t.dashboard.myDocuments}</p>
                  <p className="text-xs text-slate-400">{docs.length} total · {docs.filter(d => d.status === 'done').length} extracted</p>
                </div>
              </div>

              <div className="flex flex-1 items-center gap-2 sm:ml-2 flex-wrap">
                {/* Search */}
                <div className="relative flex-1 min-w-48">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder={t.dashboard.searchPlaceholder}
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); setSelected(new Set()) }}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all min-h-9"
                  />
                </div>

                {/* Team filter */}
                {isTeamAdmin && filterOptions.length > 1 && (
                  <div className="relative">
                    <Users size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <select
                      value={memberFilter ?? ''}
                      onChange={(e) => { setMemberFilter(e.target.value || null); setPage(1); setSelected(new Set()) }}
                      className="pl-8 pr-7 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] appearance-none cursor-pointer min-h-9"
                    >
                      <option value="">All Members</option>
                      {filterOptions.map((m) => <option key={m.userId} value={m.userId}>{m.name}</option>)}
                    </select>
                  </div>
                )}

                {/* Export actions */}
                <div className="flex items-center gap-2 ml-auto">
                  {selected.size > 0 ? (
                    <button onClick={exportSelected} disabled={exporting}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#2563EB] text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 min-h-9">
                      {exporting ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                      {t.dashboard.exportSelected} {selected.size}
                    </button>
                  ) : (
                    <button onClick={exportAll} disabled={exporting || !docs.length}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-50 min-h-9">
                      {exporting ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} className="text-[#2563EB]" />}
                      {t.dashboard.exportAll}
                    </button>
                  )}

                  {/* Google Sheets export — hidden until service account issue resolved */}
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="w-12 px-5 py-3 text-left">
                    <button onClick={toggleAll} className="text-slate-300 hover:text-slate-500 transition-colors">
                      {selected.size > 0 && selected.size === pageDocs.length
                        ? <CheckSquare size={15} className="text-[#2563EB]" />
                        : <Square size={15} />}
                    </button>
                  </th>
                  {[
                    { label: 'Document', cls: 'text-left' },
                    { label: 'Type',     cls: 'text-left hidden md:table-cell' },
                    { label: 'Vendor',   cls: 'text-left hidden lg:table-cell' },
                    { label: 'Amount',   cls: 'text-right hidden md:table-cell' },
                    { label: 'Status',   cls: 'text-left' },
                    { label: '',         cls: 'hidden md:table-cell w-8' },
                    { label: 'Date',     cls: 'text-left hidden lg:table-cell' },
                    { label: '',         cls: 'w-20' },
                  ].map((col, i) => (
                    <th key={i} className={`px-3 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider ${col.cls}`}>
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pageDocs.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center">
                          <FileText size={24} className="text-slate-300" />
                        </div>
                        <p className="text-sm text-slate-400 font-medium">
                          {search ? t.dashboard.noDocuments : t.dashboard.noDocumentsSub}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : pageDocs.map((doc) => {
                  const data     = doc.extractedData as ExtractedData | null
                  const anomaly  = doc.anomalyData as AnomalyData | null
                  const { Icon, color, bg } = fileIcon(doc.fileType)
                  const vendor   = data?.vendor?.value ?? '—'
                  const amount   = data?.totalAmount?.value
                  const currency = data?.currency?.value ?? ''
                  const isSel    = selected.has(doc.id)

                  return (
                    <tr key={doc.id} className={`group transition-colors ${isSel ? 'bg-blue-50/60' : 'hover:bg-slate-50/70'}`}>
                      {/* Checkbox */}
                      <td className="px-5 py-3.5">
                        <button onClick={() => toggleSelect(doc.id)} className="text-slate-300 hover:text-slate-500 transition-colors">
                          {isSel ? <CheckSquare size={15} className="text-[#2563EB]" /> : <Square size={15} />}
                        </button>
                      </td>

                      {/* File */}
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                            <Icon size={16} className={color} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate max-w-44" title={doc.fileName}>
                              {doc.fileName.length > 28 ? doc.fileName.slice(0, 25) + '…' : doc.fileName}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">{formatBytes(doc.fileSize)}</p>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-3 py-3.5 hidden md:table-cell">
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg uppercase tracking-wide bg-slate-100 text-slate-500">
                          {doc.fileType}
                        </span>
                      </td>

                      {/* Vendor */}
                      <td className="px-3 py-3.5 hidden lg:table-cell">
                        <span className="text-sm text-slate-600 max-w-32 truncate block" title={vendor !== '—' ? vendor : undefined}>
                          {vendor}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-3 py-3.5 text-right hidden md:table-cell">
                        <span className="text-sm font-semibold text-slate-800 tabular-nums">
                          {amount != null
                            ? `${currency ? currency + ' ' : ''}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            : <span className="text-slate-300 font-normal">—</span>}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3.5">
                        <StatusBadge status={doc.status} />
                      </td>

                      {/* Anomaly */}
                      <td className="px-3 py-3.5 hidden md:table-cell text-center">
                        {anomaly?.isAnomaly && (
                          <span title={anomaly.severity ?? 'Anomaly'}>
                            <AlertTriangle size={14} className={
                              anomaly.severity === 'CRITICAL' ? 'text-red-500' :
                              anomaly.severity === 'HIGH'     ? 'text-orange-500' : 'text-yellow-500'
                            } />
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-3 py-3.5 hidden lg:table-cell">
                        <span className="text-xs text-slate-400 whitespace-nowrap">{formatDate(doc.createdAt)}</span>
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-3.5">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setViewDoc(doc)}
                            disabled={doc.status !== 'done'}
                            title="View extracted data"
                            className="p-2 rounded-lg hover:bg-blue-50 text-slate-300 hover:text-[#2563EB] transition-colors disabled:cursor-default"
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-50 bg-slate-50/40">
              <p className="text-xs text-slate-400">
                Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-2 rounded-xl hover:bg-white disabled:opacity-30 text-slate-500 transition-colors border border-transparent hover:border-slate-200">
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 text-xs rounded-xl font-medium transition-all ${page === p ? 'bg-[#2563EB] text-white shadow-sm' : 'text-slate-500 hover:bg-white hover:border border-slate-200'}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="p-2 rounded-xl hover:bg-white disabled:opacity-30 text-slate-500 transition-colors border border-transparent hover:border-slate-200">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── 4. Analytics ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* Weekly bar chart — 7 cols */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Activity size={14} className="text-[#2563EB]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Weekly Activity</p>
                  <p className="text-xs text-slate-400">Documents processed per day</p>
                </div>
              </div>
            </div>
            {weeklyData.some((d) => d.docs > 0) ? (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={weeklyData} barSize={26} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: '#EFF6FF', radius: 6 }}
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,.08)', fontSize: 12 }}
                    formatter={(v) => [Number(v ?? 0), 'Documents']}
                  />
                  <Bar dataKey="docs" fill="#2563EB" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center gap-2">
                <BarChart3 size={28} className="text-slate-200" />
                <p className="text-sm text-slate-400">No activity this week</p>
              </div>
            )}
          </div>

          {/* Right stats — 5 cols */}
          <div className="lg:col-span-5 flex flex-col gap-4">

            {/* Success rate */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
                  <ShieldCheck size={14} className="text-[#22C55E]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Success Rate</p>
                  <p className="text-xs text-slate-400">Extraction accuracy</p>
                </div>
                <span className="ml-auto text-2xl font-bold text-slate-800">{successRate}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${successRate}%`, backgroundColor: successRate >= 90 ? '#22C55E' : successRate >= 70 ? '#F59E0B' : '#EF4444' }} />
              </div>
            </div>

            {/* Monthly usage */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Monthly Usage</p>
                  <p className="text-xs text-slate-400">{user.docsUsed.toLocaleString()} of {user.docsLimit.toLocaleString()} docs used</p>
                </div>
                <span className="text-xl font-bold" style={{ color: barColor }}>{usagePct}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(usagePct, 100)}%`, backgroundColor: barColor }} />
              </div>
              {usagePct > 80 && (
                <a href="/pricing" className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline">
                  Upgrade Plan <ArrowUpRight size={11} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Document types donut — only when data exists */}
        {typeData.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                <FileText size={14} className="text-violet-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Document Types</p>
                <p className="text-xs text-slate-400">{initialDocuments.length} documents across {typeData.length} formats</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={typeData.map((d) => ({ ...d, fill: d.color }))}
                    cx="50%" cy="50%" innerRadius={48} outerRadius={72}
                    paddingAngle={3} dataKey="value"
                    strokeWidth={0}
                  />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,.08)', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {typeData.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-sm text-slate-600 flex-1 font-medium">{name}</span>
                    <span className="text-sm font-bold text-slate-800 tabular-nums">{value}</span>
                    <span className="text-xs text-slate-300 w-9 text-right">
                      {Math.round((value / initialDocuments.length) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      <DocumentDetail doc={viewDoc} onClose={() => setViewDoc(null)} />

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
  const { t } = useLanguage()
  const cfg = {
    done:       { dot: 'bg-green-500',  pill: 'bg-green-50 text-green-700',   label: t.dashboard.done },
    processing: { dot: '',              pill: 'bg-blue-50 text-blue-700',     label: t.dashboard.processing },
    pending:    { dot: '',              pill: 'bg-slate-100 text-slate-500',  label: t.dashboard.pending },
    failed:     { dot: 'bg-red-500',    pill: 'bg-red-50 text-red-600',      label: t.dashboard.failed },
  }[status]

  if (!cfg) return <span className="text-xs text-slate-400">{status}</span>

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.pill}`}>
      {(status === 'processing' || status === 'pending')
        ? <Loader2 size={10} className="animate-spin" />
        : <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
      {cfg.label}
    </span>
  )
}
