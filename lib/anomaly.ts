interface ExtractedField {
  value?: string | number | null
  confidence?: number
}

interface ExtractedData {
  totalAmount?: ExtractedField
  invoiceNumber?: ExtractedField
  date?: ExtractedField
  vendor?: ExtractedField
  [key: string]: unknown
}

interface VendorPattern {
  avgAmount?: number | null
  invoiceCount: number
}

interface DocumentRecord {
  extractedData?: unknown
}

interface AnomalyItem {
  type: string
  severity: 'CRITICAL' | 'HIGH' | 'LOW'
  reason: string
}

export function detectAnomaly(
  currentDoc: ExtractedData,
  vendorPattern: VendorPattern | null,
  recentDocs: DocumentRecord[]
) {
  const anomalies: AnomalyItem[] = []
  const amount = currentDoc.totalAmount?.value as number | null | undefined

  // Check 1: Amount spike compared to vendor average
  if (vendorPattern?.avgAmount && amount) {
    const ratio = amount / vendorPattern.avgAmount
    if (ratio > 5) {
      anomalies.push({
        type: 'AMOUNT_SPIKE',
        severity: 'CRITICAL',
        reason: `Amount $${amount} is ${ratio.toFixed(1)}x higher than vendor average $${vendorPattern.avgAmount}`,
      })
    } else if (ratio > 2) {
      anomalies.push({
        type: 'AMOUNT_SPIKE',
        severity: 'HIGH',
        reason: `Amount is ${ratio.toFixed(1)}x higher than usual`,
      })
    }
  }

  // Check 2: Duplicate invoice number
  const invNum = currentDoc.invoiceNumber?.value as string | null | undefined
  if (invNum) {
    const dup = recentDocs.find((d) => {
      const prev = d.extractedData as ExtractedData | null
      return prev?.invoiceNumber?.value === invNum
    })
    if (dup) {
      anomalies.push({
        type: 'DUPLICATE',
        severity: 'CRITICAL',
        reason: `Invoice number ${invNum} was already processed before`,
      })
    }
  }

  // Check 3: Future date
  const dateStr = currentDoc.date?.value as string | null | undefined
  if (dateStr) {
    const invoiceDate = new Date(dateStr)
    const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    if (invoiceDate > weekFromNow) {
      anomalies.push({
        type: 'FUTURE_DATE',
        severity: 'LOW',
        reason: `Invoice is dated ${dateStr} which is in the future`,
      })
    }
  }

  const severity = anomalies.find((a) => a.severity === 'CRITICAL')
    ? 'CRITICAL'
    : anomalies.find((a) => a.severity === 'HIGH')
      ? 'HIGH'
      : anomalies.length > 0
        ? 'LOW'
        : null

  return {
    isAnomaly: anomalies.length > 0,
    severity,
    anomalies,
    recommendation:
      severity === 'CRITICAL'
        ? 'Do not pay until verified'
        : severity === 'HIGH'
          ? 'Please verify with vendor before paying'
          : 'Minor issue found, review when possible',
  }
}
