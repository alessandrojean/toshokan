<script lang="ts" setup>
import { useI18n } from '@/i18n'
import Book from '@/model/Book'
import type { ReadingMonthYear } from '@/services/sheet/getReadingMonths'
import type { GridMode, SpoilerMode } from '@/stores/settings'

export interface ReadingsPerYearProps {
  blurNsfw?: boolean
  gridMode?: GridMode
  loading?: boolean
  monthsYears?: ReadingMonthYear[]
  readBooks?: Record<number, Book[]>
  readBooksLoading?: boolean
  selected?: ReadingMonthYear
  spoilerMode?: SpoilerMode
}

const props = withDefaults(defineProps<ReadingsPerYearProps>(), {
  blurNsfw: false,
  gridMode: 'comfortable',
  loading: false,
  monthsYears: undefined,
  readBooks: undefined,
  readBooksLoading: false,
  selected: undefined,
  spoilerMode: () => ({
    cover: false,
    synopsis: false
  })
})

const emit = defineEmits<{
  (e: 'change', monthYear?: ReadingMonthYear): void
}>()

const {
  blurNsfw,
  gridMode,
  loading,
  monthsYears,
  readBooks,
  readBooksLoading,
  selected,
  spoilerMode
} = toRefs(props)

const { t, d, locale } = useI18n({ useScope: 'global' })

const years = computed(() => {
  const all = monthsYears.value?.map((monthYear) => monthYear.year)

  return [...new Set(all ?? [])]
})

function monthsInYear(year: number) {
  const inYear = monthsYears.value?.filter(
    (monthYear) => monthYear.year === year
  )

  return inYear?.map((monthYear) => monthYear.month) ?? []
}

const months = computed(() => monthsInYear(selectedYear.value))

watch(monthsYears, (monthsYears) => {
  const last = monthsYears?.[monthsYears.length - 1]

  if (!selectedMonth.value && !selectedYear.value && last) {
    selectedMonth.value = last.month
    selectedYear.value = last.year
  }
})

onMounted(() => {
  if (monthsYears.value) {
    const current = monthsYears.value.find((my) => {
      return my.month === selectedMonth.value && my.year === selectedYear.value
    })

    if (!current) {
      const last = monthsYears.value[monthsYears.value.length - 1]

      selectedMonth.value = last.month
      selectedYear.value = last.year
    }
  }
})

const selectedYear = ref(selected.value?.year ?? new Date().getFullYear())
const selectedMonth = ref(selected.value?.month ?? new Date().getMonth() + 1)

watch([selectedMonth, selectedYear], ([month, year]) => {
  const monthYear = monthsYears.value?.find((my) => {
    return my.month === month && my.year === year
  })

  emit('change', monthYear)
})

function handleSelectChange(event: Event) {
  const select = event.target as HTMLSelectElement
  const [year, month] = select.value.split('-')

  selectedYear.value = parseInt(year, 10)
  selectedMonth.value = parseInt(month, 10)
}

const monthFormatter = computed(() => {
  return new Intl.DateTimeFormat(locale.value, { month: 'short' })
})

function monthName(month: number) {
  return monthFormatter.value.format(new Date(Date.UTC(2022, month)))
}

watch(selectedYear, () => {
  selectedMonth.value = months.value[0]
})

watch(readBooks, (readBooks) => {
  if (readBooks && !readBooks[selectedMonth.value]) {
    selectedMonth.value = months.value[months.value.length - 1]
  }
})

function monthYearName(month: number, year: number) {
  const name = d(new Date(Date.UTC(year, month)), 'monthYear')

  return name.charAt(0).toUpperCase() + name.slice(1)
}
</script>

<route lang="yaml">
meta:
  title: app.routes.dashboard.readings
  layout: dashboard
</route>

