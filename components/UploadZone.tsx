'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { CloudUpload, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

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

interface FileItem {
  id: string
  file: File
  status: 'pending' | 'uploading' | 'done' | 'error'
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
        update(item.id, { status: 'uploading' })
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
          } else {
            update(item.id, { status: 'done', documentId: data.documentId })
            successIds.push(data.documentId)
          }
        } catch {
          update(item.id, { status: 'error', error: 'Network error' })
        }
      }

      if (successIds.length > 0) {
        await fetch('/api/batch-process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentIds: successIds }),
        })
        onUploadComplete(successIds)
      }

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
              className="flex items-center gap-3 bg-white border border-[#E2E8F0] rounded-lg px-4 py-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1E293B] truncate">{item.file.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {(item.file.size / 1024).toFixed(0)} KB
                </p>
                {item.status === 'uploading' && (
                  <div className="mt-1.5 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#2563EB] rounded-full w-2/3 animate-pulse" />
                  </div>
                )}
                {item.error && (
                  <p className="text-xs text-red-500 mt-1">{item.error}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {item.status === 'uploading' && (
                  <Loader2 size={16} className="text-[#2563EB] animate-spin" />
                )}
                {item.status === 'done' && (
                  <CheckCircle2 size={16} className="text-green-500" />
                )}
                {item.status === 'error' && (
                  <AlertCircle size={16} className="text-red-500" />
                )}
                {item.status !== 'uploading' && (
                  <button
                    onClick={() => setItems((p) => p.filter((f) => f.id !== item.id))}
                    className="p-1 rounded hover:bg-[#F8FAFC] text-slate-400 hover:text-slate-600 transition-colors"
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
