import Query from './Query'

/**
 * Google Query Language query builder helper.
 */
export default class QueryBuilder {
  #select = []
  #where = { operator: QueryBuilder.OR, restrictions: [] }
  #groupBy = []
  #orderBy = []
  #limit = null
  #offset = null

  #sheetUrl = ''

  static AND = 'and'
  static OR = 'or'

  /**
   * Create a QueryBuilder instance.
   *
   * @param {string?} sheetUrl The sheet URL
   */
  constructor (sheetUrl) {
    this.#sheetUrl = sheetUrl || ''
  }

  /**
   * Define the columns to select.
   *
   * @param  {...string} columns The columns to select
   * @returns {QueryBuilder} The current instance
   */
  select (...columns) {
    this.#select = columns.length > 0 ? columns : []

    return this
  }

  /**
   * Add a restriction to where.
   *
   * @param {string} column The column
   * @param {string} op The operation
   * @param {string} value The value
   * @returns {QueryBuilder} The current instance
   */
  where (column, op, value) {
    if (arguments.length === 3) {
      this.#where.restrictions.push([column, op, value])
    } else if (arguments.length === 2 && op === null) {
      this.#where.restrictions.push([column, 'is', 'null'])
    } else if (arguments.length === 2 && op) {
      this.#where.restrictions.push([column, '=', op])
    } else if (arguments.length === 1 && typeof column === 'string') {
      this.#where.restrictions.push([column, 'is not', 'null'])
    } else if (arguments.length === 1 && Array.isArray(column)) {
      this.#where.restrictions.push(...column)
    } else if (arguments.length === 1 && typeof column === 'object') {
      this.#where.restrictions.push(column)
    }

    return this
  }

  /**
   * Add a restriction to where and set the operator to AND.
   *
   * @param {string} column The column
   * @param {string} op The operation
   * @param {string} value The value
   * @returns {QueryBuilder} The current instance
   */
  andWhere (column, op, value) {
    this.#where.operator = QueryBuilder.AND
    this.where(...arguments)

    return this
  }

  /**
   * Add a restriction to where and set the operator to OR.
   *
   * @param {string} column The column
   * @param {string} op The operation
   * @param {string} value The value
   * @returns {QueryBuilder} The current instance
   */
  orWhere (column, op, value) {
    this.#where.operator = QueryBuilder.OR
    this.where(...arguments)

    return this
  }

  /**
   * Create an OR combined restriction.
   *
   * @param  {...any} restrictions The restrictions
   * @returns An OR combined restriction
   */
  static or (...restrictions) {
    return {
      operator: QueryBuilder.OR,
      restrictions
    }
  }

  /**
   * Create an AND combined restriction.
   *
   * @param  {...any} restrictions The restrictions
   * @returns An AND combined restriction
   */
  static and (...restrictions) {
    return {
      operator: QueryBuilder.AND,
      restrictions
    }
  }

  /**
   * Create an negated AND combined restriction.
   *
   * @param  {...any} restrictions The restrictions
   * @returns An AND combined restriction
   */
   static andNot (...restrictions) {
    return {
      negated: true,
      operator: QueryBuilder.AND,
      restrictions
    }
  }

  /**
   * Define the columns to group.
   *
   * @param  {...string} columns The columns to group
   * @returns {QueryBuilder} The current instance
   */
  groupBy (...columns) {
    this.#groupBy = columns.length > 0 ? columns : []

    return this
  }

  /**
   * Define the columns to sort.
   *
   * @param  {...[string, 'asc' | 'desc']} columns The columns to sort
   * @returns {QueryBuilder} The current instance
   */
  orderBy (...columns) {
    this.#orderBy = columns.length > 0 ? columns : []

    return this
  }

  /**
   * Define the query limit.
   *
   * @param {number | null | undefined} limit The limit
   * @returns {QueryBuilder} The current instance
   */
  limit (limit) {
    this.#limit = limit

    return this
  }

  /**
   * Define the query offset.
   *
   * @param {number | null | undefined} offset The offset
   * @returns {QueryBuilder} The current instance
   */
  offset (offset) {
    this.#offset = offset

    return this
  }

  /**
   * Convert the query to an object.
   */
  toObject () {
    return {
      select: this.#select,
      where: this.#where,
      groupBy: this.#groupBy,
      orderBy: this.#orderBy,
      limit: this.#limit,
      offset: this.#offset,
      sheetUrl: this.#sheetUrl
    }
  }

  /**
   * Creates a instance from a object.
   *
   * @param {Object} obj The object
   * @returns {QueryBuilder} The instance
   */
  static fromObject (obj) {
    const qb = new QueryBuilder()
    qb.#select = obj.select || qb.#select
    qb.#where = obj.where || qb.#where
    qb.#groupBy = obj.groupBy || qb.#groupBy
    qb.#orderBy = obj.orderBy || qb.#orderBy
    qb.#limit = obj.limit !== null ? obj.limit : qb.#limit
    qb.#offset = obj.offset !== null ? obj.offset : qb.#offset
    qb.#sheetUrl = obj.sheetUrl

    return qb
  }

  #whereString (where) {
    if (Array.isArray(where)) {
      const [column, op, value] = where
      const fixedValue = typeof value === 'string'
        ? (op === 'is' || op === 'is not' ? value : `"${value}"`)
        : value

      return [column, op, fixedValue].join(' ')
    }

    const string = where.restrictions
      .map(restriction => this.#whereString(restriction))
      .join(` ${where.operator} `)
    const not = where.negated ? 'not ' : ''

    return `${not}(${string})`
  }

  /**
   * Generate the query string.
   */
  toString () {
    const parts = [
      'select ' + ((this.#select.length > 0) ? this.#select.join(', ') : '*'),
      (this.#where.restrictions.length > 0)
        ? 'where ' + this.#whereString(this.#where)
        : '',
      (this.#groupBy.length > 0)
        ? 'group by ' + this.#groupBy.join(', ')
        : '',
      (this.#orderBy.length > 0)
        ? 'order by ' + this.#orderBy
            .map(([column, sort]) => `${column} ${sort}`)
            .join(', ')
        : '',
      (this.#limit !== null) ? 'limit ' + this.#limit : '',
      (this.#offset !== null) ? 'offset ' + this.#offset : ''
    ]

    return parts
      .filter(part => part.length > 0)
      .join('\n')
  }

  /**
   * Build a Query.
   *
   * @returns {Query} The built query
   */
  build () {
    return new Query(this.#sheetUrl, {
      builderObj: this.toObject(),
      queryString: this.toString()
    })
  }
}
