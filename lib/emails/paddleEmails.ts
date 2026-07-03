import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? 'noreply@datafyle.com'

export async function sendWelcomePaidEmail(to: string, planName: string) {
  const planDisplay = planName.charAt(0).toUpperCase() + planName.slice(1)

  const body = [
    `Welcome to Datafyle ${planDisplay}!`,
    ``,
    `Your subscription is now active. Here's what you can do:`,
    ``,
    `  • Upload and process documents immediately`,
    `  • Export extracted data to Excel in seconds`,
    `  • Access all ${planDisplay} plan features in your dashboard`,
    ``,
    `Get started: https://datafyle.com/dashboard`,
    ``,
    `Questions? Reply to this email — we're happy to help.`,
    ``,
    `— The Datafyle Team`,
  ].join('\n')

  await resend.emails.send({
    from:    FROM,
    to,
    subject: `Welcome to Datafyle ${planDisplay} — you're all set!`,
    text:    body,
  })
}

export async function sendCancellationEmail(to: string, previousPlan: string) {
  const planDisplay = previousPlan.charAt(0).toUpperCase() + previousPlan.slice(1)

  const body = [
    `Your Datafyle ${planDisplay} subscription has been cancelled.`,
    ``,
    `You'll keep access to your current plan until the end of the billing period.`,
    `After that, your account switches to the Free plan (10 documents/month).`,
    ``,
    `Your processed documents and extracted data are safe — we don't delete anything.`,
    ``,
    `Changed your mind? You can resubscribe any time:`,
    `https://datafyle.com/pricing`,
    ``,
    `If you cancelled because of an issue, we'd love to know what went wrong.`,
    `Just reply to this email.`,
    ``,
    `— The Datafyle Team`,
  ].join('\n')

  await resend.emails.send({
    from:    FROM,
    to,
    subject: `Your Datafyle subscription has been cancelled`,
    text:    body,
  })
}
