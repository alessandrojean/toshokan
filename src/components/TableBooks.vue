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
                    Livro
                  </span>
                  <template v-if="sortProperty === 'title'">
                    <ArrowSmUpIcon v-if="sortDirection === 'asc'" class="align-text-bottom inline-block h-4 w-4 dark:text-gray-100" aria-hidden="true" />
                    <ArrowSmDownIcon v-else class="align-text-bottom inline-block h-4 w-4 dark:text-gray-100" aria-hidden="true" />
                  </template>
                </th>
                <th scope="col" class="align-text-bottom space-x-1 px-6 py-3 text-left text-xs uppercase tracking-wider">
                  <span :class="sortProperty === 'imprint' ? 'font-semibold text-gray-700 dark:text-gray-100' : 'font-medium text-gray-500 dark:text-gray-300'">
                    Editora
                  </span>
                  <template v-if="sortProperty === 'imprint'">
                    <ArrowSmUpIcon v-if="sortDirection === 'asc'" class="align-text-bottom inline-block h-4 w-4 dark:text-gray-100" aria-hidden="true" />
                    <ArrowSmDownIcon v-else class="align-text-bottom inline-block h-4 w-4 dark:text-gray-100" aria-hidden="true" />
                  </template>
                </th>
                <th scope="col" class="align-text-bottom space-x-1 px-6 py-3 text-left text-xs uppercase tracking-wider">
                  <span :class="sortProperty === 'status' ? 'font-semibold text-gray-700 dark:text-gray-100' : 'font-medium text-gray-500 dark:text-gray-300'">
                    Estado
                  </span>
                  <template v-if="sortProperty === 'status'">
                    <ArrowSmUpIcon v-if="sortDirection === 'asc'" class="align-text-bottom inline-block h-4 w-4 dark:text-gray-100" aria-hidden="true" />
                    <ArrowSmDownIcon v-else class="align-text-bottom inline-block h-4 w-4 dark:text-gray-100" aria-hidden="true" />
                  </template>
                </th>
                <th scope="col" class="align-text-bottom space-x-1 px-6 py-3 text-left text-xs uppercase tracking-wider">
                  <span :class="sortProperty === 'paidPrice.value' ? 'font-semibold text-gray-700 dark:text-gray-100' : 'font-medium text-gray-500 dark:text-gray-300'">
                    Preço pago
                  </span>
                  <template v-if="sortProperty === 'paidPrice.value'">
                    <ArrowSmUpIcon v-if="sortDirection === 'asc'" class="align-text-bottom inline-block h-4 w-4 dark:text-gray-100" aria-hidden="true" />
                    <ArrowSmDownIcon v-else class="align-text-bottom inline-block h-4 w-4 dark:text-gray-100" aria-hidden="true" />
                  </template>
                </th>
                <th scope="col" class="align-text-bottom space-x-1 px-6 py-3 text-left text-xs uppercase tracking-wider">
                  <span :class="sortProperty === 'createdAt' ? 'font-semibold text-gray-700 dark:text-gray-100' : 'font-medium text-gray-500 dark:text-gray-300'">
                    Criação
                  </span>
                  <template v-if="sortProperty === 'createdAt'">
                    <ArrowSmUpIcon v-if="sortDirection === 'asc'" class="align-text-bottom inline-block h-4 w-4 dark:text-gray-100" aria-hidden="true" />
                    <ArrowSmDownIcon v-else class="align-text-bottom inline-block h-4 w-4 dark:text-gray-100" aria-hidden="true" />
                  </template>
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Ações</span>
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
                        Volume {{ book.titleParts[1] ? '#' + book.titleParts[1] : 'único' }}
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
                      book.status === 'Lido'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-500 dark:border dark:border-green-500'
                        : 'bg-red-100 text-red-800 dark:bg-transparent dark:text-red-400 dark:border dark:border-red-400',
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                    ]"
                  >
                    {{ book.status }}
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
                    Visualizar
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
              Anterior
            </button>
          </li>

          <li>
            <button
              type="button"
              class="button"
              :disabled="!paginationInfo.has_next_page"
              @click.stop="handlePage(paginationInfo.current_page + 1)"
            >
              Próximo
            </button>
          </li>
        </ul>
      </nav>
      <div class="hidden sm:flex-1 sm:flex sm:flex-col lg:flex-row sm:items-center sm:justify-between">
        <p class="mb-4 lg:mb-0 text-sm text-gray-700 dark:text-gray-400">
          Mostrando página
          <span class="font-medium dark:text-gray-200"> {{ paginationInfo.current_page }} </span>
          de
          <span class="font-medium dark:text-gray-200"> {{ paginationInfo.total_pages }} </span>
          de
          <span class="font-medium dark:text-gray-200"> {{ paginationInfo.total_results }} </span>
          resultados
        </p>
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
import { ArrowSmDownIcon, ArrowSmUpIcon } from '@heroicons/vue/outline'

import Paginator from './Paginator.vue'

const dateFormatter = new Intl.DateTimeFormat('pt-BR')

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

  methods: {
    formatDate: function (date) {
      return dateFormatter.format(date)
    },

    formatPrice: function (price) {
      const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: price.currency
      })

      return formatter.format(price.value.replace(',', '.'))
    },

    handlePage: function (page) {
      this.$emit('page', page)
    }
  }
}
</script>

<style>

</style>
