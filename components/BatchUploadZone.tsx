'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  CloudUpload, X, CheckCircle2, AlertCircle, Loader2,
  FileText, FileSpreadsheet, FileCode2, Image as ImageIcon, File,
  Download, Trash2, Zap, Clock,
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

const MAX_FILES = 50

type Stage = 'idle' | 'uploading' | 'queued' | 'error'

interface QueuedFile {
  id: string
  file: File
  error?: string
}

function fileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  switch (ext) {
    case 'pdf':               return { Icon: FileText,        color: 'text-red-500',    bg: 'bg-red-50'    }
    case 'docx': case 'doc':  return { Icon: FileText,        color: 'text-blue-500',   bg: 'bg-blue-50'   }
    case 'xlsx': case 'xls':  return { Icon: FileSpreadsheet, color: 'text-green-600',  bg: 'bg-green-50'  }
    case 'csv':               return { Icon: FileSpreadsheet, color: 'text-emerald-500',bg: 'bg-emerald-50'}
    case 'xml':               return { Icon: FileCode2,       color: 'text-orange-500', bg: 'bg-orange-50' }
    case 'jpg': case 'jpeg': case 'png':
                              return { Icon: ImageIcon,        color: 'text-purple-500', bg: 'bg-purple-50' }
    default:                  return { Icon: File,             color: 'text-slate-400',  bg: 'bg-slate-50'  }
  }
}

