import CoverFinder from './CoverFinder'

export default class UrlReplacerFinder extends CoverFinder {
  /**
   * Condition check.
   *
   * @callback ConditionCheck
   * @param {import('@/model/Book').default} book The book to check
   * @returns {boolean} The condition check
   */

  /** @type {ConditionCheck | null} */
  condition = null

  /** @type {keyof import('@/model/Book').default} */
  property = 'code'

  /**
   * Property transformer.
   *
   * @callback PropertyTransformer
   * @param {any} property The property to transform
   * @returns {any} The property transformed.
   */

  /** @type {PropertyTransformer | null} */
  propertyTransformer = null

  /** @type {string} */
  url = ''

  /**
   * Creates a new URL replacer finder.
   *
   * @param {Partial<UrlReplacerFinder>} properties The properties
   */
  constructor(properties) {
    super()
    Object.assign(this, properties)
  }

  async find(book) {
    if (this.condition && !this.condition(book)) {
      return []
    }

    let valueToReplace = book[this.property]

    if (this.propertyTransformer) {
      valueToReplace = this.propertyTransformer(valueToReplace)
    }

    return [this.url.replace(/\{value\}/g, valueToReplace)]
  }
}
