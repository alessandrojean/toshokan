<script lang="ts" setup>
import cloneDeep from 'lodash.clonedeep'

import { useI18n } from '@/i18n'
import Book, { Status, STATUS_READ, STATUS_UNREAD } from '@/model/Book'
import {
  ChangeTitleKey,
  DisableSearchShortcutKey,
  EnableSearchShortcutKey,
  SetNavbarTransparentKey,
  ShowSearchDialogKey
} from '@/symbols'
import { injectStrict } from '@/util'

import getBookLinks from '@/services/links'

const { t, locale } = useI18n({ useScope: 'global' })
const router = useRouter()
const route = useRoute()
const settingsStore = useSettingsStore()
const sheetStore = useSheetStore()

const bookId = computed(() => String(route.params.id))
const loading = computed(() => sheetStore.loading)

const enabled = computed(() => {
  return (
    !loading.value &&
    !!bookId.value &&
    router.currentRoute.value.name === 'dashboard-library-book-id'
  )
})

const { isLoading, data: book } = useBookQuery(bookId, { enabled })

const collectionEnabled = computed(() => {
  return (
    enabled.value &&
    book.value?.titleParts !== undefined &&
    book.value.titleParts.number !== null
  )
})

const { data: collection, isLoading: collectionLoading } =
  useBookCollectionQuery(book, { enabled: collectionEnabled })

const { data: sheetVersion } = useSheetVersionQuery({ enabled })

const redirectToHome = () => {
  router.replace({ name: 'dashboard-library' })
}

const changeTitle = injectStrict(ChangeTitleKey)

watch(book, (newBook) => {
  if (
    newBook === null &&
    router.currentRoute.value.name === 'dashboard-library-book-id'
  ) {
    redirectToHome()
    return
  }

  if (newBook) {
    changeTitle(newBook.title ?? undefined)
  }
})

const showBookInfo = computed(() => {
  return !loading.value && !isLoading.value && !!book.value
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

const blurNsfw = computed(() => settingsStore.blurNsfw)
const spoilerMode = computed(() => settingsStore.spoilerMode)

const showSearchDialog = injectStrict(ShowSearchDialogKey)

function searchBy(keyword: string, value: string) {
  const query = `${t('dashboard.search.keywords.' + keyword)}:"${value}"`
  showSearchDialog(query)
}

const { data: timeZone, isLoading: timeZoneLoading } = useTimeZoneQuery({
  enabled: computed(() => sheetStore.sheetId !== null)
})

const blurSynopsis = computed(() => {
  return (
    spoilerMode.value.synopsis &&
    book.value?.status !== Status.READ &&
    book.value?.synopsis?.length !== 0
  )
})

const region = computed(() => {
  if (!book.value?.isbnData) {
    return ''
  }

  const formatter = new Intl.DisplayNames(locale.value, { type: 'region' })

  return formatter.of(book.value.isbnData.countryCode)
})

const externalLinks = computed(() => {
  return getBookLinks(book.value, locale.value)
})
</script>

<route lang="yaml">
meta:
  title: app.routes.dashboard.details
  layout: dashboard
  transparentNavbar: true
</route>

<template>
  <div
    class="bg-white dark:bg-gray-900 motion-safe:transition-colors duration-300 ease-in-out -mt-16 relative"
  >
    <div class="absolute inset-x-0 top-0">
      <BookBanner :loading="!showBookInfo" :book="book" />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 z-10 pt-20 pb-6 relative">
      <div class="book-grid">
        <BookCover
          class="book-cover"
          :loading="!showBookInfo"
          :book="book"
          :blur-nsfw="blurNsfw"
          :spoiler-mode="spoilerMode"
        >
          <img
            v-if="book?.isbnData"
            :src="book.isbnData.flagUrl.rectangle"
            :alt="t('dashboard.details.flag', { region })"
            class="inline-block z-10 w-6 aspect-[3/2] rounded-sm shadow absolute right-3 bottom-3 pointer-events-none"
          />
        </BookCover>

        <BookTitle
          class="book-title"
          :loading="!showBookInfo"
          :book="book"
          @click:author="searchBy('author', $event)"
        />

        <BookButtons
          class="book-buttons pt-1.5"
          :loading="!showBookInfo"
          :book="book"
          :editing="writing"
          @click:edit="openEditDialog"
          @click:toggleFavorite="toggleFavorite"
          @click:toggleStatus="toggleStatus"
          @click:share="openShareDialog"
          @click:delete="openDeleteModal"
        />

        <div class="book-synopsis flex flex-col gap-4 sm:gap-6">
          <BookNavigator
            :loading="!showBookInfo || (collectionLoading && collectionEnabled)"
            :book="book"
            :collection="collection"
          />

          <BookMarkdown
            :title="t('book.properties.synopsis')"
            :empty-message="t('book.emptySynopsis')"
            :loading="!showBookInfo"
            :markdown="book?.synopsis ?? undefined"
            :blur="blurSynopsis"
          />

          <BookTags
            class="2xl:hidden"
            :tags="book?.tags"
            :loading="!showBookInfo"
            @click:tag="searchBy('tags', $event)"
          />

          <BookRelations
            class="2xl:hidden"
            :links="externalLinks"
            :loading="!showBookInfo"
          />

          <BookMarkdown
            v-if="book?.notes?.length"
            :title="t('book.properties.notes')"
            :loading="!showBookInfo"
            :markdown="book?.notes ?? undefined"
            :options="{ youtube: true }"
          />
        </div>

        <div class="book-attributes">
          <BookAttributes
            class="sticky top-24"
            :loading="!showBookInfo || timeZoneLoading"
            :book="book"
            :time-zone="timeZone"
            @click:group="searchBy('group', $event)"
            @click:publisher="searchBy('publisher', $event)"
            @click:store="searchBy('store', $event)"
          />
        </div>

        <aside class="book-right hidden 2xl:block">
          <div class="sticky top-24 flex flex-col gap-6">
            <BookTags
              :tags="book?.tags"
              :loading="!showBookInfo"
              group
              @click:tag="searchBy('tags', $event)"
            />

            <BookRelations :links="externalLinks" :loading="!showBookInfo" />
          </div>
        </aside>
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

<style lang="postcss">
.book-grid {
  display: grid;
  gap: 1rem;
  grid-template-areas:
    'art title'
    'buttons buttons'
    'synopsis synopsis'
    'attributes attributes'
    'notes notes'
    'tabs tabs';
  grid-template-columns: 6rem 1fr;

  @media (min-width: theme('screens.sm')) {
    gap: 1.5rem;
    grid-template-areas:
      'art title'
      'art buttons'
      'art padding'
      'attributes synopsis'
      'attributes tags'
      'attributes notes';
    grid-template-columns: 14rem 1fr;
  }

  @media (min-width: theme('screens.2xl')) {
    gap: 1.5rem;
    grid-template-areas:
      'art title title'
      'art buttons buttons'
      'art padding padding'
      'attributes synopsis right'
      'attributes tags right'
      'attributes notes right';
    grid-template-columns: 14rem 1fr 22rem;
  }

  .book-cover {
    grid-area: art / art / art / art;
  }

  .book-buttons {
    grid-area: buttons / buttons / buttons / buttons;
  }

  .book-title {
    grid-area: title / title / title / title;
  }

  .book-synopsis {
    grid-area: synopsis / synopsis / synopsis / synopsis;
  }

  .book-attributes {
    grid-area: attributes / attributes / attributes / attributes;
  }

  .book-right {
    grid-area: right / right / right / right;
  }
}
</style>
