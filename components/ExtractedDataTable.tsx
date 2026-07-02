'use client'

import { ConfidenceBadge } from './ConfidenceBadge'

interface ExtractedField {
  value?: string | number | null
  confidence?: number
}

interface ExtractedData {
  documentType?: string
  vendor?: ExtractedField
  invoiceNumber?: ExtractedField
  date?: ExtractedField
  dueDate?: ExtractedField
  totalAmount?: ExtractedField
  currency?: ExtractedField
  taxAmount?: ExtractedField
  summary?: string
  overallConfidence?: number
  [key: string]: unknown
}

interface Props {
  data: ExtractedData
}

const FIELD_LABELS: Record<string, string> = {
  vendor: 'Vendor',
  invoiceNumber: 'Invoice Number',
  date: 'Invoice Date',
  dueDate: 'Due Date',
  totalAmount: 'Total Amount',
  currency: 'Currency',
  taxAmount: 'Tax Amount',
  documentType: 'Document Type',
}

const DISPLAY_FIELDS = ['vendor', 'invoiceNumber', 'date', 'dueDate', 'totalAmount', 'currency', 'taxAmount']

export function ExtractedDataTable({ data }: Props) {
  if (!data) return null

  const rows = DISPLAY_FIELDS.map((key) => {
    const field = data[key] as ExtractedField | undefined
    const value = field?.value
    const confidence = field?.confidence ?? 0
    return { key, label: FIELD_LABELS[key] ?? key, value, confidence }
  }).filter((r) => r.value !== null && r.value !== undefined && r.value !== '')

  const lowConfidenceCount = rows.filter((r) => r.confidence < 70).length
  const overallConfidence = data.overallConfidence ?? 0

  return (
    <div className="space-y-4">
      {data.documentType && (
        <div className="text-xs font-medium text-[#2563EB] uppercase tracking-wide">
          {data.documentType}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-[#E2E8F0]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <th className="text-left px-4 py-2.5 font-medium text-[#1E293B]">Field</th>
              <th className="text-left px-4 py-2.5 font-medium text-[#1E293B]">Value</th>
              <th className="text-left px-4 py-2.5 font-medium text-[#1E293B]">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.key}
                className={`border-b border-[#E2E8F0] last:border-0 ${
                  row.confidence < 70 ? 'bg-yellow-50' : 'bg-white'
                }`}
              >
                <td className="px-4 py-3 text-[#1E293B] font-medium">{row.label}</td>
                <td className="px-4 py-3 text-[#1E293B]">
                  {typeof row.value === 'number'
                    ? row.value.toLocaleString()
                    : String(row.value)}
                </td>
                <td className="px-4 py-3">
                  <ConfidenceBadge score={row.confidence} fieldName={row.label} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Overall: <strong className="text-[#1E293B]">{overallConfidence}%</strong> confidence
        </span>
        {lowConfidenceCount > 0 && (
          <span className="text-yellow-600 font-medium">
            {lowConfidenceCount} field{lowConfidenceCount > 1 ? 's' : ''} need verification
          </span>
        )}
      </div>

      {data.summary && (
        <p className="text-xs text-slate-500 italic border-t border-[#E2E8F0] pt-3">
          {data.summary}
        </p>
      )}
    </div>
  )
}
