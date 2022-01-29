const COLLECTION_RANGE = 'B4:U'
const COLLECTION_SHEET = 'Collection'

export default function buildSheetUrl (sheetId) {
  const sheetUrl = new URL(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq`)

  sheetUrl.searchParams.append('range', COLLECTION_RANGE)
  sheetUrl.searchParams.append('sheet', COLLECTION_SHEET)
  sheetUrl.searchParams.append('headers', '1')
  sheetUrl.searchParams.append('access_token', window.gapi.auth.getToken().access_token)

  return sheetUrl.href
}
