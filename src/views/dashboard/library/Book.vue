<template>
  <div
    :class="state === States.NONE ? 'bg-white' : 'bg-transparent'"
    class="dark:bg-gray-900 motion-safe:transition-colors duration-300 ease-in-out"
  >
    <div class="border-b dark:border-b-0 border-gray-300 hidden md:block bg-white dark:bg-transparent">
      <div class="max-w-7xl mx-auto md:px-6 lg:px-8 dark:mt-6">
        <!-- Breadcrumb -->
        <div class="py-2.5 dark:py-0">
          <BookBreadcrumb
            :loading="!showBookInfo"
            :book="book"
          />
        </div>
      </div>
    </div>
    <div class="max-w-7xl mx-auto md:px-6 lg:px-8 md:py-10 md:dark:py-6">
      <!-- Main section -->
      <transition
        mode="out-in"
        leave-active-class="transition motion-reduce:transition-none duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        enter-active-class="transition motion-reduce:transition-none duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
      >
        <div
          v-if="state === States.NONE"
          class="md:space-y-8 bg-white dark:bg-transparent"
        >
          <section class="bg-gray-800 dark:bg-gray-700 md:bg-transparent md:dark:bg-transparent md:grid md:grid-cols-2 lg:grid-cols-7 md:gap-8">
            <!-- Book cover -->
            <div class="lg:col-span-3">
              <BookCover :loading="!showBookInfo" :book="book" />
            </div>

            <!-- Book information -->
            <div class="bg-white dark:bg-gray-800 md:dark:bg-transparent mt-5 md:mt-0 p-6 md:p-0 shadow-inner md:shadow-none rounded-t-3xl md:rounded-none lg:col-span-4">
              <BookInformation
                :loading="!showBookInfo"
                :book="book"
                :disabled="editing"
                @click:edit="showEditForm"
                @click:update-cover="showCoverEditor"
                @click:toggleFavorite="toggleFavorite"
                @click:toggleStatus="toggleStatus"
                @click:delete="openDeleteModal"
              />
            </div>
          </section>

          <!-- Book tabs -->
          <section class="dark:bg-gray-800 md:dark:bg-transparent md:pt-6">
            <BookTabs
              :loading="!showBookInfo"
              :book="book"
              :collection="collection"
            />
          </section>
        </div>

        <section
          v-else-if="state === States.FORM"
          class="max-w-2xl mx-auto space-y-6 my-6 md:my-4 bg-white dark:bg-gray-800 md:rounded-lg shadow-md overflow-hidden"
        >
          <div class="border-b border-gray-200 dark:border-gray-600 mx-4 md:mx-6 pt-4 md:pt-5 pb-2">
            <h2 class="text-xl font-medium font-display leading-6 text-gray-900 dark:text-gray-100">
              {{ t('dashboard.details.editForm.title') }}
            </h2>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {{ t('dashboard.details.editForm.description') }}
            </p>
          </div>

          <BookForm
            ref="editForm"
            :book="editingBook"
            @update:book="Object.assign(editingBook, $event)"
            class="px-4 md:px-6"
          />

          <div class="flex flex-row-reverse justify-start bg-gray-50 dark:bg-gray-800 px-4 md:px-6 dark:px-0 md:dark:px-0 dark:mx-4 md:dark:mx-6 py-3 dark:py-4 dark:border-t dark:border-gray-600">
            <button
              type="button"
              class="button is-primary ml-2"
              @click.stop="handleEdit"
            >
              <CheckIcon aria-hidden="true" />
              {{ t('dashboard.details.editForm.finish') }}
            </button>

            <button
              type="button"
              class="button is-ghost"
              @click.stop="hideEditForm"
            >
              {{ t('dashboard.details.editForm.cancel') }}
            </button>
          </div>
        </section>

        <section
          v-else-if="state === States.COVER"
          class="max-w-2xl mx-auto space-y-6 my-6 md:my-4 bg-white dark:bg-gray-800 md:rounded-lg shadow-md overflow-hidden"
        >
          <div class="border-b border-gray-200 dark:border-gray-600 mx-4 md:mx-6 pt-4 md:pt-5 pb-2">
            <h2 class="text-xl font-medium font-display leading-6 text-gray-900 dark:text-gray-100">
              {{ t('dashboard.details.coverForm.title') }}
            </h2>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {{ t('dashboard.details.coverForm.description') }}
            </p>
          </div>

          <BookCoverSelector
            custom
            v-model:cover-url="editingBook.coverUrl"
            :book="editingBook"
            class="px-4 md:px-6"
          />

          <div class="flex flex-row-reverse justify-start bg-gray-50 dark:bg-gray-800 px-4 md:px-6 dark:px-0 md:dark:px-0 dark:mx-4 md:dark:mx-6 py-3 dark:py-4 dark:border-t dark:border-gray-600">
            <button
              type="button"
              class="button is-primary ml-2"
              @click.stop="handleCover"
            >
              <CheckIcon aria-hidden="true" />
              {{ t('dashboard.details.coverForm.finish') }}
            </button>

            <button
              type="button"
              class="button is-ghost"
              @click.stop="hideCoverEditor"
            >
              {{ t('dashboard.details.coverForm.cancel') }}
            </button>
          </div>
        </section>
      </transition>
    </div>

    <BookDeleteModal
      v-model:open="deleteModalOpen"
      @click:delete="handleDelete"
    />
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import { CheckIcon } from '@heroicons/vue/solid'

