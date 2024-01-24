type GoogleDataTable = google.visualization.DataTable

/**
 * A simple wrapper to make the Google
 * Visualization's DataTable iterable.
 */
export default class DataTable implements Iterable<any[]> {
  #dataTable: GoogleDataTable

  /**
   * Creates a new DataTable instance.
   *
   * @param {GoogleDataTable} dataTable The original instance
   */
  constructor(dataTable: GoogleDataTable) {
    this.#dataTable = dataTable
  }

  get rows() {
    return this.#dataTable.getNumberOfRows()
  }

  get columns() {
    return this.#dataTable.getNumberOfColumns()
  }

  get length() {
    return this.rows
  }

  /**
   * An array out of the data table.
   *
   * @type {any[][]}
   */
  get asArray(): any[][] {
    return Array.from(this)
  }

  getRow(rowIdx: number) {
    const rowData = []

    for (let j = 0; j < this.columns; j++) {
      rowData.push(this.#dataTable.getValue(rowIdx, j))
    }

    return rowData
  }

  getValue(rowIndex: number, columnIndex: number) {
    return this.#dataTable.getValue(rowIndex, columnIndex)
  }

  [Symbol.iterator](): Iterator<any[]> {
    let row = 0

    return {
      next: () => {
        if (row >= this.rows) {
          return { done: true, value: null }
        }

        return {
          value: this.getRow(row++),
          done: false,
        }
      },
    }
  }
}
