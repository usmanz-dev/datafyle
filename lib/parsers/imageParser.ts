export async function parseImage(buffer: Buffer) {
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
