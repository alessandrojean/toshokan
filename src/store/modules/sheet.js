import groupBy from 'lodash.groupby'
import uniqBy from 'lodash.uniqby'
import Vue from 'vue'

import { bookCompare, formatBook, parseBook } from '@/model/Book'

const state = () => ({
  collection: {},
  current: '',
  display: (localStorage && localStorage.getItem('DISPLAY_MODE')) || 'grid',
  lastAdded: [],
  loading: false,
  sheetId: undefined,
  imprints: [],
  stores: [],
  stats: {}
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

    return dispatch('findSheetId')
      .then(sheetId => {
        const COLLECTION_RANGE = 'Coleção!B5:Q'
        const TOTAL_RANGE = 'Estatísticas!C5'
        const MONEY_RANGE = 'Estatísticas!C8:C11'
        const STATUS_RANGE = 'Estatísticas!C14:C16'
        const MONTHLY_RANGE = 'Estatísticas!E5:G'
        const AUTHORS_RANGE = 'Estatísticas!I5:J'
        const SERIES_RANGE = 'Estatísticas!L5:M'
        const IMPRINTS_RANGE = 'Estatísticas!O5:P'

        window.gapi.client.sheets.spreadsheets.values
          .batchGet({
            spreadsheetId: sheetId,
            ranges: [
              COLLECTION_RANGE,
              TOTAL_RANGE,
              MONEY_RANGE,
              STATUS_RANGE,
              MONTHLY_RANGE,
              AUTHORS_RANGE,
              SERIES_RANGE,
              IMPRINTS_RANGE
            ]
          })
          .then(response => {
            const books = (response.result.valueRanges[0].values || [])
              .map(parseBook)

            const lastAdded = books.slice(-6).reverse()

            books.sort(bookCompare)

            const imprints = uniqBy(books, 'imprint')
              .map(b => b.imprint)
              .sort()

            const stores = uniqBy(books, 'store')
              .map(b => b.store)
              .sort()

            const stats = {
              count: response.result.valueRanges[1].values[0][0],
              money: {
                totalSpentLabel: response.result.valueRanges[2].values[0][0],
                totalSpentPaid: response.result.valueRanges[2].values[1][0],
                saved: response.result.valueRanges[2].values[2][0],
                percent: response.result.valueRanges[2].values[3][0]
              },
              status: {
                read: response.result.valueRanges[3].values[0][0],
                unread: response.result.valueRanges[3].values[1][0],
                percent: response.result.valueRanges[3].values[2][0]
              },
              monthly: response.result.valueRanges[4].values
                .slice(0, 6)
                .reverse()
                .map(row => ({
                  month: row[0],
                  totalSpent: row[1],
                  count: row[2]
                })),
              authors: response.result.valueRanges[5].values
                .slice(0, 10)
                .map(row => ({ name: row[0], count: row[1] })),
              series: response.result.valueRanges[6].values
                .slice(0, 10)
                .map(row => ({ name: row[0], count: row[1] })),
              imprints: response.result.valueRanges[7].values
                .slice(0, 10)
                .map(row => ({ name: row[0], count: row[1] }))
            }

            commit('updateLastAdded', lastAdded)
            commit('updateCollection', groupBy(books, 'collection'))
            commit('updateImprints', imprints)
            commit('updateStores', stores)
            commit('updateStats', stats)
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
      .then(
        () => dispatch('loadSheetData'),
        response => {
          // eslint-disable-next-line no-console
          console.error(response)
          commit('updateLoading', false)
        }
      )
  },

  bulkInsert: function ({ commit, dispatch, state }, books) {
    commit('updateLoading', true)

    return window.gapi.client.sheets.spreadsheets.values
      .append({
        spreadsheetId: state.sheetId,
        range: 'Coleção!B5',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        values: books.map(formatBook)
      })
      .then(
        () => dispatch('loadSheetData'),
        response => {
          // eslint-disable-next-line no-console
          console.error(response)
          commit('updateLoading', false)
        }
      )
  },

  updateBook: function ({ commit, state }, { book, oldBook, withoutLoading }) {
    commit('updateLoading', !withoutLoading)

    return window.gapi.client.sheets.spreadsheets.values
      .update({
        spreadsheetId: state.sheetId,
        range: oldBook.sheetLocation,
        valueInputOption: 'USER_ENTERED',
        values: [formatBook(book)]
      })
      .then(
        () => {
          commit('updateBook', { book, oldBook })
          commit('updateLoading', false)
        },
        response => {
          // eslint-disable-next-line no-console
          console.error(response)
          commit('updateLoading', false)
        }
      )
  },

  deleteBook: function ({ commit, dispatch, state }, book) {
    commit('updateLoading', true)

    const bookRow = book.sheetLocation.substring(9)

    return window.gapi.client.sheets.spreadsheets
      .batchUpdate({
        spreadsheetId: state.sheetId,
        resource: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: 0,
                  dimension: 'ROWS',
                  startIndex: bookRow - 1,
                  endIndex: bookRow
                }
              }
            }
          ]
        }
      })
      .then(
        () => dispatch('loadSheetData'),
        response => {
          // eslint-disable-next-line no-console
          console.error(response)
          commit('updateLoading', false)
        }
      )
  }
}

const mutations = {
  updateBook: function (state, { book, oldBook }) {
    const index = state.collection[oldBook.collection]
      .findIndex(b => b.sheetLocation === oldBook.sheetLocation)

    if (book.collection === oldBook.collection) {
      Vue.set(state.collection[book.collection], index, book)
    } else {
      Vue.delete(state.collection[oldBook.collection], index)

      if (state.collection[book.collection]) {
        state.collection[book.collection].push(book)
      } else {
        state.collection = {
          ...state.collection,
          [book.collection]: [book]
        }
      }
    }

    state.collection[book.collection].sort(bookCompare)
  },
  updateCollection: function (state, collection) {
    state.collection = { ...state.collection, ...collection }

    const collections = Object.keys(collection).sort()

    if (state.current === '' || !collection[state.current]) {
      state.current = collections[0]
    }
  },
  updateLastAdded: function (state, lastAdded) {
    state.lastAdded = lastAdded
  },
  updateCurrent: function (state, current) {
    state.current = current
  },
  updateDisplay: function (state, display) {
    state.display = display
    localStorage && localStorage.setItem('DISPLAY_MODE', display)
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
  },
  updateStats: function (state, stats) {
    state.stats = { ...state.stats, ...stats }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
