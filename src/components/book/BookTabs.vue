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
      <TabList class="flex flex-nowrap md:justify-center px-6 max-w-full overflow-x-auto md:overflow-x-visible overflow-y-hidden md:overflow-y-visible border-b border-gray-300 dark:border-gray-600 space-x-8 text-gray-500 dark:text-gray-400 text-sm md:text-base">
        <Tab
          v-for="(tab, i) in tabs"
          :key="i"
          as="template"
          v-slot="{ disabled, selected }"
        >
          <button
            :class="[
              'shrink-0 px-1 py-4 font-medium border-b-2 -mb-px has-ring-focus dark:focus-visible:ring-offset-gray-900 disabled:cursor-default',
              'disabled:text-gray-500 dark:disabled:text-gray-400 disabled:opacity-70',
              selected
                ? 'text-primary-600 dark:text-gray-100 hover:text-primary-600 dark:hover:text-gray-100 border-primary-600 dark:border-primary-400'
                : 'hover:text-gray-800 dark:hover:text-gray-300 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
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
                    'mt-1 md:mt-0 text-sm text-gray-900 dark:text-gray-200 md:col-span-2 inline-flex items-center'
                  ]"
                >
                  <img
                    v-if="mt.flagUrl"
                    :src="mt.flagUrl"
                    alt=""
                    aria-hidden="true"
                    class="inline-block w-5 h-5 mr-2.5"
                  >

                  <time
                    v-if="mt.time"
                    :datetime="mt.value.toISOString()"
                  >
                    {{ formatDate(mt.value) }}
                  </time>
                  <ul v-else-if="mt.tags" class="tag-list">
                    <li v-for="tag in mt.value" :key="tag" class="mr-2 mt-2">
                      <a
                        href="#"
                        class="tag has-ring-focus"
                        @click.prevent="searchByTag(tag, $event)"
                      >
                        <span aria-hidden="true" class="bullet"></span>
                        {{ tag }}
                      </a>
                    </li>
                  </ul>
                  <a
                    v-else-if="mt.searchable"
                    href="#"
                    class="search-link has-ring-focus"
                    :title="t('dashboard.search.searchBy', [mt.value])"
                    @click.prevent="searchBy(mt.key, mt.value, $event)"
                  >
                    {{ mt.value }}
                  </a>
                  <span v-else>{{ mt.value }}</span>

                  <div
                    v-if="mt.badge && !mt.samePrice"
                    :class="[
                      mt.badge <= 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-800',
                      'dark:bg-gray-700 dark:text-gray-200 ml-3 px-1.5 py-0.5 flex items-center space-x-1 rounded-full text-xs uppercase font-bold dark:font-semibold'
                    ]"
                  >
                    <span aria-hidden="true">
                      <TrendingDownIcon v-if="mt.badge <= 1" class="w-4 h-4" />
                      <TrendingUpIcon v-else class="w-4 h-4" />
                    </span>
                    <span>{{ n(mt.badge, 'percent') }}</span>
                  </div>
                </dd>
                <div v-else class="mt-1 md:mt-0 motion-safe:animate-pulse w-44 h-5 bg-gray-400 dark:bg-gray-600 rounded"></div>
              </div>
            </template>
          </dl>
        </TabPanel>

        <!-- Book notes -->
        <TabPanel
          class="prose prose-sm md:prose-base dark:prose-invert leading-normal max-w-3xl mx-auto rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:ring-offset-gray-900 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500 motion-safe:transition-shadow"
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
            :current="colItem.id === book.id"
          />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </transition>
</template>

