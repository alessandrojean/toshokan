import Query from './Query'

export type WhereCondition = {
  negated?: boolean
  operator: 'OR' | 'AND'
  restrictions: (WhereRestriction | WhereCondition)[]
}

const binaryOperators = [
  'is',
  'is not',
  '=',
  '!=',
  '>',
  '>=',
  '>= date',
  '<',
  '<=',
  '<= date',
  'starts with',
  'matches'
] as const
const binaryOperatorsCheck: Set<string> = new Set(binaryOperators)
export type BinaryOperator = typeof binaryOperators[number]

export type WhereRestriction = [string, BinaryOperator, any]

export type OrderBy = [string, 'asc' | 'desc']

type Limit = number | null
type Offset = Limit

function isBinaryOperator(
  op?: BinaryOperator | string | null
): op is BinaryOperator {
  return binaryOperatorsCheck.has(op ?? '')
}

/**
 * Google Query Language query builder helper.
 */
export default class QueryBuilder {
  #select: string[] = []
  #where: WhereCondition
  #groupBy: string[] = []
  #orderBy: OrderBy[] = []
  #limit: Limit = null
  #offset: Offset = null

  #sheetUrl = ''

  static AND = 'AND'
  static OR = 'OR'

  /**
   * Create a QueryBuilder instance.
   *
   * @param {string?} sheetUrl The sheet URL
   */
  constructor(sheetUrl?: string) {
    this.#sheetUrl = sheetUrl ?? ''
    this.#where = { operator: 'OR', restrictions: [] }
  }

  /**
   * Define the columns to select.
   *
   * @param  {...string} columns The columns to select
   * @returns {QueryBuilder} The current instance
   */
  select(...columns: string[]): QueryBuilder {
    this.#select = columns.length > 0 ? columns : []

    return this
  }

  where(condition: WhereCondition): QueryBuilder
  where(restriction: WhereRestriction): QueryBuilder
  where(restrictions: (WhereRestriction | WhereCondition)[]): QueryBuilder
  where(columnNonNull: string): QueryBuilder
  where(column: string, value: string | null): QueryBuilder
  where(column: string, op: BinaryOperator, value: string): QueryBuilder
  where(
    column:
      | WhereRestriction
      | WhereCondition
      | (WhereRestriction | WhereCondition)[]
      | string,
    op?: BinaryOperator | string | null,
    value?: any
  ): QueryBuilder

  where(
    column:
      | WhereRestriction
      | WhereCondition
      | (WhereRestriction | WhereCondition)[]
      | string,
    op?: BinaryOperator | string | null,
    value?: any
  ) {
    if (
      typeof column === 'string' &&
      isBinaryOperator(op) &&
      value !== undefined
    ) {
      this.#where.restrictions.push([column, op, value])
    } else if (typeof column === 'string' && op === null) {
      this.#where.restrictions.push([column, 'is', 'null'])
    } else if (typeof column === 'string' && typeof op === 'string') {
      this.#where.restrictions.push([column, '=', op])
    } else if (typeof column === 'string') {
      this.#where.restrictions.push([column, 'is not', 'null'])
    } else if (Array.isArray(column)) {
      this.#where.restrictions.push(
        ...(column as (WhereRestriction | WhereCondition)[])
      )
    } else if (column?.operator) {
      this.#where.restrictions.push(column)
    }

