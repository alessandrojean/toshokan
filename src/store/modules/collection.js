import Fuse from 'fuse.js'
import Paginator from 'paginator'

function buildPaginationInfo ({ perPage, links, totalResults, page }) {
  const paginator = new Paginator(perPage, links)

  return paginator.build(totalResults, page)
}

const fuseOptions = {
  useExtendedSearch: true,
  keys: [
    'title',
    'authors',
    'imprint',
    'store',
    'code'
  ]
}

export default {
  namespaced: true,
  state: {
    currentPage: 0,
    gridMode: localStorage.getItem('grid_mode') || 'compact',
    group: '',
    links: 6,
    paginationInfo: {},
    perPage: 18,
    search: {
      query: '',
      results: []
    },
    sortBy: 'createdAt',
    sortDirection: 'desc',
    viewMode: localStorage.getItem('view_mode') || 'table'
  },
  mutations: {
    updateCurrentPage: function (state, { page, totalResults }) {
      const paginationInfo = buildPaginationInfo({
        perPage: state.perPage,
        links: state.links,
        totalResults,
        page
      })

      state.currentPage = page
      state.paginationInfo = { ...state.paginationInfo, ...paginationInfo }
    },

    updateGridMode: function (state, gridMode) {
      state.gridMode = gridMode
      localStorage.setItem('grid_mode', gridMode)
    },

    updateGroup: function (state, { group, totalResults }) {
      state.group = group || ''
      localStorage.setItem('collection_group', group)

      const paginationInfo = buildPaginationInfo({
        perPage: state.perPage,
        links: state.links,
        totalResults,
        page: 1
      })

      state.currentPage = 1
      state.paginationInfo = { ...state.paginationInfo, ...paginationInfo }
    },

    updateSearch: function (state, search) {
      state.search = { ...state.search, ...search }
    },

    updateSort: function (state, { sortBy, sortDirection }) {
      state.sortBy = sortBy
      state.sortDirection = sortDirection
    },

    updateViewMode: function (state, viewMode) {
      state.viewMode = viewMode
      localStorage.setItem('view_mode', viewMode)
    }
  },
  actions: {
    search ({ commit, rootState }, { query }) {
      const items = Object.values(rootState.sheet.collection)
        .flatMap(groupItems => groupItems)

      const fuse = new Fuse(items, fuseOptions)

      const search = {
        query,
        results: fuse.search(query).slice(0, 10)
      }

      commit('updateSearch', search)
    }
  }
}
