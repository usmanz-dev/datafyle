export async function parsePDF(buffer: Buffer) {
  try {
    // pdf-parse is CommonJS — dynamic import with interop
    const mod = await import('pdf-parse')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfParse: (b: Buffer) => Promise<{ text: string; numpages: number }> =
      (mod as any).default ?? mod

    const data = await pdfParse(buffer)
    const text = data.text?.trim() ?? ''

    if (text.length >= 30) {
      return { text, pageCount: data.numpages, method: 'pdf-parse' }
    }

    // Scanned PDF — fall back to Google Vision image OCR
    return await callGoogleVision(buffer)
  } catch (err) {
    console.error('[pdf-parse] failed:', err instanceof Error ? err.message : String(err))
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
    // Send PDF as base64 — Vision handles PDF files inline via DOCUMENT_TEXT_DETECTION
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
