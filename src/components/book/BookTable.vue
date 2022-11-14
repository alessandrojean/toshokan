<script lang="ts" setup>
import { useI18n } from '@/i18n'
import Book, {
  Status,
  STATUS_FUTURE,
  STATUS_READ,
  STATUS_UNREAD
} from '@/model/Book'
import type { Sort } from '@/types'

import {
  ArrowDownIcon,
  ArrowUpIcon,
  EllipsisHorizontalIcon,
  StarIcon
} from '@heroicons/vue/20/solid'
import { PhotoIcon } from '@heroicons/vue/24/outline'

export interface BookTable {
  currentPage?: number
  items?: Book[]
  loading?: boolean
  selectable?: boolean
  skeleton?: boolean
  sortProperty?: string
  sortDirection?: Sort
}

export type SortEvent = {
  property: string
  direction: Sort
}

export type MarkAsEvent = {
  booksToEdit: Book[]
  newStatus: Status
}

export type ToggleFavoriteEvent = {
  booksToEdit: Book[]
  newFavorite: boolean
}

const props = withDefaults(defineProps<BookTable>(), {
  items: undefined,
  loading: false,
  selectable: false,
  skeleton: false,
  sortDirection: undefined,
  sortProperty: undefined
})

const emit = defineEmits<{
  (e: 'click:deleteSelection', selection?: Book[]): void
  (e: 'click:markAs', event: MarkAsEvent): void
  (e: 'click:toggleFavorite', event: ToggleFavoriteEvent): void
  (e: 'select', selected: number[]): void
  (e: 'sort', sort: SortEvent): void
}>()

const { t, d, n, locale, getNumberFormat } = useI18n({ useScope: 'global' })
const sheetStore = useSheetStore()
const router = useRouter()

const { data: timeZone } = useTimeZoneQuery({
  enabled: computed(() => sheetStore.sheetId !== null)
})

function formatDate(date: Date) {
  // @ts-ignore
  return d(date, 'long', { timeZone: timeZone.value.name })
}

function formatPrice(currency: string, value?: number) {
  const formatter = new Intl.NumberFormat(locale.value, {
    ...getNumberFormat(locale.value).currency,
    currency: currency
  })

  return formatter.formatToParts(value ?? 0)
}

function currency(currency: string) {
  const part = formatPrice(currency).find((p) => p.type === 'currency')

  return part?.value || '$'
}

function value(currencyValue: string, value: number) {
  const currencySymbol = currency(currencyValue)

  // @ts-ignore
  return n(value, 'currency', { currency: currencyValue })
    .replace(currencySymbol, '')
    .trim()
}

function volumeText(item: Book) {
  const isSingle = item.titleParts.number === null

  return isSingle
    ? t('book.single')
    : t('book.volume', { number: item.titleParts.number! })
}

const { skeleton, loading } = toRefs(props)

const columns = computed(() => [
  {
    key: 'status',
    label: t('book.properties.status'),
    class:
      'hidden md:table-cell w-[12ch] ' + (skeleton.value ? '!text-right' : ''),
    buttonClass: '!text-right',
    skeletonClass: 'ml-3'
  },
  {
    key: 'paidPrice.value',
    label: t('book.properties.paidPrice'),
    class: 'hidden lg:table-cell w-[15ch]',
    buttonClass: '!pl-8',
    skeletonClass: 'ml-6'
  },
  {
    key: 'createdAt',
    label: t('book.properties.createdAt'),
    class: 'hidden md:table-cell w-[20ch]'
  },
  {
    key: 'actions',
    label: t('dashboard.library.items.tableColumns.actions'),
    hidden: true,
    class: 'w-16'
  }
])

const { items, selectable } = toRefs(props)

const selection = ref([] as number[])
const current = ref(0)
const topCheckbox = ref<HTMLInputElement>()
const tableBody = ref<HTMLTableElement>()

const isMac = ref(
  // @ts-ignore
  navigator.userAgentData
    ? // @ts-ignore
      navigator.userAgentData.platform.toLowerCase().indexOf('mac') > -1
    : navigator.platform.toLowerCase().indexOf('mac') > -1
)

function handleTopCheckbox(event: Event) {
  const checked = (event.target as HTMLInputElement).checked

  if (!selectable.value || !isMdBreakpoint.value) {
    return
  }

  selection.value = checked
    ? Array.from(Array(items.value?.length ?? 0).keys())
    : []

  if (topCheckbox.value) {
    topCheckbox.value.indeterminate =
      selection.value.length > 0 &&
      selection.value.length < (items.value?.length ?? 0)
  }

  current.value = 0

  emit('select', selection.value)
}

