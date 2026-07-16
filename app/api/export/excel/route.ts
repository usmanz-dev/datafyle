import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

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
  taxAmount?: { value?: number | null }
  documentType?: string
  keyFields?: Record<string, unknown>
  lineItems?: {
    description?: string
    quantity?: number
    unitPrice?: number
    total?: number
  }[]
}

interface AnomalyData {
  isAnomaly?: boolean
  severity?: string | null
  anomalies?: { reason: string }[]
  recommendation?: string
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 })

    const body = schema.safeParse(await req.json())
    if (!body.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

    const docs = await prisma.document.findMany({
      where: { id: { in: body.data.documentIds }, userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    // Dynamic import to avoid bundling exceljs
    const ExcelJS = (await import('exceljs')).default
    const wb = new ExcelJS.Workbook()
    wb.creator = 'Datafyle'
    wb.created = new Date()

    const BLUE       = 'FF2563EB'
    const WHITE      = 'FFFFFFFF'
    const LIGHT_GRAY = 'FFF8FAFC'
    const BORDER_CLR = 'FFD1D5DB'   // visible gray border
    const BLUE_DARK  = 'FF1D4ED8'   // slightly darker blue for header dividers

    const fullBorder = (color: string) => ({
      top:    { style: 'thin' as const, color: { argb: color } },
      left:   { style: 'thin' as const, color: { argb: color } },
      bottom: { style: 'thin' as const, color: { argb: color } },
      right:  { style: 'thin' as const, color: { argb: color } },
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function styleHeader(row: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      row.eachCell((cell: any) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BLUE } }
        cell.font = { bold: true, color: { argb: WHITE }, size: 11 }
        cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: false }
        cell.border = fullBorder(BLUE_DARK)
      })
      row.height = 26
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function styleDataRow(row: any, alt: boolean) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      row.eachCell((cell: any) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: alt ? LIGHT_GRAY : WHITE },
        }
        cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: false }
        cell.border = fullBorder(BORDER_CLR)
      })
      row.height = 22
    }

    // Ensure all columns are at least 20 wide
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function applyMinColWidth(ws: any, minWidth = 20) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ws.columns.forEach((col: any) => {
        if (!col.width || col.width < minWidth) col.width = minWidth
      })
    }

    // ── Collect all unique keyFields keys across every document ──────────────
    const allKeyFieldKeys: string[] = []
    const seenKeys = new Set<string>()
    for (const doc of docs) {
      const data = doc.extractedData as ExtractedData | null
      if (data?.keyFields && typeof data.keyFields === 'object') {
        for (const k of Object.keys(data.keyFields)) {
          if (!seenKeys.has(k)) { seenKeys.add(k); allKeyFieldKeys.push(k) }
        }
      }
    }

    // ── Sheet 1: Summary ─────────────────────────────────────────────────────
    const ws1 = wb.addWorksheet('Summary')
    ws1.columns = [
      { key: 'fileName',       header: 'File Name',       width: 30 },
      { key: 'docType',        header: 'Doc Type',        width: 14 },
      { key: 'vendor',         header: 'Vendor',          width: 22 },
      { key: 'invoiceNumber',  header: 'Invoice #',       width: 16 },
      { key: 'date',           header: 'Date',            width: 14 },
      { key: 'dueDate',        header: 'Due Date',        width: 14 },
      { key: 'amount',         header: 'Amount',          width: 14 },
      { key: 'currency',       header: 'Currency',        width: 10 },
      { key: 'tax',            header: 'Tax',             width: 12 },
      // Dynamic extra fields (Bill To, Phone, Email, etc.)
      ...allKeyFieldKeys.map((k) => ({ key: `kf_${k}`, header: k, width: 22 })),
      { key: 'confidence',     header: 'Confidence %',    width: 14 },
      { key: 'anomaly',        header: 'Anomaly',         width: 12 },
      { key: 'dateProcessed',  header: 'Date Processed',  width: 18 },
    ]
    styleHeader(ws1.getRow(1))

    docs.forEach((doc, i) => {
      const data = doc.extractedData as ExtractedData | null
      const anomaly = doc.anomalyData as AnomalyData | null
      const keyFields = (data?.keyFields ?? {}) as Record<string, unknown>

      // Build dynamic keyField values — "-" when field absent in this doc
      const extraCells: Record<string, string> = {}
      for (const k of allKeyFieldKeys) {
        const val = keyFields[k]
        extraCells[`kf_${k}`] = val != null && val !== '' ? String(val) : '-'
      }

      const row = ws1.addRow({
        fileName:      doc.fileName,
        docType:       data?.documentType ?? '',
        vendor:        data?.vendor?.value ?? '',
        invoiceNumber: data?.invoiceNumber?.value ?? '',
        date:          data?.date?.value ?? '',
        dueDate:       data?.dueDate?.value ?? '',
        amount:        data?.totalAmount?.value ?? '',
        currency:      data?.currency?.value ?? '',
        tax:           data?.taxAmount?.value ?? '',
        ...extraCells,
        confidence:    doc.confidenceScore ?? '',
        anomaly:       anomaly?.isAnomaly ? anomaly.severity ?? 'Yes' : 'No',
        dateProcessed: new Date(doc.createdAt).toLocaleDateString('en-US'),
      })
      styleDataRow(row, i % 2 === 1)

      // Red text for anomalies
      if (anomaly?.isAnomaly) {
        const cell = row.getCell('anomaly')
        cell.font = { color: { argb: 'FFEF4444' }, bold: true }
      }
    })

    // ── Sheet 2: Line Items ───────────────────────────────────────────────────
    const ws2 = wb.addWorksheet('Line Items')
    ws2.columns = [
      { key: 'docName',    header: 'Doc Name',   width: 28 },
      { key: 'vendor',     header: 'Vendor',     width: 22 },
      { key: 'desc',       header: 'Description', width: 32 },
      { key: 'qty',        header: 'Qty',         width: 8  },
      { key: 'unitPrice',  header: 'Unit Price',  width: 14 },
      { key: 'total',      header: 'Total',       width: 14 },
    ]
    styleHeader(ws2.getRow(1))

    let liRowIdx = 0
    for (const doc of docs) {
      const data = doc.extractedData as ExtractedData | null
      const items = data?.lineItems ?? []
      for (const item of items) {
        const row = ws2.addRow({
          docName:   doc.fileName,
          vendor:    data?.vendor?.value ?? '',
          desc:      item.description ?? '',
          qty:       item.quantity ?? '',
          unitPrice: item.unitPrice ?? '',
          total:     item.total ?? '',
        })
        styleDataRow(row, liRowIdx % 2 === 1)
        liRowIdx++
      }
    }

    if (liRowIdx === 0) {
      const row = ws2.addRow({ docName: 'No line items found in selected documents' })
      styleDataRow(row, false)
    }

    // ── Sheet 3: Anomalies ───────────────────────────────────────────────────
    const ws3 = wb.addWorksheet('Anomalies')
    ws3.columns = [
      { key: 'file',           header: 'File',           width: 28 },
      { key: 'vendor',         header: 'Vendor',         width: 22 },
      { key: 'severity',       header: 'Severity',       width: 12 },
      { key: 'reasons',        header: 'Reasons',        width: 40 },
      { key: 'amount',         header: 'Amount',         width: 14 },
      { key: 'recommendation', header: 'Recommendation', width: 40 },
    ]
    styleHeader(ws3.getRow(1))

    const anomalyDocs = docs.filter((d) => (d.anomalyData as AnomalyData | null)?.isAnomaly)
    if (anomalyDocs.length === 0) {
      const row = ws3.addRow({ file: 'No anomalies found in selected documents' })
      styleDataRow(row, false)
    } else {
      anomalyDocs.forEach((doc, i) => {
        const data = doc.extractedData as ExtractedData | null
        const anomaly = doc.anomalyData as AnomalyData
        const row = ws3.addRow({
          file:           doc.fileName,
          vendor:         data?.vendor?.value ?? '',
          severity:       anomaly.severity ?? '',
          reasons:        anomaly.anomalies?.map((a) => a.reason).join('; ') ?? '',
          amount:         data?.totalAmount?.value ?? '',
          recommendation: anomaly.recommendation ?? '',
        })
        styleDataRow(row, i % 2 === 1)
        const sevCell = row.getCell('severity')
        if (anomaly.severity === 'CRITICAL') {
          sevCell.font = { color: { argb: 'FFEF4444' }, bold: true }
        } else if (anomaly.severity === 'HIGH') {
          sevCell.font = { color: { argb: 'FFF97316' }, bold: true }
        }
      })
    }

    // Apply minimum column width (20) to all sheets
    applyMinColWidth(ws1)
    applyMinColWidth(ws2)
    applyMinColWidth(ws3)

    // Freeze header row on all sheets
    ws1.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
    ws2.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
    ws3.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }]

    const buffer = await wb.xlsx.writeBuffer()
    const date = new Date().toISOString().slice(0, 10)

    return new NextResponse(new Uint8Array(buffer as ArrayBuffer), {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="datafyle-export-${date}.xlsx"`,
      },
    })
  } catch (error) {
    console.error('Excel export error:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
