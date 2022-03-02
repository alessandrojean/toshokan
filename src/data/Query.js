import cloneDeep from 'lodash.clonedeep'

import i18n from '@/i18n'
import QueryBuilder from './QueryBuilder'
import DataTable from './DataTable'

/**
 * Enhanced Google Visualization Query.
 */
export default class Query {
  /**
   * The Google Visualization Query.
   *
   * @type {google.visualization.Query | null}
   */
  #query = null

  /**
   * The builder object.
   */
  #builderObj = null

  /**
   * Creates a new Query instance.
   *
   * @param {string} dataSourceUrl The sheet URL
   * @param {Object} options The options
   * @param {Object | null} options.builderObj The builder object
   * @param {string} options.queryString The query string
   */
  constructor(dataSourceUrl, { builderObj, queryString }) {
    this.#builderObj = builderObj ? cloneDeep(builderObj) : null

    this.#query = new window.google.visualization.Query(dataSourceUrl)
    this.#query.setQuery(queryString)
  }

  /**
   * Executes the query.
   *
   * @returns {Promise<DataTable>} The DataTable object
   */
  async send() {
    return new Promise((resolve, reject) => {
      this.#query.send((response) => {
        if (response.isError()) {
          const message = i18n.global.t('errors.badQuery', {
            error: response.getMessage()
          })

          reject(new Error(message))
          return
        }

        resolve(new DataTable(response.getDataTable()))
      })
    })
  }

  newBuilder() {
    if (this.#builderObj === null) {
      return null
    }

    return QueryBuilder.fromObject(this.#builderObj)
  }
}