function rangeArray(startIdx: number, endIdx: number) {
  if (startIdx === endIdx) {
    return [startIdx]
  }

  return Array.from(
    { length: endIdx - startIdx + 1 },
    (_, i) => i + startIdx
  ).sort((a, b) => a - b)
}

const { breakpoints } = useTailwindTheme()
const isMdBreakpoint = useBreakpoints(breakpoints).greater('md')

/**
 * Try to mimic the Windows behavior on selecting items
 * using the mouse + Shift + Ctrl + Command + checkboxes.
 */
function handleCheckbox(checked: boolean, idx: number, event: MouseEvent) {
  const target = event.target as Element

  if (target.tagName === 'A') {
    return
  }

  if (!isMdBreakpoint.value) {
    router.push({
      name: 'dashboard-library-book-id',
      params: { id: items.value?.[idx].id ?? '' }
    })
    return
  }

  if (!selectable.value) {
    return
  }

  const controlKey = isMac.value ? event.metaKey : event.ctrlKey

  const individual = controlKey || target.tagName === 'INPUT'

  if (target.tagName === 'LABEL') {
    event.preventDefault()
  }

  if (event.shiftKey && selection.value.length === 0) {
    selection.value.push(idx)
  } else if (event.shiftKey && !controlKey) {
    const startIdx = Math.min(selection.value[0], idx)
    const endIdx = Math.max(selection.value[0], idx)
    selection.value = rangeArray(startIdx, endIdx)
  } else if (individual && selection.value.includes(idx) && !checked) {
    selection.value.splice(selection.value.indexOf(idx), 1)
  } else if (individual) {
    selection.value.push(idx)
  } else if (selection.value.length > 1) {
    selection.value = [idx]
  } else {
    selection.value = selection.value.includes(idx) ? [] : [idx]
  }

  selection.value = Array.from(new Set(selection.value)).sort((a, b) => a - b)

  if (topCheckbox.value) {
    topCheckbox.value.indeterminate =
      selection.value.length > 0 &&
      selection.value.length < (items.value?.length ?? 0)
  }

  current.value = idx

  emit('select', selection.value)
}

