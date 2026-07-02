'use client'

import { AlertTriangle } from 'lucide-react'

interface Props {
  isAnomaly: boolean
  severity?: string | null
}

export function AnomalyIcon({ isAnomaly, severity }: Props) {
  if (!isAnomaly) return null

  const color =
    severity === 'CRITICAL'
      ? 'text-red-600'
      : severity === 'HIGH'
        ? 'text-orange-500'
        : 'text-yellow-500'

  return (
    <span title="Anomaly detected — click View to see details">
      <AlertTriangle size={16} className={`${color} shrink-0`} />
    </span>
  )
}
