<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog
      static
      :open="isOpen"
      @close="closeDialog"
    >
      <div class="dialog">
        <TransitionChild
          as="template"
          enter="motion-safe:transition-opacity duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="motion-safe:transition-opacity duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div
            class="hidden sm:block dialog-overlay"
            @click="closeDialog"
          />
        </TransitionChild>

        <TransitionChild
          as="div"
          class="dialog-content transform"
          enter="motion-reduce:transition-none duration-300 ease-out"
          enter-from="opacity-0 translate-x-full sm:translate-x-0 sm:scale-95"
          enter-to="opacity-100 translate-x-0 sm:translate-x-0 sm:scale-100"
          leave="motion-reduce:transition-none duration-200 ease-in"
          leave-from="opacity-100 translate-x-0 sm:translate-x-0 sm:scale-100"
          leave-to="opacity-0 translate-x-full sm:translate-x-0 sm:scale-95"
        >
          <div class="dialog-header">
            <Avatar
              v-if="shared"
              class="mr-6"
              dark
              small
              shared
              :picture-url="ownerPictureUrl"
            />

            <div class="flex-grow">
              <DialogTitle as="h2" class="dialog-title">
                {{ t('dashboard.newBook.title') }}
              </DialogTitle>
              <DialogDescription as="p" class="dialog-description">
                {{ t('dashboard.newBook.description') }}
              </DialogDescription>
            </div>

            <BulletSteps
              class="mr-3 sm:hidden"
              v-model="step"
              :steps="steps"
            />

            <button
              class="close-button has-ring-focus"
              @click="closeDialog"
            >
              <span aria-hidden="true">
                <XIcon class="w-5 h-5" />
              </span>
            </button>

            <span aria-hidden="true" class="absolute left-2">
              <svg class="text-white opacity-30 block h-48 w-48" viewBox="0 0 184 184" xmlns="http://www.w3.org/2000/svg">
                <path d="M182 184a2 2 0 110-4 2 2 0 010 4zm-20-20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm-20 0a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm-20 0a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm-20 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm-20 40a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm-20 60a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm-20 80a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zM22 144a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zM2 144a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zM2 4a2 2 0 110-4 2 2 0 010 4z" fill="currentColor" fill-rule="evenodd" opacity="0.503"></path>
              </svg>
            </span>
          </div>

          <ul class="select-none hidden sm:flex border-b border-gray-200 dark:border-gray-600 divide-x divide-gray-200 dark:divide-gray-600">
            <li
              v-for="(st, i) of steps"
              :key="i"
              :class="[
                'flex-1 relative flex items-baseline justify-center py-3 text-sm font-medium has-ring-focus',
                step === i + 1
                  ? 'text-primary-600 dark:text-gray-100'
                  : 'text-gray-400 dark:text-gray-400'
              ]"
            >
              <span
                :class="[
                  step === i + 1
                    ? 'text-gray-500 dark:text-gray-300'
                    : 'text-gray-400 dark:text-gray-500',
                  'text-xs mr-2'
                ]"
              >
                {{ i + 1 }}.
              </span>
              <span>{{ st }}</span>
              <span
                v-if="step === i + 1"
                aria-hidden="true"
                class="bg-primary-600 dark:bg-primary-400 h-2px absolute -bottom-px left-0 w-full"
              />
            </li>
          </ul>

          <div class="flex-grow overflow-y-auto p-4 md:p-6 lg:p-8" ref="main">
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
                v-if="bookCreatedId"
                class="max-w-md mx-auto h-full flex items-center justify-center flex-col space-y-4"
              >
                <div class="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-gray-700">
                  <CheckOutlineIcon class="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                </div>

                <p class="font-medium font-display leading-6 text">
                  {{ t('book.createdModal.title') }}
                </p>

                <p class="text-center text-gray-500 dark:text-gray-400 text-sm">
                  {{ t('book.createdModal.message') }}
                </p>
              </div>
              <BookProviderSearch
                v-else-if="step === 1"
                class="max-w-xl mx-auto"
                @click:view-existing="viewBook"
                @select="handleSearchSelect"
                @search="setLoading"
                ref="bookProviderSearch"
              />
              <BookForm
                v-else-if="step === 2"
                class="max-w-xl mx-auto"
                ref="form"
                :model-value="book"
                @update:modelValue="Object.assign(book, $event)"
                @error="setBookInvalid"
              />
              <BookCoverSelector
                v-else-if="step === 3"
                class="max-w-xl mx-auto"
                custom
                hide-custom-title
                v-model:cover-url="book.coverUrl"
                :book="book"
              />
              <div v-else class="grid grid-cols-1 sm:grid-cols-3 sm:gap-4 md:gap-6 lg:gap-8 w-full">
                <div
                  v-if="book.coverUrl.length > 0"
                  class="w-48 sm:w-auto max-w-full sm:max-w-none mb-8 sm:mb-0 mt-3 sm:mt-0"
                >
                  <div class="sm:sticky sm:top-0">
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
                        v-if="imageLoading || imageHasError"
                        class="aspect-w-1 aspect-h-1"
                        aria-hidden="true"
                      >
                        <div class="flex justify-center items-center w-full h-full">
                          <PhotographIcon
                            :class="imageLoading ? 'motion-safe:animate-pulse' : ''"
                            class="w-10 h-10 text-gray-300"
                          />
                        </div>
                      </div>
                      <img
                        v-else
                        :src="book.coverUrl"
                        :alt="book.title"
                        class="w-full rounded-md shadow"
                      />
                    </transition>
                  </div>
                </div>
                <div :class="book.coverUrl.length > 0 ? 'col-span-2' : 'col-span-3'">
                  <DescriptionList
                    :class="book.coverUrl.length > 0 ? 'w-full' : 'max-w-xl mx-auto'"
                    :info="bookInfo"
                  >
                    <template v-slot:synopsis="{ value }">
                      <div
                        class="prose prose-sm dark:prose-invert leading-normal"
                        v-html="renderMarkdown(value)"
                      />
                    </template>

                    <template v-slot:notes="{ value }">
                      <div
                        class="prose prose-sm dark:prose-invert leading-normal"
                        v-html="renderMarkdown(value)"
                      />
                    </template>
                  </DescriptionList>
                </div>
              </div>
            </transition>
          </div>

          <div class="dialog-footer">
            <button
              v-if="bookCreatedId"
              type="button"
              class="button is-primary"
              @click.stop="viewBook(bookCreatedId)"
            >
              {{ t('book.createdModal.view') }}
            </button>
            <button
              v-else-if="step === 4"
              type="button"
              class="button is-primary"
              @click.stop="handleInsertBook"
            >
              <CheckIcon aria-hidden="true" />
              {{ t('dashboard.details.editForm.finish') }}
            </button>
            <button
              v-else
              type="button"
              class="button is-primary"
              @click.stop="nextStep"
            >
              {{ nextStepText }}
              <span aria-hidden="true">
                <ArrowSmRightIcon class="is-right" aria-hidden="true" />
              </span>
            </button>

            <button
              v-if="step === 1"
              type="button"
              class="button is-ghost"
              @click.stop="closeDialog"
            >
              {{ t('dashboard.details.editForm.cancel') }}
            </button>
            <button
              v-else-if="!bookCreatedId"
              type="button"
              class="button is-ghost"
              @click.stop="previousStep"
            >
              {{ t('dashboard.newBook.goBack') }}
            </button>
            <button
              v-else
              type="button"
              class="button is-ghost"
              @click.stop="resetSteps"
            >
              {{ t('book.createdModal.newBook') }}
            </button>
          </div>

          <LoadingIndicator
            :loading="loading || inserting"
            :blur="false"
          />
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { computed, inject, nextTick, reactive, ref, toRaw, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import cloneDeep from 'lodash.clonedeep'

import useMarkdown from '@/composables/useMarkdown'
import useImageLoader from '@/composables/useImageLoader'
import Book, { STATUS_UNREAD } from '@/model/Book'
import useCreateBookMutation from '@/mutations/useCreateBookMutation'
import { useSheetStore } from '@/stores/sheet'
import useTimeZoneQuery from '@/queries/useTimeZoneQuery'

import {
  Dialog,
  DialogDescription,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'

import { ArrowSmRightIcon, CheckIcon, XIcon } from '@heroicons/vue/solid'
import {
  CheckIcon as CheckOutlineIcon,
  PhotographIcon
} from '@heroicons/vue/outline'

import Avatar from '@/components/Avatar.vue'
import BookCoverSelector from '@/components/book/BookCoverSelector.vue'
import BookForm from '@/components/book/BookForm.vue'
import BookProviderSearch from '@/components/book/BookProviderSearch.vue'
import BulletSteps from '@/components/BulletSteps.vue'
import DescriptionList from '@/components/DescriptionList.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'

export default {
  components: {
    Avatar,
    ArrowSmRightIcon,
    BookCoverSelector,
    BookForm,
    BookProviderSearch,
    BulletSteps,
    CheckIcon,
    CheckOutlineIcon,
    DescriptionList,
    Dialog,
    DialogDescription,
    DialogTitle,
    LoadingIndicator,
    PhotographIcon,
    TransitionChild,
    TransitionRoot,
    XIcon
  },

  props: {
    isOpen: Boolean
  },

  emits: ['close'],

  setup (props, context) {
    const { t } = useI18n({ useScope: 'global' })

    function resetSteps () {
      step.value = 1
      bookCreatedId.value = null
      bookInvalid.value = false
      searchBookSelected.value = null
      Object.assign(book, bookInitialState)
      form.value?.forceUpdateBook()
    }

    function closeDialog () {
      if (loading.value || inserting.value) {
        return
      }

      context.emit('close')

      setTimeout(() => resetSteps(), 400)
    }

    const { isOpen } = toRefs(props)

    const now = new Date()

    const bookInitialState = new Book({
      authors: [],
      boughtAt: now,
      code: '',
      group: '',
      coverUrl: '',
      dimensions: {
        width: null,
        height: null
      },
      publisher: '',
      labelPrice: {
        currency: 'BRL',
        value: null,
        valueStr: ''
      },
      paidPrice: {
        currency: 'BRL',
        value: null,
        valueStr: ''
      },
      notes: '',
      status: STATUS_UNREAD,
      store: '',
      synopsis: '',
      title: ''
    })

    const book = reactive(cloneDeep(bookInitialState))
    const step = ref(1)

    const steps = computed(() => [
      t('dashboard.newBook.autoFill.title'),
      t('dashboard.newBook.metadata.title'),
      t('dashboard.newBook.cover.title'),
      t('dashboard.newBook.review.title')
    ])

    function previousStep () {
      if (step.value === 2) {
        searchBookSelected.value = null
        Object.assign(book, cloneDeep(bookInitialState))
      }

      step.value--
    }

    function nextStep () {
      if (step.value === 1 && searchBookSelected.value) {
        const selected = Object.entries(cloneDeep(searchBookSelected.value))
          .filter(([, value]) => value !== null)
        Object.assign(book, Object.fromEntries(selected))
      } else if (step.value === 2) {
        const { error } = form.value.touch()

        if (error) {
          nextTick(() => {
            main.value.scroll({
              top: main.value.scrollHeight,
              behavior: 'smooth'
            })
          })
          return
        }
      } else if (step.value === 3) {
        loadImage()
      }

      main.value.scroll({ top: 0, behavior: 'smooth' })
      step.value++
    }

    const nextStepText = computed(() => {
      const stepActions = [
        searchBookSelected.value
          ? t('dashboard.newBook.autoFill.editInfo')
          : t('dashboard.newBook.autoFill.fillManually'),
        t('dashboard.newBook.metadata.findCover'),
        t('dashboard.newBook.cover.review')
      ]

      return stepActions[step.value - 1]
    })

    const bookInvalid = ref(false)

    function setBookInvalid (value) {
      bookInvalid.value = value
    }

    const disableSearchShortcut = inject('disableSearchShortcut')
    const enableSearchShortcut = inject('enableSearchShortcut')

    /**
     * @param {BeforeUnloadEvent} event
     */
    function preventUnload (event) {
      event.preventDefault()
      event.returnValue = ''
    }

    watch(isOpen, newIsOpen => {
      if (newIsOpen) {
        Object.assign(book, cloneDeep(bookInitialState))
        window.addEventListener('beforeunload', preventUnload)
        disableSearchShortcut()
        nextTick(() => isbnSearchInput.value?.focus())
      } else {
        window.removeEventListener('beforeunload', preventUnload)
        enableSearchShortcut()
      }
    })

    const searchBookSelected = ref(null)

    function handleSearchSelect (searchBook) {
      searchBookSelected.value = searchBook
    }

    async function handleNew () {
      if (!bookInvalid.value) {
        context.emit('new', cloneDeep(toRaw(book)))
        closeDialog()
      }
    }

    const form = ref(null)
    const main = ref(null)

    const loading = ref(false)

    function setLoading (newValue) {
      loading.value = newValue
    }

    const { renderMarkdown } = useMarkdown()

    const bookCoverUrl = computed(() => book.coverUrl)

    const {
      imageHasError,
      imageLoading,
      loadImage
    } = useImageLoader(bookCoverUrl)

    const router = useRouter()
    const {
      mutate: insertBook,
      isLoading: inserting
    } = useCreateBookMutation()
    const bookCreatedId = ref(null)

    function handleInsertBook () {
      insertBook(book, {
        onSuccess (data) {
          bookCreatedId.value = data
        }
      })
    }

    function viewBook (bookId) {
      bookId = bookId || bookCreatedId.value

      closeDialog()

      setTimeout(() => {
        router.replace({
          name: 'BookDetails',
          params: { bookId }
        })
      }, 400)
    }

    const bookProviderSearch = ref(null)

    const isbnSearchInput = computed(() => {
      return bookProviderSearch.value?.$el.querySelector('#book-isbn')
    })

    const sheetStore = useSheetStore()
    const ownerPictureUrl = computed(() => sheetStore.ownerPictureUrl)
    const shared = computed(() => sheetStore.shared)

    return {
      t,
      resetSteps,
      closeDialog,
      bookInvalid,
      setBookInvalid,
      book,
      handleSearchSelect,
      handleNew,
      step,
      steps,
      nextStepText,
      previousStep,
      nextStep,
      form,
      main,
      loading,
      setLoading,
      searchBookSelected,
      renderMarkdown,
      imageHasError,
      imageLoading,
      inserting,
      handleInsertBook,
      bookCreatedId,
      viewBook,
      bookProviderSearch,
      isbnSearchInput,
      ownerPictureUrl,
      shared,
      ...useRevisionStep(book)
    }
  }
}

function useRevisionStep (book) {
  const { t, d, n } = useI18n({ useScope: 'global' })
  const sheetStore = useSheetStore()

  const { data: timeZone } = useTimeZoneQuery({
    enabled: computed(() => sheetStore.sheetId !== null)
  })

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
      value: book.labelPrice.value,
      currency: book.labelPrice.currency
    })
  })

  const formattedPaidPrice = computed(() => {
    return formatPrice({
      value: book.paidPrice.value,
      currency: book.paidPrice.currency
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
        value: n(book.dimensions.width, 'dimensions') +
          ' × ' + n(book.dimensions.height, 'dimensions') + ' cm',
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

<style lang="postcss" scoped>
.dialog {
  @apply fixed z-20 inset-0 flex flex-col items-center
    sm:py-6 sm:px-6 md:px-0 md:py-12 lg:py-16;
}

.dialog-content {
  @apply relative flex flex-col w-full max-w-3xl h-full
    overflow-hidden text-left bg-white dark:bg-gray-800
    sm:shadow-xl sm:rounded-lg ring-1 ring-black/5;
}

.dialog-header {
  @apply relative overflow-hidden
    bg-primary-600 dark:bg-primary-500
    shrink-0 flex items-center
    px-4 md:px-6 py-4 md:py-5;
}

.dialog-title {
  @apply text-lg font-medium font-display leading-6 text-white;
}

.dialog-description {
  @apply hidden sm:block mt-0.5 text-sm font-medium text-white opacity-80;
}

.dialog-footer {
  @apply shrink-0 flex flex-row-reverse justify-start
    space-x-2 space-x-reverse
    border-t border-gray-200 dark:border-gray-600
    bg-gray-50 dark:bg-gray-800
    px-4 md:px-6 py-3 md:py-4;
}

.close-button {
  @apply shrink-0 p-2 -mr-2 text-primary-200 rounded;
}

.close-button:hover {
  @apply text-white bg-primary-500 dark:bg-primary-400;
}

.close-button:focus-visible {
  @apply text-white ring-primary-300
    ring-offset-primary-600 dark:ring-offset-primary-500;
}
</style>
