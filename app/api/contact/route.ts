import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const schema = z.object({
  name:        z.string().min(2).max(100),
  email:       z.string().email(),
  company:     z.string().max(100).optional(),
  phone:       z.string().max(30).optional(),
  teamSize:    z.string().optional(),
  inquiryType: z.enum(['general', 'sales', 'technical', 'enterprise', 'partnership']),
  message:     z.string().min(10).max(3000),
})

const INQUIRY_LABELS: Record<string, string> = {
  general:     'General Question',
  sales:       'Sales / Pricing',
  technical:   'Technical Support',
  enterprise:  'Enterprise Plan',
  partnership: 'Partnership',
}

export async function POST(req: NextRequest) {
  try {
    const body = schema.safeParse(await req.json())
    if (!body.success) {
      return NextResponse.json({ error: 'Invalid input', details: body.error.flatten() }, { status: 400 })
    }

    const { name, email, company, phone, teamSize, inquiryType, message } = body.data
    const inquiryLabel = INQUIRY_LABELS[inquiryType] ?? inquiryType

    // Save to Supabase via Prisma
    await prisma.contactSubmission.create({
      data: { name, email, company, phone, teamSize, inquiryType, message },
    })

    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail) {
      await resend.emails.send({
        from:    process.env.RESEND_FROM_EMAIL ?? 'noreply@datafyle.com',
        to:      adminEmail,
        replyTo: email,
        subject: `[Contact] ${inquiryLabel} from ${name}${company ? ` · ${company}` : ''}`,
        html: `
          <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:24px;border-radius:12px;">
            <div style="background:#1E293B;padding:20px 24px;border-radius:8px 8px 0 0;">
              <h2 style="margin:0;color:white;font-size:18px;">New Contact Form Submission</h2>
              <p style="margin:4px 0 0;color:#94a3b8;font-size:13px;">datafyle.com/contact</p>
            </div>
            <div style="background:white;padding:24px;border:1px solid #E2E8F0;border-top:none;border-radius:0 0 8px 8px;">
              <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
                <tr><td style="padding:8px 0;color:#64748b;font-size:13px;width:130px;">Name</td>         <td style="padding:8px 0;font-size:13px;font-weight:600;color:#1E293B;">${name}</td></tr>
                <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Email</td>        <td style="padding:8px 0;font-size:13px;color:#2563EB;"><a href="mailto:${email}" style="color:#2563EB;">${email}</a></td></tr>
                ${company ? `<tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Company</td>      <td style="padding:8px 0;font-size:13px;color:#1E293B;">${company}</td></tr>` : ''}
                ${phone   ? `<tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Phone</td>        <td style="padding:8px 0;font-size:13px;color:#1E293B;">${phone}</td></tr>` : ''}
                ${teamSize? `<tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Team Size</td>    <td style="padding:8px 0;font-size:13px;color:#1E293B;">${teamSize}</td></tr>` : ''}
                <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Inquiry</td>      <td style="padding:8px 0;font-size:13px;font-weight:600;color:#2563EB;">${inquiryLabel}</td></tr>
              </table>
              <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:16px;">
                <p style="margin:0;font-size:14px;color:#1E293B;white-space:pre-wrap;line-height:1.6;">${message.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</p>
              </div>
              <p style="margin:20px 0 0;font-size:12px;color:#94a3b8;">Reply directly to this email to respond to ${name}.</p>
            </div>
          </div>
        `,
      })

      // Confirmation to the sender
      await resend.emails.send({
        from:    process.env.RESEND_FROM_EMAIL ?? 'noreply@datafyle.com',
        to:      email,
        subject: `Thanks for reaching out, ${name.split(' ')[0]}! — Datafyle`,
        html: `
          <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:24px;border-radius:12px;">
            <div style="background:#2563EB;padding:20px 24px;border-radius:8px 8px 0 0;">
              <h2 style="margin:0;color:white;font-size:18px;">We received your message!</h2>
            </div>
            <div style="background:white;padding:24px;border:1px solid #E2E8F0;border-top:none;border-radius:0 0 8px 8px;">
              <p style="margin:0 0 16px;color:#1E293B;font-size:14px;">Hi ${name.split(' ')[0]},</p>
              <p style="margin:0 0 16px;color:#1E293B;font-size:14px;">Thanks for getting in touch with us. We've received your message and our team will get back to you within <strong>24 hours</strong>.</p>
              <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;padding:12px 16px;margin-bottom:20px;">
                <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;">${inquiryLabel}</p>
                <p style="margin:0;font-size:14px;color:#1E293B;white-space:pre-wrap;">${message.slice(0, 200).replace(/</g,'&lt;').replace(/>/g,'&gt;')}${message.length > 200 ? '…' : ''}</p>
              </div>
              <p style="margin:0 0 16px;color:#1E293B;font-size:14px;">In the meantime, you can <a href="https://datafyle.com/pricing" style="color:#2563EB;">explore our pricing plans</a> or <a href="https://datafyle.com/sign-up" style="color:#2563EB;">start for free</a> — no credit card required.</p>
              <p style="margin:0;color:#94a3b8;font-size:12px;">— The Datafyle Team</p>
            </div>
          </div>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact route error:', error)
    return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 500 })
  }
}
