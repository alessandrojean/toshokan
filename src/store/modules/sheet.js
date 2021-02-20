import groupBy from 'lodash.groupby'
import sortBy from 'lodash.sortby'
import uniqBy from 'lodash.uniqby'

import { formatBook, parseBook } from '@/model/Book'

const state = () => ({
  collection: {},
  current: '',
  loading: true,
  sheetId: undefined,
  imprints: [],
  stores: []
})

const getters = {
  collections: function (state) {
    return Object.keys(state.collection).sort()
  },
  getCollectionByName: function (state) {
    return function (name) {
      return state.collections[name]
    }
  }
}

const actions = {
  findSheetId: function ({ commit }) {
    return new Promise((resolve, reject) => {
      window.gapi.client.drive.files
        .list({
          q: 'name=\'Toshokan\' and mimeType=\'application/vnd.google-apps.spreadsheet\'',
          orderBy: 'starred'
        })
        .then(response => {
          if (response.result.files.length > 0) {
            const sheetId = response.result.files[0].id

            commit('updateSheetId', sheetId)
            resolve(sheetId)

            return
          }

          reject(new Error('Planilha não encontrada.'))
        })
    })
  },

  loadSheetData: function ({ commit, dispatch }) {
    commit('updateLoading', true)

    dispatch('findSheetId')
      .then(sheetId => {
        const COLLECTION_RANGE = 'Coleção!B5:P'

        window.gapi.client.sheets.spreadsheets.values
          .batchGet({
            spreadsheetId: sheetId,
            ranges: [
              COLLECTION_RANGE
            ]
          })
          .then(response => {
            const books = (response.result.valueRanges[0].values || [])
              .map(parseBook)

            const imprints = uniqBy(books, 'imprint')
              .map(b => b.imprint)
              .sort()

            const stores = uniqBy(books, 'store')
              .map(b => b.store)
              .sort()

            const collection = sortBy(books, [
              'collection',
              b => b.titleParts[0],
              'imprint',
              b => b.titleParts[1] || '01'
            ])

            commit('updateCollection', groupBy(collection, 'collection'))
            commit('updateImprints', imprints)
            commit('updateStores', stores)
            commit('updateLoading', false)
          })
      })
  },

  insertBook: function ({ commit, dispatch, state }, book) {
    commit('updateLoading', true)

    return window.gapi.client.sheets.spreadsheets.values
      .append({
        spreadsheetId: state.sheetId,
        range: 'Coleção!B5',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        values: [formatBook(book)]
      })
      .then(() => dispatch('loadSheetData'))
  }
}

const mutations = {
  updateCollection: function (state, collection) {
    state.collection = { ...state.collection, ...collection }

    const collections = Object.keys(collection).sort()

    if (state.current === '' || !collection[state.current]) {
      state.current = collections[0]
    }
  },
  updateCurrent: function (state, current) {
    state.current = current
  },
  updateLoading: function (state, loading) {
    state.loading = loading
  },
  updateSheetId: function (state, sheetId) {
    state.sheetId = sheetId
  },
  updateImprints: function (state, imprints) {
    state.imprints = imprints
  },
  updateStores: function (state, stores) {
    state.stores = stores
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
