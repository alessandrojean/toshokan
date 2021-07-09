<template>
  <div>
    <template v-if="loading">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5">
        <BookCard
          v-for="tempBook in skeletonItems"
          :key="tempBook"
          :loading="loading"
        />
      </div>
    </template>
    <template v-else>
      <div v-if="paginationInfo.total_pages > 1" class="bg-white dark:bg-gray-800 px-4 py-4 md:py-3 sm:px-6 shadow rounded-lg mb-6 flex flex-col md:flex-row md:justify-between items-center">
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
                :disabled="!paginationInfo.has_previous_page"
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
                :disabled="!paginationInfo.has_next_page"
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
            @page="handlePage"
          />
        </div>
      </div>
      <ul class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5">
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
      <div v-if="paginationInfo.total_pages > 1" class="mt-6 bg-white dark:bg-gray-800 px-4 py-4 md:py-3 sm:px-6 shadow rounded-lg mb-6 flex flex-col md:flex-row md:justify-between items-center">
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
                :disabled="!paginationInfo.has_previous_page"
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
                :disabled="!paginationInfo.has_next_page"
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
            @page="handlePage"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/solid'
import { useI18n } from 'vue-i18n'

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
    loading: Boolean,
    paginationInfo: Object,
    skeletonItems: Number
  },

  setup (_, context) {
    function handlePage (page) {
      context.emit('page', page)
    }

    const { t } = useI18n()

    return { handlePage, t }
  }
}
</script>

<style>

</style>
