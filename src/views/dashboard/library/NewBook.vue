<template>
  <div class="flex flex-col">
    <SimpleHeader
      class="shadow-none sm:shadow"
      :title="t('dashboard.newBook.title')"
      :subtitle="stepText"
    />

    <div class="flex-1 flex items-start sm:items-center justify-center py-5 md:py-10 px-5" ref="mainEl">
      <transition
        mode="out-in"
        leave-active-class="transition motion-reduce:transition-none transform motion-reduce:transform-none duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 -translate-x-2"
        enter-active-class="transition motion-reduce:transition-none transform motion-reduce:transform-none duration-200 ease-out"
        enter-from-class="opacity-0 translate-x-2"
        enter-to-class="opacity-100 translate-x-0"
      >
        <section
          v-if="step === 1"
          class="relative sm:max-w-xl w-full rounded-md bg-white shadow-md overflow-hidden dark:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:ring-offset-gray-900 focus-visible:ring-indigo-600"
          aria-labelledby="step-1-title"
          tabindex="-1"
        >
          <div class="px-4 py-5 space-y-6 sm:p-6">
            <div>
              <h3 id="step-1-title" class="text-lg font-medium font-title leading-6 text-gray-900 dark:text-gray-100">
                <span class="sr-only">{{ t('dashboard.newBook.step', [1, 4]) }}: </span>
                {{ t('dashboard.newBook.autoFill.title') }}
                <span class="sr-only">{{ t('dashboard.newBook.autoFill.titleSr') }}</span>
              </h3>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {{ t('dashboard.newBook.autoFill.description') }}
              </p>
            </div>
            <form
              role="form"
              :aria-label="t('dashboard.newBook.autoFill.ariaLabel')"
              class="flex flex-col items-end"
              @submit.prevent="search"
            >
              <label for="book-isbn" id="isbn-search-label" class="sr-only">
                {{ t('dashboard.newBook.autoFill.label' )}}
              </label>
              <div class="group relative w-full">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
                  <SearchIcon class="w-5 h-5 text-gray-500 dark:group-focus-within:text-gray-300 sm:text-sm" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  inputmode="numeric"
                  id="book-isbn"
                  class="input text-lg pl-10 md:pr-16"
                  :placeholder="t('dashboard.newBook.autoFill.placeholder')"
                  v-model="isbnQuery"
                  @keyup.enter.prevent="search"
                  aria-labelledby="isbn-search-label search-provider-info"
                >
                <p class="hidden md:group-focus-within:flex absolute right-3 inset-y-0 justify-center items-center" aria-hidden="true">
                  <span class="font-medium text-gray-400 dark:text-gray-300 text-xs leading-5 px-1.5 border border-gray-300 dark:border-gray-500 rounded-md">
                    <span class="sr-only">{{ t('dashboard.newBook.autoFill.press') }} </span>
                    <kbd class="font-sans">{{ t('dashboard.newBook.autoFill.enter') }}</kbd>
                    <span class="sr-only"> {{ t('dashboard.newBook.autoFill.toSearch') }}</span>
                  </span>
                </p>
              </div>
              <i18n-t
                keypath="dashboard.newBook.autoFill.searchPowered"
                tag="p"
                id="search-provider-info"
                class="mt-2 text-xs text-gray-500 dark:text-gray-400"
              >
                <span class="sr-only">{{ t('dashboard.newBook.autoFill.cbl') }}</span>
                <img src="@/assets/cbl-logo.png" alt="" class="cbl-logo" aria-hidden="true">
              </i18n-t>
              <button type="submit" class="sr-only">
                {{ t('dashboard.newBook.autoFill.search') }}
              </button>
            </form>

            <Alert
              type="error"
              :show="searchFailed"
              :title="t('dashboard.newBook.autoFill.error')"
            >
              <p>{{ searchError }}</p>
            </Alert>

            <Alert
              type="info"
              :show="noResultsFound"
            >
              <p>{{ t('dashboard.newBook.autoFill.noResults') }}</p>
            </Alert>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-600 px-4 py-5 sm:px-6 sm:py-3 flex justify-end">
            <button
              type="button"
              class="button is-ghost -mr-4"
              @click.stop="handleFillManually"
            >
              {{ t('dashboard.newBook.autoFill.fillManually') }}
              <span aria-hidden="true">
                <ChevronRightIcon class="is-right" aria-hidden="true" />
              </span>
            </button>
          </div>
          <LoadingIndicator :loading="searching">
            <template v-slot:icon="{ cssClass }">
              <SearchIcon :class="cssClass" />
            </template>
          </LoadingIndicator>
        </section>

        <section
          v-else-if="step == 2"
          class="sm:max-w-2xl w-full rounded-md bg-white shadow-md overflow-hidden dark:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:ring-offset-gray-900 focus-visible:ring-indigo-600"
          aria-labelledby="step-2-title"
          tabindex="-1"
        >
          <div class="px-4 py-5 space-y-6 sm:p-6">
            <div>
              <h3 id="step-2-title" class="text-lg font-medium font-title leading-6 text-gray-900 dark:text-gray-100">
                <span class="sr-only">
                  {{ t('dashboard.newBook.step', [searchAvailable ? step : step - 1, searchAvailable ? 4 : 3]) }}
                </span>
                {{ t('dashboard.newBook.metadata.title') }}
              </h3>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {{ t('dashboard.newBook.metadata.description') }}
              </p>
            </div>

            <BookForm
              ref="bookForm"
              :book="book"
              @update:book="Object.assign(book, $event)"
            />
          </div>

          <div class="bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-600 px-4 py-5 sm:px-6 sm:py-3 flex justify-between">
            <div>
              <button
                type="button"
                class="button is-ghost -ml-4"
                @click.stop="step = 1"
                v-if="searchAvailable"
              >
                <span aria-hidden="true">
                  <ChevronLeftIcon aria-hidden="true" />
                </span>
                {{ t('dashboard.newBook.goBack') }}
              </button>
            </div>

            <button
              type="button"
              class="button is-primary"
              @click.stop="handleSearchCover"
            >
              {{ t(`dashboard.newBook.metadata.${book.codeType.includes('ISBN') ? 'findCover' : 'review'}`) }}
              <span aria-hidden="true">
                <ChevronRightIcon class="is-right" aria-hidden="true" />
              </span>
            </button>
          </div>
        </section>

        <section
          v-else-if="step === 3"
          class="relative sm:max-w-2xl w-full rounded-md bg-white shadow-md overflow-hidden dark:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:ring-offset-gray-900 focus-visible:ring-indigo-600"
          aria-labelledby="step-3-title"
          tabindex="-1"
        >
          <div class="px-4 py-5 space-y-6 sm:p-6">
            <div>
              <h3 id="step-3-title" class="text-lg font-medium font-title leading-6 text-gray-900 dark:text-gray-100">
                <span class="sr-only">
                  {{ t('dashboard.newBook.step', [searchAvailable ? step : step - 1, searchAvailable ? 4 : 3]) }}
                </span>
                {{ t('dashboard.newBook.cover.title') }}
              </h3>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {{ t('dashboard.newBook.cover.description') }}
              </p>
            </div>

            <BookCoverSelector
              custom
              v-model:cover-url="book.coverUrl"
              :book="book"
              @update:finding="coverFinding = $event"
            />
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-600 px-4 py-5 sm:px-6 sm:py-3 flex justify-between">
            <button
              type="button"
              class="button is-ghost -ml-4"
              @click.stop="step = 2"
            >
              <span aria-hidden="true">
                <ChevronLeftIcon aria-hidden="true" />
              </span>
              {{ t('dashboard.newBook.goBack') }}
            </button>

            <button
              type="button"
              class="button is-primary"
              @click.stop="step = 4"
            >
              {{ t('dashboard.newBook.cover.review') }}
              <span aria-hidden="true">
                <ChevronRightIcon class="is-right" aria-hidden="true" />
              </span>
            </button>
          </div>
          <LoadingIndicator :loading="coverFinding">
            <template v-slot:icon="{ cssClass }">
              <SearchIcon :class="cssClass" />
            </template>
          </LoadingIndicator>
        </section>

        <TableInfo
          v-else
          class="sm:max-w-2xl w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:ring-offset-gray-900 focus-visible:ring-indigo-600"
          :info="bookInfo"
          :title="t('dashboard.newBook.review.title')"
          :subtitle="t('dashboard.newBook.review.description')"
          tabindex="-1"
        >
          <template v-slot:step-indicator>
            <span class="sr-only">
              {{ t('dashboard.newBook.step', [searchAvailable ? step : step - 1, searchAvailable ? 4 : 3]) }}
            </span>
          </template>
          <template v-slot:footer>
            <button
              type="button"
              class="button is-ghost -ml-4"
              @click.stop="step = book.codeType.includes('ISBN') ? 3 : 2"
            >
              <span aria-hidden="true">
                <ChevronLeftIcon aria-hidden="true" />
              </span>
              {{ t('dashboard.newBook.goBack') }}
            </button>

            <button
              type="button"
              class="button is-primary"
              @click.stop="handleInsertBook"
            >
              <span aria-hidden="true">
                <CheckIcon aria-hidden="true" />
              </span>
              {{ t('dashboard.newBook.review.finish') }}
            </button>
          </template>

          <template v-slot:loading-indicator>
            <LoadingIndicator :loading="inserting">
              <template v-slot:icon="{ cssClass }">
                <BookOpenIcon :class="cssClass" />
              </template>
            </LoadingIndicator>
          </template>
        </TableInfo>
      </transition>
    </div>

    <BookCreatedModal
      v-model:open="createdModalOpen"
      @click:new="handleModalNew"
      @click:view="handleModalView"
    />
  </div>
