import i18n from '@/i18n'
import { promisify } from '@/util/gapi'

const SHEET_FILE_NAME = 'Toshokan'
const SHEET_MIME_TYPE = 'application/vnd.google-apps.spreadsheet'
const SHEET_DEV_SUFFIX = '-dev'

/**
 * Find the sheet ID and other matches.
 *
 * @param {boolean} useDevSheet If it should only get dev sheets
 * @returns The sheet and other matches
 */
export default async function findSheetId(useDevSheet = false) {
  // Use a development only sheet to prevent issues during tests.
  const isDevEnvironment = import.meta.env.DEV
  const sheetSuffix = isDevEnvironment && useDevSheet ? SHEET_DEV_SUFFIX : ''
  const fileName = SHEET_FILE_NAME + sheetSuffix

  const thenable = window.gapi.client.drive.files.list({
    q: `name='${fileName}' and mimeType='${SHEET_MIME_TYPE}'`,
    orderBy: 'starred',
    fields:
      'files(capabilities/canEdit,id,modifiedTime,name,ownedByMe,owners(displayName,emailAddress,photoLink),starred)'
  })

  const response = await promisify(thenable)

  if (response.result.files.length === 0) {
    throw new Error(i18n.global.t('sheet.notFound'))
  }

  const lastSheetOpened = localStorage.getItem('last_sheet_opened')

  const sheet =
    response.result.files.find((sheet) => sheet.id === lastSheetOpened) ||
    response.result.files.find((sheet) => sheet.ownedByMe) ||
    response.result.files[0]

  return { sheet, options: response.result.files }
}
