import mammoth from 'mammoth'

export async function parseWord(buffer: Buffer) {
  const result = await mammoth.extractRawText({ buffer })
  return { text: result.value }
}
