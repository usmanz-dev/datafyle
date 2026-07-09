import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const PRO_PLANS = ['professional', 'business', 'enterprise']

const schema = z.object({
  documentIds: z.array(z.string().min(1)).min(1).max(500),
  spreadsheetId: z.string().optional(),
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

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 })

    if (!PRO_PLANS.includes(user.plan)) {
      return NextResponse.json(
        { error: 'Google Sheets export requires Professional plan or higher' },
        { status: 403 }
      )
    }

    const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
    if (!serviceAccountJson) {
      return NextResponse.json(
        { error: 'Google Sheets not configured. Add GOOGLE_SERVICE_ACCOUNT_JSON to environment variables.' },
        { status: 503 }
      )
    }

    const body = schema.safeParse(await req.json())
    if (!body.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

    const docs = await prisma.document.findMany({
      where: { id: { in: body.data.documentIds }, userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    // Build row data
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

    // Auth with Google via service account JWT
    const { google } = await import('googleapis')
    const credentials = JSON.parse(serviceAccountJson)
    const auth2 = new google.auth.GoogleAuth({
      credentials,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
      ],
    })
    const sheets = google.sheets({ version: 'v4', auth: auth2 })

    let spreadsheetId = body.data.spreadsheetId
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

    if (!spreadsheetId) {
      // Create a new spreadsheet
      const created = await sheets.spreadsheets.create({
        requestBody: {
          properties: { title: `Datafyle Export ${date}` },
          sheets: [{ properties: { title: 'Documents' } }],
        },
      })
      spreadsheetId = created.data.spreadsheetId!

      // Style the header row blue
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
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
            },
          ],
        },
      })
    }

    // Append data
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [headers, ...rows],
      },
    })

    // Share the spreadsheet with the user so they can actually open it
    const drive = google.drive({ version: 'v3', auth: auth2 })
    await drive.permissions.create({
      fileId: spreadsheetId,
      requestBody: {
        role: 'writer',
        type: 'user',
        emailAddress: user.email,
      },
      sendNotificationEmail: false,
    })

    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`
    return NextResponse.json({ success: true, spreadsheetUrl, rowCount: rows.length })
  } catch (error) {
    console.error('Google Sheets export error:', error)
    return NextResponse.json({ error: 'Google Sheets export failed' }, { status: 500 })
  }
}
