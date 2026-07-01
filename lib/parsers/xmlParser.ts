import xml2js from 'xml2js'

export async function parseXML(text: string) {
  const result = await xml2js.parseStringPromise(text)
  return { data: result, text: JSON.stringify(result) }
}