<script>
import { computed, inject, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

import useMarkdown from '@/composables/useMarkdown'
import { useSheetStore } from '@/stores/sheet'

import { TrendingDownIcon, TrendingUpIcon } from '@heroicons/vue/solid'
import { Tab, TabGroup, TabList, TabPanels, TabPanel } from '@headlessui/vue'

import BookCard from '@/components/book/BookCard.vue'

export default {
  components: {
    BookCard,
    Tab,
    TabGroup,
    TabList,
    TabPanels,
    TabPanel,
    TrendingDownIcon,
    TrendingUpIcon
  },

  props: {
    book: Object,
    collection: Array,
    loading: Boolean
  },

  setup (props) {
    const { t, d, n, locale } = useI18n({ useScope: 'global' })
    const sheetStore = useSheetStore()
    const { book, loading, collection } = toRefs(props)

    const showBookInfo = computed(() => {
      return !loading.value && book.value
    })

    const { renderMarkdown } = useMarkdown({ youtube: true })

    const notesRendered = computed(() => {
      if (!showBookInfo.value) {
        return ''
      }

      return renderMarkdown(book.value.notes)
    })

    const filteredCollection = computed(() => {
      if (!showBookInfo.value || !collection.value || collection.value.length === 0) {
        return []
      }

      return collection.value
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

      return n(value, 'currency', { currency })
    }

    const timeZone = computed(() => sheetStore.timeZone)

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

    const country = computed(() => book.value?.isbnData)

    const language = computed(() => {
      if (!country.value) {
        return null
      }

      const languageNames = new Intl.DisplayNames([locale.value], { type: 'language' })
      const localizedName = languageNames.of(country.value.locale)

      return localizedName.charAt(0).toLocaleUpperCase(locale.value) +
        localizedName.slice(1)
    })

    const metadata = computed(() => {
      const sameCurrency = book.value?.paidPrice?.currency === book.value?.labelPrice?.currency

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
            : null,
          flagUrl: country.value?.flagUrl
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
                ' × ' + n(book.value.dimensions.height, 'dimensions') + ' cm'
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
            ? (book.value?.paidPrice?.value > book.value?.labelPrice?.value
                ? book.value?.paidPrice?.value / book.value?.labelPrice.value
                : 1 - book.value?.paidPrice?.value / book.value?.labelPrice.value)
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
        },
        {
          title: t('book.properties.tags'),
          value: (book.value?.tags || []).length > 0
            ? book.value?.tags
            : null,
          tags: true
        }
      ]
    })

    const showSearchDialog = inject('showSearchDialog')

    function searchBy (key, value, event) {
      event.preventDefault()

      const queryKeyword = t('dashboard.search.keywords.' + key)
      const queryString = `${queryKeyword}:"${value}"`
      showSearchDialog(queryString)
    }

    function searchByTag (tag, event) {
      searchBy('tags', tag.toLowerCase(), event)
    }

    return {
      showBookInfo,
      notesRendered,
      tabs,
      formatPrice,
      formatDate,
      metadata,
      filteredCollection,
      searchBy,
      searchByTag,
      t,
      n
    }
  }
}
</script>

<style lang="postcss" scoped>
.tag-list {
  @apply flex flex-wrap -mt-2;
}

.tag {
  @apply text-xxs uppercase font-bold tracking-wide
    bg-primary-100 dark:bg-gray-700 rounded-md
    text-primary-700 dark:text-gray-300
    px-2.5 inline-flex items-center;
}

.tag:hover,
.tag:focus-visible {
  @apply bg-primary-200 dark:bg-gray-600
    text-primary-800 dark:text-gray-200;
}

.tag:focus-visible {
  @apply dark:ring-offset-gray-900;
}

.bullet {
  @apply bg-primary-300 dark:bg-gray-500
    w-1.5 h-1.5 mr-2 -ml-0.5
    inline-block rounded;
}

.tag:hover .bullet,
.tag:focus-visible .bullet {
  @apply bg-primary-400 dark:bg-gray-400;
}

.search-link {
  @apply rounded font-medium
    text-gray-800 dark:text-gray-300
    underline underline-offset-1 decoration-2
    decoration-primary-600/60 dark:decoration-primary-400/80;
}

.search-link:hover {
  @apply decoration-primary-600 dark:decoration-primary-400
    text-gray-900 dark:text-gray-200;
}

.search-link:focus-visible {
  @apply dark:ring-offset-gray-800 md:dark:ring-offset-gray-900;
}
</style>
