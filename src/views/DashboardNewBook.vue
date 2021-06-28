<template>
  <div class="flex flex-col">
    <SimpleHeader class="shadow-none sm:shadow" title="Novo livro" />

    <div class="flex-1 flex items-start sm:items-center justify-center py-10 px-5" ref="mainEl">
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
          class="relative sm:max-w-xl w-full rounded-md bg-white shadow-md overflow-hidden dark:bg-gray-800"
          aria-labelledby="step-1-title"
        >
          <div class="px-4 py-5 space-y-6 sm:p-6">
            <div>
              <h3 id="step-1-title" class="text-lg font-medium font-title leading-6 text-gray-900 dark:text-gray-100">
                Preenchimento automático
                <span class="sr-only">a partir do ISBN</span>
              </h3>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Obtenha automaticamente os metadados do livro a partir de seu ISBN.
              </p>
            </div>
            <form
              role="form"
              aria-label="Pesquisa na CBL"
              class="flex flex-col items-end"
            >
              <label for="book-isbn" class="sr-only">ISBN</label>
              <div class="group relative w-full">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
                  <SearchIcon class="w-5 h-5 text-gray-500 dark:group-focus-within:text-gray-300 sm:text-sm" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  inputmode="numeric"
                  id="book-isbn"
                  class="input text-lg pl-10 md:pr-16"
                  placeholder="Pesquisar por ISBN"
                  v-model="isbnQuery"
                  @keyup.enter.stop="search"
                >
                <div class="hidden md:group-focus-within:flex absolute right-3 inset-y-0 justify-center items-center">
                  <span class="font-medium text-gray-400 dark:text-gray-300 text-xs leading-5 px-1.5 border border-gray-300 dark:border-gray-500 rounded-md">
                    <span class="sr-only">Pressione </span>
                    <kbd class="font-sans">Enter</kbd>
                    <span class="sr-only"> para pesquisar</span>
                  </span>
                </div>
              </div>
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Mecanismo de pesquisa por
                <span class="sr-only">CBL</span>
                <img src="@/assets/cbl-logo.png" alt="Logo da CBL" class="cbl-logo" aria-hidden="true">
              </p>
            </form>

            <Alert
              type="error"
              :show="searchFailed"
              title="Houve um erro durante a pesquisa"
            >
              <p>{{ searchError }}</p>
            </Alert>

            <Alert
              type="info"
              :show="noResultsFound"
            >
              <p>Nenhum resultado encontrado.</p>
            </Alert>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-600 px-4 py-5 sm:px-6 sm:py-3 flex justify-end">
            <button
              type="button"
              class="button is-ghost -mr-4"
              @click.stop="handleFillManually"
            >
              Preencher manualmente
              <ChevronRightIcon class="is-right" aria-hidden="true" />
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
          class="sm:max-w-2xl w-full rounded-md bg-white shadow-md overflow-hidden dark:bg-gray-800"
          aria-labelledby="step-2-title"
        >
          <div class="px-4 py-5 space-y-6 sm:p-6">
            <div>
              <h3 id="step-2-title" class="text-lg font-medium font-title leading-6 text-gray-900 dark:text-gray-100">
                Metadados do livro
              </h3>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Estas informações serão cadastradas na planilha.
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
                <ChevronLeftIcon aria-hidden="true" />
                Voltar uma etapa
              </button>
            </div>

            <button
              type="button"
              class="button is-primary"
              @click.stop="handleSearchCover"
            >
              {{ book.codeType.includes('ISBN') ? 'Procurar capa' : 'Revisar' }}
              <ChevronRightIcon class="is-right" aria-hidden="true" />
            </button>
          </div>
        </section>

        <section
          v-else-if="step === 3"
          class="relative sm:max-w-2xl w-full rounded-md bg-white shadow-md overflow-hidden dark:bg-gray-800"
          aria-labelledby="step-3-title"
        >
          <div class="px-4 py-5 space-y-6 sm:p-6">
            <div>
              <h3 id="step-3-title" class="text-lg font-medium font-title leading-6 text-gray-900 dark:text-gray-100">
                Imagem de capa
              </h3>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Escolha a imagem de capa do livro ou pule direto para a revisão.
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
              <ChevronLeftIcon aria-hidden="true" />
              Voltar uma etapa
            </button>

            <button
              type="button"
              class="button is-primary"
              @click.stop="step = 4"
            >
              Revisar
              <ChevronRightIcon class="is-right" aria-hidden="true" />
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
          class="sm:max-w-2xl w-full"
          :info="bookInfo"
          title="Informações do livro"
          subtitle="Revise as informações antes de concluir o procedimento."
        >
          <template v-slot:footer>
            <button
              type="button"
              class="button is-ghost -ml-4"
              @click.stop="step = book.codeType.includes('ISBN') ? 3 : 2"
            >
              <ChevronLeftIcon aria-hidden="true" />
              Voltar uma etapa
            </button>

            <button
              type="button"
              class="button is-primary"
              @click.stop="handleInsertBook"
            >
              <CheckIcon aria-hidden="true" />
              Concluir
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
  </div>
</template>

<script>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

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
import BookForm from '@/components/BookForm'
import LoadingIndicator from '@/components/LoadingIndicator'
import SimpleHeader from '@/components/SimpleHeader'
import TableInfo from '@/components/TableInfo'

export default {
  name: 'DashboardNewBook',

  components: {
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

    const isbnSearchStep = useIsbnSearchStep(step, book, bookInitialState)
    const bookFormStep = useBookFormStep(step, book)
    const coverFinderStep = useCoverFinderStep()
    const revisionStep = useRevisionStep(book)

    watch(step, (newValue, oldValue) => {
      if (oldValue === 3 && newValue === 2) {
        book.coverUrl = ''
      }

      nextTick(() => mainEl.value.scrollIntoView({ behavior: 'smooth' }))
    })

    const router = useRouter()
    const { inserting, insertBook } = useBookInserter(book)

    async function handleInsertBook () {
      const bookId = await insertBook()

      router.replace({
        name: 'BookDetails',
        params: {
          bookId
        }
      })
    }

    return {
      mainEl,
      book,
      step,
      handleInsertBook,
      inserting,
      ...isbnSearchStep,
      ...bookFormStep,
      ...coverFinderStep,
      ...revisionStep
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
  function formatPrice ({ value, currency }) {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    })

    return formatter.format(value.replace(',', '.'))
  }

  const boughtAt = computed(() => {
    if (book.boughtAt && book.boughtAt.length > 0) {
      return book.boughtAt.replace(/(\d{4})-(\d{2})-(\d{2})/, '$3/$2/$1')
    }

    return 'Desconhecida'
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
    return [
      {
        title: 'Identificação',
        value: book.code,
        property: 'code'
      },
      {
        title: 'Título',
        value: book.title,
        property: 'title'
      },
      {
        title: book.authors.length > 1 ? 'Autores' : 'Autor',
        value: book.authors.join(', ').replace(/, ([^,]*)$/, ' e $1'),
        property: 'authors'
      },
      {
        title: 'Editora',
        value: book.imprint,
        property: 'imprint'
      },
      {
        title: 'Coleção',
        value: book.collection,
        property: 'collection'
      },
      {
        title: 'Formato',
        value: book.format,
        property: 'format'
      },
      {
        title: 'Local da compra',
        value: book.store,
        property: 'store'
      },
      {
        title: 'Preço de capa',
        value: formattedLabelPrice.value,
        property: 'labelPrice'
      },
      {
        title: 'Preço pago',
        value: formattedPaidPrice.value,
        property: 'paidPrice'
      },
      {
        title: 'Data da aquisição',
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
