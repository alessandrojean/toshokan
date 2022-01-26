import Paginator from 'paginator'

import { searchBooks } from '@/services/sheet'

export const SearchMutations = {
  CLEAR: 'clear',
  UPDATE_HISTORY: 'updateHistory',
  UPDATE_SORT: 'updateSort',
  UPDATE_STATE: 'updateState'
}

const state = () => ({
  history: localStorage.getItem('search_history')
    ? JSON.parse(localStorage.getItem('search_history'))
    : [],
  query: '',
  page: 1,
  pagination: null,
  sortBy: 'createdAt',
  sortDirection: 'desc',
  results: [],
  loading: false
})

const actions = {
  async search (
    { commit, dispatch, state, rootState },
    { query, sortBy, sortDirection, page }
  ) {
    commit(SearchMutations.UPDATE_STATE, {
      loading: true,
      results: [],
      page: page || 1,
      pagination: null,
      query
    })

    const sheetId = rootState.sheet.sheetId

    try {
      if (Object.keys(rootState.collection.idMap).length === 0) {
        await dispatch('collection/fetchIdMap', null, { root: true })
      }

      commit(SearchMutations.UPDATE_STATE, {
        sortBy: sortBy || state.sortBy,
        sortDirection: sortDirection || state.sortDirection
      })

      const { results, total } = await searchBooks({
        sheetId,
        idMap: rootState.collection.idMap,
        searchTerm: query,
        sort: {
          sortBy: state.sortBy,
          sortDirection: state.sortDirection
        },
        page
      })

      const newHistory = [query].concat(state.history)

      commit(SearchMutations.UPDATE_STATE, {
        results,
        history: [...new Set(newHistory)].slice(0, 6),
        paginationInfo: new Paginator(state.perPage, 4)
          .build(total, state.page)
      })
    } catch (e) {
      commit(SearchMutations.UPDATE_STATE, {
        results: [],
        page: 1,
        paginationInfo: null
      })
    } finally {
      commit(SearchMutations.UPDATE_STATE, { loading: false })
    }
  }
}

const mutations = {
  [SearchMutations.CLEAR]: function (state) {
    state.query = ''
    state.page = 1
    state.paginationInfo = null
    state.sortBy = 'createdAt'
    state.sortDirection = 'desc'
    state.results = []
    state.loading = false
  },

  [SearchMutations.UPDATE_HISTORY]: function (state, history) {
    state.history = history
  },

  [SearchMutations.UPDATE_SORT]: function (state, { sortBy, sortDirection }) {
    state.sortBy = sortBy || state.sortBy
    state.sortDirection = sortDirection || state.sortDirection
  },

  [SearchMutations.UPDATE_STATE]: function (state, newState) {
    Object.assign(state, newState)

    if (newState.history) {
      localStorage.setItem('search_history', JSON.stringify(newState.history))
    }
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
