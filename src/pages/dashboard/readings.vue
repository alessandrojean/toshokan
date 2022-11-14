<script lang="ts" setup>
import { useI18n } from '@/i18n'

const { t, d, locale } = useI18n({ useScope: 'global' })
const settingsStore = useSettingsStore()
const sheetStore = useSheetStore()
const enabled = computed(() => sheetStore.sheetId !== null)

const { data: readingMonthsYears, isLoading: readingMonthsYearsLoading } =
  useReadingMonthsQuery({ enabled })

const years = computed(() => {
  const all = readingMonthsYears.value?.map((monthYear) => monthYear.year)

  return [...new Set(all ?? [])]
})

const months = computed(() => {
  const inYear = readingMonthsYears.value?.filter(
    (monthYear) => monthYear.year === selectedYear.value
  )

  return inYear?.map((monthYear) => monthYear.month) ?? []
})

watch(readingMonthsYears, (readingMonthsYears) => {
  const last = readingMonthsYears?.[readingMonthsYears.length - 1]

  if (!selectedMonth.value && !selectedYear.value && last) {
    selectedMonth.value = last.month
    selectedYear.value = last.year
  }
})

const selectedYear = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth() + 1)

const monthFormatter = computed(() => {
  return new Intl.DateTimeFormat(locale.value, { month: 'short' })
})

function monthName(month: number) {
  return monthFormatter.value.format(new Date(Date.UTC(2022, month)))
}

watch(selectedYear, () => {
  selectedMonth.value = months.value[0]
})

const gridMode = computed(() => settingsStore.gridMode)
const blurNsfw = computed(() => settingsStore.blurNsfw)
const spoilerMode = computed(() => settingsStore.spoilerMode)

const { data: readBooks, isLoading: readBooksLoading } =
  useReadBooksInYearQuery({ year: selectedYear }, { enabled })

watch(readBooks, (readBooks) => {
  if (readBooks && !readBooks[selectedMonth.value]) {
    selectedMonth.value = months.value[months.value.length - 1]
  }
})

const selectedMonthYear = computed(() => {
  const current = Date.UTC(selectedYear.value, selectedMonth.value)
  const localized = d(new Date(current), 'monthYear')

  return localized.charAt(0).toUpperCase() + localized.slice(1)
})
</script>

<route lang="yaml">
meta:
  title: app.routes.dashboard.readings
  layout: dashboard
</route>

<template>
  <div>
    <SimpleHeader
      :title="t('dashboard.readings.title')"
      :subtitle="selectedMonthYear"
    />

    <div class="max-w-7xl w-full mx-auto py-6 px-4 sm:px-6">
      <div class="w-full md:flex gap-8">
        <div class="w-52 shrink-0 hidden md:block">
          <div class="sticky top-20">
            <fieldset class="grid grid-cols-2 gap-2">
              <legend class="col-span-2 text-md font-medium font-display mb-3">
                {{ t('dashboard.readings.year') }}
              </legend>
              <template v-if="!readingMonthsYearsLoading">
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
                <template v-if="!readingMonthsYearsLoading">
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
          <BookGrid
            :items="readBooks?.[selectedMonth]"
            kind="readings"
            sort-direction="asc"
            sort-property="readAt"
            :current-page="1"
            :loading="
              readBooksLoading ||
              readingMonthsYearsLoading ||
              !readBooks?.[selectedMonth]?.length
            "
            :skeleton-items="30"
            :mode="gridMode"
            :blur-nsfw="blurNsfw"
            :spoiler-mode="spoilerMode"
            image-only
          >
            <template
              v-if="!readBooksLoading && !readingMonthsYearsLoading"
              #actions="{ book }"
            >
              <div
                class="bg-white select-none dark:bg-gray-600 text-sm shadow-lg rounded-full px-2 py-0.5 mt-1"
              >
                {{ d(book.readAt!, 'dayMonth') }}
              </div>
            </template>
          </BookGrid>
        </div>
      </div>
    </div>
  </div>
</template>
