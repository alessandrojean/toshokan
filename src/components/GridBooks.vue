<template>
  <div>
    <template v-if="sheetLoading || (loading && items.length === 0)">
      <div class="motion-safe:animate-pulse mb-6 w-full hidden sm:block h-28 md:h-14 bg-gray-400 dark:bg-gray-600 rounded"></div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5">
        <BookCard
          v-for="tempBook in skeletonItems"
          :key="tempBook"
          :loading="true"
        />
      </div>
      <div class="motion-safe:animate-pulse mt-6 w-full h-28 md:h-14 bg-gray-400 dark:bg-gray-600 rounded"></div>
    </template>
    <template v-else>
      <div v-if="paginationInfo.total_pages > 1" class="bg-white dark:bg-gray-800 px-4 py-4 md:py-3 sm:px-6 shadow rounded-lg mb-6 hidden sm:flex flex-col md:flex-row md:justify-between items-center">
        <div>
          <i18n-t
            keypath="pagination.text"
            tag="p"
            class="text-sm text-gray-700 dark:text-gray-400 sm:mb-4 md:mb-0"
          >
            <span class="font-medium dark:text-gray-200"> {{ paginationInfo.current_page }} </span>
            <span class="font-medium dark:text-gray-200"> {{ paginationInfo.total_pages }} </span>
            <span class="font-medium dark:text-gray-200"> {{ paginationInfo.total_results }} </span>
          </i18n-t>
        </div>

        <div class="hidden sm:block">
          <Paginator
            v-if="paginationInfo.total_pages > 1"
            :pagination-info="paginationInfo"
            :enabled="!loading"
            @page="handlePage"
          />
        </div>
      </div>

      <ul
        class="mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5"
        v-if="!loading"
      >
        <li
          v-for="book in items"
          :key="book.id"
        >
          <BookCard
            :book="book"
            :loading="loading"
          />
        </li>
      </ul>

      <div
        class="mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5"
        v-else
      >
        <BookCard
          v-for="tempBook in skeletonItems"
          :key="tempBook"
          :loading="true"
        />
      </div>

      <div v-if="paginationInfo.total_pages > 1" class="bg-white dark:bg-gray-800 px-4 py-4 md:py-3 sm:px-6 shadow rounded-lg flex sm:mb-6 flex-col md:flex-row md:justify-between items-center">
        <div>
          <i18n-t
            keypath="pagination.text"
            tag="p"
            class="text-sm text-gray-700 dark:text-gray-400 mb-4 md:mb-0"
          >
            <span class="font-medium dark:text-gray-200"> {{ paginationInfo.current_page }} </span>
            <span class="font-medium dark:text-gray-200"> {{ paginationInfo.total_pages }} </span>
            <span class="font-medium dark:text-gray-200"> {{ paginationInfo.total_results }} </span>
          </i18n-t>
        </div>

        <nav
          role="navigation"
          aria-label="Paginação do conteúdo"
          class="w-full sm:hidden"
        >
          <ul class="flex justify-center space-x-4">
            <li>
              <button
                type="button"
                class="button"
                :disabled="!paginationInfo.has_previous_page || loading"
                @click.stop="handlePage(paginationInfo.current_page - 1)"
              >
                <span aria-hidden="true">
                  <ChevronLeftIcon aria-hidden="true" />
                </span>
                {{ t('pagination.previous') }}
              </button>
            </li>

            <li>
              <button
                type="button"
                class="button"
                :disabled="!paginationInfo.has_next_page || loading"
                @click.stop="handlePage(paginationInfo.current_page + 1)"
              >
                {{ t('pagination.next') }}
                <span aria-hidden="true">
                  <ChevronRightIcon class="is-right" aria-hidden="true" />
                </span>
              </button>
            </li>
          </ul>
        </nav>

        <div class="hidden sm:block">
          <Paginator
            v-if="paginationInfo.total_pages > 1"
            :pagination-info="paginationInfo"
            :enabled="!loading"
            @page="handlePage"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/solid'

import BookCard from './BookCard.vue'
import Paginator from './Paginator.vue'

export default {
  name: 'GridBooks',

  components: {
    BookCard,
    Paginator,
    ChevronLeftIcon,
    ChevronRightIcon
  },

  props: {
    items: Array,
    paginationInfo: Object,
    skeletonItems: Number
  },

  emits: ['page'],

  setup (_, context) {
    function handlePage (page) {
      context.emit('page', page)
    }

    const store = useStore()

    const sheetLoading = computed(() => store.state.sheet.loading)
    const loading = computed(() => store.state.collection.books.loading)

    const { t } = useI18n()

    return {
      handlePage,
      sheetLoading,
      loading,
      t
    }
  }
}
</script>

<style>

</style>
