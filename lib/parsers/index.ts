import { parsePDF } from './pdfParser'
import { parseWord } from './wordParser'
import { parseExcel } from './excelParser'
import { parseCSV } from './csvParser'
import { parseXML } from './xmlParser'
import { parseTXT } from './txtParser'
import { parseImage } from './imageParser'

export async function parseFile(buffer: Buffer, fileType: string) {
  const ext = fileType.toLowerCase()

  if (ext === 'pdf') return parsePDF(buffer)
  if (ext === 'docx' || ext === 'doc') return parseWord(buffer)
  if (ext === 'xlsx' || ext === 'xls') return parseExcel(buffer)
  if (ext === 'csv') return parseCSV(buffer.toString())
  if (ext === 'xml') return parseXML(buffer.toString())
  if (ext === 'txt') return parseTXT(buffer)
  if (['jpg', 'jpeg', 'png'].includes(ext)) return parseImage(buffer)

  throw new Error('Unsupported file type: ' + fileType)
}
