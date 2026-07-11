import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM   = process.env.RESEND_FROM_EMAIL ?? 'noreply@datafyle.com'
const SITE   = 'https://datafyle.com'

// ── Shared helpers ────────────────────────────────────────────────────────────

function wrap(body: string, preview = ''): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
</head>
<body style="margin:0;padding:0;background-color:#F1F5F9;-webkit-font-smoothing:antialiased;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
${preview ? `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${preview}&nbsp;&zwnj;&nbsp;</div>` : ''}
<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background-color:#F1F5F9;">
  <tr>
    <td align="center" style="padding:48px 16px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:600px;">

        <!-- HEADER -->
        <tr>
          <td style="background-color:#1E293B;border-radius:12px 12px 0 0;padding:22px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
                  <span style="font-size:20px;font-weight:800;color:#FFFFFF;letter-spacing:-0.5px;font-family:Inter,-apple-system,sans-serif;">
                    Data<span style="color:#60A5FA;">fyle</span>
                  </span>
                </td>
                <td align="right">
                  <span style="font-size:11px;color:#64748B;letter-spacing:1px;text-transform:uppercase;font-weight:500;">AI &middot; Document Processing</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="background-color:#FFFFFF;padding:40px 32px;border-left:1px solid #E2E8F0;border-right:1px solid #E2E8F0;">
            ${body}
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background-color:#F8FAFC;border:1px solid #E2E8F0;border-top:1px solid #E2E8F0;border-radius:0 0 12px 12px;padding:20px 32px;text-align:center;">
            <p style="margin:0 0 6px;font-size:12px;color:#94A3B8;font-family:Inter,-apple-system,sans-serif;">
              <a href="${SITE}" style="color:#94A3B8;text-decoration:none;">datafyle.com</a>
              &nbsp;&middot;&nbsp;
              <a href="${SITE}/privacy" style="color:#94A3B8;text-decoration:none;">Privacy</a>
              &nbsp;&middot;&nbsp;
              <a href="${SITE}/contact" style="color:#94A3B8;text-decoration:none;">Contact</a>
            </p>
            <p style="margin:0;font-size:11px;color:#CBD5E1;font-family:Inter,-apple-system,sans-serif;">&copy; 2026 Datafyle. All rights reserved.</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}

function btn(label: string, href: string, color = '#2563EB'): string {
  return `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="margin:28px 0 4px;">
  <tr>
    <td style="background-color:${color};border-radius:8px;">
      <a href="${href}" target="_blank"
        style="display:block;padding:14px 36px;color:#FFFFFF;font-size:15px;font-weight:700;text-decoration:none;border-radius:8px;text-align:center;font-family:Inter,-apple-system,sans-serif;">
        ${label} &rarr;
      </a>
    </td>
  </tr>
</table>`
}

function divider(): string {
  return `<table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:24px 0;" role="presentation">
  <tr><td style="border-top:1px solid #E2E8F0;font-size:0;">&nbsp;</td></tr>
</table>`
}

function checkItem(text: string): string {
  return `<tr>
  <td style="padding:5px 0;font-size:14px;color:#1E293B;font-family:Inter,-apple-system,sans-serif;line-height:1.6;">
    <span style="color:#22C55E;font-weight:700;margin-right:10px;">&#10003;</span>${text}
  </td>
</tr>`
}

function planBadge(plan: string): string {
  const map: Record<string, { bg: string; color: string }> = {
    free:         { bg: '#F1F5F9', color: '#475569' },
    starter:      { bg: '#DBEAFE', color: '#1D4ED8' },
    professional: { bg: '#EDE9FE', color: '#6D28D9' },
    business:     { bg: '#FEF3C7', color: '#92400E' },
    enterprise:   { bg: '#DCFCE7', color: '#166534' },
  }
  const c = map[plan.toLowerCase()] ?? map['free']
  const label = plan.charAt(0).toUpperCase() + plan.slice(1)
  return `<span style="display:inline-block;padding:5px 14px;background-color:${c.bg};color:${c.color};border-radius:20px;font-size:12px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;font-family:Inter,-apple-system,sans-serif;">${label} Plan</span>`
}

