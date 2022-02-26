/**
 * Get the sheet time zone data.
 *
 * @param {string} sheetId The sheet to perform the operation
 * @returns The sheet time zone
 */
export default async function getTimeZone (sheetId) {
  const propertiesResponse = await window.gapi.client.sheets.spreadsheets
    .get({
      spreadsheetId: sheetId,
      fields: 'properties.timeZone'
    })

  const timeZoneName = propertiesResponse.result.properties.timeZone
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
    offsetStr: offset.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      signDisplay: 'always'
    }) + ':00',
    timezoneOffset: -offset * 60
  }
}
