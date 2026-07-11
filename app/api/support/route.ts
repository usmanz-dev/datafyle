import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const schema = z.object({
  category: z.enum(['technical', 'billing', 'feature', 'account', 'other']),
  subject:  z.string().min(3).max(150),
  message:  z.string().min(10).max(3000),
})

const CATEGORY_LABELS: Record<string, string> = {
  technical: 'Technical Issue',
  billing:   'Billing Question',
  feature:   'Feature Request',
  account:   'Account Help',
  other:     'Other',
}

const PLAN_SLA: Record<string, string> = {
  free:         'Standard (5 business days)',
  starter:      'Email Support (3 business days)',
  professional: 'Priority Support (24 hours)',
  business:     'Priority Support (4 hours)',
  enterprise:   'Dedicated Support (1 hour)',
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 })

    const body = schema.safeParse(await req.json())
    if (!body.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

    const { category, subject, message } = body.data
    const sla   = PLAN_SLA[user.plan]  ?? PLAN_SLA.free
    const catLabel = CATEGORY_LABELS[category] ?? category
    const priorityFlag = ['business', 'enterprise'].includes(user.plan) ? '🔴 HIGH PRIORITY — ' :
                         user.plan === 'professional' ? '🟠 PRIORITY — ' : ''

    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail) return NextResponse.json({ error: 'Support not configured' }, { status: 500 })

    await resend.emails.send({
      from:    process.env.RESEND_FROM_EMAIL ?? 'noreply@datafyle.com',
      to:      adminEmail,
      replyTo: user.email,
      subject: `${priorityFlag}[Support] ${catLabel}: ${subject}`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:12px;">
          <div style="background:#1E293B;padding:20px 24px;border-radius:8px 8px 0 0;">
            <h2 style="margin:0;color:white;font-size:18px;">Datafyle Support Ticket</h2>
          </div>
          <div style="background:white;padding:24px;border:1px solid #E2E8F0;border-top:none;border-radius:0 0 8px 8px;">
            <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
              <tr><td style="padding:8px 0;color:#64748b;font-size:13px;width:130px;">From</td><td style="padding:8px 0;font-size:13px;font-weight:600;color:#1E293B;">${user.name ?? 'Unknown'} &lt;${user.email}&gt;</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Plan</td><td style="padding:8px 0;font-size:13px;font-weight:600;color:#2563EB;">${user.plan.toUpperCase()}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">SLA</td><td style="padding:8px 0;font-size:13px;color:#1E293B;">${sla}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Category</td><td style="padding:8px 0;font-size:13px;color:#1E293B;">${catLabel}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Subject</td><td style="padding:8px 0;font-size:13px;font-weight:600;color:#1E293B;">${subject}</td></tr>
            </table>
            <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:16px;">
              <p style="margin:0;font-size:14px;color:#1E293B;white-space:pre-wrap;line-height:1.6;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            </div>
            <p style="margin:20px 0 0;font-size:12px;color:#94a3b8;">Reply directly to this email to respond to the user.</p>
          </div>
        </div>
      `,
    })

    // Also send confirmation to the user
    await resend.emails.send({
      from:    process.env.RESEND_FROM_EMAIL ?? 'noreply@datafyle.com',
      to:      user.email,
      subject: `We received your support request — ${subject}`,
      html: `
        <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:12px;">
          <div style="background:#2563EB;padding:20px 24px;border-radius:8px 8px 0 0;">
            <h2 style="margin:0;color:white;font-size:18px;">We got your message</h2>
          </div>
          <div style="background:white;padding:24px;border:1px solid #E2E8F0;border-top:none;border-radius:0 0 8px 8px;">
            <p style="margin:0 0 16px;color:#1E293B;font-size:14px;">Hi ${user.name?.split(' ')[0] ?? 'there'},</p>
            <p style="margin:0 0 16px;color:#1E293B;font-size:14px;">We've received your support request and will get back to you based on your plan SLA:</p>
            <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;padding:12px 16px;margin-bottom:20px;">
              <p style="margin:0;font-weight:600;color:#2563EB;font-size:14px;">${sla}</p>
            </div>
            <p style="margin:0 0 8px;color:#64748b;font-size:13px;font-weight:600;">Your message:</p>
            <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:12px 16px;margin-bottom:20px;">
              <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">${catLabel} · ${subject}</p>
              <p style="margin:0;font-size:13px;color:#1E293B;white-space:pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            </div>
            <p style="margin:0;color:#94a3b8;font-size:12px;">— The Datafyle Team</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Support route error:', error)
    return NextResponse.json({ error: 'Failed to send support request' }, { status: 500 })
  }
}