</template>

<script>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import useBookInserter from '@/composables/useBookInserter'
import useIsbnSearch, { useSearchAvailable } from '@/composables/useIsbnSearch'

import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon
} from '@heroicons/vue/solid'

import { BookOpenIcon } from '@heroicons/vue/outline'

import Alert from '@/components/Alert'
import BookCoverSelector from '@/components/BookCoverSelector'
import BookCreatedModal from '@/components/BookCreatedModal'
import BookForm from '@/components/BookForm'
import LoadingIndicator from '@/components/LoadingIndicator'
import SimpleHeader from '@/components/SimpleHeader'
import TableInfo from '@/components/TableInfo'

export default {
  name: 'DashboardNewBook',

  components: {
    BookCreatedModal,
    BookOpenIcon,
    CheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    SearchIcon,
    Alert,
    BookCoverSelector,
    BookForm,
    LoadingIndicator,
    SimpleHeader,
    TableInfo
  },

  setup () {
    const mainEl = ref(null)
    const { t } = useI18n({ useScope: 'global' })

    function toDateInputValue (date) {
      const local = new Date(date)
      local.setMinutes(date.getMinutes() - date.getTimezoneOffset())
      return local.toISOString().slice(0, 10)
    }

    const bookInitialState = {
      authors: [],
      authorsStr: '',
      boughtAt: toDateInputValue(new Date()),
      code: '',
      codeType: '',
      collection: '',
      coverUrl: '',
      format: '',
      imprint: '',
      labelPriceCurrency: 'BRL',
      labelPriceValue: '',
      paidPriceCurrency: 'BRL',
      paidPriceValue: '',
      store: '',
      title: ''
    }

    const book = reactive({ ...bookInitialState })
    const searchAvailable = useSearchAvailable()
    const step = ref(searchAvailable.value ? 1 : 2)

    const stepText = computed(() => {
      const currentStep = searchAvailable.value ? step.value : step.value - 1
      const totalSteps = searchAvailable.value ? 4 : 3

      return t('dashboard.newBook.step', [currentStep, totalSteps])
    })

    const isbnSearchStep = useIsbnSearchStep(step, book, bookInitialState)
    const bookFormStep = useBookFormStep(step, book)
    const coverFinderStep = useCoverFinderStep()
    const revisionStep = useRevisionStep(book)

    watch(step, (newValue, oldValue) => {
      if (oldValue === 3 && newValue === 2) {
        book.coverUrl = ''
      }

      nextTick(() => {
        mainEl.value.scrollIntoView({ behavior: 'smooth' })

        setTimeout(() => { mainEl.value.children[0].focus() }, 500)
      })
    })

    const router = useRouter()
    const { inserting, insertBook } = useBookInserter(book)

    const createdModalOpen = ref(false)
    const bookId = ref(null)

    function handleModalNew () {
      bookId.value = null
      Object.assign(book, bookInitialState)
      isbnSearchStep.clearSearch()
      isbnSearchStep.isbnQuery.value = ''
      step.value = searchAvailable.value ? 1 : 2
    }

    function handleModalView () {
      router.replace({
        name: 'BookDetails',
        params: {
          bookId: bookId.value
        }
      })
    }

    async function handleInsertBook () {
      bookId.value = await insertBook()

      createdModalOpen.value = true
    }

    return {
      mainEl,
      searchAvailable,
      book,
      step,
      stepText,
      handleInsertBook,
      inserting,
      createdModalOpen,
      handleModalNew,
      handleModalView,
      ...isbnSearchStep,
      ...bookFormStep,
      ...coverFinderStep,
      ...revisionStep,
      t
    }
  }
}

