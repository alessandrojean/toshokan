<template>
  <!-- <div class="bg-white dark:bg-transparent"> -->
  <div>
    <SimpleHeader :title="t('dashboard.newBook.title')" />
    <!-- <div class="max-w-2xl mx-auto md:px-6 lg:px-8 py-6 md:py-12"> -->
    <div
      class="relative max-w-2xl mx-auto bg-white dark:bg-gray-800 my-6 md:my-12 md:rounded-lg shadow-md overflow-hidden has-ring-focus focus-visible:ring-offset-gray-100 dark:focus-visible:ring-offset-gray-900"
      tabindex="-1"
      ref="mainEl"
    >
      <!-- <div class="md:grid md:grid-cols-3 md:gap-8"> -->
      <div>
        <div class="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 dark:border-gray-600 mx-4 md:mx-6 pt-4 md:pt-5 pb-2">
          <div class="flex-1">
            <span class="text-xs uppercase tracking-wide font-semibold text-gray-500 dark:text-gray-400">
              {{ stepText }}
            </span>
            <h2 class="font-medium font-display text-lg -mt-1 dark:text-gray-100">
              {{ steps[step - 1] }}
            </h2>
          </div>

          <BulletSteps v-model="step" :steps="steps" class="mr-2.5 mb-2.5 mt-3 md:mt-0" />
        </div>

        <div class="md:col-span-2 mt-6">
          <transition
            mode="out-in"
            leave-active-class="transition motion-reduce:transition-none duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
            enter-active-class="transition motion-reduce:transition-none duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
          >
            <section
              v-if="step === 1"
              class="relative space-y-6 w-full md:rounded-md overflow-visible"
              :aria-busy="searching"
            >
              <form
                id="search-form"
                :aria-label="t('dashboard.newBook.autoFill.ariaLabel')"
                class="flex flex-col items-end px-4 md:px-6"
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
                    ref="searchInput"
                    :disabled="searching"
                    autofocus
                  >
                  <div class="key-tooltip absolute right-3 inset-y-0 justify-center items-center" aria-hidden="true">
                    <button
                      type="submit"
                      class="font-medium text-gray-400 dark:text-gray-300 text-xs leading-5 px-1.5 border border-gray-300 dark:border-gray-500 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500 dark:focus-visible:ring-offset-gray-700"
                      :disabled="searching"
                    >
                      <kbd aria-hidden="true" class="font-sans">
                        {{ t('dashboard.newBook.autoFill.enter') }}
                      </kbd>
                      <span class="sr-only">
                        {{ t('dashboard.header.search.search' )}}
                      </span>
                    </button>
                  </div>
                </div>
              </form>

              <div
                v-if="searchResults && searchResults.length > 0"
                class="px-4 md:px-6"
              >
                <h3 class="text-gray-700 dark:text-gray-200 font-medium font-display">
                  {{ t('dashboard.search.results') }}
                </h3>

                <BookSelector
                  v-if="searchResults && searchResults.length > 0"
                  :options="searchResults"
                  @select="handleSearchSelect"
                  class="mt-3"
                />
              </div>

              <Alert
                type="error"
                :show="searchFailed"
                :title="t('dashboard.newBook.autoFill.error')"
                class="mx-4 md:mx-6"
              >
                <p>{{ searchError }}</p>
              </Alert>

              <Alert
                type="info"
                :show="noResultsFound"
                class="mx-4 md:mx-6"
              >
                <p>{{ t('dashboard.newBook.autoFill.noResults') }}</p>
              </Alert>

              <div class="flex justify-end bg-gray-50 dark:bg-gray-800 px-4 md:px-6 dark:px-0 md:dark:px-0 dark:mx-4 md:dark:mx-6 py-3 dark:py-4 dark:border-t dark:border-gray-600">
                <button
                  type="button"
                  class="button is-ghost -mr-3.5"
                  @click.stop="handleFillManually"
                  :disabled="searching"
                >
                  {{ t('dashboard.newBook.autoFill.fillManually') }}
                  <span aria-hidden="true">
                    <ArrowSmRightIcon class="is-right" aria-hidden="true" />
                  </span>
                </button>
              </div>
            </section>

            <section
              v-else-if="step == 2"
              class="space-y-6 w-full md:rounded-md overflow-visible"
            >
              <BookForm
                ref="bookForm"
                :book="book"
                @update:book="Object.assign(book, $event)"
                class="px-4 md:px-6"
              />

              <div class="flex flex-row-reverse justify-between bg-gray-50 dark:bg-gray-800 px-4 md:px-6 dark:px-0 md:dark:px-0 dark:mx-4 md:dark:mx-6 py-3 dark:py-4 dark:border-t dark:border-gray-600">
                <button
                  type="button"
                  class="button is-primary ml-2"
                  @click.stop="handleSearchCover"
                >
                  {{ t('dashboard.newBook.metadata.findCover') }}
                  <span aria-hidden="true">
                    <ArrowSmRightIcon class="is-right" aria-hidden="true" />
                  </span>
                </button>

                <div>
                  <button
                    type="button"
                    class="button is-ghost -ml-3.5"
                    @click.stop="step = 1"
                  >
                    <span aria-hidden="true">
                      <ArrowSmLeftIcon aria-hidden="true" />
                    </span>
                    {{ t('dashboard.newBook.goBack') }}
                  </button>
                </div>
              </div>
            </section>

            <section
              v-else-if="step === 3"
              class="relative space-y-6 w-full md:rounded-md overflow-visible"
            >
              <BookCoverSelector
                custom
                v-model:cover-url="book.coverUrl"
                :book="book"
                @update:finding="coverFinding = $event"
                class="px-4 md:px-6"
              />

              <div class="flex justify-between flex-row-reverse bg-gray-50 dark:bg-gray-800 px-4 md:px-6 dark:px-0 md:dark:px-0 dark:mx-4 md:dark:mx-6 py-3 dark:py-4 dark:border-t dark:border-gray-600">
                <button
                  type="button"
                  class="button is-primary ml-2"
                  @click.stop="step = 4"
                  :disabled="coverFinding"
                >
                  {{ t('dashboard.newBook.cover.review') }}
                  <span aria-hidden="true">
                    <ArrowSmRightIcon class="is-right" aria-hidden="true" />
                  </span>
                </button>

                <button
                  type="button"
                  class="button is-ghost -ml-3.5"
                  @click.stop="step = 2"
                  :disabled="coverFinding"
                >
                  <span aria-hidden="true">
                    <ArrowSmLeftIcon aria-hidden="true" />
                  </span>
                  {{ t('dashboard.newBook.goBack') }}
                </button>
              </div>
            </section>

            <section
              v-else
              class="relative space-y-6 w-full md:rounded-md overflow-visible"
            >
              <DescriptionList class="w-full px-4 md:px-6" :info="bookInfo">
                <template v-slot:synopsis="{ value }">
                  <div
                    class="prose prose-sm dark:prose-dark leading-normal"
                    v-html="renderMarkdown(value)"
                  />
                </template>

                <template v-slot:notes="{ value }">
                  <div
                    class="prose prose-sm leading-normal dark:text-gray-300"
                    v-html="renderMarkdown(value)"
                  />
                </template>
              </DescriptionList>

              <div class="flex justify-between flex-row-reverse bg-gray-50 dark:bg-gray-800 px-4 md:px-6 dark:px-0 md:dark:px-0 dark:mx-4 md:dark:mx-6 py-3 dark:py-4 dark:border-t dark:border-gray-600">
                <button
                  type="button"
                  class="button is-primary ml-2"
                  @click.stop="handleInsertBook"
                  :disabled="inserting"
                >
                  <span aria-hidden="true">
                    <CheckIcon aria-hidden="true" />
                  </span>
                  {{ t('dashboard.newBook.review.finish') }}
                </button>

                <button
                  type="button"
                  class="button is-ghost -ml-3.5"
                  @click.stop="step = 3"
                  :disabled="inserting"
                >
                  <span aria-hidden="true">
                    <ArrowSmLeftIcon aria-hidden="true" />
                  </span>
                  {{ t('dashboard.newBook.goBack') }}
                </button>
              </div>
            </section>
          </transition>
        </div>
      </div>

      <LoadingIndicator
        :loading="searching || coverFinding || inserting"
        :blur="false"
      />
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
import useIsbnSearch from '@/composables/useIsbnSearch'
import useMarkdown from '@/composables/useMarkdown'

