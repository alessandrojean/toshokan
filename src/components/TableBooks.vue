<template>
  <div>
    <div class="overflow-x-auto -mx-5 md:-mx-8 lg:mx-0">
      <div class="align-middle inline-block min-w-full">
        <div class="shadow overflow-hidden border-b border-gray-200 dark:border-gray-600 lg:rounded-t-lg">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" class="align-text-bottom space-x-1 px-6 py-3 text-left text-xs uppercase tracking-wider">
                  <span :class="sortProperty === 'title' ? 'font-semibold text-gray-700 dark:text-gray-100' : 'font-medium text-gray-500 dark:text-gray-300'">
                    {{ t('book.book') }}
                  </span>
                  <template v-if="sortProperty === 'title'">
                    <ArrowSmUpIcon v-if="sortDirection === 'asc'" class="align-text-bottom inline-block h-4 w-4 dark:text-gray-100" aria-hidden="true" />
                    <ArrowSmDownIcon v-else class="align-text-bottom inline-block h-4 w-4 dark:text-gray-100" aria-hidden="true" />
                  </template>
                </th>
                <th scope="col" class="align-text-bottom space-x-1 px-6 py-3 text-left text-xs uppercase tracking-wider">
                  <span :class="sortProperty === 'imprint' ? 'font-semibold text-gray-700 dark:text-gray-100' : 'font-medium text-gray-500 dark:text-gray-300'">
                    {{ t('book.properties.imprint') }}
                  </span>
                  <template v-if="sortProperty === 'imprint'">
                    <ArrowSmUpIcon v-if="sortDirection === 'asc'" class="align-text-bottom inline-block h-4 w-4 dark:text-gray-100" aria-hidden="true" />
                    <ArrowSmDownIcon v-else class="align-text-bottom inline-block h-4 w-4 dark:text-gray-100" aria-hidden="true" />
                  </template>
                </th>
                <th scope="col" class="align-text-bottom space-x-1 px-6 py-3 text-left text-xs uppercase tracking-wider">
                  <span :class="sortProperty === 'status' ? 'font-semibold text-gray-700 dark:text-gray-100' : 'font-medium text-gray-500 dark:text-gray-300'">
                    {{ t('book.properties.status') }}
                  </span>
                  <template v-if="sortProperty === 'status'">
                    <ArrowSmUpIcon v-if="sortDirection === 'asc'" class="align-text-bottom inline-block h-4 w-4 dark:text-gray-100" aria-hidden="true" />
                    <ArrowSmDownIcon v-else class="align-text-bottom inline-block h-4 w-4 dark:text-gray-100" aria-hidden="true" />
                  </template>
                </th>
                <th scope="col" class="align-text-bottom space-x-1 px-6 py-3 text-left text-xs uppercase tracking-wider">
                  <span :class="sortProperty === 'paidPrice.value' ? 'font-semibold text-gray-700 dark:text-gray-100' : 'font-medium text-gray-500 dark:text-gray-300'">
                    {{ t('book.properties.paidPrice') }}
                  </span>
                  <template v-if="sortProperty === 'paidPrice.value'">
                    <ArrowSmUpIcon v-if="sortDirection === 'asc'" class="align-text-bottom inline-block h-4 w-4 dark:text-gray-100" aria-hidden="true" />
                    <ArrowSmDownIcon v-else class="align-text-bottom inline-block h-4 w-4 dark:text-gray-100" aria-hidden="true" />
                  </template>
                </th>
                <th scope="col" class="align-text-bottom space-x-1 px-6 py-3 text-left text-xs uppercase tracking-wider">
                  <span :class="sortProperty === 'createdAt' ? 'font-semibold text-gray-700 dark:text-gray-100' : 'font-medium text-gray-500 dark:text-gray-300'">
                    {{ t('book.properties.createdAt') }}
                  </span>
                  <template v-if="sortProperty === 'createdAt'">
                    <ArrowSmUpIcon v-if="sortDirection === 'asc'" class="align-text-bottom inline-block h-4 w-4 dark:text-gray-100" aria-hidden="true" />
                    <ArrowSmDownIcon v-else class="align-text-bottom inline-block h-4 w-4 dark:text-gray-100" aria-hidden="true" />
                  </template>
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">
                    {{ t('dashboard.library.items.tableColumns.actions') }}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:divide-gray-600">
              <tr v-for="book in items" :key="book.id" class="hover:bg-gray-50 dark:hover:bg-gray-600">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img class="h-10 w-10 rounded-full object-cover" :src="book.coverUrl" alt="" />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900 dark:text-gray-200">
                        {{ book.titleParts[0] }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ volumeText(book) }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                  {{ book.imprint }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      book.status === BookStatus.READ
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-500 dark:border dark:border-green-500'
                        : 'bg-red-100 text-red-800 dark:bg-transparent dark:text-red-400 dark:border dark:border-red-400',
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                    ]"
                  >
                    {{ t(`book.${book.status.toLowerCase()}`) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatPrice(book.paidPrice) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(book.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <router-link
                    :to="{ name: 'BookDetails', params: { bookId: book.id } }"
                    class="button is-ghost bg-transparent hover:underline -mr-4"
                  >
                    {{ t('dashboard.library.items.view') }}
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="-mx-5 md:-mx-8 lg:mx-0 bg-white px-4 py-4 lg:py-3 flex items-center justify-between lg:rounded-b-lg shadow sm:px-6 dark:bg-gray-800">
      <nav
        role="navigation"
        aria-label="Paginação do conteúdo"
        class="flex-1 sm:hidden"
      >
        <ul class="flex justify-between">
          <li>
            <button
              type="button"
              class="button"
              :disabled="!paginationInfo.has_previous_page"
              @click.stop="handlePage(paginationInfo.current_page - 1)"
            >
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
            </button>
          </li>
        </ul>
      </nav>
      <div class="hidden sm:flex-1 sm:flex sm:flex-col lg:flex-row sm:items-center sm:justify-between">
        <i18n-t
          keypath="pagination.text"
          tag="p"
          class="mb-4 lg:mb-0 text-sm text-gray-700 dark:text-gray-400"
        >
          <span class="font-medium dark:text-gray-200"> {{ paginationInfo.current_page }} </span>
          <span class="font-medium dark:text-gray-200"> {{ paginationInfo.total_pages }} </span>
          <span class="font-medium dark:text-gray-200"> {{ paginationInfo.total_results }} </span>
        </i18n-t>
        <Paginator
          v-if="paginationInfo.total_pages > 1"
          :pagination-info="paginationInfo"
          @page="handlePage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import { ArrowSmDownIcon, ArrowSmUpIcon } from '@heroicons/vue/outline'

import Paginator from './Paginator.vue'

import { BookStatus as BaseBookStatus } from '@/model/Book'

export default {
  name: 'TableBooks',

  components: {
    ArrowSmDownIcon,
    ArrowSmUpIcon,
    Paginator
  },

  props: {
    items: Array,
    paginationInfo: Object,
    sortProperty: String,
    sortDirection: String
  },

  emits: ['page'],

  setup (_, context) {
    const { t, n, d } = useI18n()
    const store = useStore()

    const timeZone = computed(() => store.state.sheet.timeZone)

    const BookStatus = computed(() => BaseBookStatus)

    function formatDate (date) {
      return d(date, 'long', { timeZone: timeZone.value.name })
    }

    function formatPrice ({ currency, value }) {
      return n(parseFloat(value.replace(',', '.')), 'currency', { currency })
    }

    function handlePage (page) {
      context.emit('page', page)
    }

    function volumeText (item) {
      const isSingle = item.titleParts[1] === undefined

      return t(
        isSingle ? 'book.single' : 'book.volume',
        isSingle ? undefined : { number: item.titleParts[1] }
      )
    }

    return {
      BookStatus,
      formatDate,
      formatPrice,
      handlePage,
      t,
      volumeText
    }
  }
}
</script>

<style>

</style>
