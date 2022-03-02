const COLLECTION_RANGE = 'B4:X'
const COLLECTION_SHEET = 'Collection'

/**
 * Creates a query URL for a specific sheet.
 *
 * @param {string} sheetId The sheet to create the URL
 * @returns {string} The sheet query URL
 */
export default function buildSheetUrl(sheetId) {
  const sheetUrl = new URL(
    `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq`
  )
  const accessToken = window.gapi?.auth?.getToken?.()?.access_token

  sheetUrl.searchParams.append('range', COLLECTION_RANGE)
  sheetUrl.searchParams.append('sheet', COLLECTION_SHEET)
  sheetUrl.searchParams.append('headers', '1')

  if (accessToken) {
    sheetUrl.searchParams.append('access_token', accessToken)
  }

  return sheetUrl.href
}
