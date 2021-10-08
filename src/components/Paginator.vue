<template>
  <nav
    role="navigation"
    class="relative rounded-md shadow-sm"
  >
    <ul class="z-0 inline-flex -space-x-px">
      <li>
        <button
          type="button"
          class="pag-button is-left has-ring-focus"
          @click.stop="changePage(1)"
          :disabled="!paginationInfo.has_previous_page || !enabled"
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
          class="pag-button has-ring-focus"
          @click.stop="changePage(paginationInfo.previous_page)"
          :disabled="!paginationInfo.has_previous_page || !enabled"
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
            isCurrent(pageIdx) ? 'is-current' : '',
            'pag-button is-number has-ring-focus'
          ]"
          :aria-current="isCurrent(pageIdx) ? 'page' : ''"
          :disabled="!enabled"
          @click.stop="changePage(paginationInfo.first_page + pageIdx - 1)"
        >
          <span class="sr-only" v-if="isCurrent(pageIdx)">
            {{ t('pagination.current') }}
          </span>
          <span class="sr-only">
            {{ t('pagination.goToPage') }}
          </span>
          {{ paginationInfo.first_page + pageIdx - 1 }}
        </button>
      </li>

      <li>
        <button
          type="button"
          class="pag-button has-ring-focus"
          @click.stop="changePage(paginationInfo.next_page)"
          :disabled="!paginationInfo.has_next_page || !enabled"
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
          class="pag-button is-right has-ring-focus"
          @click.stop="changePage(paginationInfo.total_pages)"
          :disabled="!paginationInfo.has_next_page || !enabled"
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
    enabled: Boolean,
    paginationInfo: Object
  },

  emits: ['page'],

  setup (props, context) {
    const { paginationInfo } = toRefs(props)

    const links = computed(() => {
      return paginationInfo.value.last_page + 1 - paginationInfo.value.first_page
    })

    const { t } = useI18n()

    function isCurrent (idx) {
      return paginationInfo.value.current_page === paginationInfo.value.first_page + idx - 1
    }

    function changePage (page) {
      if (page !== paginationInfo.value.current_page) {
        context.emit('page', page)
      }
    }

    return { links, t, isCurrent, changePage }
  }
}
</script>

<style scoped>
.pag-button {
  @apply relative inline-flex items-center
    px-2 py-2 text-sm font-medium
    border border-gray-300 dark:border-gray-600
    bg-white dark:bg-gray-700
    text-gray-500 dark:text-gray-300;
}

.pag-button:disabled {
  @apply cursor-default opacity-50
    bg-white dark:bg-gray-700 dark:border-gray-700;
}

.pag-button:focus {
  @apply outline-none;
}

.pag-button:not(:disabled):hover {
  @apply z-10 bg-gray-50 dark:bg-gray-600
    dark:text-gray-200 dark:border-gray-500;
}

.pag-button:not(:disabled):active {
  @apply bg-gray-100 dark:bg-gray-700;
}

.pag-button:focus-visible {
  @apply dark:ring-offset-gray-800;
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

.pag-button.is-current,
.pag-button.is-current:hover,
.pag-button.is-current:active {
  @apply z-20 cursor-default bg-primary-50 dark:bg-primary-900
    border-primary-500 text-primary-600 dark:text-primary-200;
}

.pag-button.is-current:disabled {
  @apply bg-primary-50 dark:bg-primary-900
    border-primary-500 dark:border-primary-500;
}
</style>
