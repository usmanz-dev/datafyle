import Papa from 'papaparse'

export function parseCSV(text: string) {
  const result = Papa.parse(text, { header: true, skipEmptyLines: true })
  return {
    headers: result.meta.fields,
    rows: result.data,
    text: JSON.stringify(result.data),
  }
}
