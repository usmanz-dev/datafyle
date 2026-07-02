'use client'

import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

interface Props {
  score: number
  fieldName?: string
}

export function ConfidenceBadge({ score, fieldName }: Props) {
  if (score >= 90) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-300">
        <CheckCircle size={12} />
        {score}%
      </span>
    )
  }

  if (score >= 70) {
    return (
      <span
        title={fieldName ? `Please verify: ${fieldName}` : 'Please verify this field'}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-300 cursor-help"
      >
        <AlertTriangle size={12} />
        {score}%
      </span>
    )
  }

  return (
    <span
      title={fieldName ? `Low confidence: ${fieldName} — check manually` : 'Low confidence — check manually'}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-300 cursor-help"
    >
      <XCircle size={12} />
      {score}%
    </span>
  )
}
