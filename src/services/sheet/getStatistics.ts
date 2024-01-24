import { promisify } from '@/util/gapi'

export interface RankingItem {
  name: string
  count: number
}

/**
 * Get the sheet statistics.
 *
 * @param {string} sheetId The sheet to perform the operation
 * @returns The sheet statistics
 */
export default async function getStatistics(sheetId: string) {
  const thenable = window.gapi.client.sheets.spreadsheets.values.batchGet({
    spreadsheetId: sheetId,
    ranges: [
      'TotalItems',
      'Expense',
      'Reading',
      'MonthlyStatistics',
      'AuthorRank',
      'SeriesRank',
      'PublisherRank',
      'Currency',
    ],
  })

  const response = await promisify(thenable)

  return {
    count: Number.parseInt(response.result.valueRanges![0].values![0][0]),
    money: {
      totalSpentLabel: Number.parseFloat(
        response.result.valueRanges![1].values![0][1],
      ),
      totalSpentPaid: Number.parseFloat(response.result.valueRanges![1].values![1][1]),
      saved: Number.parseFloat(response.result.valueRanges![1].values![2][1]),
      percent: Number.parseFloat(response.result.valueRanges![1].values![3][1]),
      currency: response.result.valueRanges![7].values![0][0],
    },
    status: {
      read: Number.parseInt(response.result.valueRanges![2].values![0][1], 10),
      unread: Number.parseInt(response.result.valueRanges![2].values![1][1], 10),
      percent: Number.parseFloat(response.result.valueRanges![2].values![2][1]),
    },
    monthly: (response.result.valueRanges![3].values || [])
      .reverse()
      .filter(row => row[0].length > 0)
      .map(row => ({
        month: new Date(`${row[0]}-02`),
        totalSpent: Number.parseFloat(row[1]),
        count: Number.parseInt(row[2], 10),
        read: Number.parseInt(row[3], 10),
      })),
    authors: (response.result.valueRanges![4].values || [])
      .slice(0, 10)
      .map<RankingItem>(row => ({
        name: row[0],
        count: Number.parseInt(row[1], 10),
      })),
    series: (response.result.valueRanges![5].values || [])
      .slice(0, 10)
      .map<RankingItem>(row => ({
        name: row[0],
        count: Number.parseInt(row[1], 10),
      })),
    publishers: (response.result.valueRanges![6].values || [])
      .slice(0, 10)
      .map<RankingItem>(row => ({
        name: row[0],
        count: Number.parseInt(row[1], 10),
      })),
  }
}

export type Statistics = Awaited<ReturnType<typeof getStatistics>>
