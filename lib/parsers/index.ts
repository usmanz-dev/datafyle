export async function parseFile(buffer: Buffer, fileType: string) {
  const ext = fileType.toLowerCase()

  if (ext === 'pdf') {
    const { parsePDF } = await import('./pdfParser')
    return parsePDF(buffer)
  }
  if (ext === 'docx' || ext === 'doc') {
    const { parseWord } = await import('./wordParser')
    return parseWord(buffer)
  }
  if (ext === 'xlsx' || ext === 'xls') {
    const { parseExcel } = await import('./excelParser')
    return parseExcel(buffer)
  }
  if (ext === 'csv') {
    const { parseCSV } = await import('./csvParser')
    return parseCSV(buffer.toString())
  }
  if (ext === 'xml') {
    const { parseXML } = await import('./xmlParser')
    return parseXML(buffer.toString())
  }
  if (ext === 'txt') {
    const { parseTXT } = await import('./txtParser')
    return parseTXT(buffer)
  }
  if (['jpg', 'jpeg', 'png'].includes(ext)) {
    const { parseImage } = await import('./imageParser')
    return parseImage(buffer)
  }

  throw new Error('Unsupported file type: ' + fileType)
}
