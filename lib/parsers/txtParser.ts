export function parseTXT(buffer: Buffer) {
  return { text: buffer.toString('utf-8') }
}
