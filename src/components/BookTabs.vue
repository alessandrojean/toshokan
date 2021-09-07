<template>
  <transition
    leave-active-class="transition motion-reduce:transition-none duration-300 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    enter-active-class="transition motion-reduce:transition-none duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
  >
    <TabGroup as="div" v-if="!loading">
      <TabList class="flex md:justify-center px-6 max-w-full overflow-x-auto md:overflow-x-visible overflow-y-hidden md:overflow-y-visible border-b border-gray-300 dark:border-gray-600 space-x-8 text-gray-500 dark:text-gray-400 text-sm md:text-base">
        <Tab
          v-for="(tab, i) in tabs"
          :key="i"
          as="template"
          v-slot="{ disabled, selected }"
        >
          <button
            :class="[
              'px-1 py-4 rounded-sm font-medium border-b-2 -mb-px focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:ring-offset-gray-900 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500 disabled:cursor-default motion-safe:transition-shadow',
              'hover:text-gray-800 dark:hover:text-gray-200 disabled:text-gray-500 dark:disabled:text-gray-400 disabled:opacity-70',
              selected ? 'text-primary-600 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-400 border-primary-600 dark:border-primary-400' : 'border-transparent'
            ]"
            :disabled="disabled"
          >
            {{ tab.title }}
            <span
              v-if="tab.count !== undefined"
              :class="[
                'ml-2 text-xs px-2.5 py-0.5 rounded-xl font-semibold',
                selected ? 'bg-primary-100 dark:bg-primary-500 dark:bg-opacity-50 dark:text-primary-50' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              ]"
            >
              {{ n(tab.count, 'integer') }}
            </span>
          </button>
        </Tab>
      </TabList>
      <TabPanels class="dark:text-gray-300 py-4 md:py-8 px-6 md:px-0">
        <!-- Book metadata -->
        <TabPanel class="max-w-3xl mx-auto rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:ring-offset-gray-900 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500 motion-safe:transition-shadow">
          <dl class="md:divide-y md:divide-gray-200 md:dark:divide-gray-700">
            <template
              v-for="(mt, i) in metadata"
              :key="i"
            >
              <div
                v-if="mt.value || !showBookInfo"
                class="px-0 md:px-6 py-2 md:py-3.5 md:grid md:grid-cols-3 md:gap-4"
              >
                <dt
                  v-if="showBookInfo"
                  class="text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  {{ mt.title }}
                </dt>
                <div v-else class="mt-1 md:mt-0 motion-safe:animate-pulse w-32 h-5 bg-gray-400 dark:bg-gray-600 rounded"></div>

                <dd
                  v-if="showBookInfo"
                  :class="[
                    mt.class || '',
                    'mt-1 md:mt-0 text-sm text-gray-900 dark:text-gray-200 md:col-span-2'
                  ]"
                >
                  {{ mt.value }}
                </dd>
                <div v-else class="mt-1 md:mt-0 motion-safe:animate-pulse w-44 h-5 bg-gray-400 dark:bg-gray-600 rounded"></div>
              </div>
            </template>
          </dl>
        </TabPanel>

        <!-- Book notes -->
        <TabPanel
          class="prose-sm md:prose leading-normal dark:text-gray-300 max-w-3xl mx-auto rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:ring-offset-gray-900 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500 motion-safe:transition-shadow"
          v-html="notesRendered"
          v-if="showBookInfo && book.notes.length > 0"
        />

        <!-- Collection -->
        <TabPanel
          class="grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 dark:ring-offset-gray-900 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500 motion-safe:transition-shadow"
          v-if="showBookInfo && filteredCollection.length > 0"
        >
          <BookCard
            v-for="colItem in filteredCollection"
            :key="colItem.id"
            :book="colItem"
            :loading="!showBookInfo"
          />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </transition>
</template>

