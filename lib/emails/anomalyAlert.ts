import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface AnomalyItem {
  type: string
  severity: string
  reason: string
}

interface AnomalyEmailParams {
  to: string
  fileName: string
  vendor: string | null
  amount: number | null
  severity: 'CRITICAL' | 'HIGH'
  anomalies: AnomalyItem[]
  recommendation: string
}

export async function sendAnomalyAlert(params: AnomalyEmailParams) {
  const { to, fileName, vendor, amount, severity, anomalies, recommendation } = params

  const icon = severity === 'CRITICAL' ? '🚨' : '⚠️'
  const subject = `${icon} Anomaly Detected in ${fileName}`

  const reasons = anomalies.map((a) => `  • ${a.reason}`).join('\n')

  const body = [
    `${severity} ANOMALY DETECTED`,
    ``,
    `File: ${fileName}`,
    vendor ? `Vendor: ${vendor}` : null,
    amount != null ? `Amount: $${amount.toLocaleString()}` : null,
    ``,
    `Issues found:`,
    reasons,
    ``,
    `Recommendation: ${recommendation}`,
    ``,
    `Log in to review: https://datafyle.com/dashboard`,
    ``,
    `— Datafyle Anomaly Detector`,
  ]
    .filter((line) => line !== null)
    .join('\n')

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'noreply@datafyle.com',
    to,
    subject,
    text: body,
  })
}