function handleKeyboard(event: KeyboardEvent, idx: number) {
  const allowedKeys = [
    'ArrowDown',
    'ArrowUp',
    'Home',
    'End',
    'Delete',
    'Enter',
    'a',
    ' '
  ]
  const { key, shiftKey, ctrlKey, metaKey } = event

  const controlKey = isMac.value ? metaKey : ctrlKey

  const totalItems = items.value?.length ?? 0
  const selectionTotalItems = selection.value.length

  if (!allowedKeys.includes(key) || !isMdBreakpoint.value) {
    return
  }

  if (key === 'Enter') {
    router.push({
      name: 'dashboard-library-book-id',
      params: { id: items.value?.[idx]?.id ?? '' }
    })

    return
  }

  if (!selectable.value) {
    if (key === 'ArrowDown') {
      current.value = Math.min(idx + 1, totalItems - 1)
    } else if (key === 'ArrowUp') {
      current.value = Math.max(idx - 1, 0)
    }

    const tableRow = tableBody.value?.children[current.value] as
      | HTMLTableRowElement
      | undefined

    nextTick(() => tableRow?.focus())

    return
  }

  if ((key === 'ArrowUp' || key === 'Home') && current.value === 0) {
    return
  }

  if (
    (key === 'ArrowDown' || key === 'End') &&
    current.value === totalItems - 1
  ) {
    return
  }

  event.preventDefault()

  if (key === 'Delete' && selection.value.length > 0) {
    emit('click:deleteSelection')
  } else if (
    key === 'a' &&
    controlKey &&
    !shiftKey &&
    selection.value.length < totalItems
  ) {
    selection.value = rangeArray(0, totalItems - 1)
  } else if (key === 'a' && controlKey && !shiftKey) {
    selection.value = []
  } else if (key === ' ' && !controlKey && selectionTotalItems === 0) {
    selection.value = [idx]
    current.value = idx
  } else if (
    selectionTotalItems === 0 &&
    (key === 'ArrowDown' || key === 'ArrowUp') &&
    !controlKey
  ) {
    selection.value = [idx]
    current.value = idx
  } else if (shiftKey) {
    if (key === 'End') {
      const startIdx = selection.value[0] || 0
      const endIdx = totalItems - 1
      selection.value = rangeArray(startIdx, endIdx)
      current.value = endIdx
    } else if (key === 'Home') {
      const startIdx = 0
      const endIdx =
        selection.value.length > 0
          ? selection.value[selection.value.length - 1]
          : 0
      selection.value = rangeArray(startIdx, endIdx)
      current.value = startIdx
    } else if (
      key === 'ArrowDown' &&
      !selection.value.includes(current.value + 1)
    ) {
      const startIdx = selection.value[0]
      const endIdx = Math.min(current.value + 1, totalItems - 1)
      selection.value = rangeArray(startIdx, endIdx)
      current.value = endIdx
    } else if (key === 'ArrowDown') {
      const startIdx = Math.min(current.value + 1, totalItems - 1)
      const endIdx = selection.value[selection.value.length - 1]
      selection.value = rangeArray(startIdx, endIdx)
      current.value = startIdx
    } else if (
      key === 'ArrowUp' &&
      !selection.value.includes(current.value - 1)
    ) {
      const startIdx = Math.max(current.value - 1, 0)
      const endIdx = selection.value[selection.value.length - 1]
      selection.value = rangeArray(startIdx, endIdx)
      current.value = startIdx
    } else if (key === 'ArrowUp') {
      const startIdx = selection.value[0]
      const endIdx = Math.max(current.value - 1, 0)
      selection.value = rangeArray(startIdx, endIdx)
      current.value = endIdx
    }
  } else if (controlKey) {
    if (key === 'Home') {
      current.value = 0
    } else if (key === 'End') {
      current.value = totalItems - 1
    } else if (key === 'ArrowDown') {
      current.value = Math.min(idx + 1, totalItems - 1)
    } else if (key === 'ArrowUp') {
      current.value = Math.max(idx - 1, 0)
    } else if (key === ' ' && selection.value.includes(current.value)) {
      selection.value.splice(selection.value.indexOf(current.value), 1)
    } else if (key === ' ') {
      selection.value.push(current.value)
    }
  } else if (key === 'ArrowDown' && current.value + 1 < totalItems) {
    selection.value = [++current.value]
  } else if (key === 'ArrowUp' && current.value - 1 >= 0) {
    selection.value = [--current.value]
  } else if (key === 'Home') {
    selection.value = [0]
    current.value = selection.value[0]
  } else if (key === 'End') {
    selection.value = [totalItems - 1]
    current.value = selection.value[0]
  }

  selection.value = Array.from(new Set(selection.value)).sort((a, b) => a - b)

  if (topCheckbox.value) {
    topCheckbox.value.indeterminate =
      selection.value.length > 0 &&
      selection.value.length < (items.value?.length ?? '')
  }

  nextTick(() => focus())

  emit('select', selection.value)
}

function clearSelection() {
  selection.value = []
  current.value = 0

  if (topCheckbox.value) {
    topCheckbox.value.indeterminate = false
  }

  emit('select', selection.value)
}

const { currentPage, sortProperty, sortDirection } = toRefs(props)

watch(() => loading.value || skeleton.value, clearSelection)
watch([currentPage, sortProperty, sortDirection], clearSelection)

function handleDeleteSelection() {
  const booksToDelete = selection.value.map((idx) => items.value![idx])
  emit('click:deleteSelection', booksToDelete)
}

function ariaSorted(property: string) {
  if (sortProperty.value !== property) {
    return 'none'
  }

  return sortDirection.value === 'asc' ? 'ascending' : 'descending'
}

function handleSort(property: string) {
  if (property !== sortProperty.value) {
    emit('sort', {
      property,
      direction: sortDirection.value!
    })
  } else {
    emit('sort', {
      property,
      direction: sortDirection.value === 'asc' ? 'desc' : 'asc'
    })
  }
}

function countBy(array: number[], key: keyof Book) {
  const counting = array
    .map((idx) => items.value![idx])
    .reduce((acm, crr) => {
      const acmKey = acm[crr[key] as string]

      if (acm[acmKey] !== undefined) {
        acm[acmKey]++
      } else {
        acm[acmKey] = 1
      }

      return acm
    }, {} as Record<string, number>)

  return Object.entries(counting)
    .sort((a, b) => b[1] - a[1])
    .map((entry) => ({ [key]: entry[0], count: entry[1] }))
}

