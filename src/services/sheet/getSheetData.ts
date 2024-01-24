import getStatistics from './getStatistics'
import getTimeZone from './getTimeZone'

/**
 * Get the sheet timezone data and statistics.
 *
 * @param {string} sheetId The sheet to perform the operation
 * @returns The sheet data and statistics
 */
export default async function getSheetData(sheetId: string) {
  const stats = await getStatistics(sheetId)
  const timeZone = await getTimeZone(sheetId)

  return { stats, timeZone }
}
