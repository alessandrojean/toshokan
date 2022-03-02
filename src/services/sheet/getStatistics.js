/**
 * Get the sheet statistics.
 *
 * @param {string} sheetId The sheet to perform the operation
 * @returns The sheet statistics
 */
export default async function getStatistics(sheetId) {
  const response = await window.gapi.client.sheets.spreadsheets.values.batchGet(
    {
      spreadsheetId: sheetId,
      ranges: [
        'TotalItems',
        'Expense',
        'Reading',
        'MonthlyStatistics',
        'AuthorRank',
        'SeriesRank',
        'PublisherRank',
        'Currency'
      ]
    }
  )

  return {
    count: parseInt(response.result.valueRanges[0].values[0][0]),
    money: {
      totalSpentLabel: parseFloat(response.result.valueRanges[1].values[0][1]),
      totalSpentPaid: parseFloat(response.result.valueRanges[1].values[1][1]),
      saved: parseFloat(response.result.valueRanges[1].values[2][1]),
      percent: parseFloat(response.result.valueRanges[1].values[3][1]),
      currency: response.result.valueRanges[7].values[0][0]
    },
    status: {
      read: parseInt(response.result.valueRanges[2].values[0][1], 10),
      unread: parseInt(response.result.valueRanges[2].values[1][1], 10),
      percent: parseFloat(response.result.valueRanges[2].values[2][1], 10)
    },
    monthly: (response.result.valueRanges[3].values || [])
      .slice(0, 10)
      .reverse()
      .filter((row) => row[0].length > 0)
      .map((row) => ({
        month: new Date(`${row[0]}-02`),
        totalSpent: parseFloat(row[1]),
        count: parseInt(row[2], 10),
        read: parseInt(row[3], 10)
      })),
    authors: (response.result.valueRanges[4].values || [])
      .slice(0, 10)
      .map((row) => ({ name: row[0], count: parseInt(row[1], 10) })),
    series: (response.result.valueRanges[5].values || [])
      .slice(0, 10)
      .map((row) => ({ name: row[0], count: parseInt(row[1], 10) })),
    publishers: (response.result.valueRanges[6].values || [])
      .slice(0, 10)
      .map((row) => ({ name: row[0], count: parseInt(row[1], 10) }))
  }
}