function useIsbnSearchStep (step, book, bookInitialState) {
  const isbnQuery = ref('')

  const {
    available: searchAvailable,
    clear: clearSearch,
    errorMessage: searchError,
    failed: searchFailed,
    noResultsFound,
    result: searchResult,
    search,
    searching
  } = useIsbnSearch(isbnQuery)

  function handleFillManually () {
    clearSearch()
    isbnQuery.value = ''
    step.value = 2
    Object.assign(book, bookInitialState)
  }

  watch(searchResult, newValue => {
    Object.assign(book, newValue || {})

    if (newValue) {
      book.authorsStr = newValue.authors.join('; ')
      step.value = 2
    }
  })

  return {
    clearSearch,
    isbnQuery,
    searchAvailable,
    searchError,
    searchFailed,
    noResultsFound,
    searchResult,
    search,
    searching,
    handleFillManually
  }
}

function useBookFormStep (step, book) {
  const bookForm = ref()

  function handleSearchCover () {
    const { error: hasError } = bookForm.value.touch(book)

    if (!hasError) {
      step.value = book.codeType.includes('ISBN') ? 3 : 4
    }
  }

  return {
    bookForm,
    handleSearchCover
  }
}

function useCoverFinderStep () {
  const coverFinding = ref(false)

  return { coverFinding }
}

