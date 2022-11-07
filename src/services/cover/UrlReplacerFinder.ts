import Book from '@/model/Book'
import CoverFinder from './CoverFinder'

export default class UrlReplacerFinder<
  S extends keyof Book
> extends CoverFinder {
  condition: (book: Book) => boolean = (_) => true

  property!: S

  propertyTransformer: ((value: Book[S]) => string) | null = null

  url = ''

  /**
   * Creates a new URL replacer finder.
   */
  constructor(properties: Partial<UrlReplacerFinder<S>>) {
    super()
    Object.assign(this, properties)
  }

  async find(book: Book) {
    if (this.condition && !this.condition(book)) {
      return []
    }

    let valueToReplace = String(book[this.property])

    if (this.propertyTransformer) {
      valueToReplace = this.propertyTransformer(book[this.property])
    }

    return [this.url.replace(/\{value\}/g, valueToReplace)]
  }
}