<template>
  <div class="w-full md:flex gap-8">
    <div class="w-52 shrink-0 hidden md:block">
      <div class="sticky top-20">
        <fieldset class="grid grid-cols-2 gap-2">
          <legend class="col-span-2 text-md font-medium font-display mb-3">
            {{ t('dashboard.readings.year') }}
          </legend>
          <template v-if="!loading">
            <div v-for="year in years" :key="year" class="w-full">
              <input
                class="sr-only peer"
                type="radio"
                :id="`year-${year}`"
                :value="year"
                v-model="selectedYear"
              />
              <label
                :class="[
                  'border border-gray-200 dark:border-gray-700',
                  'select-none peer-enabled:cursor-pointer',
                  'peer-disabled:opacity-30 bg-gray-200 dark:bg-gray-700',
                  'peer-checked:bg-primary-100 peer-checked:border-gray-200',
                  'dark:peer-checked:bg-primary-800/50 dark:peer-checked:border-primary-400',
                  'peer-checked:text-primary-700 dark:peer-checked:text-primary-100 peer-checked:font-medium',
                  'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2',
                  'peer-focus-visible:ring-primary-600',
                  'dark:peer-focus-visible:ring-offset-gray-900',
                  'w-full block text-center py-1 rounded-md text-sm'
                ]"
                :for="`year-${year}`"
              >
                {{ year }}
              </label>
            </div>
          </template>
          <template v-else>
            <div
              v-for="year in 6"
              :key="year"
              class="skeleton h-7 w-full rounded-md"
            />
          </template>
        </fieldset>

        <fieldset class="grid grid-cols-3 gap-2 mt-8">
          <legend class="col-span-3 text-md font-medium font-display mb-3">
            {{ t('dashboard.readings.month') }}
          </legend>
          <div v-for="month of 12" :key="month" class="w-full">
            <template v-if="!loading">
              <input
                class="sr-only peer"
                type="radio"
                :id="`month-${month}`"
                :value="month"
                :disabled="!months.includes(month)"
                v-model="selectedMonth"
              />
              <label
                :class="[
                  'border border-gray-200 dark:border-gray-700',
                  'select-none peer-enabled:cursor-pointer',
                  'peer-disabled:opacity-30 bg-gray-200 dark:bg-gray-700',
                  'peer-checked:bg-primary-100 peer-checked:border-gray-200',
                  'dark:peer-checked:bg-primary-800/50 dark:peer-checked:border-primary-400',
                  'peer-checked:text-primary-700 dark:peer-checked:text-primary-100 peer-checked:font-medium',
                  'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2',
                  'peer-focus-visible:ring-primary-600',
                  'dark:peer-focus-visible:ring-offset-gray-900',
                  'w-full block text-center py-1 rounded-md text-sm'
                ]"
                :for="`month-${month}`"
              >
                {{ monthName(month) }}
              </label>
            </template>
            <div
              aria-hidden="true"
              v-else
              class="skeleton h-7 w-full rounded-md"
            />
          </div>
        </fieldset>
      </div>
    </div>

    <div class="grow">
      <div class="md:hidden mb-6" v-if="!loading && monthsYears">
        <label for="month-select" class="sr-only">
          {{ t('dashboard.readings.month') }}
        </label>

        <select id="month-select" class="select" @change="handleSelectChange">
          <optgroup v-for="year in years" :key="year" :label="year.toString()">
            <option
              v-for="month in monthsInYear(year)"
              :key="month.toString()"
              :value="`${year}-${month}`"
              :selected="selectedMonth === month && selectedYear === year"
            >
              {{ monthYearName(month, year) }}
            </option>
          </optgroup>
        </select>
      </div>

      <BookGrid
        :items="readBooks?.[selectedMonth]"
        kind="readings"
        :loading="
          readBooksLoading || loading || !readBooks?.[selectedMonth]?.length
        "
        :skeleton-items="30"
        :mode="gridMode"
        :blur-nsfw="blurNsfw"
        :spoiler-mode="spoilerMode"
        image-only
      >
        <template v-if="!readBooksLoading && !loading" #actions="{ book }">
          <div
            class="bg-white select-none dark:bg-gray-600 text-xs sm:text-sm shadow-lg rounded-full px-2 py-0.5 mt-1"
          >
            {{ d(book.readAt!, 'dayMonth') }}
          </div>
        </template>
      </BookGrid>
    </div>
  </div>
</template>
