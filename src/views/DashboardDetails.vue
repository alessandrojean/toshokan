<template>
  <div>
    <BookHeader
      :book="book"
      :book-found="bookFound"
      :image-has-error="imageHasError"
      :image-loading="imageLoading"
      :loading="loading"
      :editing="editing || editingCover"
      @click:edit="showEditForm"
      @click:delete="deleteModalOpen = true"
      @click:toggle-status="toggleStatus"
      @click:toggle-favorite="toggleFavorite"
      @click:update-cover="showCoverEditor"
    />

    <div class="max-w-5xl mx-auto py-6 px-5 md:px-8" ref="mainEl">
      <div class="md:grid grid-cols-6 gap-6">
        <div class="col-span-2">
          <div class="w-full flex flex-col space-y-6">
            <!-- Book image -->
            <BookImage
              :book="book"
              :book-found="bookFound"
              :image-has-error="imageHasError"
              :image-loading="imageLoading"
              :loading="loading"
            />

            <div class="hidden md:flex">
              <div class="flex-1 space-y-1">
                <div v-if="loading || !bookFound" class="motion-safe:animate-pulse h-7 bg-gray-400 dark:bg-gray-600 rounded w-56 mb-1"></div>
                <h2 v-else class="text-lg font-title font-semibold leading-5 text-gray-900 dark:text-gray-200">
                  {{ book.titleParts[0] }}
                </h2>

                <div v-if="loading || !bookFound" class="motion-safe:animate-pulse h-4 bg-gray-400 dark:bg-gray-600 rounded w-36"></div>
                <p v-else class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Volume {{ book.titleParts[1] ? '#' + book.titleParts[1] : 'único' }}
                </p>
              </div>
              <HeartIcon v-if="bookFound && book.favorite === 'Sim'" class="ml-2 h-8 w-8 dark:text-gray-500" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div class="col-span-4">
          <transition
            mode="out-in"
            leave-active-class="transition motion-reduce:transition-none duration-300 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
            enter-active-class="transition motion-reduce:transition-none duration-500 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
          >
            <div v-if="!editing && !editingCover">
              <BookNavigation
                class="mb-6 md:hidden"
                :next-book="nextBook"
                :previous-book="previousBook"
                :loading="loading || !bookFound"
              />

              <!-- Book information -->
              <TableInfo
                :info="bookInfo"
                title="Informações do livro"
                :loading="loading || !bookFound"
              >
                <template v-slot:paidPrice>
                  <span
                    v-if="discount !== null"
                    :class="[
                      discount > 100
                        ? 'bg-red-100 text-red-800 dark:bg-transparent dark:text-red-500 dark:border dark:border-red-500'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400 dark:border dark:border-green-500',
                      'px-2 py-0.5 text-xs rounded-full leading-5 font-semibold ml-2'
                    ]"
                  >
                    {{ discount }}%
                  </span>
                </template>
              </TableInfo>

              <BookNavigation
                class="mt-6"
                :next-book="nextBook"
                :previous-book="previousBook"
                :loading="loading || !bookFound"
              />
            </div>

            <section v-else-if="editing" class="w-full rounded-md bg-white shadow-md overflow-hidden dark:bg-gray-800">
              <div class="px-4 py-5 space-y-6 sm:p-6">
                <div>
                  <h3 class="text-lg font-medium font-title leading-6 text-gray-900 dark:text-gray-100">
                    Metadados do livro
                  </h3>
                  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Edite as informações necessárias na planilha.
                  </p>
                </div>

                <BookForm
                  ref="editForm"
                  :book="editingBook"
                  @update:book="Object.assign(editingBook, $event)"
                />
              </div>

              <div class="bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-600 px-4 py-5 sm:px-6 sm:py-3 flex justify-between">
                <div>
                  <button
                    type="button"
                    class="button is-ghost -ml-4"
                    @click.stop="hideEditForm"
                  >
                    Cancelar
                  </button>
                </div>

                <button
                  type="button"
                  class="button is-primary"
                  @click.stop="handleEdit"
                >
                  <CheckIcon aria-hidden="true" />
                  Concluir
                </button>
              </div>
            </section>

            <section v-else class="relative w-full rounded-md bg-white shadow-md overflow-hidden dark:bg-gray-800">
              <div class="px-4 py-5 space-y-6 sm:p-6">
                <div>
                  <h3 class="text-lg font-title font-medium leading-6 text-gray-900 dark:text-gray-100">
                    Imagem de capa
                  </h3>
                  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Escolha uma imagem de capa do livro obtida automaticamente.
                  </p>
                </div>

                <BookCoverSelector
                  custom
                  v-model:cover-url="editingCoverUrl"
                  :book="book"
                  @update:finding="findingCovers = $event"
                />
              </div>
              <div class="bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-600 px-4 py-5 sm:px-6 sm:py-3 flex justify-between">
                <button
                  type="button"
                  class="button is-ghost -ml-4"
                  @click.stop="hideCoverEditor"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  class="button is-primary"
                  @click.stop="handleCover"
                >
                  <CheckIcon aria-hidden="true" />
                  Concluir
                </button>
              </div>

              <LoadingIndicator :loading="findingCovers">
                <template v-slot:icon="{ cssClass }">
                  <SearchIcon :class="cssClass" />
                </template>
              </LoadingIndicator>
            </section>
          </transition>
        </div>
      </div>
    </div>

    <BookDeleteModal
      v-model:open="deleteModalOpen"
      @click:delete="handleDelete"
    />
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