    return this
  }

  andWhere(condition: WhereCondition): QueryBuilder
  andWhere(restriction: WhereRestriction): QueryBuilder
  andWhere(restrictions: (WhereRestriction | WhereCondition)[]): QueryBuilder
  andWhere(columnNonNull: string): QueryBuilder
  andWhere(column: string, value: string | null): QueryBuilder
  andWhere(column: string, op: BinaryOperator, value: any): QueryBuilder

  andWhere(
    column:
      | WhereRestriction
      | WhereCondition
      | (WhereRestriction | WhereCondition)[]
      | string,
    op?: BinaryOperator | string | null,
    value?: any
  ): QueryBuilder {
    this.#where.operator = 'AND'
    this.where(column, op, value)

    return this
  }

  orWhere(condition: WhereCondition): QueryBuilder
  orWhere(restriction: WhereRestriction): QueryBuilder
  orWhere(restrictions: (WhereRestriction | WhereCondition)[]): QueryBuilder
  orWhere(columnNonNull: string): QueryBuilder
  orWhere(column: string, value: string | null): QueryBuilder
  orWhere(column: string, op: BinaryOperator, value: any): QueryBuilder

  orWhere(
    column:
      | WhereRestriction
      | WhereCondition
      | (WhereRestriction | WhereCondition)[]
      | string,
    op?: BinaryOperator | string | null,
    value?: any
  ): QueryBuilder {
    this.#where.operator = 'OR'
    this.where(column, op, value)

    type a = Parameters<typeof this.where>

    return this
  }

  /**
   * Create an OR combined restriction.
   *
   * @param  {...WhereCondition['restrictions'][number]} restrictions The restrictions
   * @returns An OR combined restriction
   */
  static or(...restrictions: WhereCondition['restrictions']): WhereCondition {
    return {
      operator: 'OR',
      restrictions
    }
  }

  /**
   * Create an AND combined restriction.
   *
   * @param  {...WhereCondition['restrictions'][number]} restrictions The restrictions
   * @returns An AND combined restriction
   */
  static and(...restrictions: WhereCondition['restrictions']): WhereCondition {
    return {
      operator: 'AND',
      restrictions
    }
  }

  /**
   * Create an negated AND combined restriction.
   *
   * @param  {...WhereCondition['restrictions'][number]} restrictions The restrictions
   * @returns An AND combined restriction
   */
  static andNot(
    ...restrictions: WhereCondition['restrictions']
  ): WhereCondition {
    return {
      negated: true,
      operator: 'AND',
      restrictions
    }
  }

  /**
   * Define the columns to group.
   *
   * @param  {...string} columns The columns to group
   * @returns {QueryBuilder} The current instance
   */
  groupBy(...columns: string[]): QueryBuilder {
    this.#groupBy = columns.length > 0 ? columns : []

    return this
  }

  /**
   * Define the columns to sort.
   *
   * @param  {...OrderBy} columns The columns to sort
   * @returns {QueryBuilder} The current instance
   */
  orderBy(...columns: OrderBy[]): QueryBuilder {
    this.#orderBy = columns.length > 0 ? columns : []

    return this
  }

  /**
   * Define the query limit.
   *
   * @param {Limit} limit The limit
   * @returns {QueryBuilder} The current instance
   */
  limit(limit: Limit): QueryBuilder {
    this.#limit = limit

    return this
  }

  /**
   * Define the query offset.
   *
   * @param {Offset} offset The offset
   * @returns {QueryBuilder} The current instance
   */
  offset(offset: Offset): QueryBuilder {
    this.#offset = offset

    return this
  }

  /**
   * Convert the query to an object.
   */
  toObject() {
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
   * @param {ReturnType<QueryBuilder['toObject']>} obj The object
   * @returns {QueryBuilder} The instance
   */
  static fromObject(obj: ReturnType<QueryBuilder['toObject']>): QueryBuilder {
    const qb = new QueryBuilder()
    qb.#select = obj.select ?? qb.#select
    qb.#where = obj.where ?? qb.#where
    qb.#groupBy = obj.groupBy ?? qb.#groupBy
    qb.#orderBy = obj.orderBy ?? qb.#orderBy
    qb.#limit = obj.limit !== null ? obj.limit : qb.#limit
    qb.#offset = obj.offset !== null ? obj.offset : qb.#offset
    qb.#sheetUrl = obj.sheetUrl

    return qb
  }

  #whereString(where: WhereCondition | WhereRestriction): string {
    if (Array.isArray(where)) {
      const [column, op, value] = where
      const fixedValue =
        typeof value === 'string'
          ? op === 'is' || op === 'is not'
            ? value
            : `"${value}"`
          : value

      return [column, op, fixedValue].join(' ')
    }

    const string = where.restrictions
      .map((restriction) => this.#whereString(restriction))
      .join(` ${where.operator} `)
    const not = where.negated ? 'not ' : ''

    return `${not}(${string})`
  }

  /**
   * Generate the query string.
   */
  toString() {
    const parts = [
      'select ' + (this.#select.length > 0 ? this.#select.join(', ') : '*'),
      this.#where.restrictions.length > 0
        ? 'where ' + this.#whereString(this.#where)
        : '',
      this.#groupBy.length > 0 ? 'group by ' + this.#groupBy.join(', ') : '',
      this.#orderBy.length > 0
        ? 'order by ' +
          this.#orderBy.map(([column, sort]) => `${column} ${sort}`).join(', ')
        : '',
      this.#limit !== null ? 'limit ' + this.#limit : '',
      this.#offset !== null ? 'offset ' + this.#offset : ''
    ]

    return parts.filter((part) => part.length > 0).join('\n')
  }

  /**
   * Build a Query.
   *
   * @returns {Query} The built query
   */
  build(): Query {
    return new Query(this.#sheetUrl, {
      builderObj: this.toObject(),
      queryString: this.toString()
    })
  }
}
