'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  CloudUpload, X, CheckCircle2, AlertCircle, Loader2,
  Brain, Download, FileSpreadsheet,
} from 'lucide-react'

const ACCEPT = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-excel': ['.xls'],
  'text/csv': ['.csv'],
  'text/plain': ['.txt'],
  'application/xml': ['.xml'],
  'text/xml': ['.xml'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
}

type FileStatus = 'pending' | 'uploading' | 'processing' | 'done' | 'error'

interface FileItem {
  id: string
  file: File
  status: FileStatus
  documentId?: string
  error?: string
}

interface Props {
  onUploadComplete: (documentIds: string[]) => void
  atLimit?: boolean
  onUpgradePlan?: () => void
}

export function UploadZone({ onUploadComplete, atLimit, onUpgradePlan }: Props) {
  const [items, setItems] = useState<FileItem[]>([])
  const [busy, setBusy] = useState(false)
  const [downloading, setDownloading] = useState<Set<string>>(new Set())
  const [sheetsLoading, setSheetsLoading] = useState<Set<string>>(new Set())
  const [copiedSheet, setCopiedSheet] = useState<Set<string>>(new Set())
  const [sessionIds, setSessionIds] = useState<string[]>([])
  const [exportingSession, setExportingSession] = useState(false)

  function update(id: string, patch: Partial<FileItem>) {
    setItems((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  }

  async function exportSessionFiles() {
    if (sessionIds.length === 0) return
    setExportingSession(true)
    try {
      const res = await fetch('/api/export/excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentIds: sessionIds }),
      })
      if (!res.ok) return
      const blob = await res.blob()
      const date = new Date().toISOString().slice(0, 10)
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `datafyle-${sessionIds.length}-files-${date}.xlsx`
      a.click()
      URL.revokeObjectURL(a.href)
    } finally {
      setExportingSession(false)
    }
  }

  async function exportToSheets(item: FileItem) {
    if (!item.documentId) return
    setSheetsLoading((prev) => new Set([...prev, item.id]))
    try {
      const res = await fetch('/api/export/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentIds: [item.documentId] }),
      })
      const data = await res.json() as { error?: string; spreadsheetUrl?: string }
      if (data.error === 'not_connected') {
        window.location.href = '/api/auth/google'
        return
      }
      if (!res.ok || !data.spreadsheetUrl) return
      await navigator.clipboard.writeText(data.spreadsheetUrl)
      setCopiedSheet((prev) => new Set([...prev, item.id]))
      setTimeout(() => {
        setCopiedSheet((prev) => { const n = new Set(prev); n.delete(item.id); return n })
      }, 2500)
    } finally {
      setSheetsLoading((prev) => { const n = new Set(prev); n.delete(item.id); return n })
    }
  }

  async function downloadFile(item: FileItem) {
    if (!item.documentId) return
    setDownloading((prev) => new Set([...prev, item.id]))
    try {
      const res = await fetch('/api/export/excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentIds: [item.documentId] }),
      })
      if (!res.ok) return
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = item.file.name.replace(/\.[^.]+$/, '') + '-extracted.xlsx'
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading((prev) => {
        const n = new Set(prev)
        n.delete(item.id)
        return n
      })
    }
  }

  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (busy || atLimit) return
      const newItems: FileItem[] = accepted.map((file) => ({
        id: crypto.randomUUID(),
        file,
        status: 'pending',
      }))
      setItems((prev) => [...prev, ...newItems])
      setBusy(true)

      const successIds: string[] = []

      for (const item of newItems) {
        // Step 1: Upload file
        update(item.id, { status: 'uploading' })
        let documentId: string | null = null
        try {
          const fd = new FormData()
          fd.append('file', item.file)
          const res = await fetch('/api/upload', { method: 'POST', body: fd })
          const data = await res.json()
          if (!res.ok) {
            const msg = data.error === 'limit'
              ? 'Monthly limit reached — upgrade your plan'
              : data.error ?? 'Upload failed'
            update(item.id, { status: 'error', error: msg })
            continue
          }
          documentId = data.documentId
        } catch {
          update(item.id, { status: 'error', error: 'Network error — check connection' })
          continue
        }

        // Step 2: AI extraction
        update(item.id, { status: 'processing', documentId: documentId! })
        try {
          const res = await fetch('/api/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ documentId }),
          })
          if (!res.ok) {
            const data = await res.json()
            update(item.id, { status: 'error', error: data.error ?? 'AI processing failed' })
            continue
          }
          update(item.id, { status: 'done', documentId: documentId! })
          successIds.push(documentId!)
        } catch {
          update(item.id, { status: 'error', error: 'Processing failed — try again' })
        }
      }

      if (successIds.length > 0) {
        onUploadComplete(successIds)
        setSessionIds(successIds)
      }
      setBusy(false)
    },
    [busy, atLimit, onUploadComplete]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxSize: 26_214_400,
    disabled: busy || atLimit,
  })

  if (atLimit) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 px-6 border-2 border-dashed border-[#E2E8F0] rounded-xl bg-[#F8FAFC] text-center">
        <AlertCircle size={36} className="text-[#F59E0B]" />
        <div>
          <p className="font-semibold text-[#1E293B] text-sm">Monthly limit reached</p>
          <p className="text-xs text-slate-400 mt-1">Upgrade your plan to keep processing documents.</p>
        </div>
        {onUpgradePlan && (
          <button
            onClick={onUpgradePlan}
            className="mt-1 px-4 py-2 bg-[#2563EB] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upgrade Plan
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3" id="upload">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all select-none ${
          isDragActive
            ? 'border-[#2563EB] bg-[#EFF6FF] scale-[1.01]'
            : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#2563EB]/60 hover:bg-white'
        } ${busy ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        <input {...getInputProps()} />
        <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-colors ${
          isDragActive ? 'bg-[#2563EB]' : 'bg-white border border-[#E2E8F0]'
        }`}>
          <CloudUpload size={22} className={isDragActive ? 'text-white' : 'text-[#2563EB]'} />
        </div>
        <p className="font-semibold text-[#1E293B] text-sm">
          {isDragActive ? 'Release to upload' : 'Drop files here or click to browse'}
        </p>
        <p className="text-xs text-slate-400 mt-1.5">PDF · Word · Excel · CSV · XML · TXT · Images</p>
        <p className="text-xs text-slate-400">Max 25 MB per file</p>
      </div>

      {/* Session bulk export — shows after all uploads finish with 2+ files */}
      {!busy && sessionIds.length >= 2 && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#EFF6FF] border border-blue-200 rounded-xl">
          <div className="flex items-center gap-2 min-w-0">
            <FileSpreadsheet size={16} className="text-[#2563EB] shrink-0" />
            <span className="text-sm font-medium text-[#1E293B]">
              {sessionIds.length} files ready — export all together
            </span>
          </div>
          <button
            onClick={exportSessionFiles}
            disabled={exportingSession}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-[#2563EB] text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 shrink-0"
          >
            {exportingSession
              ? <Loader2 size={13} className="animate-spin" />
              : <Download size={13} />}
            {exportingSession ? 'Preparing...' : `Export ${sessionIds.length} Files`}
          </button>
        </div>
      )}

      {/* File list */}
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border px-4 py-3 transition-all ${
                item.status === 'error'      ? 'border-red-200 bg-red-50' :
                item.status === 'done'       ? 'border-green-200 bg-green-50' :
                item.status === 'processing' ? 'border-blue-200 bg-[#EFF6FF]' :
                'border-[#E2E8F0] bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Status icon */}
                <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  item.status === 'done'       ? 'bg-green-100' :
                  item.status === 'error'      ? 'bg-red-100' :
                  item.status === 'processing' ? 'bg-[#2563EB]/10' :
                  'bg-slate-100'
                }`}>
                  {item.status === 'uploading'  && <Loader2 size={15} className="text-slate-400 animate-spin" />}
                  {item.status === 'processing' && <Brain size={15} className="text-[#2563EB] animate-pulse" />}
                  {item.status === 'done'       && <CheckCircle2 size={15} className="text-green-500" />}
                  {item.status === 'error'      && <AlertCircle size={15} className="text-red-500" />}
                  {item.status === 'pending'    && <Loader2 size={15} className="text-slate-300 animate-spin" />}
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1E293B] truncate">{item.file.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs text-slate-400">
                      {(item.file.size / 1024).toFixed(0)} KB
                    </span>
                    <span className="text-slate-200">·</span>
                    <span className={`text-xs font-medium ${
                      item.status === 'done'       ? 'text-green-600' :
                      item.status === 'error'      ? 'text-red-500' :
                      item.status === 'processing' ? 'text-[#2563EB]' :
                      'text-slate-400'
                    }`}>
                      {item.status === 'uploading'  ? 'Uploading...' :
                       item.status === 'processing' ? 'AI extracting data...' :
                       item.status === 'done'       ? 'Extraction complete' :
                       item.status === 'error'      ? (item.error ?? 'Failed') :
                       'Waiting...'}
                    </span>
                  </div>

                  {/* Progress bar */}
                  {(item.status === 'uploading' || item.status === 'processing') && (
                    <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full animate-pulse ${
                        item.status === 'processing' ? 'w-4/5 bg-[#2563EB]' : 'w-1/2 bg-slate-300'
                      }`} />
                    </div>
                  )}

                  {/* Download buttons — appear when done */}
                  {item.status === 'done' && item.documentId && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {/* Excel */}
                      <button
                        onClick={() => downloadFile(item)}
                        disabled={downloading.has(item.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#2563EB] text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 shadow-sm"
                      >
                        {downloading.has(item.id)
                          ? <Loader2 size={12} className="animate-spin" />
                          : <Download size={12} />}
                        {downloading.has(item.id) ? 'Preparing...' : 'Download Excel'}
                        {!downloading.has(item.id) && (
                          <FileSpreadsheet size={12} className="text-green-300" />
                        )}
                      </button>

                      {/* Google Sheet */}
                      <button
                        onClick={() => exportToSheets(item)}
                        disabled={sheetsLoading.has(item.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-[#E2E8F0] text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-60 shadow-sm"
                      >
                        {sheetsLoading.has(item.id) ? (
                          <Loader2 size={12} className="animate-spin text-green-600" />
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <rect width="24" height="24" rx="4" fill="#34A853" />
                            <path d="M5 7h14M5 12h14M5 17h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                          </svg>
                        )}
                        {sheetsLoading.has(item.id)
                          ? 'Creating...'
                          : copiedSheet.has(item.id)
                          ? '✓ Link Copied!'
                          : 'Google Sheet'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Remove button */}
                {(item.status === 'done' || item.status === 'error') && (
                  <button
                    onClick={() => setItems((p) => p.filter((f) => f.id !== item.id))}
                    className="p-1.5 rounded-lg hover:bg-white/60 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
