'use client'

import { AlertTriangle, XCircle, Info } from 'lucide-react'

interface AnomalyItem {
  type: string
  severity: string
  reason: string
}

interface AnomalyData {
  isAnomaly: boolean
  severity: 'CRITICAL' | 'HIGH' | 'LOW' | null
  anomalies: AnomalyItem[]
  recommendation: string
}

interface Props {
  anomalyData: AnomalyData | null | undefined
}

export function AnomalyBanner({ anomalyData }: Props) {
  if (!anomalyData?.isAnomaly) return null

  const { severity, anomalies, recommendation } = anomalyData

  if (severity === 'CRITICAL') {
    return (
      <div className="border-l-4 border-red-500 bg-red-50 p-4 mb-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <XCircle size={18} className="text-red-600 shrink-0" />
          <span className="font-semibold text-red-800">
            Critical Anomaly Detected — Do Not Pay Until Verified
          </span>
        </div>
        <ul className="list-disc list-inside space-y-1 mb-2">
          {anomalies.map((a, i) => (
            <li key={i} className="text-sm text-red-700">{a.reason}</li>
          ))}
        </ul>
        <p className="text-xs text-red-600 font-medium">{recommendation}</p>
      </div>
    )
  }

  if (severity === 'HIGH') {
    return (
      <div className="border-l-4 border-orange-500 bg-orange-50 p-4 mb-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={18} className="text-orange-600 shrink-0" />
          <span className="font-semibold text-orange-800">
            Anomaly Detected — Please Review Before Paying
          </span>
        </div>
        <ul className="list-disc list-inside space-y-1 mb-2">
          {anomalies.map((a, i) => (
            <li key={i} className="text-sm text-orange-700">{a.reason}</li>
          ))}
        </ul>
        <p className="text-xs text-orange-600 font-medium">{recommendation}</p>
      </div>
    )
  }

  return (
    <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 mb-4 rounded-r-lg">
      <div className="flex items-center gap-2 mb-2">
        <Info size={18} className="text-yellow-600 shrink-0" />
        <span className="font-semibold text-yellow-800">
          Minor Issue Found — Review When Possible
        </span>
      </div>
      <ul className="list-disc list-inside space-y-1 mb-2">
        {anomalies.map((a, i) => (
          <li key={i} className="text-sm text-yellow-700">{a.reason}</li>
        ))}
      </ul>
      <p className="text-xs text-yellow-600 font-medium">{recommendation}</p>
    </div>
  )
}
