<script lang="ts" setup>
import { useI18n } from '@/i18n'
import Book from '@/model/Book'
import { ReadingMonthYear } from '@/services/sheet/getReadingMonths'
import { TabPanel } from '@headlessui/vue'

const { t } = useI18n({ useScope: 'global' })
const settingsStore = useSettingsStore()
const sheetStore = useSheetStore()
const enabled = computed(() => sheetStore.sheetId !== null)

const { data: readingMonthsYears, isLoading: readingMonthsYearsLoading } =
  useReadingMonthsQuery({ enabled })

const selectedMonthYear = ref<ReadingMonthYear>({
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  count: 0
})

const blurNsfw = computed(() => settingsStore.blurNsfw)
const gridMode = computed(() => settingsStore.gridMode)
const spoilerMode = computed(() => settingsStore.spoilerMode)

const { data: readBooks, isLoading: readBooksLoading } =
  useReadBooksInYearQuery(
    { year: computed(() => selectedMonthYear.value.year) },
    { enabled }
  )

function handleMonthYearChange(newMonthYear?: ReadingMonthYear) {
  selectedMonthYear.value = newMonthYear ?? selectedMonthYear.value
}

const { isLoading: nextVolumesLoading, data: nextVolumes } = useNextReadsQuery(
  { threshold: Infinity },
  { enabled }
)

const { mutate: edit, isLoading: editing } = useEditBookMutation()
const editingId = ref<string>()

function handleMarkAsRead(book: Book) {
  if (editingId.value === book.id!) {
    return
  }

  editingId.value = book.id!

  edit(book, {
    onSuccess: () => {
      editingId.value = undefined
    },
    onError: () => {
      editingId.value = undefined
    }
  })
}
</script>

<route lang="yaml">
meta:
  title: app.routes.dashboard.readings
  layout: dashboard
</route>

<template>
  <div>
    <TabGroup>
      <DashboardHeader :title="t('dashboard.readings.title')">
        <template #tabs>
          <TabList class="flex gap-6 -mt-3" v-slot="{ selectedIndex }">
            <Tab
              :class="[
                'text-sm lg:text-base font-medium py-3 border-b-2 -mb-px px-0.5 has-ring-focus',
                selectedIndex === 0
                  ? 'border-b-primary-600 dark:border-b-primary-400 text-primary-700 dark:text-primary-100'
                  : 'border-b-transparent text-gray-600 dark:text-gray-400'
              ]"
            >
              {{ t('dashboard.readings.nextReads') }}
            </Tab>
            <Tab
              :class="[
                'text-sm lg:text-base font-medium py-3 border-b-2 -mb-px px-0.5 has-ring-focus',
                selectedIndex === 1
                  ? 'border-b-primary-600 dark:border-b-primary-400 text-primary-700 dark:text-primary-100'
                  : 'border-b-transparent text-gray-600 dark:text-gray-400'
              ]"
            >
              {{ t('dashboard.readings.history') }}
            </Tab>
          </TabList>
        </template>
      </DashboardHeader>

      <div class="max-w-7xl w-full mx-auto py-6 px-4 sm:px-6">
        <TabPanels>
          <TabPanel class="has-ring-focus rounded-xl">
            <ReadingsNextVolumes
              :blur-nsfw="blurNsfw"
              :loading="nextVolumesLoading"
              :editing="editing"
              :editing-id="editingId"
              :books="nextVolumes"
              :spoiler-mode="spoilerMode"
              :grid-mode="gridMode"
              @mark-as-read="handleMarkAsRead"
            />
          </TabPanel>
          <TabPanel class="has-ring-focus rounded-xl">
            <ReadingsPerYear
              :blur-nsfw="blurNsfw"
              :loading="readingMonthsYearsLoading"
              :months-years="readingMonthsYears"
              :read-books="readBooks"
              :read-books-loading="readBooksLoading"
              :spoiler-mode="spoilerMode"
              :grid-mode="gridMode"
              :selected="selectedMonthYear"
              @change="handleMonthYearChange"
            />
          </TabPanel>
        </TabPanels>
      </div>
    </TabGroup>
  </div>
</template>