import {
  CheckIcon,
  ArrowSmLeftIcon,
  ArrowSmRightIcon,
  SearchIcon
} from '@heroicons/vue/solid'

import Alert from '@/components/Alert'
import BookCoverSelector from '@/components/BookCoverSelector'
import BookCreatedModal from '@/components/BookCreatedModal'
import BookForm from '@/components/BookForm'
import BookSelector from '@/components/BookSelector.vue'
import BulletSteps from '@/components/BulletSteps.vue'
import DescriptionList from '@/components/DescriptionList'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import SimpleHeader from '@/components/SimpleHeader.vue'

export default {
  name: 'DashboardNewBook',

  components: {
    BookCreatedModal,
    CheckIcon,
    ArrowSmLeftIcon,
    ArrowSmRightIcon,
    SearchIcon,
    Alert,
    BookCoverSelector,
    BookForm,
    BookSelector,
    BulletSteps,
    DescriptionList,
    LoadingIndicator,
    SimpleHeader
  },

  setup () {
    const mainEl = ref(null)
    const { t } = useI18n({ useScope: 'global' })

    const bookInitialState = {
      authors: [],
      authorsStr: '',
      boughtAt: new Date(),
      code: '',
      codeType: '',
      group: '',
      coverUrl: '',
      dimensions: [],
      dimensionsStr: '',
      publisher: '',
      labelPriceCurrency: 'BRL',
      labelPriceValue: 0.0,
      labelPriceValueStr: '',
      notes: '',
      paidPriceCurrency: 'BRL',
      paidPriceValue: 0.0,
      paidPriceValueStr: '',
      store: '',
      synopsis: '',
      title: ''
    }

    const book = reactive({ ...bookInitialState })
    const step = ref(1)

    const steps = computed(() => [
      t('dashboard.newBook.autoFill.title'),
      t('dashboard.newBook.metadata.title'),
      t('dashboard.newBook.cover.title'),
      t('dashboard.newBook.review.title')
    ])

    const stepText = computed(() => {
      const currentStep = step.value
      const totalSteps = 4

      return t('dashboard.newBook.step', [currentStep, totalSteps])
    })

    const isbnSearchStep = useIsbnSearchStep(step, book, bookInitialState)
    const bookFormStep = useBookFormStep(step, book)
    const coverFinderStep = useCoverFinderStep()
    const revisionStep = useRevisionStep(book)

    watch(step, newValue => {
      if (newValue === 1) {
        Object.assign(book, bookInitialState)
      }

      nextTick(() => {
        window.scroll({ top: 0, behavior: 'smooth' })
        setTimeout(() => { mainEl.value.focus() }, 500)
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
      step.value = 1
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

    const { renderMarkdown } = useMarkdown()

    return {
      mainEl,
      book,
      step,
      stepText,
      steps,
      handleInsertBook,
      inserting,
      createdModalOpen,
      handleModalNew,
      handleModalView,
      ...isbnSearchStep,
      ...bookFormStep,
      ...coverFinderStep,
      ...revisionStep,
      t,
      renderMarkdown
    }
  }
}

function useIsbnSearchStep (step, book, bookInitialState) {
  const isbnQuery = ref('')
  const searchInput = ref(null)

  const {
    clear: clearSearch,
    errorMessage: searchError,
    failed: searchFailed,
    noResultsFound,
    results: searchResults,
    search: isbnSearch,
    searching
  } = useIsbnSearch(isbnQuery)

  function handleFillManually () {
    clearSearch()
    isbnQuery.value = ''
    step.value = 2
    Object.assign(book, bookInitialState)
  }

  watch(searchResults, results => {
    if (results && results.length === 1) {
      Object.assign(book, results[0])
      book.authorsStr = results[0].authors.join('; ')
      step.value = 2
    }
  })

  function handleSearchSelect (selectedBook) {
    Object.assign(book, selectedBook)
    book.authorsStr = selectedBook.authors.join('; ')
    step.value = 2
  }

  async function search () {
    searchInput.value?.blur()
    await isbnSearch()
  }

  return {
    searchInput,
    clearSearch,
    isbnQuery,
    searchError,
    searchFailed,
    noResultsFound,
    searchResults,
    search,
    searching,
    handleFillManually,
    handleSearchSelect
  }
}

function useBookFormStep (step, book) {
  const bookForm = ref()

  function handleSearchCover () {
    const { error: hasError } = bookForm.value.touch(book)

    if (!hasError) {
      step.value = 3
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
    return n(value, 'currency', { currency })
  }

  const boughtAt = computed(() => {
    if (book.boughtAt) {
      return d(
        // new Date(`${book.boughtAt}T00:00:00.000${timeZone.value.offsetStr}`),
        book.boughtAt,
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

    const properties = [
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
        title: t('book.properties.publisher'),
        value: book.publisher,
        property: 'publisher',
        columns: 1
      },
      {
        title: t('book.properties.group'),
        value: book.group,
        property: 'group',
        columns: 1
      },
      {
        title: t('book.properties.dimensions'),
        value: book.dimensions
          .map(dm => n(dm, 'dimensions'))
          .join(' × ') + ' cm',
        property: 'dimensions'
      },
      {
        title: t('book.properties.labelPrice'),
        value: formattedLabelPrice.value,
        property: 'labelPrice',
        columns: 1
      },
      {
        title: t('book.properties.paidPrice'),
        value: formattedPaidPrice.value,
        property: 'paidPrice',
        columns: 1
      },
      {
        title: t('book.properties.store'),
        value: book.store,
        property: 'store',
        columns: 1
      },
      {
        title: t('book.properties.boughtAt'),
        value: boughtAt.value,
        property: 'boughtAt',
        columns: 1
      }
    ]

    if (book.synopsis && book.synopsis.length > 0) {
      properties.splice(3, 0, {
        title: t('book.properties.synopsis'),
        value: book.synopsis,
        property: 'synopsis'
      })
    }

    if (book.notes && book.notes.length > 0) {
      properties.push({
        title: t('book.properties.notes'),
        value: book.notes,
        property: 'notes'
      })
    }

    return properties
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

#search-form .key-tooltip {
  @apply hidden;
}

#search-form:focus-within .key-tooltip {
  @apply md:flex;
}
</style>
