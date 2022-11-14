<script lang="ts" setup>
import { useI18n } from '@/i18n'
import Book from '@/model/Book'
import type { MonetaryValue } from '@/model/Book'
import type { SheetTimezone } from '@/services/sheet/getTimeZone'

import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon
} from '@heroicons/vue/20/solid'

export interface BookButtonsProps {
  book?: Book | null
  loading?: boolean
  timeZone?: SheetTimezone
}

const props = withDefaults(defineProps<BookButtonsProps>(), {
  book: undefined,
  loading: false,
  timeZone: undefined
})

defineEmits<{
  (e: 'click:publisher', publisher: string): void
  (e: 'click:group', group: string): void
  (e: 'click:store', store: string): void
}>()

const { book, loading, timeZone } = toRefs(props)
const { t, d, n, locale } = useI18n({ useScope: 'global' })

function formatPrice(price: MonetaryValue | null | undefined) {
  if (!price) {
    return null
  }

  const { value, currency } = price

  // @ts-ignore
  return n(value, 'currency', { currency })
}

function formatDate(date: Date | string, format = 'short') {
  if (typeof date === 'string' && date.length > 0) {
    return d(
      new Date(`${date}T00:00:00.000${timeZone.value!.offsetStr}`),
      format,
      // @ts-ignore
      { timeZone: timeZone.value.name }
    )
  }

  if (date instanceof Date) {
    // @ts-ignore
    return d(date, format, { timeZone: timeZone.value.name })
  }

  return t('dashboard.details.info.dateUnknown')
}

const country = computed(() => book.value?.isbnData)

const language = computed(() => {
  if (!country.value) {
    return null
  }

  const languageNames = new Intl.DisplayNames([locale.value], {
    type: 'language'
  })
  const localizedName = languageNames.of(country.value.locale)!

  return (
    localizedName.charAt(0).toLocaleUpperCase(locale.value) +
    localizedName.slice(1)
  )
})

const metadata = computed(() => {
  const sameCurrency =
    book.value?.paidPrice?.currency === book.value?.labelPrice?.currency

  return [
    {
      title: t('book.properties.language'),
      value: country.value ? language.value : null
    },
    {
      title: book.value?.codeType ?? t('book.properties.code'),
      value: book.value?.code
    },
    {
      title: t('book.properties.publisher'),
      key: 'publisher',
      value: book.value?.publisher,
      searchable: true
    },
    {
      title: t('book.properties.group'),
      key: 'group',
      value: book.value?.group,
      searchable: true
    },
    {
      title: t('book.properties.dimensions'),
      value: book.value?.dimensions
        ? n(book.value.dimensions.width, 'dimensions') +
          ' × ' +
          n(book.value.dimensions.height, 'dimensions') +
          ' cm'
        : null
    },
    {
      title: t('book.properties.labelPrice'),
      value: formatPrice(book.value?.labelPrice)
    },
    {
      title: t('book.properties.paidPrice'),
      value: formatPrice(book.value?.paidPrice),
      badge: sameCurrency
        ? (book.value?.paidPrice?.value ?? 0) >
          (book.value?.labelPrice?.value ?? 0)
          ? (book.value?.paidPrice?.value ?? 1) /
            (book.value?.labelPrice?.value ?? 1)
          : 1 -
            (book.value?.paidPrice?.value ?? 1) /
              (book.value?.labelPrice?.value ?? 1)
        : null,
      samePrice: book.value?.paidPrice?.value === book.value?.labelPrice?.value
    },
    {
      title: t('book.properties.store'),
      key: 'store',
      value: book.value?.store,
      searchable: true
    },
    {
      title: t('book.properties.boughtAt'),
      value: book.value?.boughtAt,
      time: true
    },
    {
      title: t('book.properties.readAt'),
      value: book.value?.readAt,
      time: true
    }
  ]
})
</script>

<template>
  <DashboardBlock as="dl">
    <div class="space-y-4">
      <template v-for="(mt, i) in metadata" :key="i">
        <div v-if="mt.value || loading">
          <dt
            v-if="!loading"
            class="text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            {{ mt.title }}
          </dt>
          <div v-else aria-hidden="true" class="skeleton w-16 h-5" />

          <dd
            v-if="!loading"
            class="mt-1 text-sm text-gray-900 dark:text-gray-200 inline-flex items-center"
          >
            <time v-if="mt.time" :datetime="mt.value!.toISOString()">
              {{ formatDate(mt.value!) }}
            </time>
            <a
              v-else-if="mt.searchable"
              href="#"
              class="search-link has-ring-focus"
              :title="t('dashboard.search.searchBy', [mt.value])"
              @click.prevent="$emit(`click:${mt.key}`, mt.value!)"
            >
              {{ mt.value }}
            </a>
            <span v-else>{{ mt.value }}</span>

            <div
              v-if="mt.badge && !mt.samePrice"
              :class="[
                mt.badge <= 1
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-red-100 text-red-800',
                'dark:bg-gray-700 dark:text-gray-200 ml-3 px-1.5 py-0.5 flex items-center space-x-1 rounded-full text-xs uppercase font-bold dark:font-semibold'
              ]"
            >
              <span aria-hidden="true">
                <ArrowTrendingDownIcon v-if="mt.badge <= 1" class="w-4 h-4" />
                <ArrowTrendingUpIcon v-else class="w-4 h-4" />
              </span>
              <span>{{ n(mt.badge, 'percent') }}</span>
            </div>
          </dd>
          <div v-else aria-hidden="true" class="mt-1 skeleton w-32 h-6" />
        </div>
      </template>
    </div>
  </DashboardBlock>
</template>

<style lang="postcss" scoped>
.search-link {
  @apply rounded font-medium
    text-gray-800 dark:text-gray-300
    underline underline-offset-1 decoration-2
    decoration-primary-600/60 dark:decoration-primary-400/80;

  &:hover {
    @apply decoration-primary-600 dark:decoration-primary-400
      text-gray-900 dark:text-gray-200;
  }

  &:focus-visible {
    @apply dark:ring-offset-gray-800 md:dark:ring-offset-gray-900;
  }
}
</style>