const PLAN_FEATURES: Record<string, { docs: string; seats: string; extras: string[] }> = {
  starter:      { docs: '500 documents/month',    seats: '2 team seats',  extras: ['Anomaly detection', 'Monthly reports', 'Excel export'] },
  professional: { docs: '3,000 documents/month',  seats: '5 team seats',  extras: ['Batch upload', 'Google Sheets sync', 'Smart Memory — vendor tracking'] },
  business:     { docs: '10,000 documents/month', seats: '15 team seats', extras: ['All features unlocked', 'Priority support — 4-hour SLA'] },
  enterprise:   { docs: '20,000 documents/month', seats: '50 team seats', extras: ['All features unlocked', 'Priority support — 1-hour SLA', 'Dedicated onboarding'] },
}

function getFirstName(name: string | null | undefined, fallbackEmail: string): string {
  if (name) return name.split(/[\s@]/)[0] ?? name
  return fallbackEmail.split('@')[0] ?? 'there'
}

// ── 1. Welcome — Free Signup ──────────────────────────────────────────────────

export async function sendWelcomeFreeEmail(to: string, name: string | null) {
  const fname = getFirstName(name, to)

  const html = wrap(`
    <h2 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#1E293B;font-family:Inter,-apple-system,sans-serif;">Welcome to Datafyle, ${fname}! &#x1F389;</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#64748B;line-height:1.7;font-family:Inter,-apple-system,sans-serif;">
      Your account is ready. You have <strong style="color:#2563EB;">10 free documents</strong> to process — no credit card needed.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
      style="background-color:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;margin-bottom:28px;">
      <tr><td style="padding:24px 28px;">
        <p style="margin:0 0 14px;font-size:12px;font-weight:700;color:#1E293B;letter-spacing:1px;text-transform:uppercase;font-family:Inter,-apple-system,sans-serif;">What you can do right now:</p>
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          ${checkItem('Upload any invoice, receipt or document (PDF, Excel, image and more)')}
          ${checkItem('AI extracts all data automatically in seconds')}
          ${checkItem('Download a clean, formatted Excel file instantly')}
          ${checkItem('See confidence scores for every extracted field')}
        </table>
      </td></tr>
    </table>

    ${btn('Go to Dashboard', `${SITE}/dashboard`)}

    ${divider()}

    <p style="margin:0;font-size:13px;color:#94A3B8;line-height:1.7;font-family:Inter,-apple-system,sans-serif;">
      Need more than 10 documents? <a href="${SITE}/pricing" style="color:#2563EB;text-decoration:none;font-weight:600;">Upgrade from $49/month</a> &mdash;
      one bookkeeper costs $2,500/month. Datafyle costs $49.
    </p>
  `, `Welcome! Your Datafyle account is ready — 10 free documents to process.`)

  await resend.emails.send({
    from:    FROM,
    to,
    subject: `Welcome to Datafyle, ${fname}! Your account is ready`,
    html,
  })
}

// ── 2. Welcome — Paid Plan ────────────────────────────────────────────────────

export async function sendWelcomePaidEmail(to: string, planName: string, name?: string | null) {
  const fname      = getFirstName(name, to)
  const plan       = planName.toLowerCase()
  const planLabel  = plan.charAt(0).toUpperCase() + plan.slice(1)
  const info       = PLAN_FEATURES[plan] ?? PLAN_FEATURES['starter']

  const html = wrap(`
    <div style="margin-bottom:20px;">${planBadge(plan)}</div>
    <h2 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#1E293B;font-family:Inter,-apple-system,sans-serif;">You're all set, ${fname}! &#x1F680;</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#64748B;line-height:1.7;font-family:Inter,-apple-system,sans-serif;">
      Your <strong style="color:#1E293B;">${planLabel}</strong> subscription is now active. Start processing documents immediately &mdash; no setup required.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
      style="background-color:#EFF6FF;border:1px solid #BFDBFE;border-radius:10px;margin-bottom:28px;">
      <tr><td style="padding:24px 28px;">
        <p style="margin:0 0 4px;font-size:12px;font-weight:700;color:#1D4ED8;letter-spacing:1px;text-transform:uppercase;font-family:Inter,-apple-system,sans-serif;">Your ${planLabel} plan includes:</p>
        <p style="margin:0 0 16px;font-size:24px;font-weight:800;color:#1E293B;font-family:Inter,-apple-system,sans-serif;">${info.docs}</p>
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          ${checkItem(info.seats)}
          ${info.extras.map(checkItem).join('')}
        </table>
      </td></tr>
    </table>

    ${btn('Start Processing Documents', `${SITE}/dashboard`)}

    ${divider()}

    <p style="margin:0;font-size:13px;color:#94A3B8;line-height:1.7;font-family:Inter,-apple-system,sans-serif;">
      Questions? <a href="${SITE}/contact" style="color:#2563EB;text-decoration:none;">Contact us</a> or reply to this email &mdash; we reply within 24 hours.
    </p>
  `, `Your ${planLabel} plan is active — ${info.docs}. Let's get started!`)

  await resend.emails.send({
    from:    FROM,
    to,
    subject: `You're on Datafyle ${planLabel} — let's get started!`,
    html,
  })
}

