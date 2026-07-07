import { PDFParser } from 'pdf2json'

export async function parsePDF(buffer: Buffer) {
  try {
    const text = await new Promise<string>((resolve, reject) => {
      const parser = new PDFParser(null, true) // true = raw text mode

      parser.on('pdfParser_dataReady', () => {
        try {
          const raw = parser.getRawTextContent()
          resolve(raw?.trim() ?? '')
        } catch {
          resolve('')
        }
      })

      parser.on('pdfParser_dataError', (err: unknown) => {
        const msg = err && typeof err === 'object' && 'parserError' in err
          ? String((err as { parserError: unknown }).parserError)
          : String(err)
        reject(new Error(msg))
      })

      parser.parseBuffer(buffer)
    })

    if (text.length >= 30) {
      return { text, pageCount: 1, method: 'pdf2json' }
    }

    // Very short text — likely a scanned PDF
    return await callGoogleVision(buffer)
  } catch (err) {
    console.error('[pdf2json] failed:', err instanceof Error ? err.message : String(err))
    return await callGoogleVision(buffer)
  }
}

async function callGoogleVision(buffer: Buffer) {
  const apiKey = process.env.GOOGLE_VISION_API_KEY
  if (!apiKey) {
    console.error('[pdf] scanned PDF but GOOGLE_VISION_API_KEY not set')
    return { text: '', pageCount: 1, method: 'no-text-extracted' }
  }

  try {
    const base64 = buffer.toString('base64')
    const res = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{
            image: { content: base64 },
            features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
          }],
        }),
      }
    )
    const visionData = await res.json()
    const text = visionData.responses?.[0]?.fullTextAnnotation?.text ?? ''
    return { text: text.trim(), pageCount: 1, method: 'google-vision' }
  } catch (err) {
    console.error('[google-vision] failed:', err instanceof Error ? err.message : String(err))
    return { text: '', pageCount: 1, method: 'vision-failed' }
  }
}