import useBookDeleter from '@/composables/useBookDeleter'
import useBookEditor from '@/composables/useBookEditor'
import useBookFinder from '@/composables/useBookFinder'
import useImageLoader from '@/composables/useImageLoader'

import { CheckIcon, HeartIcon, SearchIcon } from '@heroicons/vue/solid'

import BookCoverSelector from '@/components/BookCoverSelector'
import BookDeleteModal from '@/components/BookDeleteModal'
import BookForm from '@/components/BookForm'
import BookHeader from '@/components/BookHeader'
import BookImage from '@/components/BookImage'
import BookNavigation from '@/components/BookNavigation'
import LoadingIndicator from '@/components/LoadingIndicator'
import TableInfo from '@/components/TableInfo'

export default {
  name: 'DashboardDetails',

  components: {
    BookCoverSelector,
    BookDeleteModal,
    BookForm,
    BookHeader,
    BookImage,
    BookNavigation,
    LoadingIndicator,
    TableInfo,
    CheckIcon,
    HeartIcon,
    SearchIcon
  },

  setup () {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    const mainEl = ref(null)

    const bookId = computed(() => route.params.bookId)

    const {
      book,
      bookFound,
      previousBook,
      nextBook,
      findTheBook
    } = useBookFinder()

    const coverUrl = computed(() => {
      if (!book.value) {
        return ''
      }

      return book.value.coverUrl || ''
    })

    const {
      imageHasError,
      imageLoading,
      loadImage
    } = useImageLoader(coverUrl)

    const loading = computed(() => store.state.sheet.loading)

    const redirectToHome = () => {
      router.replace({ name: 'DashboardHome' })
    }

    onMounted(() => {
      if (!loading.value && bookId.value) {
        findTheBook(bookId.value, redirectToHome)
      }
    })

    watch(loading, newValue => {
      if (!newValue && bookId.value) {
        findTheBook(bookId.value, redirectToHome)
      }
    })

    watch(bookId, newId => {
      if (newId && !loading.value) {
        findTheBook(newId, redirectToHome)
      }
    })

    watch(bookFound, newValue => {
      if (newValue) {
        loadImage()
      }
    })

    const info = useInfo(book, bookFound, bookId, loading)
    const editor = useEditor(book, bookId, findTheBook, redirectToHome, mainEl)
    const deleter = useDeleter(book, router)
    const coverEditor = useCoverEditor(book, editor.updateBook, findTheBook, redirectToHome, mainEl)

    return {
      mainEl,
      book,
      bookFound,
      loading,
      nextBook,
      previousBook,
      imageHasError,
      imageLoading,
      ...info,
      ...editor,
      ...deleter,
      ...coverEditor
    }
  }
}

