import * as XLSX from 'xlsx'

export function parseExcel(buffer: Buffer) {
  const wb = XLSX.read(buffer, { type: 'buffer' })
  const sheets = wb.SheetNames.map((name) => ({
    name,
    data: XLSX.utils.sheet_to_json(wb.Sheets[name]),
  }))
  const text = sheets.map((s) => JSON.stringify(s.data)).join(' ')
  return { sheets, text }
}
