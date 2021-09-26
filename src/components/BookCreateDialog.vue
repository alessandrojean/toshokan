<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog
      as="div"
      static
      :open="isOpen"
      :initial-focus="bookProviderSearch"
      class="fixed z-20 inset-0 flex flex-col items-center sm:py-6 sm:px-6 md:px-0 md:py-12 lg:py-16"
      @close="closeDialog"
    >
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
          class="hidden sm:block fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-90 transition-none backdrop-filter backdrop-blur-sm"
          @click="closeDialog"
        />
      </TransitionChild>

      <TransitionChild
        as="template"
        enter="motion-reduce:transition-none duration-300 ease-out"
        enter-from="opacity-0 scale-95"
        enter-to="opacity-100 scale-100"
        leave="motion-reduce:transition-none duration-200 ease-in"
        leave-from="opacity-100 scale-100"
        leave-to="opacity-0 scale-95"
      >
        <div class="relative flex flex-col w-full max-w-3xl h-full overflow-hidden text-left motion-safe:transition-all transform bg-white dark:bg-gray-800 sm:shadow-xl sm:rounded-lg">
          <div class="relative overflow-hidden bg-primary-600 dark:bg-primary-500 flex-shrink-0 flex items-center px-4 md:px-6 py-4 md:py-5">
            <div class="flex-grow">
              <DialogTitle as="h2" class="text-lg font-medium font-display leading-6 text-white">
                {{ t('dashboard.newBook.title') }}
              </DialogTitle>
              <DialogDescription as="p" class="hidden sm:block mt-0.5 text-sm font-medium text-white opacity-80">
                {{ t('dashboard.newBook.description') }}
              </DialogDescription>
            </div>

            <BulletSteps
              class="mr-3 sm:hidden"
              v-model="step"
              :steps="steps"
            />

            <button
              class="flex-shrink-0 p-2 -mr-2 text-primary-200 hover:text-white focus-visible:text-white hover:bg-primary-500 dark:hover:bg-primary-400 rounded-md focus:outline-none has-ring-focus"
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
                <div class="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-gray-700">
                  <CheckOutlineIcon class="w-6 h-6 text-green-500 dark:text-green-400" />
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
                :book="book"
                @update:book="Object.assign(book, $event)"
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
              <div v-else class="grid grid-cols-3 gap-4 md:gap-6 lg:gap-8 w-full">
                <div v-if="book.coverUrl.length > 0">
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
                <div :class="book.coverUrl.length > 0 ? 'col-span-2' : 'col-span-3'">
                  <DescriptionList
                    :class="book.coverUrl.length > 0 ? 'w-full' : 'max-w-xl mx-auto'"
                    :info="bookInfo"
                  >
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
                </div>
              </div>
            </transition>
          </div>

          <div class="flex-shrink-0 flex flex-row-reverse justify-start border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 md:px-6 py-3 md:py-4">
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
              class="button is-primary ml-2"
              @click.stop="handleInsertBook"
            >
              <CheckIcon aria-hidden="true" />
              {{ t('dashboard.details.editForm.finish') }}
            </button>
            <button
              v-else
              type="button"
              class="button is-primary ml-2"
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
        </div>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { computed, nextTick, reactive, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

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

import BookCoverSelector from '@/components/BookCoverSelector.vue'
import BookForm from '@/components/BookForm.vue'
import BookProviderSearch from '@/components/BookProviderSearch.vue'
import BulletSteps from '@/components/BulletSteps.vue'
import DescriptionList from '@/components/DescriptionList.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'

import useBookInserter from '@/composables/useBookInserter'
import useMarkdown from '@/composables/useMarkdown'
import useImageLoader from '@/composables/useImageLoader'

export default {
  components: {
    Dialog,
    DialogDescription,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    BookCoverSelector,
    BookForm,
    BookProviderSearch,
    BulletSteps,
    DescriptionList,
    LoadingIndicator,
    ArrowSmRightIcon,
    CheckIcon,
    CheckOutlineIcon,
    PhotographIcon,
    XIcon
  },

  props: {
    isOpen: Boolean
  },

  emits: ['close'],

  setup (props, context) {
    const { t } = useI18n()

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

    const bookInitialState = {
      authors: [],
      authorsStr: '',
      boughtAt: now,
      boughtAtStr: now.toISOString().substring(0, 10),
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

    function previousStep () {
      if (step.value === 2) {
        searchBookSelected.value = null
        Object.assign(book, bookInitialState)
      }

      step.value--
    }

    function nextStep () {
      if (step.value === 1 && searchBookSelected.value) {
        Object.assign(book, searchBookSelected.value)
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

    watch(isOpen, newIsOpen => {
      if (newIsOpen) {
        Object.assign(book, bookInitialState)
      }
    })

    const searchBookSelected = ref(null)

    function handleSearchSelect (searchBook) {
      searchBookSelected.value = searchBook
    }

    async function handleNew () {
      if (!bookInvalid.value) {
        context.emit('new', book)
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
    const { inserting, insertBook } = useBookInserter(book)
    const bookCreatedId = ref(null)

    async function handleInsertBook () {
      bookCreatedId.value = await insertBook()
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
      ...useRevisionStep(book)
    }
  }
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
