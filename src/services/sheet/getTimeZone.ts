import { promisify } from '@/util/gapi'

export interface SheetTimezone {
  name: string
  offset: number
  offsetStr: string
  timezoneOffset: number
}

/**
 * Get the sheet time zone data.
 *
 * @param {string} sheetId The sheet to perform the operation
 * @returns The sheet time zone
 */
export default async function getTimeZone(
  sheetId: string
): Promise<SheetTimezone> {
  const thenable = window.gapi.client.sheets.spreadsheets.get({
    spreadsheetId: sheetId,
    fields: 'properties.timeZone'
  })

  const response = await promisify(thenable)

  const timeZoneName = response.result.properties!.timeZone!
  const offset = parseInt(
    new Date()
      .toLocaleString('en-US', {
        timeZone: timeZoneName,
        timeZoneName: 'short',
        hour12: false
      })
      .replace(/.*GMT/, '')
  )

  return {
    name: timeZoneName,
    offset,
    offsetStr:
      offset.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        signDisplay: 'always'
      }) + ':00',
    timezoneOffset: -offset * 60
  }
}