function fmt(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

interface Props {
  onBatchComplete: () => void
  atLimit?: boolean
  onUpgradePlan?: () => void
}

export function BatchUploadZone({ onBatchComplete, atLimit, onUpgradePlan }: Props) {
  const [files, setFiles]           = useState<QueuedFile[]>([])
  const [stage, setStage]           = useState<Stage>('idle')
  const [progress, setProgress]     = useState(0)       // 0-100 during upload
  const [queued, setQueued]         = useState(0)        // how many queued
  const [docIds, setDocIds]         = useState<string[]>([])
  const [exporting, setExporting]   = useState(false)
  const [errorMsg, setErrorMsg]     = useState<string | null>(null)

  const onDrop = useCallback((accepted: File[]) => {
    if (stage !== 'idle') return
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.file.name + f.file.size))
      const fresh = accepted
        .filter((f) => !existing.has(f.name + f.size))
        .slice(0, MAX_FILES - prev.length)
        .map((f) => ({ id: crypto.randomUUID(), file: f }))
      return [...prev, ...fresh]
    })
  }, [stage])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxSize: 26_214_400,
    multiple: true,
    disabled: stage !== 'idle' || atLimit,
  })

  function removeFile(id: string) {
    setFiles((p) => p.filter((f) => f.id !== id))
  }

  function reset() {
    setFiles([])
    setStage('idle')
    setProgress(0)
    setQueued(0)
    setDocIds([])
    setErrorMsg(null)
  }

  async function uploadAll() {
    if (!files.length || stage !== 'idle') return
    setStage('uploading')
    setProgress(0)
    setErrorMsg(null)

    try {
      // Step 1: Upload all files to R2
      const fd = new FormData()
      files.forEach((f) => fd.append('files', f.file))

      // Simulate progress during upload (can't get real progress with fetch)
      const progressTimer = setInterval(() => {
        setProgress((p) => Math.min(p + 8, 85))
      }, 300)

      const res = await fetch('/api/upload/batch', { method: 'POST', body: fd })
      clearInterval(progressTimer)
      setProgress(90)

      const data = await res.json()

      if (!res.ok) {
        if (data.error === 'limit') {
          setErrorMsg(data.message ?? 'Monthly limit reached. Please upgrade your plan.')
        } else {
          setErrorMsg(data.error ?? 'Upload failed. Please try again.')
        }
        setStage('error')
        return
      }

      const ids: string[] = data.documentIds ?? []
      if (!ids.length) {
        setErrorMsg('No files were uploaded. Check file types and sizes.')
        setStage('error')
        return
      }

      // Step 2: Queue for AI processing via Inngest
      setProgress(95)
      const queueRes = await fetch('/api/batch-process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentIds: ids }),
      })

      if (!queueRes.ok) {
        setErrorMsg('Files uploaded but failed to queue for processing. Please refresh and try processing manually.')
        setStage('error')
        return
      }

      setProgress(100)
      setDocIds(ids)
      setQueued(ids.length)
      setStage('queued')
      onBatchComplete()
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.')
      setStage('error')
    }
  }

  async function exportAll() {
    if (!docIds.length) return
    setExporting(true)
    try {
      const res = await fetch('/api/export/excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentIds: docIds }),
      })
      if (!res.ok) return
      const blob = await res.blob()
      const date = new Date().toISOString().slice(0, 10)
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `datafyle-batch-${docIds.length}-files-${date}.xlsx`
      a.click()
      URL.revokeObjectURL(a.href)
    } finally {
      setExporting(false)
    }
  }

  const totalSize = files.reduce((s, f) => s + f.file.size, 0)

  // ── Limit reached state ───────────────────────────────────────────────────
  if (atLimit) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 px-6 border-2 border-dashed border-[#E2E8F0] rounded-xl bg-[#F8FAFC] text-center">
        <AlertCircle size={36} className="text-[#F59E0B]" />
        <div>
          <p className="font-semibold text-[#1E293B] text-sm">Monthly limit reached</p>
          <p className="text-xs text-slate-400 mt-1">Upgrade your plan to keep processing documents.</p>
        </div>
        {onUpgradePlan && (
          <button onClick={onUpgradePlan} className="mt-1 px-4 py-2 bg-[#2563EB] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
            Upgrade Plan
          </button>
        )}
      </div>
    )
  }

  // ── Queued success state ──────────────────────────────────────────────────
  if (stage === 'queued') {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center gap-3 py-8 px-6 bg-green-50 border border-green-200 rounded-xl text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 size={28} className="text-green-500" />
          </div>
          <div>
            <p className="font-bold text-[#1E293B] text-base">
              {queued} file{queued !== 1 ? 's' : ''} queued for AI processing
            </p>
            <p className="text-sm text-slate-500 mt-1 flex items-center justify-center gap-1">
              <Clock size={13} className="text-slate-400" />
              Processing in background — dashboard updates automatically
            </p>
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap justify-center">
            <button
              onClick={exportAll}
              disabled={exporting}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {exporting
                ? <Loader2 size={14} className="animate-spin" />
                : <Download size={14} />}
              {exporting ? 'Preparing Excel…' : `Export ${queued} Files to Excel`}
              {!exporting && <FileSpreadsheet size={13} className="text-blue-200" />}
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-[#E2E8F0] text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Zap size={14} />
              Upload More
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Uploading state ───────────────────────────────────────────────────────
  if (stage === 'uploading') {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center gap-4 py-8 px-6 bg-[#EFF6FF] border border-blue-200 rounded-xl text-center">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center border border-blue-100 shadow-sm">
            <Loader2 size={26} className="text-[#2563EB] animate-spin" />
          </div>
          <div>
            <p className="font-bold text-[#1E293B] text-base">Uploading {files.length} files…</p>
            <p className="text-sm text-slate-500 mt-1">Please don&apos;t close this tab</p>
          </div>
          {/* Progress bar */}
          <div className="w-full max-w-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
              <span>{progress < 90 ? 'Uploading to secure storage…' : progress < 98 ? 'Queueing for AI…' : 'Almost done…'}</span>
              <span className="font-semibold text-[#2563EB]">{progress}%</span>
            </div>
            <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2563EB] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (stage === 'error') {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-red-700">Upload failed</p>
            <p className="text-xs text-red-500 mt-0.5">{errorMsg}</p>
          </div>
          <button onClick={reset} className="text-xs text-red-400 hover:text-red-600 shrink-0 underline">
            Try again
          </button>
        </div>
      </div>
    )
  }

  // ── Idle state — drop zone + file list ───────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all select-none ${
          isDragActive
            ? 'border-[#2563EB] bg-[#EFF6FF] scale-[1.01]'
            : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#2563EB]/60 hover:bg-white'
        }`}
      >
        <input {...getInputProps()} />
        <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-colors ${
          isDragActive ? 'bg-[#2563EB]' : 'bg-white border border-[#E2E8F0]'
        }`}>
          <CloudUpload size={22} className={isDragActive ? 'text-white' : 'text-[#2563EB]'} />
        </div>
        <p className="font-semibold text-[#1E293B] text-sm">
          {isDragActive ? 'Release to add files' : 'Drop multiple files here or click to browse'}
        </p>
        <p className="text-xs text-slate-400 mt-1.5">PDF · Word · Excel · CSV · XML · TXT · Images · Max 25 MB each</p>
        <p className="text-xs text-slate-400">Up to {MAX_FILES} files per batch</p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {/* Summary bar */}
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-semibold text-[#1E293B]">
              {files.length} file{files.length !== 1 ? 's' : ''} selected
              <span className="text-slate-400 font-normal ml-2">({fmt(totalSize)} total)</span>
            </span>
            <button
              onClick={() => setFiles([])}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={12} /> Clear all
            </button>
          </div>

          {/* Files */}
          <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
            {files.map((item) => {
              const { Icon, color, bg } = fileIcon(item.file.name)
              return (
                <div key={item.id} className="flex items-center gap-3 px-3 py-2.5 bg-white border border-[#E2E8F0] rounded-xl group hover:border-slate-300 transition-colors">
                  <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                    <Icon size={14} className={color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1E293B] truncate">{item.file.name}</p>
                    <p className="text-xs text-slate-400">{fmt(item.file.size)}</p>
                  </div>
                  <button
                    onClick={() => removeFile(item.id)}
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-slate-300 hover:text-red-400 transition-all shrink-0"
                  >
                    <X size={13} />
                  </button>
                </div>
              )
            })}
          </div>

          {/* Upload button */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={uploadAll}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#2563EB] text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Zap size={16} />
              Upload &amp; Process {files.length} Files with AI
            </button>
            {files.length < MAX_FILES && (
              <span className="text-xs text-slate-400 whitespace-nowrap">
                {MAX_FILES - files.length} more allowed
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
