import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function extractWithClaude(
  text: string,
  fileType: string,
  vendorHint?: string
) {
  const systemPrompt = `You are an expert document data extraction AI.
Extract ALL important information and return ONLY valid JSON.
No explanation. No markdown. Just pure JSON parseable by JSON.parse().`

  let userPrompt = `Extract all data from this ${fileType} document.`
  if (vendorHint) userPrompt += ` Previous invoices from this vendor: ${vendorHint}`
  userPrompt += `\n\nDocument text:\n${text}\n\n`
  userPrompt += `Return this exact JSON structure:
{
  "documentType": "invoice" | "receipt" | "contract" | "form" | "statement" | "other",
  "vendor": { "value": "string or null", "confidence": 0 },
  "invoiceNumber": { "value": "string or null", "confidence": 0 },
  "date": { "value": "string or null", "confidence": 0 },
  "dueDate": { "value": "string or null", "confidence": 0 },
  "totalAmount": { "value": 0, "confidence": 0 },
  "currency": { "value": "string or null", "confidence": 0 },
  "taxAmount": { "value": 0, "confidence": 0 },
  "lineItems": [{ "description": "", "quantity": 0, "unitPrice": 0, "total": 0 }],
  "keyFields": { "Bill To": "string", "Phone": "string", "Email": "string" },
  "summary": "one sentence description",
  "overallConfidence": 0
}

CRITICAL RULE for keyFields: Capture EVERY field in the document that is not already in the structure above.
Examples of what to put in keyFields: Bill To, Ship To, Phone, Email, Address, Payment Method, Payment Terms, PO Number, Account Number, Reference, Notes, Remit To, Contact, Website, Bank Details, IBAN, etc.
Use the exact label from the document as the key. Value must be a plain string.
If a field exists in the document, it MUST appear in keyFields. Never leave keyFields empty if the document has extra fields.`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text : ''
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    return JSON.parse(jsonMatch ? jsonMatch[0] : raw)
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err)
    console.error('[claude] primary call failed:', errMsg)
    try {
      const simple = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `Extract key fields from: ${text.slice(0, 2000)}. Return JSON only.`,
          },
        ],
      })
      const raw = simple.content[0].type === 'text' ? simple.content[0].text : '{}'
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      return JSON.parse(jsonMatch ? jsonMatch[0] : raw)
    } catch (err2) {
      const err2Msg = err2 instanceof Error ? err2.message : String(err2)
      console.error('[claude] fallback call failed:', err2Msg)
      throw new Error(`Claude API error: ${errMsg}`)
    }
  }
}