function useRevisionStep (book) {
  const { t, d, n } = useI18n({ useScope: 'global' })
  const store = useStore()

  const timeZone = computed(() => store.state.sheet.timeZone)

  function formatPrice ({ value, currency }) {
    return n(parseFloat(value.replace(',', '.')), 'currency', { currency })
  }

  const boughtAt = computed(() => {
    if (book.boughtAt && book.boughtAt.length > 0) {
      return d(
        new Date(`${book.boughtAt}T00:00:00.000${timeZone.value.offsetStr}`),
        'short',
        { timeZone: timeZone.value.name }
      )
    }

    return t('dashboard.newBook.review.dateUnknown')
  })

  const formattedLabelPrice = computed(() => {
    return formatPrice({
      value: book.labelPriceValue,
      currency: book.labelPriceCurrency
    })
  })

  const formattedPaidPrice = computed(() => {
    return formatPrice({
      value: book.paidPriceValue,
      currency: book.paidPriceCurrency
    })
  })

  const bookInfo = computed(() => {
    const separator = t('dashboard.details.header.authorSeparator')
    let authors = (book.authors || []).join(separator)

    if (book.authors && book.authors.length >= 2) {
      const firstAuthors = book.authors.slice(0, -1).join(separator)

      authors = t(
        'dashboard.details.header.authorListComplete',
        {
          authors: firstAuthors,
          lastAuthor: book.authors[book.authors.length - 1]
        }
      )
    }

    return [
      {
        title: t('book.properties.id'),
        value: book.code,
        property: 'code'
      },
      {
        title: t('book.properties.title'),
        value: book.title,
        property: 'title'
      },
      {
        title: t('book.properties.author', book.authors.length),
        value: authors,
        property: 'authors'
      },
      {
        title: t('book.properties.imprint'),
        value: book.imprint,
        property: 'imprint'
      },
      {
        title: t('book.properties.collection'),
        value: book.collection,
        property: 'collection'
      },
      {
        title: t('book.properties.format'),
        value: book.format,
        property: 'format'
      },
      {
        title: t('book.properties.store'),
        value: book.store,
        property: 'store'
      },
      {
        title: t('book.properties.labelPrice'),
        value: formattedLabelPrice.value,
        property: 'labelPrice'
      },
      {
        title: t('book.properties.paidPrice'),
        value: formattedPaidPrice.value,
        property: 'paidPrice'
      },
      {
        title: t('book.properties.boughtAt'),
        value: boughtAt.value,
        property: 'boughtAt'
      }
    ]
  })

  return { bookInfo }
}
</script>

<style scoped>
.cbl-logo {
  @apply inline-block h-3 align-text-bottom filter dark:invert dark:opacity-50;
}

div[id^="headlessui-radiogroup-option"] {
  @apply focus:outline-none;
}
</style>
