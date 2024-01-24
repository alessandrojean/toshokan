import { promisify } from '@/util/gapi'

/**
 * Get the sheet version.
 *
 * @param {string} sheetId The sheet to perform the operation
 * @returns The sheet version
 */
export default async function getVersion(sheetId: string) {
  const thenable = window.gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'ToshokanVersion',
  })

  const response = await promisify(thenable)

  return Number.parseInt(response.result.values![0][0], 10)
}
