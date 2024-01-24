import type { DefineComponent } from 'vue'
import { convertIsbn13ToIsbn10 } from '@/util/isbn'

import AmazonIcon from '@/components/icons/AmazonIcon.vue'
import FnacIcon from '@/components/icons/FnacIcon.vue'
import GoodreadsIcon from '@/components/icons/GoodreadsIcon.vue'
import NewPopIcon from '@/components/icons/NewPopIcon.vue'
import PaniniIcon from '@/components/icons/PaniniIcon.vue'
import SkoobIcon from '@/components/icons/SkoobIcon.vue'

import type Book from '@/model/Book'

enum Category {
  DATABASE = 0,
  STORE = 1,
}

const ALL_COUNTRIES = 'ALL'

export interface Link {
  title: string
  url: string | ((book: Book) => string)
  country: string
  category: Category
  icon?: DefineComponent<object, object, any>
  check?: (book: Book) => boolean
}

export type BookLink = Omit<Link, 'url'> & { url: string }

const WEBSITES: Link[] = [
  // Database websites.
  {
    title: 'Goodreads',
    url: 'https://goodreads.com/search?q={isbn}',
    country: ALL_COUNTRIES,
    category: Category.DATABASE,
    icon: GoodreadsIcon,
  },
  {
    title: 'Open Library',
    url: 'https://openlibrary.org/isbn/{isbn}',
    country: ALL_COUNTRIES,
    category: Category.DATABASE,
  },
  {
    title: 'Skoob',
    url: 'https://www.skoob.com.br/livro/lista/busca:{isbn}/tipo:isbn',
    country: 'BR',
    category: Category.DATABASE,
    icon: SkoobIcon,
  },
  // Stores
  {
    title: 'Amazon',
    url: 'https://amazon.com/dp/{isbn10}',
    country: 'US',
    category: Category.STORE,
    icon: AmazonIcon,
  },
  {
    title: 'Amazon.co.jp',
    url: 'https://amazon.co.jp/dp/{isbn10}',
    country: 'JP',
    category: Category.STORE,
    icon: AmazonIcon,
  },
  {
    title: 'Amazon.com.br',
    url: 'https://amazon.com.br/dp/{isbn10}?m=A1ZZFT5FULY4LN',
    country: 'BR',
    category: Category.STORE,
    icon: AmazonIcon,
  },
  {
    title: 'Amazon.es',
    url: 'https://amazon.es/dp/{isbn10}',
    country: 'ES',
    category: Category.STORE,
    icon: AmazonIcon,
  },
  {
    title: 'Loja Panini',
    url: (book: Book) => {
      const url = new URL('https://panini.com.br/catalogsearch/result/')
      url.searchParams.append('q', book.title!)

      return url.href
    },
    country: 'BR',
    category: Category.STORE,
    check: (book: Book) => book.publisher!.includes('Panini'),
    icon: PaniniIcon,
  },
  {
    title: 'NewPOP SHOP',
    url: 'https://www.lojanewpop.com.br/buscar?q={isbn}',
    country: 'BR',
    category: Category.STORE,
    check: (book: Book) => book.publisher!.includes('NewPOP'),
    icon: NewPopIcon,
  },
  {
    title: 'Fnac.pt',
    url: 'https://fnac.pt/SearchResult/ResultList.aspx?Search={isbn}',
    country: 'PT',
    category: Category.STORE,
    icon: FnacIcon,
  },
]

/**
 * Generate the links for the book.
 *
 * @param {Book} book
 * @param {string} locale
 */
export default function getBookLinks(
  book: Book | undefined | null,
  locale: string,
): BookLink[] {
  if (!book || !book.codeType.includes('ISBN')) {
    return []
  }

  const isbn = book.code!.replace(/-/g, '')
  const isbn10 = isbn.length === 10 ? isbn : convertIsbn13ToIsbn10(isbn)!

  const country = book.isbnData?.countryCode

  return WEBSITES.filter((website) => {
    return website.country === country || website.country === ALL_COUNTRIES
  })
    .filter(website => (website.check ? website.check(book) : true))
    .map((website) => {
      const urlString
        = typeof website.url === 'function'
          ? website.url(book)
          : website.url.toString()

      return {
        ...website,
        url: urlString.replace(/\{isbn\}/g, isbn).replace(/\{isbn10\}/g, isbn10),
      }
    })
    .sort((a, b) => {
      return a.category - b.category || a.title.localeCompare(b.title, locale)
    })
}