<script>
import { computed, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import { Tab, TabGroup, TabList, TabPanels, TabPanel } from '@headlessui/vue'

import BookCard from '@/components/BookCard.vue'

import useMarkdown from '@/composables/useMarkdown'

import { getIsbnCountry } from '@/util/isbn'

export default {
  components: {
    BookCard,
    Tab,
    TabGroup,
    TabList,
    TabPanels,
    TabPanel
  },

  props: {
    book: Object,
    collection: Array,
    loading: Boolean
  },

  setup (props) {
    const { t, d, n, locale } = useI18n()
    const store = useStore()
    const { book, loading, collection } = toRefs(props)

    const showBookInfo = computed(() => {
      return !loading.value && book.value
    })

    const { renderMarkdown } = useMarkdown()

    const notesRendered = computed(() => {
      if (!showBookInfo.value) {
        return ''
      }

      return renderMarkdown(book.value.notes)
    })

    const filteredCollection = computed(() => {
      if (!showBookInfo.value || !collection.value || collection.length === 0) {
        return []
      }

      return collection.value.filter(colItem => colItem.id !== book.value.id)
    })

    const tabs = computed(() => {
      const items = [{ title: t('dashboard.details.tabs.metadata') }]

      if (showBookInfo.value) {
        if (book.value.notes.length > 0) {
          items.push({ title: t('dashboard.details.tabs.notes') })
        }

        if (filteredCollection.value.length > 0) {
          items.push({
            title: t('dashboard.details.tabs.collection'),
            count: filteredCollection.value.length
          })
        }
      }

      return items
    })

    function formatPrice (price) {
      if (!price) {
        return null
      }

      const { value, currency } = price

      return n(parseFloat(value.replace(',', '.')), 'currency', { currency })
    }

    const timeZone = computed(() => store.state.sheet.timeZone)

    function formatDate (date, format = 'short') {
      if (typeof date === 'string' && date.length > 0) {
        return d(
          new Date(`${date}T00:00:00.000${timeZone.value.offsetStr}`),
          format,
          { timeZone: timeZone.value.name }
        )
      }

      if (date instanceof Date) {
        return d(date, format, { timeZone: timeZone.value.name })
      }

      return t('dashboard.details.info.dateUnknown')
    }

    const country = computed(() => {
      if (!book.value || !book.value.codeType.includes('ISBN')) {
        return null
      }

      return getIsbnCountry(book.value.code)
    })

    const language = computed(() => {
      if (!country.value) {
        return null
      }

      const languageNames = new Intl.DisplayNames([locale.value], { type: 'language' })
      const localizedName = languageNames.of(country.value[1])

      return localizedName.charAt(0).toLocaleUpperCase(locale.value) +
        localizedName.slice(1)
    })

    const metadata = computed(() => {
      return [
        {
          title: t('book.properties.id'),
          value: book.value?.id,
          class: 'font-mono'
        },
        {
          title: t('book.properties.language'),
          value: country.value
            ? language.value
            : null
        },
        {
          title: t('book.properties.publisher'),
          value: book.value?.publisher
        },
        {
          title: t('book.properties.group'),
          value: book.value?.group
        },
        {
          title: t('book.properties.dimensions'),
          value: book.value?.dimensions + ' cm'
        },
        {
          title: t('book.properties.labelPrice'),
          value: formatPrice(book.value?.labelPrice)
        },
        {
          title: t('book.properties.paidPrice'),
          value: formatPrice(book.value?.paidPrice)
        },
        {
          title: t('book.properties.store'),
          value: book.value?.store
        },
        {
          title: t('book.properties.boughtAt'),
          value: book.value?.boughtAt
            ? formatDate(book.value.boughtAt)
            : null
        },
        {
          title: t('book.properties.readAt'),
          value: book.value?.readAt
            ? formatDate(book.value.readAt)
            : null
        }
      ]
    })

    return {
      showBookInfo,
      notesRendered,
      tabs,
      formatPrice,
      formatDate,
      metadata,
      filteredCollection,
      t,
      n
    }
  }
}
</script>
