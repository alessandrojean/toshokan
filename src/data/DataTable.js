/**
 * A simple wrapper to make the Google
 * Visualization's DataTable iterable.
 */
export default class DataTable {
  /** @type {google.visualization.DataTable | null} */
  #dataTable = null

  /**
   * Creates a new DataTable instance.
   *
   * @param {google.visualization.DataTable} dataTable The original instance
   */
  constructor (dataTable) {
    this.#dataTable = dataTable
  }

  get rows () {
    return this.#dataTable.getNumberOfRows()
  }

  get columns () {
    return this.#dataTable.getNumberOfColumns()
  }

  get length () {
    return this.rows
  }

  /**
   * An array out of the data table.
   *
   * @type {any[][]}
   */
  get asArray () {
    return Array.from(this)
  }

  getRow (rowIdx) {
    const rowData = []

    for (let j = 0; j < this.columns; j++) {
      rowData.push(this.#dataTable.getValue(rowIdx, j))
    }

    return rowData
  }

  getValue (rowIndex, columnIndex) {
    return this.#dataTable.getValue(rowIndex, columnIndex)
  }

  /** @type {Iterable<any[]>} */
  [Symbol.iterator] () {
    let row = 0

    return {
      next: () => {
        if (row >= this.rows) {
          return { done: true }
        }

        return {
          value: this.getRow(row++),
          done: false
        }
      }
    }
  }
}