const statusCount = computed(() => countBy(selection.value, 'status'))

const predominantStatus = computed(() => statusCount.value[0]?.status)

const inverseStatus = computed(() => {
  return predominantStatus.value === STATUS_READ ? STATUS_UNREAD : STATUS_READ
})

const inverseStatusText = computed(() => {
  const statusKey = inverseStatus.value.toLowerCase()
  return t(`book.${statusKey}`)
})

const hasFutureSelected = computed(() => {
  return statusCount.value.find(({ status }) => status === STATUS_FUTURE)
})

function handleMarkAsClick() {
  const booksToEdit = selection.value.map((idx) => items.value![idx])
  emit('click:markAs', { booksToEdit, newStatus: inverseStatus.value })
}

const favoritesCount = computed(() => countBy(selection.value, 'favorite'))

const inverseFavorite = computed(() => {
  return favoritesCount.value?.[0]?.favorite === 'false'
})

function handleToggleFavorite() {
  const booksToEdit = selection.value.map((idx) => items.value![idx])
  emit('click:toggleFavorite', {
    booksToEdit,
    newFavorite: inverseFavorite.value
  })
}

function focus() {
  const tableRow = tableBody.value?.children[current.value] as
    | HTMLTableRowElement
    | undefined

  tableRow?.focus()
}

function focusOnActiveHeader() {
  document
    .querySelector<HTMLButtonElement>(
      'th[aria-sort]:not([aria-sort=none]) button'
    )
    ?.focus()
}

defineExpose({ focus, focusOnActiveHeader })
</script>

