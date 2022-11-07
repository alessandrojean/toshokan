import { acceptHMRUpdate, defineStore } from 'pinia'
import Paginator from 'paginator'
import { useLocalStorage } from '@vueuse/core'

export const HIDE = 'hide'
export const ONLY = 'only'
export const INDIFERENT = 'indiferent'

export type TriState = 'hide' | 'only' | 'indiferent'
export type Sort = 'asc' | 'desc'

type BuildPaginationInfoArgs = {
  perPage?: number
  links?: number
  totalResults: number | undefined | null
  page: number
}

type UpdateSortArgs = {
  sortBy?: string
  sortDirection?: Sort
}

type PaginationInfo = ReturnType<Paginator['build']>

export const useCollectionStore = defineStore('collection', {
  state: () => ({
    currentPage: 1,
    filters: {
      groups: useLocalStorage<string[]>('collection_groups', [])
    },
    favorites: useLocalStorage<TriState>('collection_favorites', 'indiferent'),
    futureItems: useLocalStorage<TriState>('collection_future_items', 'hide'),
    links: 6,
    paginationInfo: {} as PaginationInfo,
    perPage: 18,
    sortBy: useLocalStorage('collection_sort_by', 'createdAt'),
    sortDirection: useLocalStorage<Sort>('collection_sort_direction', 'desc')
  }),
  actions: {
    buildPaginationInfo({
      perPage,
      links,
      totalResults,
      page
    }: BuildPaginationInfoArgs) {
      const paginator = new Paginator(perPage!, links!)

      return paginator.build(totalResults ?? 0, page)
    },

    updateCurrentPage({ page, totalResults }: BuildPaginationInfoArgs) {
      this.currentPage = page

      this.paginationInfo = {
        ...this.paginationInfo,
        ...this.buildPaginationInfo({
          perPage: this.perPage,
          links: this.links,
          totalResults,
          page
        })
      }
    },

    updateFavorites(favorites: TriState) {
      this.favorites = favorites
    },

    updateFutureItems(futureItems: TriState) {
      this.futureItems = futureItems
    },

    updateGroups(groups?: string[]) {
      this.filters.groups = groups ?? []
    },

    updateSort({ sortBy, sortDirection }: UpdateSortArgs) {
      this.sortBy = sortBy ?? this.sortBy
      this.sortDirection = sortDirection ?? this.sortDirection
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCollectionStore, import.meta.hot))
}