function useInfo (book, bookFound, bookId, loading) {
  function formatPrice ({ value, currency }) {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    })

    return formatter.format(value.replace(',', '.'))
  }

  function formatDate (date) {
    if (typeof date === 'string' && date.length > 0) {
      return date.replace(/(\d{4})-(\d{2})-(\d{2})/, '$3/$2/$1')
    }

    if (date instanceof Date) {
      return date.toLocaleString('pt-BR')
    }

    return 'Desconhecida'
  }

  const boughtAt = computed(() => {
    return book.value.boughtAt ? formatDate(book.value.boughtAt) : ''
  })

  const createdAt = computed(() => {
    return book.value.createdAt ? formatDate(book.value.createdAt) : ''
  })

  const updatedAt = computed(() => {
    return book.value.updatedAt ? formatDate(book.value.updatedAt) : ''
  })

  const formattedLabelPrice = computed(() => {
    return book.value.labelPrice ? formatPrice(book.value.labelPrice) : ''
  })

  const formattedPaidPrice = computed(() => {
    return book.value.paidPrice ? formatPrice(book.value.paidPrice) : ''
  })

  const discount = computed(() => {
    if (loading.value || !bookFound.value) {
      return null
    }

    const { labelPrice, paidPrice } = book.value

    if (!labelPrice || !paidPrice) {
      return null
    }

    if (labelPrice.value === paidPrice.value) {
      return null
    }

    if (labelPrice.currency === paidPrice.currency) {
      const labelValue = parseFloat(labelPrice.value.replace(',', '.'))
      const paidValue = parseFloat(paidPrice.value.replace(',', '.'))

      const discount = paidValue / labelValue

      return Math.round((discount > 1.0 ? discount : 1.0 - discount) * 100.0)
    }

    return null
  })

  const bookInfo = computed(() => {
    if (loading.value || !bookFound.value) {
      return []
    }

    return [
      {
        title: book.value.codeType === 'N/A' ? 'Identificação' : book.value.codeType,
        value: book.value.code,
        property: 'code'
      },
      {
        title: 'Título',
        value: book.value.title,
        property: 'title'
      },
      {
        title: book.value.authors && book.value.authors.length > 1 ? 'Autores' : 'Autor',
        value: (book.value.authors || []).join(', ').replace(/, ([^,]*)$/, ' e $1'),
        property: 'authors'
      },
      {
        title: 'Editora',
        value: book.value.imprint,
        property: 'imprint'
      },
      {
        title: 'Coleção',
        value: book.value.collection,
        property: 'collection'
      },
      {
        title: 'Formato',
        value: book.value.format,
        property: 'format'
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
        title: 'Local da compra',
        value: book.value.store,
        property: 'store'
      },
      {
        title: 'Data de compra',
        value: boughtAt.value,
        property: 'boughtAt'
      },
      {
        title: 'Data de criação',
        value: createdAt.value,
        property: 'createdAt'
      },
      {
        title: 'Data de modificação',
        value: updatedAt.value,
        property: 'updatedAt'
      }
    ]
  })

  return {
    bookInfo,
    boughtAt,
    discount,
    formattedLabelPrice,
    formattedPaidPrice
  }
}

function useEditor (book, bookId, findTheBook, redirectToHome, mainEl) {
  const editing = ref(false)
  const editForm = ref()
  const editingBook = reactive(book.value || {})

  const { updateBook } = useBookEditor(editingBook)

  function hideEditForm () {
    editForm.value.reset()
    editing.value = false
    window.scroll({ top: 0, left: 0, behavior: 'smooth' })
  }

  function showEditForm () {
    Object.assign(editingBook, book.value)
    editing.value = true
    mainEl.value.scrollIntoView({ behavior: 'smooth' })
  }

  async function handleEdit () {
    const { error, book: editedBook } = editForm.value.touch(editingBook)

    if (!error) {
      hideEditForm()
      await updateBook(editedBook)
      findTheBook(editedBook.id, redirectToHome)
    }
  }

  async function toggleStatus () {
    await updateBook({
      ...book.value,
      status: book.value.status === 'Lido' ? 'Não lido' : 'Lido'
    })

    findTheBook(bookId.value, redirectToHome)
  }

  async function toggleFavorite () {
    await updateBook({
      ...book.value,
      favorite: book.value.favorite === 'Sim' ? '' : 'Sim'
    })

    findTheBook(bookId.value, redirectToHome)
  }

  return {
    editing,
    editForm,
    editingBook,
    hideEditForm,
    showEditForm,
    handleEdit,
    toggleStatus,
    toggleFavorite,
    updateBook
  }
}

function useDeleter (book, router) {
  const deleteModalOpen = ref(false)
  const { deleteBook } = useBookDeleter(book)

  async function handleDelete () {
    await deleteBook()

    router.replace({ name: 'DashboardCollection' })
  }

  return { deleteModalOpen, handleDelete }
}

function useCoverEditor (book, updateBook, findTheBook, redirectToHome, mainEl) {
  const editingCover = ref(false)
  const editingCoverUrl = ref('')
  const findingCovers = ref(false)

  function hideCoverEditor () {
    editingCover.value = false
    window.scroll({ top: 0, left: 0, behavior: 'smooth' })
  }

  function showCoverEditor () {
    editingCoverUrl.value = book.value.coverUrl
    editingCover.value = true
    mainEl.value.scrollIntoView({ behavior: 'smooth' })
  }

  async function handleCover () {
    hideCoverEditor()

    await updateBook({
      ...book.value,
      coverUrl: editingCoverUrl.value
    })

    editingCoverUrl.value = ''

    findTheBook(book.value.id, redirectToHome)
  }

  return {
    editingCover,
    editingCoverUrl,
    findingCovers,
    hideCoverEditor,
    handleCover,
    showCoverEditor
  }
}
</script>

<style scoped>
.book-image {
  height: fit-content;
}
</style>
