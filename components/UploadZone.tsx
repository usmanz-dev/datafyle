'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { CloudUpload, X, CheckCircle2, AlertCircle, Loader2, Brain } from 'lucide-react'

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
}

export function UploadZone({ onUploadComplete }: Props) {
  const [items, setItems] = useState<FileItem[]>([])
  const [busy, setBusy] = useState(false)

  function update(id: string, patch: Partial<FileItem>) {
    setItems((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  }

  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (busy) return
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

        // Step 2: AI extraction (direct, no Inngest)
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
          update(item.id, { status: 'done' })
          successIds.push(documentId!)
        } catch {
          update(item.id, { status: 'error', error: 'Processing failed — try again' })
        }
      }

      if (successIds.length > 0) onUploadComplete(successIds)
      setBusy(false)
    },
    [busy, onUploadComplete]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxSize: 26_214_400,
    disabled: busy,
  })

  const statusLabel: Record<FileStatus, string> = {
    pending:    'Waiting...',
    uploading:  'Uploading...',
    processing: 'AI extracting data...',
    done:       'Done',
    error:      'Failed',
  }

  return (
    <div className="space-y-3" id="upload">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all select-none ${
          isDragActive
            ? 'border-[#2563EB] bg-[#EFF6FF]'
            : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#2563EB]/60 hover:bg-white'
        } ${busy ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        <input {...getInputProps()} />
        <CloudUpload
          size={44}
          className={`mx-auto mb-3 transition-colors ${isDragActive ? 'text-[#2563EB]' : 'text-slate-300'}`}
        />
        <p className="font-semibold text-[#1E293B] text-sm">
          {isDragActive ? 'Release to upload' : 'Drop files here or click to upload'}
        </p>
        <p className="text-xs text-slate-400 mt-1.5">PDF · Word · Excel · CSV · XML · TXT · Images</p>
        <p className="text-xs text-slate-400">Maximum 25MB per file</p>
      </div>

      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 bg-white border rounded-lg px-4 py-3 transition-colors ${
                item.status === 'error' ? 'border-red-200 bg-red-50' :
                item.status === 'done'  ? 'border-green-200 bg-green-50' :
                'border-[#E2E8F0]'
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1E293B] truncate">{item.file.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {(item.file.size / 1024).toFixed(0)} KB
                  <span className="mx-1.5">·</span>
                  <span className={
                    item.status === 'done'       ? 'text-green-600 font-medium' :
                    item.status === 'error'      ? 'text-red-500' :
                    item.status === 'processing' ? 'text-[#2563EB] font-medium' :
                    'text-slate-400'
                  }>
                    {statusLabel[item.status]}
                  </span>
                </p>
                {(item.status === 'uploading' || item.status === 'processing') && (
                  <div className="mt-1.5 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full animate-pulse ${
                      item.status === 'processing' ? 'w-4/5 bg-[#2563EB]' : 'w-2/3 bg-slate-300'
                    }`} />
                  </div>
                )}
                {item.error && (
                  <p className="text-xs text-red-500 mt-1">{item.error}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {item.status === 'uploading' && (
                  <Loader2 size={16} className="text-slate-400 animate-spin" />
                )}
                {item.status === 'processing' && (
                  <Brain size={16} className="text-[#2563EB] animate-pulse" />
                )}
                {item.status === 'done' && (
                  <CheckCircle2 size={16} className="text-green-500" />
                )}
                {item.status === 'error' && (
                  <AlertCircle size={16} className="text-red-500" />
                )}
                {(item.status === 'done' || item.status === 'error') && (
                  <button
                    onClick={() => setItems((p) => p.filter((f) => f.id !== item.id))}
                    className="p-1 rounded hover:bg-white text-slate-400 hover:text-slate-600 transition-colors"
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