import useBookDeleter from '@/composables/useBookDeleter'
import useBookEditor from '@/composables/useBookEditor'
import useBookFinder from '@/composables/useBookFinder'

import BookBreadcrumb from '@/components/BookBreadcrumb.vue'
import BookCover from '@/components/BookCover.vue'
import BookCoverSelector from '@/components/BookCoverSelector.vue'
import BookDeleteModal from '@/components/BookDeleteModal.vue'
import BookForm from '@/components/BookForm.vue'
import BookInformation from '@/components/BookInformation.vue'
import BookTabs from '@/components/BookTabs.vue'

import { BookFavorite, BookStatus } from '@/model/Book'

export default {
  components: {
    BookBreadcrumb,
    BookCover,
    BookCoverSelector,
    BookDeleteModal,
    BookForm,
    BookInformation,
    BookTabs,
    CheckIcon
  },

  setup () {
    const { t, n } = useI18n()
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const bookId = computed(() => route.params.bookId)

    const {
      book,
      bookFound,
      collection,
      findTheBook
    } = useBookFinder()

    const loading = computed(() => store.state.sheet.loading)

    const redirectToHome = () => {
      router.replace({ name: 'DashboardHome' })
    }

    onMounted(async () => {
      if (!loading.value && bookId.value) {
        await findTheBook(bookId.value, redirectToHome)
      }
    })

    watch(loading, async newValue => {
      if (!newValue && bookId.value) {
        await findTheBook(bookId.value, redirectToHome)
      }
    })

    watch(bookId, async newId => {
      if (newId && !loading.value) {
        state.value = States.NONE
        await findTheBook(newId, redirectToHome)
      }
    })

    watch(book, newValue => {
      if (newValue) {
        document.title = newValue.title + ' | ' + t('app.name')
      }
    })

    const showBookInfo = computed(() => {
      return !loading.value && bookFound.value && !editing.value
    })

    const States = {
      NONE: 0,
      FORM: 1,
      COVER: 2,
      NOT_FOUND: 3
    }

    const state = ref(0)
    const editing = ref(false)
    const editingBook = reactive({})
    const editForm = ref(null)

    const { updateBook } = useBookEditor(editingBook)

    function showEditForm () {
      window.scroll({ top: 0, behavior: 'smooth' })
      Object.assign(editingBook, book.value, {
        dimensionsStr: book.value.dimensions
          .map(dm => n(dm, 'dimensions'))
          .join(' x '),
        labelPriceValueStr: n(book.value.labelPrice.value, 'decimal'),
        paidPriceValueStr: n(book.value.paidPrice.value, 'decimal')
      })
      state.value = States.FORM
    }

    function hideEditForm () {
      window.scroll({ top: 0, behavior: 'smooth' })
      state.value = States.NONE
      editForm.value?.reset()
    }

    async function handleEdit () {
      const { error, book: editedBook } = editForm.value.touch(editingBook)

      if (!error) {
        try {
          hideEditForm()
          editing.value = true
          await updateBook(editedBook)
          await findTheBook(editedBook.id, redirectToHome)
        } finally {
          editing.value = false
        }
      }
    }

    function showCoverEditor () {
      window.scroll({ top: 0, behavior: 'smooth' })
      Object.assign(editingBook, book.value)
      state.value = States.COVER
    }

    function hideCoverEditor () {
      window.scroll({ top: 0, behavior: 'smooth' })
      state.value = States.NONE
    }

    async function handleCover () {
      try {
        hideCoverEditor()
        editing.value = true
        await updateBook(editingBook)
        await findTheBook(book.value.id, redirectToHome)
      } finally {
        editing.value = false
      }
    }

    function toDateInputValue (date) {
      const local = new Date(date)
      local.setMinutes(date.getMinutes() - date.getTimezoneOffset())

      return local
    }

    async function toggleStatus () {
      try {
        editing.value = true

        await updateBook({
          ...book.value,
          status: book.value.status === BookStatus.READ
            ? BookStatus.UNREAD
            : BookStatus.READ,
          readAt: book.value.status === BookStatus.READ
            ? ''
            : toDateInputValue(new Date())
        })

        await findTheBook(bookId.value, redirectToHome)
      } finally {
        editing.value = false
      }
    }

    async function toggleFavorite () {
      try {
        editing.value = true

        await updateBook({
          ...book.value,
          favorite: book.value.favorite === BookFavorite.ACTIVE
            ? BookFavorite.INACTIVE
            : BookFavorite.ACTIVE
        })

        await findTheBook(bookId.value, redirectToHome)
      } finally {
        editing.value = false
      }
    }

    const deleteModalOpen = ref(false)
    const { deleteBook } = useBookDeleter(book)

    async function handleDelete () {
      try {
        editing.value = true
        await deleteBook()
      } finally {
        router.replace({ name: 'DashboardLibrary' })
      }
    }

    function openDeleteModal () {
      setTimeout(() => {
        deleteModalOpen.value = true
      })
    }

    return {
      t,
      bookId,
      loading,
      book,
      bookFound,
      collection,
      showBookInfo,
      state,
      editingBook,
      editForm,
      editing,
      showEditForm,
      hideEditForm,
      handleEdit,
      States,
      showCoverEditor,
      hideCoverEditor,
      handleCover,
      toggleStatus,
      toggleFavorite,
      deleteModalOpen,
      openDeleteModal,
      handleDelete
    }
  }
}
</script>
