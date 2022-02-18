<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog
      static
      as="template"
      :open="isOpen"
      @close="closeDialog"
    >
      <div class="dialog">
        <TransitionChild
          as="template"
          enter="motion-reduce:transition-none duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="motion-reduce:transition-none duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay class="hidden sm:block dialog-overlay" />
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
                {{ t('dashboard.details.editDialog.title') }}
              </DialogTitle>
              <DialogDescription as="p" class="dialog-description">
                {{ t('dashboard.details.editDialog.description') }}
              </DialogDescription>
            </div>

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

          <TabGroup>
            <TabList class="tab-list">
              <Tab
                v-for="tab of tabs"
                :key="tab.title"
                as="template"
                :disabled="tab.disabled"
              >
                <button class="tab-button has-ring-focus">
                  <span
                    v-if="tab.error"
                    aria-hidden="true"
                    class="mr-2 bg-red-500 dark:bg-red-400 w-1.5 h-1.5 rounded-md"
                  />
                  <span>{{ tab.title }}</span>
                </button>
              </Tab>
            </TabList>

            <TabPanels as="template">
              <div class="tab-panels" ref="main">
                <TabPanel class="has-ring-focus rounded-md">
                  <BookForm
                    ref="editForm"
                    touch-on-mount
                    :modelValue="editingBook"
                    @update:modelValue="Object.assign(editingBook, $event)"
                    @error="setEditFormInvalid"
                  />
                </TabPanel>
                <TabPanel class="has-ring-focus rounded-md">
                  <BookCoverSelector
                    custom
                    hide-custom-title
                    v-model:cover-url="editingBook.coverUrl"
                    :book="editingBook"
                  />
                </TabPanel>
                <TabPanel class="has-ring-focus rounded-md">
                  <BookReading
                    :modelValue="editingBook"
                    @update:modelValue="Object.assign(editingBook, $event)"
                  />
                </TabPanel>
                <TabPanel class="has-ring-focus rounded-md">
                  <BookOrganization
                    :modelValue="editingBook"
                    @update:modelValue="Object.assign(editingBook, $event)"
                  />
                </TabPanel>
              </div>
            </TabPanels>
          </TabGroup>

          <div class="dialog-footer">
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
              @click.stop="closeDialog"
            >
              {{ t('dashboard.details.editForm.cancel') }}
            </button>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { computed, inject, nextTick, reactive, ref, toRaw, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { useSheetStore } from '@/stores/sheet'

import {
  Dialog,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'

import { CheckIcon, XIcon } from '@heroicons/vue/solid'

import Avatar from '@/components/Avatar.vue'
import BookCoverSelector from '@/components/book/BookCoverSelector.vue'
import BookForm from '@/components/book/BookForm.vue'
import BookOrganization from '@/components/book/BookOrganization.vue'
import BookReading from '@/components/book/BookReading.vue'

import Book from '@/model/Book'

import cloneDeep from 'lodash.clonedeep'

export default {
  components: {
    Avatar,
    BookCoverSelector,
    BookForm,
    BookOrganization,
    BookReading,
    CheckIcon,
    Dialog,
    DialogDescription,
    DialogOverlay,
    DialogTitle,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    TransitionChild,
    TransitionRoot,
    XIcon
  },

  props: {
    book: Book,
    isOpen: Boolean
  },

  emits: ['close', 'edit'],

  setup (props, context) {
    const { t, n } = useI18n({ useScope: 'global' })

    function closeDialog () {
      editFormInvalid.value = false
      context.emit('close')
    }

    const { isOpen, book } = toRefs(props)

    const editingBook = reactive(book.value || new Book())
    const editFormInvalid = ref(false)

    function setEditFormInvalid (value) {
      editFormInvalid.value = value
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
        Object.assign(editingBook, cloneDeep(book.value), {
          labelPrice: {
            ...book.value.labelPrice,
            valueStr: n(book.value.labelPrice.value, 'decimal')
          },
          paidPrice: {
            ...book.value.paidPrice,
            valueStr: n(book.value.paidPrice.value, 'decimal')
          }
        })

        window.addEventListener('beforeunload', preventUnload)
        disableSearchShortcut()
      } else {
        window.removeEventListener('beforeunload', preventUnload)
        enableSearchShortcut()
      }
    })

    const editForm = ref(null)

    async function handleEdit () {
      if (!editFormInvalid.value) {
        context.emit('edit', cloneDeep(toRaw(editingBook)))
        closeDialog()
      } else {
        nextTick(() => {
          main.value.scroll({
            top: main.value.scrollHeight,
            behavior: 'smooth'
          })
        })
      }
    }

    const main = ref(null)

    const tabs = computed(() => [
      {
        title: t('dashboard.details.editForm.title'),
        error: editFormInvalid.value
      },
      { title: t('dashboard.details.coverForm.title') },
      {
        title: t('dashboard.details.readingForm.title'),
        disabled: editingBook.isFuture
      },
      { title: t('dashboard.details.organizationForm.title') }
    ])

    const sheetStore = useSheetStore()
    const ownerPictureUrl = computed(() => sheetStore.ownerPictureUrl)
    const shared = computed(() => sheetStore.shared)

    return {
      t,
      closeDialog,
      editForm,
      editFormInvalid,
      setEditFormInvalid,
      editingBook,
      handleEdit,
      main,
      tabs,
      ownerPictureUrl,
      shared
    }
  }
}
</script>

<style lang="postcss" scoped>
.dialog {
  @apply fixed z-20 inset-0 flex flex-col items-center
    sm:py-6 sm:px-6 md:px-0 md:py-12 lg:py-16;
}

.dialog-content {
  @apply relative flex flex-col w-full max-w-2xl h-full
    overflow-hidden text-left bg-white dark:bg-gray-800
    sm:shadow-xl sm:rounded-lg;
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

.tab-list {
  @apply flex flex-nowrap w-full shrink-0
    overflow-x-auto md:overflow-x-visible overflow-y-visible
    px-4 md:px-6 space-x-6
    border-b border-gray-300 dark:border-gray-600;
}

.tab-button {
  @apply flex shrink-0 items-center justify-center
    px-1 py-2.5 -mb-px
    text-sm font-medium border-b-2 border-transparent
    text-gray-600 dark:text-gray-400;
}

.tab-button:not(:disabled):hover {
  @apply border-gray-300 dark:border-gray-600
    text-gray-800 dark:text-gray-300;
}

.tab-button[aria-selected="true"] {
  @apply text-primary-600 dark:text-gray-100
     border-primary-600 dark:border-primary-400
}

.tab-button[aria-selected="true"]:hover {
  @apply text-primary-600 dark:text-gray-100
    border-primary-600 dark:border-primary-400;
}

.tab-button:disabled {
  @apply opacity-50 cursor-default;
}

.tab-panels {
  @apply flex-grow overflow-y-auto px-4 md:px-6 py-4 md:py-6;
}
</style>
