export async function parsePDF(buffer: Buffer) {
  try {
    // pdfjs-dist has no native/canvas dependency unlike pdf-parse v2
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfjsLib: any = await import('pdfjs-dist/legacy/build/pdf.mjs')

    // Empty string tells pdfjs to run on the main thread (fake worker)
    // — required in Vercel serverless where Worker threads aren't available
    pdfjsLib.GlobalWorkerOptions.workerSrc = ''

    const uint8Array = new Uint8Array(buffer)
    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
      disableRange: true,
      disableStream: true,
    })

    const pdfDoc = await loadingTask.promise
    const pages: string[] = []

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i)
      const textContent = await page.getTextContent()
      const items = textContent.items as Array<{ str?: string }>
      const pageText = items.map((item) => item.str ?? '').filter(Boolean).join(' ')
      pages.push(pageText)
    }

    const text = pages.join('\n').trim()
    if (text.length < 50) {
      return await callGoogleVision(buffer)
    }
    return { text, pageCount: pdfDoc.numPages, method: 'pdfjs-dist' }
  } catch {
    return await callGoogleVision(buffer)
  }
}

async function callGoogleVision(buffer: Buffer) {
  const base64 = buffer.toString('base64')
  const res = await fetch(
    'https://vision.googleapis.com/v1/images:annotate?key=' + process.env.GOOGLE_VISION_API_KEY,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [{ image: { content: base64 }, features: [{ type: 'TEXT_DETECTION' }] }],
      }),
    }
  )
  const data = await res.json()
  const text = data.responses?.[0]?.fullTextAnnotation?.text || ''
  return { text, pageCount: 1, method: 'google-vision' }
}
