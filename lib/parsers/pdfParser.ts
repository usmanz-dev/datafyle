export async function parsePDF(buffer: Buffer) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdf = require('pdf-parse') as (buffer: Buffer) => Promise<{ text: string; numpages: number }>
    const data = await pdf(buffer)
    if (data.text.trim().length < 50) {
      return await callGoogleVision(buffer)
    }
    return { text: data.text, pageCount: data.numpages, method: 'pdf-parse' }
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
