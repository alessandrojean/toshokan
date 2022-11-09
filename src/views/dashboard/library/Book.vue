<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, toRaw, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import cloneDeep from 'lodash.clonedeep'

import useDeleteBookMutation from '@/mutations/useDeleteBookMutation'
import useEditBookMutation from '@/mutations/useEditBookMutation'
import Book, { STATUS_READ, STATUS_UNREAD } from '@/model/Book'
import { useSettingsStore } from '@/stores/settings'
import { useSheetStore } from '@/stores/sheet'
import useBookQuery from '@/queries/useBookQuery'
import useBookCollectionQuery from '@/queries/useBookCollectionQuery'
import useSheetVersionQuery from '@/queries/useSheetVersionQuery'
import {
  DisableSearchShortcutKey,
  EnableSearchShortcutKey,
  SetNavbarTransparentKey
} from '@/symbols'
import { injectStrict } from '@/utils'

import BookBreadcrumb from '@/components/book/BookBreadcrumb.vue'
import BookCover from '@/components/book/BookCover.vue'
import BookDeleteDialog from '@/components/dialogs/BookDeleteDialog.vue'
import BookEditDialog from '@/components/dialogs/BookEditDialog.vue'
import BookInformation from '@/components/book/BookInformation.vue'
import BookShareDialog from '@/components/dialogs/BookShareDialog.vue'
import BookTabs from '@/components/book/BookTabs.vue'
import BookBanner from '@/components/book/BookBanner.vue'

const { t } = useI18n({ useScope: 'global' })
const router = useRouter()
const route = useRoute()
const settingsStore = useSettingsStore()
const sheetStore = useSheetStore()

const bookId = computed(() => route.params.bookId as string)
const loading = computed(() => sheetStore.loading)

const enabled = computed(() => {
  return !loading.value && !!bookId.value
})

const { isLoading, data: book } = useBookQuery(bookId, { enabled })

const { data: collection } = useBookCollectionQuery(book, {
  enabled: computed(() => {
    return (
      enabled.value &&
      book.value?.titleParts !== undefined &&
      book.value.titleParts.number !== null
    )
  })
})

const { data: sheetVersion } = useSheetVersionQuery({ enabled })

const redirectToHome = () => {
  router.replace({ name: 'DashboardLibrary' })
}

watch(book, (newBook) => {
  if (newBook === null) {
    redirectToHome()
    return
  }

  if (newBook !== undefined) {
    document.title = newBook.title + ' | ' + t('app.name')
  }
})

const showBookInfo = computed(() => {
  return !loading.value && !isLoading.value && book.value
})

const { mutate: updateBook, isLoading: editing } = useEditBookMutation()

const editDialogOpen = ref(false)
const bookToEdit = ref<Book>()

function openEditDialog() {
  bookToEdit.value = cloneDeep(toRaw(book!.value!))
  editDialogOpen.value = true
}

function closeEditDialog() {
  editDialogOpen.value = false
}

function handleEdit(editedBook: Book) {
  updateBook(editedBook)
}

function toDateInputValue(date: Date) {
  const local = new Date(date)
  local.setMinutes(date.getMinutes() - date.getTimezoneOffset())

  return local
}

function toggleStatus() {
  if (book.value?.isFuture) {
    return
  }

  const updatedBook = cloneDeep(toRaw(book!.value!))
  updatedBook.status = updatedBook.isRead ? STATUS_UNREAD : STATUS_READ
  updatedBook.readAt = updatedBook.isRead ? toDateInputValue(new Date()) : null

  updateBook(updatedBook)
}

function toggleFavorite() {
  const updatedBook = cloneDeep(toRaw(book!.value!))
  updatedBook.favorite = !updatedBook.favorite

  updateBook(updatedBook)
}

const deleteModalOpen = ref(false)
const { mutate: deleteBook, isLoading: deleting } = useDeleteBookMutation()

function handleDelete() {
  deleteBook(book.value!)
}

function openDeleteModal() {
  setTimeout(() => {
    deleteModalOpen.value = true
  })
}

const writing = computed(() => editing.value || deleting.value)

const setNavbarTransparent = injectStrict(SetNavbarTransparentKey)

onMounted(() => setNavbarTransparent(true))
onUnmounted(() => setNavbarTransparent(false))

const shareDialogOpen = ref(false)

function openShareDialog() {
  shareDialogOpen.value = true
}

const disableSearchShortcut = injectStrict(DisableSearchShortcutKey)
const enableSearchShortcut = injectStrict(EnableSearchShortcutKey)

watch(shareDialogOpen, (newOpen) => {
  newOpen ? disableSearchShortcut() : enableSearchShortcut()
})

const gridMode = computed(() => settingsStore.gridMode)
const blurNsfw = computed(() => settingsStore.blurNsfw)
const spoilerMode = computed(() => settingsStore.spoilerMode)
</script>

<template>
  <div
    class="bg-white dark:bg-gray-900 motion-safe:transition-colors duration-300 ease-in-out -mt-16"
  >
    <BookBanner :loading="!showBookInfo" :book="book" />

    <div class="max-w-7xl mx-auto md:px-6 lg:px-8 md:py-10 md:dark:py-6">
      <!-- Main section -->
      <div class="md:space-y-8 bg-white dark:bg-transparent">
        <section
          class="bg-gray-800 dark:bg-gray-700 md:bg-transparent md:dark:bg-transparent md:grid md:grid-cols-2 lg:grid-cols-7 md:gap-8 -mt-16 md:mt-0"
        >
          <!-- Book cover -->
          <div class="lg:col-span-3">
            <BookCover
              :loading="!showBookInfo"
              :book="book"
              :blur-nsfw="blurNsfw"
              :spoiler-mode="spoilerMode"
            />
          </div>

          <!-- Book information -->
          <div
            class="bg-white dark:bg-gray-800 md:dark:bg-transparent relative -mt-5 md:mt-0 p-6 md:p-0 shadow-inner md:shadow-none rounded-t-3xl md:rounded-none lg:col-span-4"
          >
            <BookInformation
              :loading="!showBookInfo"
              :book="book"
              :disabled="writing"
              @click:edit="openEditDialog"
              @click:toggleFavorite="toggleFavorite"
              @click:toggleStatus="toggleStatus"
              @click:share="openShareDialog"
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
            :blur-nsfw="blurNsfw"
            :spoiler-mode="spoilerMode"
            :mode="gridMode"
          />
        </section>
      </div>
    </div>

    <BookDeleteDialog
      v-model:open="deleteModalOpen"
      @click:delete="handleDelete"
    />

    <BookEditDialog
      :is-open="editDialogOpen"
      :book="bookToEdit"
      @close="closeEditDialog"
      @edit="handleEdit"
    />

    <BookShareDialog
      v-model="shareDialogOpen"
      :book="book"
      :version="sheetVersion ?? 1"
    />
  </div>
</template>
