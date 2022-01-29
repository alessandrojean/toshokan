<template>
  <div class="bg-white dark:bg-gray-900 motion-safe:transition-colors duration-300 ease-in-out">
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
      <div class="md:space-y-8 bg-white dark:bg-transparent">
        <section class="bg-gray-800 dark:bg-gray-700 md:bg-transparent md:dark:bg-transparent md:grid md:grid-cols-2 lg:grid-cols-7 md:gap-8 -mt-16 md:mt-0">
          <!-- Book cover -->
          <div class="lg:col-span-3">
            <BookCover
              :loading="!showBookInfo"
              :book="book"
              :collection="collection"
            />
          </div>

          <!-- Book information -->
          <div class="bg-white dark:bg-gray-800 md:dark:bg-transparent relative -mt-5 md:mt-0 p-6 md:p-0 shadow-inner md:shadow-none rounded-t-3xl md:rounded-none lg:col-span-4">
            <BookInformation
              :loading="!showBookInfo"
              :book="book"
              :disabled="editing"
              @click:edit="openEditDialog"
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
    </div>

    <BookDeleteModal
      v-model:open="deleteModalOpen"
      @click:delete="handleDelete"
    />

    <BookEditDialog
      :is-open="editDialogOpen"
      :book="book"
      @close="closeEditDialog"
      @edit="handleEdit"
    />
  </div>
</template>

<script>
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import useBookDeleter from '@/composables/useBookDeleter'
import useBookEditor from '@/composables/useBookEditor'
import useBookFinder from '@/composables/useBookFinder'

import BookBreadcrumb from '@/components/book/BookBreadcrumb.vue'
import BookCover from '@/components/book/BookCover.vue'
import BookDeleteModal from '@/components/dialogs/BookDeleteDialog.vue'
import BookEditDialog from '@/components/dialogs/BookEditDialog.vue'
import BookInformation from '@/components/book/BookInformation.vue'
import BookTabs from '@/components/book/BookTabs.vue'

import Book, { STATUS_READ, STATUS_UNREAD } from '@/model/Book'

import cloneDeep from 'lodash.clonedeep'

export default {
  components: {
    BookBreadcrumb,
    BookCover,
    BookDeleteModal,
    BookEditDialog,
    BookInformation,
    BookTabs
  },

  setup () {
    const { t } = useI18n()
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
      if (!deleted.value) {
        router.replace({ name: 'DashboardHome' })
      }
    }

    onMounted(async () => {
      if (!loading.value && bookId.value) {
        await findTheBook(bookId.value, redirectToHome)
      }
    })

    watch(loading, async newValue => {
      if (!newValue && bookId.value && !deleted.value) {
        await findTheBook(bookId.value, redirectToHome)
      }
    })

    watch(bookId, async newId => {
      if (newId && !loading.value) {
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

    const editing = ref(false)
    const editDialogOpen = ref(false)

    const { updateBook } = useBookEditor()

    function openEditDialog () {
      editDialogOpen.value = true
    }

    function closeEditDialog () {
      editDialogOpen.value = false
    }

    async function handleEdit (editedBook) {
      try {
        editing.value = true
        await updateBook(editedBook)
        await findTheBook(editedBook.id, redirectToHome)
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
      if (book.value.isFuture) {
        return
      }

      try {
        editing.value = true

        /** @type {Book} */
        const updatedBook = cloneDeep(book.value)
        updatedBook.status = updatedBook.isRead
          ? STATUS_UNREAD
          : STATUS_READ
        updatedBook.readAt = updatedBook.isRead
          ? toDateInputValue(new Date())
          : null

        await updateBook(updatedBook)
        await findTheBook(bookId.value, redirectToHome)
      } finally {
        editing.value = false
      }
    }

    async function toggleFavorite () {
      try {
        editing.value = true

        /** @type {Book} */
        const updatedBook = cloneDeep(book.value)
        updatedBook.favorite = !updatedBook.favorite

        await updateBook(updatedBook)
        await findTheBook(bookId.value, redirectToHome)
      } finally {
        editing.value = false
      }
    }

    const deleteModalOpen = ref(false)
    const { deleteBook, deleted } = useBookDeleter(book)

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

    const setNavbarTransparent = inject('setNavbarTransparent')

    onMounted(() => setNavbarTransparent(true))
    onUnmounted(() => setNavbarTransparent(false))

    return {
      t,
      bookId,
      loading,
      book,
      bookFound,
      collection,
      showBookInfo,
      editing,
      handleEdit,
      editDialogOpen,
      openEditDialog,
      closeEditDialog,
      toggleStatus,
      toggleFavorite,
      deleteModalOpen,
      openDeleteModal,
      handleDelete
    }
  }
}
</script>
