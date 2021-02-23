import { splitTitle } from '../../model/Book'

function formatDate (date) {
  if (!date) return null

  const [year, month, day] = date.split('-')
  return `${day}/${month}/${year}`
}

const state = () => ({
  book: {
    code: '',
    title: '',
    authors: [],
    imprint: '',
    collection: '',
    labelPrice: {
      currency: 'BRL',
      value: ''
    },
    paidPrice: {
      currency: 'BRL',
      value: ''
    },
    format: '',
    store: '',
    coverUrl: '',
    boughtAt: new Date().toISOString().substring(0, 10),
    boughtAtFormatted: formatDate(new Date().toISOString().substring(0, 10))
  },
  invalid: false
})

const getters = {

}

const actions = {

}

const mutations = {
  clearBook: function (state) {
    state.book = {
      code: '',
      title: '',
      titleParts: [],
      authors: [],
      imprint: '',
      collection: '',
      labelPrice: {
        currency: 'BRL',
        value: ''
      },
      paidPrice: {
        currency: 'BRL',
        value: ''
      },
      format: '',
      store: '',
      coverUrl: '',
      boughtAt: new Date().toISOString().substring(0, 10),
      boughtAtFormatted: formatDate(new Date().toISOString().substring(0, 10))
    }

    state.invalid = false
  },

  updateBook: function (state, book) {
    state.book = { ...state.book, ...book }
    state.book.boughtAtFormatted = formatDate(book.boughtAt)
    state.book.paidPrice = { ...state.book.paidPrice, ...book.paidPrice }
    state.book.labelPrice = { ...state.book.labelPrice, ...book.labelPrice }
  },

  updateBookInvalid: function (state, invalid) {
    state.invalid = invalid
  },

  updateCode: function (state, code) {
    state.book.code = code
  },

  updateTitle: function (state, title) {
    state.book.title = title
    state.book.titleParts = splitTitle(title)
  },

  updateAuthors: function (state, authors) {
    state.book.authors = authors
  },

  updateImprint: function (state, imprint) {
    state.book.imprint = imprint
  },

  updateCollection: function (state, collection) {
    state.book.collection = collection
  },

  updateFormat: function (state, format) {
    state.book.format = format
  },

  updateLabelPrice: function (state, labelPrice) {
    state.book.labelPrice = { ...state.book.labelPrice, ...labelPrice }
  },

  updatePaidPrice: function (state, paidPrice) {
    state.book.paidPrice = { ...state.book.paidPrice, ...paidPrice }
  },

  updateStore: function (state, store) {
    state.book.store = store
  },

  updateBoughtAt: function (state, boughtAt) {
    state.book.boughtAt = boughtAt
    state.book.boughtAtFormatted = formatDate(boughtAt)
  },

  updateBoughtAtFormatted: function (state, boughtAtFormatted) {
    state.book.boughtAtFormatted = boughtAtFormatted

    if (!boughtAtFormatted) {
      state.book.boughtAt = undefined
    }
  },

  updateCoverUrl: function (state, coverUrl) {
    state.book.coverUrl = coverUrl
  },

  updateStatus: function (state, status) {
    state.book.status = status
  },

  updateFavorite: function (state, favorite) {
    state.book.favorite = favorite
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
