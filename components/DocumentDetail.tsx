'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Download, Copy, Check, Trash2, Loader2,
  FileText, FileSpreadsheet, FileCode2, Image as ImageIcon, File,
  Brain, AlertCircle,
} from 'lucide-react'
import { ExtractedDataTable } from './ExtractedDataTable'
import { LineItemsTable } from './LineItemsTable'
import { AnomalyBanner } from './AnomalyBanner'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExtractedData {
  vendor?: { value?: string | null; confidence?: number }
  invoiceNumber?: { value?: string | null; confidence?: number }
  date?: { value?: string | null; confidence?: number }
  dueDate?: { value?: string | null; confidence?: number }
  totalAmount?: { value?: number | null; confidence?: number }
  currency?: { value?: string | null; confidence?: number }
  taxAmount?: { value?: number | null; confidence?: number }
  documentType?: string
  lineItems?: { description?: string; quantity?: number; unitPrice?: number; total?: number }[]
  keyFields?: Record<string, unknown>
  summary?: string
  overallConfidence?: number
  [key: string]: unknown
}

interface AnomalyData {
  isAnomaly: boolean
  severity: 'CRITICAL' | 'HIGH' | 'LOW' | null
  anomalies: { type: string; severity: string; reason: string }[]
  recommendation: string
}

export interface DocRow {
  id: string
  userId?: string
  fileName: string
  fileType: string
  fileSize: number
  status: string
  extractedData: unknown
  anomalyData: unknown
  confidenceScore: number | null
  uploadedByName: string | null
  createdAt: string
}