// ── 3. Batch Processing Started ───────────────────────────────────────────────

export async function sendBatchStartedEmail(to: string, count: number, name?: string | null) {
  const fname   = getFirstName(name, to)
  const docWord = count === 1 ? 'document' : 'documents'
  const estMins = Math.max(1, Math.ceil(count * 0.4))

  const html = wrap(`
    <h2 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#1E293B;font-family:Inter,-apple-system,sans-serif;">Batch processing started, ${fname}! &#x26A1;</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#64748B;line-height:1.7;font-family:Inter,-apple-system,sans-serif;">
      Your batch of <strong style="color:#2563EB;">${count} ${docWord}</strong> has been queued and AI extraction is now underway.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
      style="background-color:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;margin-bottom:28px;">
      <tr><td style="padding:24px 28px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:13px;color:#64748B;font-family:Inter,-apple-system,sans-serif;">Documents queued</td>
            <td align="right" style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:14px;font-weight:700;color:#1E293B;font-family:Inter,-apple-system,sans-serif;">${count} ${docWord}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:13px;color:#64748B;font-family:Inter,-apple-system,sans-serif;">Estimated completion</td>
            <td align="right" style="padding:10px 0;border-bottom:1px solid #F1F5F9;font-size:14px;font-weight:700;color:#1E293B;font-family:Inter,-apple-system,sans-serif;">~${estMins} min${estMins !== 1 ? 's' : ''}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;font-size:13px;color:#64748B;font-family:Inter,-apple-system,sans-serif;">Anomaly alerts</td>
            <td align="right" style="padding:10px 0;font-size:14px;font-weight:700;color:#22C55E;font-family:Inter,-apple-system,sans-serif;">Active</td>
          </tr>
        </table>
      </td></tr>
    </table>

    <p style="margin:0 0 28px;font-size:14px;color:#64748B;line-height:1.7;font-family:Inter,-apple-system,sans-serif;">
      Results appear in your dashboard as each document finishes. If any anomalies are found &mdash; duplicate invoices, unusual amounts &mdash; you'll receive a separate alert automatically.
    </p>

    ${btn('View Dashboard', `${SITE}/dashboard`)}
  `, `${count} ${docWord} are now being processed — results will appear in your dashboard.`)

  await resend.emails.send({
    from:    FROM,
    to,
    subject: `Processing ${count} ${docWord} — Datafyle batch started`,
    html,
  })
}

// ── 4. Anomaly Alert ──────────────────────────────────────────────────────────

interface AnomalyItem {
  type:     string
  severity: string
  reason:   string
}

interface AnomalyAlertParams {
  to:             string
  fileName:       string
  vendor:         string | null
  amount:         number | null
  severity:       'CRITICAL' | 'HIGH'
  anomalies:      AnomalyItem[]
  recommendation: string
}

