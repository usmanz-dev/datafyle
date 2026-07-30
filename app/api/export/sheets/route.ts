import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { google } from 'googleapis'

const PRO_PLANS = ['professional', 'business', 'enterprise']

const schema = z.object({
  documentIds: z.array(z.string().min(1)).min(1).max(500),
})

interface ExtractedData {
  vendor?: { value?: string | null }
  invoiceNumber?: { value?: string | null }
  date?: { value?: string | null }
  dueDate?: { value?: string | null }
  totalAmount?: { value?: number | null }
  currency?: { value?: string | null }
  documentType?: string
}

interface AnomalyData {
  isAnomaly?: boolean
  severity?: string | null
}

function getGoogleAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON not configured')
  const credentials = JSON.parse(raw)
  // Vercel sometimes escapes newlines in env vars — fix private key
  if (credentials.private_key) {
    credentials.private_key = credentials.private_key.replace(/\\n/g, '\n')
  }
  return new google.auth.GoogleAuth({
    credentials,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive',
    ],
  })
}

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { clerkId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 })

    if (!PRO_PLANS.includes(user.plan)) {
      return NextResponse.json(
        { error: 'Google Sheets export requires Professional plan or higher' },
        { status: 403 }
      )
    }

    const body = schema.safeParse(await req.json())
    if (!body.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

    const docs = await prisma.document.findMany({
      where: { id: { in: body.data.documentIds }, userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    if (docs.length === 0) {
      return NextResponse.json({ error: 'No documents found' }, { status: 404 })
    }

    const headers = [
      'File Name', 'Doc Type', 'Vendor', 'Invoice #',
      'Date', 'Due Date', 'Amount', 'Currency', 'Confidence %', 'Anomaly', 'Date Processed',
    ]

    const rows = docs.map((doc) => {
      const data = doc.extractedData as ExtractedData | null
      const anomaly = doc.anomalyData as AnomalyData | null
      return [
        doc.fileName,
        data?.documentType ?? '',
        data?.vendor?.value ?? '',
        data?.invoiceNumber?.value ?? '',
        data?.date?.value ?? '',
        data?.dueDate?.value ?? '',
        data?.totalAmount?.value?.toString() ?? '',
        data?.currency?.value ?? '',
        doc.confidenceScore?.toString() ?? '',
        anomaly?.isAnomaly ? anomaly.severity ?? 'Yes' : 'No',
        new Date(doc.createdAt).toLocaleDateString('en-US'),
      ]
    })

    const googleAuth = getGoogleAuth()
    const sheets = google.sheets({ version: 'v4', auth: googleAuth })
    const drive = google.drive({ version: 'v3', auth: googleAuth })

    const date = new Date().toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })

    // Create spreadsheet
    const created = await sheets.spreadsheets.create({
      requestBody: {
        properties: { title: `Datafyle Export — ${date}` },
        sheets: [{ properties: { title: 'Documents' } }],
      },
    })
    const spreadsheetId = created.data.spreadsheetId!

    // Blue header row
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{
          repeatCell: {
            range: { sheetId: 0, startRowIndex: 0, endRowIndex: 1 },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.145, green: 0.388, blue: 0.922 },
                textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true },
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat)',
          },
        }],
      },
    })

    // Write data
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A1',
      valueInputOption: 'RAW',
      requestBody: { values: [headers, ...rows] },
    })

    // Share with user as writer (no email notification to avoid spam)
    await drive.permissions.create({
      fileId: spreadsheetId,
      requestBody: {
        type: 'user',
        role: 'writer',
        emailAddress: user.email,
      },
      sendNotificationEmail: false,
    })

    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`
    return NextResponse.json({ success: true, spreadsheetUrl, rowCount: rows.length })

  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('Google Sheets export error:', msg)
    return NextResponse.json({ error: `Google Sheets export failed: ${msg}` }, { status: 500 })
  }
}
