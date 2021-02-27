import axios from 'axios'

import { parseBookFromCbl } from '../model/Book'
import { isbn as validateIsbn } from '../util/validators'

const cbl = axios.create({
  baseURL: 'https://isbn-search-br.search.windows.net/indexes/isbn-index/docs/',
  headers: {
    Accept: 'application/json',
    'Api-Key': process.env.VUE_APP_CBL_QUERY_KEY
  }
})

export const IMPRINT_REPLACEMENTS = {
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

function createSearchPayload (query, dataOptions) {
  let payload = {
    count: true,
    facets: ['Imprint,count:50', 'Authors,count:50'],
    filter: '',
    orderby: null,
    queryType: 'full',
    search: query,
    searchFields: 'FormattedKey,RowKey,Authors,Title,Imprint',
    searchMode: 'any',
    select: 'Authors,Colection,Countries,Date,Imprint,Title,RowKey,' +
      'PartitionKey,RecordId,FormattedKey,Subject,Veiculacao,Profissoes,Dimensao',
    skip: 0,
    top: 12
  }

  if (dataOptions) {
    payload = { ...payload, ...dataOptions }
  }

  return payload
}

export async function search (query = '', options) {
  const queryKey = process.env.VUE_APP_CBL_QUERY_KEY

  if (!queryKey) {
    throw new Error('Chave de consulta inexistente.')
  }

  const dataPayload = createSearchPayload(query, options.dataOptions)

  try {
    const response = await cbl.post('search?api-version=2016-09-01', dataPayload)

    return response.data.value.map(parseBookFromCbl)
  } catch (e) {
    throw new Error('Houve um erro durante a pesquisa.')
  }
}

export async function searchByIsbn (isbn) {
  if (!validateIsbn(isbn)) {
    throw new Error('O ISBN informado é inválido.')
  }

  const searchResults = await search(isbn.replace(/-/g, ''), {
    dataOptions: { searchFields: 'FormattedKey,RowKey' }
  })

  return searchResults
}