<template>
  <div
    class="relative -mx-4 sm:-mx-6 md:mx-0 md:rounded-lg border dark:border-gray-700 overflow-hidden"
  >
    <div class="align-middle inline-block min-w-full" :aria-hidden="skeleton">
      <table
        class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 select-none"
      >
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th
              v-if="selectable"
              scope="col"
              class="table-column-header !pl-5 !pr-2 w-6 hidden md:table-cell align-middle"
            >
              <label for="select-all" class="sr-only">
                {{ t('table.selectAll') }}
              </label>
              <input
                ref="topCheckbox"
                type="checkbox"
                class="checkbox !ml-0"
                id="select-all"
                :checked="selection.length === items?.length && !skeleton"
                :disabled="loading || skeleton"
                @change="handleTopCheckbox"
              />
            </th>
            <th
              scope="col"
              :class="[
                'table-column-header align-middle',
                sortProperty === 'title' ? 'is-selected' : ''
              ]"
              :aria-sort="ariaSorted('title')"
            >
              <button
                v-if="selection.length === 0 && !skeleton"
                type="button"
                :class="[
                  'has-ring-focus !pl-4 sm:!pl-6 focus-visible:ring-inset table-header-button',
                  selectable ? 'md:!pl-3' : 'md:!pl-6'
                ]"
                :disabled="loading"
                @click="handleSort('title')"
              >
                <span>
                  {{ t('book.book') }}
                </span>
                <template v-if="sortProperty === 'title'">
                  <ArrowUpIcon
                    v-if="sortDirection === 'asc'"
                    class="align-text-bottom inline-block h-4 w-4 dark:text-gray-100 ml-1"
                    aria-hidden="true"
                  />
                  <ArrowDownIcon
                    v-else
                    class="align-text-bottom inline-block h-4 w-4 dark:text-gray-100 ml-1"
                    aria-hidden="true"
                  />
                </template>
              </button>
              <div v-else-if="!skeleton" class="space-x-2 ml-3">
                <Button
                  v-if="!hasFutureSelected"
                  size="small"
                  @click="handleMarkAsClick"
                >
                  {{
                    t('dashboard.details.header.options.markAs', {
                      status: inverseStatusText.toLocaleLowerCase(locale)
                    })
                  }}
                </Button>
                <Button size="small" @click="handleToggleFavorite">
                  {{
                    t(
                      inverseFavorite
                        ? 'dashboard.details.header.options.addToFavorites'
                        : 'dashboard.details.header.options.removeFromFavorites'
                    )
                  }}
                </Button>
                <Button size="small" @click="handleDeleteSelection">
                  {{
                    t('dashboard.library.items.tableColumns.deleteSelection')
                  }}
                </Button>
              </div>
              <div
                v-else
                :class="[
                  'skeleton w-20 h-4 mr-auto ml-4 sm:ml-6',
                  selectable ? 'md:ml-0' : 'md:ml-6'
                ]"
              >
                <span class="sr-only">
                  {{ t('book.book') }}
                </span>
              </div>
            </th>
            <th
              v-for="column of columns"
              :key="column.key"
              scope="col"
              :class="[
                'table-column-header !pl-0 align-middle',
                sortProperty === column.key ? 'is-selected' : '',
                column.class
              ]"
              :aria-sort="!column.hidden ? ariaSorted(column.key) : undefined"
            >
              <button
                v-if="!column.hidden && !skeleton"
                type="button"
                :class="[
                  'has-ring-focus table-header-button focus-visible:ring-inset',
                  column.buttonClass
                ]"
                :disabled="loading"
                @click="handleSort(column.key)"
              >
                <span>
                  {{ column.label }}
                </span>
                <template v-if="sortProperty === column.key && !column.hidden">
                  <ArrowUpIcon
                    v-if="sortDirection === 'asc'"
                    class="align-text-bottom inline-block h-4 w-4 dark:text-gray-100 ml-1"
                    aria-hidden="true"
                  />
                  <ArrowDownIcon
                    v-else
                    class="align-text-bottom inline-block h-4 w-4 dark:text-gray-100 ml-1"
                    aria-hidden="true"
                  />
                </template>
              </button>
              <span v-else-if="!skeleton" class="sr-only">
                {{ column.label }}
              </span>
              <div
                v-else
                :class="[
                  'h-4',
                  column.skeletonClass,
                  !column.hidden ? 'skeleton w-20' : 'w-10'
                ]"
              >
                <span class="sr-only">
                  {{ column.label }}
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody
          ref="tableBody"
          class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
        >
          <template v-if="!skeleton">
            <tr
              v-for="(book, bookIdx) in items"
              :key="book.id!"
              :class="[
                selection.includes(bookIdx)
                  ? 'bg-primary-100/25 dark:bg-gray-700/60 hover:bg-primary-100/50 dark:hover:bg-gray-700/80'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/20',
                'motion-safe:transition-colors group has-ring-focus focus-visible:ring-inset focus-visible:!ring-offset-2'
              ]"
              :tabindex="bookIdx === current ? '0' : undefined"
              :aria-labelledby="'book-label-' + book.id"
              @click="
                handleCheckbox(!selection.includes(bookIdx), bookIdx, $event)
              "
              @keydown="handleKeyboard($event, bookIdx)"
            >
              <td v-if="selectable" class="hidden pl-5 md:table-cell relative">
                <div
                  :class="[
                    'absolute w-[3px] h-full left-0 inset-y-0',
                    'bg-primary-600 dark:bg-primary-500',
                    'motion-safe:transition-transform',
                    selection.includes(bookIdx)
                      ? 'translate-x-0 group-focus-visible:-translate-x-full'
                      : '-translate-x-full'
                  ]"
                />
                <input
                  type="checkbox"
                  class="checkbox"
                  tabindex="-1"
                  :checked="selection.includes(bookIdx)"
                  :id="'book-checkbox-' + book.id"
                />
              </td>
              <td
                :class="[
                  'pl-4 sm:pl-6 py-4 max-w-[calc(100vw-8.5rem)] md:max-w-xs lg:max-w-none',
                  selectable ? 'md:pl-3' : 'md:pl-6'
                ]"
              >
                <div class="flex items-center">
                  <div
                    :class="[
                      'shrink-0 h-10 w-10 flex items-center justify-center rounded',
                      'motion-safe:transition-colors',
                      selection.includes(bookIdx)
                        ? 'bg-primary-600/10 dark:bg-gray-600/60'
                        : 'bg-gray-600/10 dark:bg-gray-600/40'
                    ]"
                  >
                    <img
                      v-if="(book.coverUrl?.length ?? 0) > 0"
                      :class="[
                        'h-10 w-10 rounded object-cover motion-safe:transition',
                        selection.includes(bookIdx)
                          ? 'ring-2 ring-primary-200/60 dark:ring-gray-500/40'
                          : ''
                      ]"
                      :src="book.coverUrl!"
                      :alt="book.title!"
                      loading="lazy"
                    />
                    <PhotoIcon
                      v-else
                      :class="[
                        'h-6 w-6 motion-safe:transition-colors',
                        selection.includes(bookIdx)
                          ? 'text-primary-600/70 dark:text-gray-300/70'
                          : 'text-gray-500/80 dark:text-gray-400/80'
                      ]"
                    />
                  </div>
                  <div class="ml-4 min-w-0">
                    <label
                      :class="[
                        'text-sm font-medium truncate max-w-[calc(100vw-8.5rem)] md:max-w-xs lg:max-w-none min-w-0 block',
                        selection.includes(bookIdx)
                          ? 'text-primary-800 dark:text-gray-100'
                          : 'text-gray-900 dark:text-gray-200'
                      ]"
                      :for="'book-checkbox-' + book.id"
                      :id="'book-label-' + book.id"
                    >
                      {{ book.titleParts.title }}
                    </label>
                    <div
                      :class="[
                        'text-xs truncate max-w-[calc(100vw-8.5rem)] md:max-w-xs lg:max-w-none min-w-0',
                        selection.includes(bookIdx)
                          ? 'text-primary-600 dark:text-gray-300'
                          : 'text-gray-500 dark:text-gray-300/80'
                      ]"
                    >
                      {{ volumeText(book) }} &middot; {{ book.publisher }}
                    </div>
                  </div>
                  <StarIcon
                    v-if="book.favorite"
                    :class="[
                      'w-5 h-5 shrink-0 ml-auto -mr-2 hidden sm:block',
                      selection.includes(bookIdx)
                        ? 'text-primary-600 dark:text-yellow-500'
                        : 'text-gray-700/50 dark:text-yellow-500/80'
                    ]"
                  />
                </div>
              </td>
              <td
                class="pr-3 py-4 md:whitespace-nowrap hidden md:table-cell text-right"
              >
                <span :class="'is-' + book.status!.toLowerCase()" class="badge">
                  {{ t(`book.${book.status!.toLowerCase()}`) }}
                </span>
              </td>
              <td
                class="py-4 lg:whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden lg:table-cell"
              >
                <div class="tabular-nums px-8">
                  <span>
                    {{ currency(book.paidPrice!.currency) }}
                  </span>
                  <span class="float-right">
                    {{ value(book.paidPrice!.currency, book.paidPrice!.value) }}
                  </span>
                </div>
              </td>
              <td
                class="w-[20ch] px-3 py-4 md:whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 hidden md:table-cell"
              >
                <span class="tabular-nums">
                  {{ formatDate(book.createdAt!) }}
                </span>
              </td>
              <td
                class="pr-6 py-4 w-16 md:whitespace-nowrap text-right text-sm font-medium"
              >
                <Button
                  as="RouterLink"
                  kind="ghost"
                  icon-only
                  rounded
                  :to="{
                    name: 'dashboard-library-book-id',
                    params: { id: book.id }
                  }"
                  class="-mr-2"
                  tabindex="-1"
                  :title="t('dashboard.library.items.view')"
                  v-slot="{ iconClass }"
                >
                  <EllipsisHorizontalIcon :class="iconClass" />
                </Button>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr v-for="idx in 18" :key="idx">
              <td v-if="selectable" class="hidden px-5 md:table-cell">
                <input
                  aria-hidden="true"
                  type="checkbox"
                  disabled
                  class="checkbox"
                />
              </td>
              <td
                :class="[
                  'pr-6 py-4 pl-4 sm:pl-6',
                  selectable ? 'md:pl-0' : 'md:pl-6'
                ]"
              >
                <div class="flex items-center">
                  <div
                    class="shrink-0 skeleton h-10 w-10 inline-flex items-center justify-center"
                  >
                    <PhotoIcon class="h-6 w-6 text-white dark:text-gray-500" />
                  </div>
                  <div class="ml-4">
                    <div class="skeleton w-36 h-4" />
                    <div class="skeleton w-24 h-3 mt-1" />
                  </div>
                </div>
              </td>
              <td class="pr-6 py-4 hidden md:table-cell text-right">
                <div class="skeleton w-16 h-4 ml-auto" />
              </td>
              <td class="px-6 py-4 hidden lg:table-cell">
                <div class="skeleton w-20 h-4" />
              </td>
              <td class="pr-6 py-4 hidden md:table-cell">
                <div class="skeleton w-28 h-4" />
              </td>
              <td class="py-4">
                <div class="skeleton w-10 h-10" />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>