export async function sendAnomalyAlert(params: AnomalyAlertParams) {
  const { to, fileName, vendor, amount, severity, anomalies, recommendation } = params
  const isCritical  = severity === 'CRITICAL'
  const alertColor  = isCritical ? '#EF4444' : '#F97316'
  const alertBg     = isCritical ? '#FEF2F2' : '#FFF7ED'
  const alertBorder = isCritical ? '#FECACA' : '#FED7AA'
  const alertIcon   = isCritical ? '&#x1F6A8;' : '&#x26A0;&#xFE0F;'

  const html = wrap(`
    <div style="margin-bottom:20px;">
      <span style="display:inline-block;padding:6px 14px;background-color:${alertBg};color:${alertColor};border-radius:20px;font-size:12px;font-weight:700;letter-spacing:0.8px;border:1px solid ${alertBorder};font-family:Inter,-apple-system,sans-serif;">
        ${alertIcon} ${severity} ANOMALY
      </span>
    </div>

    <h2 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#1E293B;font-family:Inter,-apple-system,sans-serif;">Anomaly Detected</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#64748B;line-height:1.7;font-family:Inter,-apple-system,sans-serif;">
      A <strong style="color:${alertColor};">${severity.toLowerCase()} severity anomaly</strong> was found in one of your documents. Please review it before processing payment.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
      style="background-color:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;margin-bottom:20px;">
      <tr><td style="padding:24px 28px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #F1F5F9;font-size:13px;color:#64748B;width:110px;font-family:Inter,-apple-system,sans-serif;">File</td>
            <td style="padding:8px 0;border-bottom:1px solid #F1F5F9;font-size:14px;font-weight:600;color:#1E293B;font-family:Inter,-apple-system,sans-serif;">${fileName}</td>
          </tr>
          ${vendor ? `
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #F1F5F9;font-size:13px;color:#64748B;font-family:Inter,-apple-system,sans-serif;">Vendor</td>
            <td style="padding:8px 0;border-bottom:1px solid #F1F5F9;font-size:14px;font-weight:600;color:#1E293B;font-family:Inter,-apple-system,sans-serif;">${vendor}</td>
          </tr>` : ''}
          ${amount != null ? `
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #F1F5F9;font-size:13px;color:#64748B;font-family:Inter,-apple-system,sans-serif;">Amount</td>
            <td style="padding:8px 0;border-bottom:1px solid #F1F5F9;font-size:14px;font-weight:700;color:#1E293B;font-family:Inter,-apple-system,sans-serif;">$${amount.toLocaleString()}</td>
          </tr>` : ''}
          <tr>
            <td style="padding:12px 0 4px;font-size:13px;color:#64748B;vertical-align:top;font-family:Inter,-apple-system,sans-serif;">Issues</td>
            <td style="padding:12px 0 4px;font-size:14px;color:#1E293B;font-family:Inter,-apple-system,sans-serif;">
              ${anomalies.map(a => `<div style="margin-bottom:6px;line-height:1.5;">&#x2022; ${a.reason}</div>`).join('')}
            </td>
          </tr>
        </table>
      </td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
      style="background-color:${alertBg};border:1px solid ${alertBorder};border-radius:10px;margin-bottom:28px;">
      <tr><td style="padding:18px 22px;">
        <p style="margin:0 0 5px;font-size:12px;font-weight:700;color:${alertColor};text-transform:uppercase;letter-spacing:0.5px;font-family:Inter,-apple-system,sans-serif;">Recommendation</p>
        <p style="margin:0;font-size:14px;color:#1E293B;line-height:1.6;font-family:Inter,-apple-system,sans-serif;">${recommendation}</p>
      </td></tr>
    </table>

    ${btn('Review in Dashboard', `${SITE}/dashboard`, alertColor)}

    <p style="margin:20px 0 0;font-size:12px;color:#94A3B8;text-align:center;font-family:Inter,-apple-system,sans-serif;">
      Sent by Datafyle Anomaly Detector &middot; Manage alerts in <a href="${SITE}/settings" style="color:#94A3B8;">settings</a>
    </p>
  `, `${severity} anomaly found in ${fileName} — review required before payment.`)

  await resend.emails.send({
    from:    FROM,
    to,
    subject: `${isCritical ? '🚨' : '⚠️'} ${severity}: ${fileName} — Datafyle Anomaly Alert`,
    html,
  })
}

// ── 5. Team Invitation ────────────────────────────────────────────────────────

export async function sendTeamInviteEmail(
  to:          string,
  inviterName: string,
  teamName:    string,
  role:        string,
  acceptUrl:   string,
) {
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1)

  const html = wrap(`
    <h2 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#1E293B;font-family:Inter,-apple-system,sans-serif;">You've been invited! &#x1F44B;</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#64748B;line-height:1.7;font-family:Inter,-apple-system,sans-serif;">
      <strong style="color:#1E293B;">${inviterName}</strong> has invited you to join
      <strong style="color:#2563EB;">${teamName}</strong> on Datafyle as a team <strong style="color:#1E293B;">${roleLabel}</strong>.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
      style="background-color:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;margin-bottom:28px;">
      <tr><td style="padding:24px 28px;">
        <p style="margin:0 0 14px;font-size:12px;font-weight:700;color:#1E293B;letter-spacing:1px;text-transform:uppercase;font-family:Inter,-apple-system,sans-serif;">What is Datafyle?</p>
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          ${checkItem('Upload any invoice or financial document')}
          ${checkItem('AI extracts all data automatically in seconds')}
          ${checkItem('Download clean, formatted Excel files instantly')}
          ${checkItem('Detect duplicate invoices &amp; anomalies automatically')}
        </table>
      </td></tr>
    </table>

    ${btn('Accept Invitation', acceptUrl)}

    ${divider()}

    <p style="margin:0;font-size:13px;color:#94A3B8;text-align:center;line-height:1.7;font-family:Inter,-apple-system,sans-serif;">
      This invite expires in <strong style="color:#64748B;">7 days</strong>.<br/>
      If you weren't expecting this, you can safely ignore this email.
    </p>
  `, `${inviterName} invited you to join ${teamName} on Datafyle.`)

  await resend.emails.send({
    from:    FROM,
    to,
    subject: `${inviterName} invited you to join ${teamName} on Datafyle`,
    html,
  })
}

// ── 6. Subscription Cancelled ─────────────────────────────────────────────────

export async function sendCancellationEmail(to: string, previousPlan: string, name?: string | null) {
  const fname      = getFirstName(name, to)
  const planLabel  = previousPlan.charAt(0).toUpperCase() + previousPlan.slice(1)

  const html = wrap(`
    <h2 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#1E293B;font-family:Inter,-apple-system,sans-serif;">Your subscription has been cancelled</h2>
    <p style="margin:0 0 24px;font-size:15px;color:#64748B;line-height:1.7;font-family:Inter,-apple-system,sans-serif;">
      Hi ${fname}, your <strong style="color:#1E293B;">${planLabel}</strong> subscription has been cancelled. We're sorry to see you go.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
      style="background-color:#FFF7ED;border:1px solid #FED7AA;border-radius:10px;margin-bottom:20px;">
      <tr><td style="padding:22px 28px;">
        <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#92400E;text-transform:uppercase;letter-spacing:0.5px;font-family:Inter,-apple-system,sans-serif;">What happens next:</p>
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr><td style="padding:5px 0;font-size:14px;color:#1E293B;font-family:Inter,-apple-system,sans-serif;line-height:1.6;">
            &#x1F4C5;&nbsp;&nbsp;You keep <strong>${planLabel}</strong> access until end of billing period
          </td></tr>
          <tr><td style="padding:5px 0;font-size:14px;color:#1E293B;font-family:Inter,-apple-system,sans-serif;line-height:1.6;">
            &#x1F4E6;&nbsp;&nbsp;Account switches to <strong>Free plan (10 docs/month)</strong>
          </td></tr>
          <tr><td style="padding:5px 0;font-size:14px;color:#1E293B;font-family:Inter,-apple-system,sans-serif;line-height:1.6;">
            &#x1F512;&nbsp;&nbsp;All your documents and extracted data are safely kept
          </td></tr>
        </table>
      </td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"
      style="background-color:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;margin-bottom:28px;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#166534;font-family:Inter,-apple-system,sans-serif;">Changed your mind?</p>
        <p style="margin:0;font-size:14px;color:#15803D;line-height:1.6;font-family:Inter,-apple-system,sans-serif;">
          Resubscribe any time and get back to full power instantly &mdash; your history and settings are preserved.
        </p>
      </td></tr>
    </table>

    ${btn('Resubscribe', `${SITE}/pricing`, '#22C55E')}

    ${divider()}

    <p style="margin:0;font-size:13px;color:#94A3B8;line-height:1.7;font-family:Inter,-apple-system,sans-serif;">
      If you cancelled because of an issue, we'd love to know what went wrong &mdash;
      <a href="mailto:hello@datafyle.com" style="color:#2563EB;text-decoration:none;">reply to this email</a>. We read every message.
    </p>
  `, `Your ${planLabel} subscription has been cancelled. Access continues until end of billing period.`)

  await resend.emails.send({
    from:    FROM,
    to,
    subject: `Your Datafyle ${planLabel} subscription has been cancelled`,
    html,
  })
}
