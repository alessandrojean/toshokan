import QueryBuilder from './QueryBuilder'
import DataTable from './DataTable'
import i18n from '@/i18n'
import { STATUS_CODE_TIMEOUT, STATUS_CODE_UNAUTHORIZED } from '@/util/gapi'

type GoogleQuery = google.visualization.Query

interface QueryConstructorOptions {
  builderObj: ReturnType<QueryBuilder['toObject']> | null
  queryString: string
}

/**
 * Enhanced Google Visualization Query.
 */
export default class Query {
  /**
   * The Google Visualization Query.
   */
  #query: GoogleQuery

  /**
   * The builder object.
   */
  #builderObj: ReturnType<QueryBuilder['toObject']> | null

  /**
   * Creates a new Query instance.
   */
  constructor(
    dataSourceUrl: string,
    { builderObj, queryString }: QueryConstructorOptions,
  ) {
    this.#builderObj = builderObj ? structuredClone(builderObj) : null

    this.#query = new window.google.visualization.Query(dataSourceUrl)
    this.#query.setQuery(queryString)
  }

  /**
   * Executes the query.
   *
   * @returns {Promise<DataTable>} The DataTable object
   */
  async send(): Promise<DataTable> {
    return new Promise((resolve, reject) => {
      this.#query.send((response) => {
        if (response.isError()) {
          const reasons = response.getReasons()

          if (reasons.includes('invalid_query')) {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({
              message: i18n.global.t('errors.badQuery', {
                error: response.getMessage(),
              }),
              detailedMessage: response.getDetailedMessage(),
              reasons,
            })

            return
          }

          // eslint-disable-next-line prefer-promise-reject-errors
          reject({
            message: response.getMessage(),
            detailedMessage: response.getDetailedMessage(),
            status: reasons.includes('access_denied')
              ? STATUS_CODE_UNAUTHORIZED
              : STATUS_CODE_TIMEOUT,
            reasons,
          })

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
