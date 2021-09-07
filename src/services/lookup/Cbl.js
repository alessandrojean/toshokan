import axios from 'axios'

import { parseBookFromCbl } from '@/model/Book'
import { isbn as validateIsbn } from '@/util/validators'
import i18n from '@/i18n'

import Lookup from './Lookup'

export const PUBLISHER_REPLACEMENTS = {
  'Editora JBC': 'JBC',
  INK: 'JBC',
  'Japorama Editora e Comunicação': 'JBC',
  'New Pop Editora': 'NewPOP',
  'NewPOP Editora': 'NewPOP',
  'Panini Brasil': 'Panini',
  'Panini Comics': 'Panini',
  'Bernardo Ferreira de Santana Carvalho': 'Panini',
  CONRAD: 'Conrad',
  'Editora Alto Astral': 'Alto Astral',
  'Editora Draco': 'Draco',
  'L&PM Editores': 'L&PM',
  'Pipoca e Nanquim': 'Pipoca & Nanquim',
  'Pipoca e Nanquim Editora LTDA': 'Pipoca & Nanquim',
  'Darkside Books': 'DarkSide',
  'Kleber de Sousa': 'Devir',
  'Verus Editora': 'Verus',
  'reginaldo f silva': 'ComixZone'
}

export default class Cbl extends Lookup {
  FIELDS_TO_SELECT = [
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
    'Sinopse'
  ]

  createAxios () {
    return axios.create({
      baseURL: 'https://isbn-search-br.search.windows.net/indexes/isbn-index/docs/',
      headers: {
        Accept: 'application/json',
        'Api-Key': process.env.VUE_APP_CBL_QUERY_KEY
      }
    })
  }

  createSearchPayload (query, dataOptions) {
    let payload = {
      count: true,
      facets: ['Imprint,count:50', 'Authors,count:50'],
      filter: '',
      orderby: null,
      queryType: 'full',
      search: query,
      searchFields: 'FormattedKey,RowKey,Authors,Title,Imprint',
      searchMode: 'any',
      select: this.FIELDS_TO_SELECT.join(','),
      skip: 0,
      top: 12
    }

    if (dataOptions) {
      payload = { ...payload, ...dataOptions }
    }

    return payload
  }

  async internalSearch (query = '', options) {
    const { t } = i18n.global

    const queryKey = process.env.VUE_APP_CBL_QUERY_KEY

    if (!queryKey) {
      throw new Error(t('isbn.keyMissing'))
    }

    const dataPayload = this.createSearchPayload(query, options.dataOptions)

    try {
      const response = await this.axios.post('search?api-version=2016-09-01', dataPayload)

      return response.data.value.map(parseBookFromCbl)
    } catch (e) {
      throw new Error(t('isbn.searchError'))
    }
  }

  async search (isbn) {
    const { t } = i18n.global

    if (!validateIsbn(isbn)) {
      throw new Error(t('isbn.invalid'))
    }

    const searchResults = await this.internalSearch(isbn.replace(/-/g, ''), {
      dataOptions: { searchFields: 'FormattedKey,RowKey' }
    })

    return searchResults
  }
}