interface Props {
  doc: DocRow | null
  onClose: () => void
  onDelete: (id: string) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fileIcon(type: string) {
  switch (type) {
    case 'pdf':              return { Icon: FileText,        color: 'text-red-500' }
    case 'docx': case 'doc': return { Icon: FileText,        color: 'text-blue-500' }
    case 'xlsx': case 'xls': return { Icon: FileSpreadsheet, color: 'text-green-600' }
    case 'csv':              return { Icon: FileSpreadsheet, color: 'text-emerald-500' }
    case 'xml':              return { Icon: FileCode2,       color: 'text-orange-500' }
    case 'jpg': case 'jpeg': case 'png': return { Icon: ImageIcon, color: 'text-purple-500' }
    default:                 return { Icon: File,            color: 'text-slate-400' }
  }
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DocumentDetail({ doc, onClose, onDelete }: Props) {
  const [vendorData, setVendorData] = useState<{ invoiceCount: number; avgAmount: number | null } | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Fetch vendor memory when doc opens
  useEffect(() => {
    if (!doc) { setVendorData(null); return }
    const vendor = (doc.extractedData as ExtractedData | null)?.vendor?.value
    if (!vendor) return
    fetch(`/api/vendors?name=${encodeURIComponent(vendor)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.invoiceCount > 1) {
          setVendorData({ invoiceCount: data.invoiceCount, avgAmount: data.avgAmount })
        } else {
          setVendorData(null)
        }
      })
      .catch(() => setVendorData(null))
  }, [doc?.id])

  async function downloadExcel() {
    if (!doc) return
    setDownloading(true)
    try {
      const res = await fetch('/api/export/excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentIds: [doc.id] }),
      })
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `datafyle-${doc.fileName.replace(/\.[^.]+$/, '')}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Export failed. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  async function copyJSON() {
    if (!doc?.extractedData) return
    await navigator.clipboard.writeText(JSON.stringify(doc.extractedData, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleDelete() {
    if (!doc) return
    setDeleting(true)
    try {
      await fetch(`/api/documents/${doc.id}`, { method: 'DELETE' })
      onDelete(doc.id)
    } catch {
      alert('Delete failed. Please try again.')
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const data = doc?.extractedData as ExtractedData | null
  const anomalyData = doc?.anomalyData as AnomalyData | null
  const lineItems = data?.lineItems ?? []
  const keyFields = data?.keyFields ?? {}
  const hasKeyFields = Object.keys(keyFields).length > 0

  const { Icon, color } = doc ? fileIcon(doc.fileType) : { Icon: File, color: 'text-slate-400' }

  return (
    <AnimatePresence>
      {doc && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed right-0 top-0 h-full w-full md:max-w-xl bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* ── Header ───────────────────────────────────────────────── */}
            <div className="shrink-0 border-b border-[#E2E8F0] px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  <Icon size={28} className={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-bold text-[#1E293B] text-sm leading-snug truncate"
                    title={doc.fileName}
                  >
                    {doc.fileName}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <StatusBadge status={doc.status} />
                    <span className="text-xs text-slate-400">{formatBytes(doc.fileSize)}</span>
                    <span className="text-xs text-slate-400">{formatDate(doc.createdAt)}</span>
                    {doc.confidenceScore != null && (
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          doc.confidenceScore >= 90
                            ? 'bg-green-100 text-green-700'
                            : doc.confidenceScore >= 70
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {Math.round(doc.confidenceScore)}% confidence
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={downloadExcel}
                    disabled={downloading || doc.status !== 'done'}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-[#2563EB] text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {downloading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                    Excel
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-[#F8FAFC] text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Scrollable content ───────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">

              {/* Anomaly banner */}
              {anomalyData?.isAnomaly && (
                <AnomalyBanner anomalyData={anomalyData} />
              )}

              {/* Extracted information */}
              {data && doc.status === 'done' && (
                <section>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                    Extracted Information
                  </h3>
                  <ExtractedDataTable data={data} />
                </section>
              )}

              {/* Line items */}
              {lineItems.length > 0 && (
                <section>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                    Line Items ({lineItems.length})
                  </h3>
                  <LineItemsTable items={lineItems} />
                </section>
              )}

              {/* Vendor memory */}
              {vendorData && (
                <section>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                    Vendor Memory
                  </h3>
                  <div className="bg-[#EFF6FF] border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <Brain size={16} className="text-[#2563EB] shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      Vendor seen{' '}
                      <strong>{vendorData.invoiceCount} times</strong>
                      {vendorData.avgAmount != null && (
                        <>
                          {' '}— average amount{' '}
                          <strong>
                            ${vendorData.avgAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </strong>
                        </>
                      )}
                    </p>
                  </div>
                </section>
              )}

              {/* Other fields */}
              {hasKeyFields && (
                <section>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                    Other Fields
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(keyFields).map(([k, v]) => (
                      <div key={k} className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0]">
                        <p className="text-xs text-slate-500 mb-1 truncate">{k}</p>
                        <p className="text-sm font-medium text-[#1E293B] truncate">{String(v ?? '—')}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Not processed yet */}
              {doc.status !== 'done' && doc.status !== 'failed' && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Loader2 size={32} className="text-[#2563EB] animate-spin mb-3" />
                  <p className="text-sm font-medium text-[#1E293B]">Processing document…</p>
                  <p className="text-xs text-slate-400 mt-1">This usually takes a few seconds</p>
                </div>
              )}

              {doc.status === 'failed' && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle size={32} className="text-red-400 mb-3" />
                  <p className="text-sm font-medium text-[#1E293B]">Processing failed</p>
                  <p className="text-xs text-slate-400 mt-1">Please try uploading the file again</p>
                </div>
              )}
            </div>

            {/* ── Footer ───────────────────────────────────────────────── */}
            <div className="shrink-0 border-t border-[#E2E8F0] px-5 py-3 flex items-center gap-2 bg-[#F8FAFC]">
              <button
                onClick={downloadExcel}
                disabled={downloading || doc.status !== 'done'}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-white border border-[#E2E8F0] text-[#1E293B] rounded-lg hover:bg-[#F8FAFC] transition-colors disabled:opacity-50 shadow-sm"
              >
                {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} className="text-[#2563EB]" />}
                Download Excel
              </button>
              <button
                onClick={copyJSON}
                disabled={doc.status !== 'done'}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-white border border-[#E2E8F0] text-[#1E293B] rounded-lg hover:bg-[#F8FAFC] transition-colors disabled:opacity-50 shadow-sm"
              >
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-slate-400" />}
                {copied ? 'Copied!' : 'Copy JSON'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>

            {/* ── Delete confirmation overlay ──────────────────────────── */}
            <AnimatePresence>
              {showDeleteConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10 p-6"
                >
                  <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-6 max-w-xs w-full text-center">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trash2 size={20} className="text-red-500" />
                    </div>
                    <h4 className="font-bold text-[#1E293B] mb-2">Delete Document?</h4>
                    <p className="text-sm text-slate-500 mb-5">
                      This will permanently delete &quot;{doc.fileName}&quot;. This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 py-2.5 rounded-lg border border-[#E2E8F0] text-sm font-medium text-[#1E293B] hover:bg-[#F8FAFC] transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex-1 py-2.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
                      >
                        {deleting && <Loader2 size={14} className="animate-spin" />}
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'done':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Done
        </span>
      )
    case 'processing':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
          <Loader2 size={10} className="animate-spin" />
          Processing
        </span>
      )
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
          <Loader2 size={10} className="animate-spin" />
          Pending
        </span>
      )
    case 'failed':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-600">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Failed
        </span>
      )
    default:
      return <span className="text-xs text-slate-400">{status}</span>
  }
}
