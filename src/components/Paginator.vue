<script setup>
import { computed, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/solid'

const props = defineProps({
  enabled: Boolean,
  paginationInfo: Object
})

const emit = defineEmits(['page'])

const { paginationInfo } = toRefs(props)

const links = computed(() => {
  return paginationInfo.value.last_page + 1 - paginationInfo.value.first_page
})

const { t } = useI18n({ useScope: 'global' })

function isCurrent(idx) {
  return (
    paginationInfo.value.current_page ===
    paginationInfo.value.first_page + idx - 1
  )
}

function changePage(page) {
  if (page !== paginationInfo.value.current_page) {
    emit('page', page)
  }
}

const paginator = ref(null)
const focused = ref((paginationInfo.value?.current_page || 1) + 1)

function tabIndex(idx) {
  return idx === focused.value ? '0' : '-1'
}

watch(paginationInfo, (newPagination) => {
  const { current_page: currentPage, first_page: firstPage } = newPagination
  focused.value = currentPage - firstPage + 2
})

/**
 * @param {KeyboardEvent} event
 * @param {number} idx
 */
function handleKeydown(event, idx) {
  const allowedKeys = ['ArrowRight', 'ArrowLeft', 'Home', 'End']
  const { key } = event
  const {
    current_page: currentPage,
    first_page: firstPage,
    has_previous_page: hasPreviousPage,
    has_next_page: hasNextPage
  } = paginationInfo.value

  if (key === 'Tab') {
    setTimeout(() => {
      focused.value = currentPage - firstPage + 2
    })
    return
  }

  if (!allowedKeys.includes(key)) {
    return
  }

  event.preventDefault()

  if (key === 'ArrowRight' && hasNextPage) {
    focused.value =
      focused.value + 1 >= links.value + 4
        ? hasPreviousPage
          ? 0
          : 2
        : focused.value + 1
  } else if (key === 'ArrowRight') {
    focused.value = focused.value + 1 >= links.value + 2 ? 0 : focused.value + 1
  } else if (key === 'ArrowLeft' && hasPreviousPage) {
    focused.value =
      focused.value - 1 < 0
        ? hasNextPage
          ? links.value + 3
          : links.value + 1
        : focused.value - 1
  } else if (key === 'ArrowLeft') {
    focused.value = focused.value - 1 <= 1 ? links.value + 3 : focused.value - 1
  } else if (key === 'Home') {
    focused.value = hasPreviousPage ? 0 : 2
  } else if (key === 'End') {
    focused.value = hasNextPage ? links.value + 3 : links.value + 1
  }

  const li = paginator.value?.children?.[focused.value]
  const button = li?.children?.[0]

  button?.focus()
}
</script>

<template>
  <nav role="navigation" class="relative rounded-md shadow-sm">
    <ul class="z-0 inline-flex -space-x-px" ref="paginator">
      <li>
        <button
          type="button"
          class="pag-button is-left has-ring-focus"
          :disabled="!paginationInfo.has_previous_page || !enabled"
          :tabindex="tabIndex(0)"
          @click.stop="changePage(1)"
          @keydown="handleKeydown($event, 0)"
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
          :disabled="!paginationInfo.has_previous_page || !enabled"
          :tabindex="tabIndex(1)"
          @click.stop="changePage(paginationInfo.previous_page)"
          @keydown="handleKeydown($event, 1)"
        >
          <span class="sr-only">{{ t('pagination.previousPage') }}</span>
          <span aria-hidden="true">
            <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
          </span>
        </button>
      </li>

      <li v-for="pageIdx in links" :key="pageIdx">
        <button
          type="button"
          :class="[
            isCurrent(pageIdx) ? 'is-current' : '',
            'pag-button is-number has-ring-focus'
          ]"
          :aria-current="isCurrent(pageIdx) ? 'page' : ''"
          :disabled="!enabled"
          :tabindex="tabIndex(pageIdx + 1)"
          @click.stop="changePage(paginationInfo.first_page + pageIdx - 1)"
          @keydown="handleKeydown($event, pageIdx + 1)"
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
          :disabled="!paginationInfo.has_next_page || !enabled"
          :tabindex="tabIndex(links + 2)"
          @click.stop="changePage(paginationInfo.next_page)"
          @keydown="handleKeydown($event, links + 2)"
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
          :disabled="!paginationInfo.has_next_page || !enabled"
          :tabindex="tabIndex(links + 3)"
          @click.stop="changePage(paginationInfo.total_pages)"
          @keydown="handleKeydown($event, links + 3)"
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

<style lang="postcss" scoped>
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
  @apply z-[5] bg-gray-50 dark:bg-gray-600
    dark:text-gray-200 dark:border-gray-500;
}

.pag-button:not(:disabled):active {
  @apply bg-gray-100 dark:bg-gray-700;
}

.pag-button:focus-visible {
  @apply dark:ring-offset-gray-800 z-[15];
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
.pag-button.is-current:not(:disabled):hover,
.pag-button.is-current:not(:disabled):active {
  @apply z-10 cursor-default bg-primary-50 dark:bg-primary-900
    border-primary-500 dark:border-primary-500
    text-primary-600 dark:text-primary-200;
}

.pag-button.is-current:disabled,
.pag-button.is-current:disabled:hover,
.pag-button.is-current:disabled:active {
  @apply bg-primary-50 dark:bg-primary-900
    border-primary-500 dark:border-primary-500;
}
</style>
