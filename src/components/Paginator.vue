<template>
  <nav
    role="navigation"
    class="relative rounded-md shadow-sm"
    aria-label="Paginação dos conteúdos"
  >
    <ul class="z-0 inline-flex -space-x-px">
      <li>
        <button
          type="button"
          class="pag-button is-left"
          @click.stop="$emit('page', 1)"
          :disabled="!paginationInfo.has_previous_page"
        >
          <span class="sr-only">{{ t('pagination.firstPage') }}</span>
          <span aria-hidden="true">
            <ChevronDoubleLeftIcon class="h-5 w-5" aria-hidden="true" />
          </span>
        </button>
      </li>

      <li>
        <button
          type="button"
          class="pag-button"
          @click.stop="$emit('page', paginationInfo.previous_page)"
          :disabled="!paginationInfo.has_previous_page"
        >
          <span class="sr-only">{{ t('pagination.previousPage') }}</span>
          <span aria-hidden="true">
            <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
          </span>
        </button>
      </li>

      <li
        v-for="pageIdx in links"
        :key="pageIdx"
      >
        <button
          type="button"
          :class="[
            paginationInfo.first_page + pageIdx - 1 === paginationInfo.current_page ? 'is-current' : '',
            'pag-button is-number'
          ]"
          :aria-current="paginationInfo.first_page + pageIdx - 1 === paginationInfo.current_page"
          @click.stop="$emit('page', paginationInfo.first_page + pageIdx - 1)"
        >
          <span class="sr-only" v-if="paginationInfo.first_page + pageIdx - 1 === paginationInfo.current_page">{{ t('pagination.current') }}</span>
          <span class="sr-only">{{ t('pagination.goToPage') }}</span>
          {{ paginationInfo.first_page + pageIdx - 1 }}
        </button>
      </li>

      <li>
        <button
          type="button"
          class="pag-button"
          @click.stop="$emit('page', paginationInfo.next_page)"
          :disabled="!paginationInfo.has_next_page"
        >
          <span class="sr-only">{{ t('pagination.nextPage') }}</span>
          <span aria-hidden="true">
            <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
          </span>
        </button>
      </li>

      <li>
        <button
          type="button"
          class="pag-button is-right"
          @click.stop="$emit('page', paginationInfo.total_pages)"
          :disabled="!paginationInfo.has_next_page"
        >
          <span class="sr-only">{{ t('pagination.lastPage') }}</span>
          <span aria-hidden="true">
            <ChevronDoubleRightIcon class="h-5 w-5" aria-hidden="true" />
          </span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
import { computed, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/solid'

export default {
  name: 'Paginator',

  components: {
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon
  },

  props: {
    paginationInfo: Object
  },

  setup (props) {
    const { paginationInfo } = toRefs(props)

    const links = computed(() => {
      return paginationInfo.value.last_page + 1 - paginationInfo.value.first_page
    })

    const { t } = useI18n()

    return { links, t }
  }
}
</script>

<style scoped>
@layer components {
  .pag-button {
    @apply relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-default disabled:opacity-50 disabled:bg-white active:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:z-20 motion-safe:transition-shadow dark:bg-gray-700 dark:text-gray-300 dark:disabled:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:active:bg-gray-500 dark:hover:border-gray-500 dark:disabled:border-gray-600 dark:hover:text-gray-200 dark:focus-visible:ring-offset-gray-700;
  }

  .pag-button.is-left {
    @apply rounded-l-md;
  }

  .pag-button.is-right {
    @apply rounded-r-md;
  }

  .pag-button.is-number {
    @apply px-4;
  }

  .pag-button.is-current {
    @apply z-10 bg-indigo-50 border-indigo-500 text-indigo-600 hover:bg-indigo-100 active:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800 dark:hover:border-indigo-400 dark:active:bg-indigo-700;
  }
}
</style>
