import axios from 'axios'

import Lookup from './Lookup'
import Book from '@/model/Book'
import { isbn as isValidIsbn } from '@/util/validators'
import i18n from '@/i18n'

export const PUBLISHER_REPLACEMENTS: Record<string, string> = {
  'Editora JBC': 'JBC',
  'INK': 'JBC',
  'Japorama Editora e Comunicação': 'JBC',
  'New Pop Editora': 'NewPOP',
  'NewPOP Editora': 'NewPOP',
  'Panini Brasil': 'Panini',
  'Panini Comics': 'Panini',
  'Bernardo Ferreira de Santana Carvalho': 'Panini',
  'CONRAD': 'Conrad',
  'Editora Alto Astral': 'Alto Astral',
  'Editora Draco': 'Draco',
  'L&PM Editores': 'L&PM',
  'Pipoca e Nanquim': 'Pipoca & Nanquim',
  'Pipoca e Nanquim Editora LTDA': 'Pipoca & Nanquim',
  'Darkside Books': 'DarkSide',
  'Kleber de Sousa': 'Devir',
  'Verus Editora': 'Verus',
  'reginaldo f silva': 'ComixZone',
}

interface CblSearchResponse {
  value: CblBook[]
}

export interface CblBook {
  Authors: string[] | null
  Colection: string | null
  Countries: string[] | null
  Date: string | null
  Imprint: string | null
  Title: string | null
  RowKey: string | null
  PartitionKey: string | null
  RecordId: string | null
  FormattedKey: string | null
  Subject: string | null
  Veiculacao: string | null
  Profissoes: string | null
  Dimensao: string | null
  Sinopse: string | null
}

interface SearchOptions {
  count?: boolean | null
  facets?: string[] | null
  filter?: string | null
  orderby?: string | null
  queryType?: string | null
  search?: string | null
  searchFields?: string | null
  searchMode?: string | null
  select?: string | null
  skip?: number | null
  top?: number | null
}

export default class Cbl extends Lookup {
  #FIELDS_TO_SELECT: (keyof CblBook)[] = [
    'Authors',
    'Colection',
    'Countries',
    'Date',
    'Imprint',
    'Title',
    'RowKey',
    'PartitionKey',
    'RecordId',
    'FormattedKey',
    'Subject',
    'Veiculacao',
    'Profissoes',
    'Dimensao',
    'Sinopse',
  ]

  _createAxios() {
    return axios.create({
      baseURL:
        'https://isbn-search-br.search.windows.net/indexes/isbn-index/docs/',
      headers: {
        'Accept': 'application/json',
        'Api-Key': import.meta.env.VITE_APP_CBL_QUERY_KEY,
      },
    })
  }

  #createSearchPayload(query: string, dataOptions: SearchOptions) {
    let payload: SearchOptions = {
      count: true,
      facets: ['Imprint,count:50', 'Authors,count:50'],
      filter: '',
      orderby: null,
      queryType: 'full',
      search: query,
      searchFields: 'FormattedKey,RowKey,Authors,Title,Imprint',
      searchMode: 'any',
      select: this.#FIELDS_TO_SELECT.join(','),
      skip: 0,
      top: 12,
    }

    if (dataOptions) {
      payload = { ...payload, ...dataOptions }
    }

    return payload
  }

  async #internalSearch(query = '', options: SearchOptions) {
    const { t } = i18n.global

    const queryKey = import.meta.env.VITE_APP_CBL_QUERY_KEY

    if (!queryKey) {
      throw new Error(t('isbn.keyMissing'))
    }

    const dataPayload = this.#createSearchPayload(query, options)

    try {
      const response = await this.axios.post<CblSearchResponse>(
        'search?api-version=2016-09-01',
        dataPayload,
      )

      return response.data.value.map(Book.fromCbl)
    } catch (e) {
      throw new Error(t('isbn.searchError'))
    }
  }

  async search(isbn: string) {
    const { t } = i18n.global

    if (!isValidIsbn(isbn)) {
      throw new Error(t('isbn.invalid'))
    }

    const searchResults = await this.#internalSearch(isbn.replace(/-/g, ''), {
      searchFields: 'FormattedKey,RowKey',
    })

    return searchResults
  }
}
