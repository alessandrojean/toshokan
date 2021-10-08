<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog
      as="div"
      :open="isOpen"
      static
      class="fixed z-20 inset-0 flex flex-col items-center sm:py-6 sm:px-6 md:px-0 md:py-12 lg:py-16"
      @close="closeDialog"
    >
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
        as="template"
        enter="motion-reduce:transition-none duration-300 ease-out"
        enter-from="opacity-0 translate-x-full sm:translate-x-0 sm:scale-95"
        enter-to="opacity-100 translate-x-0 sm:translate-x-0 sm:scale-100"
        leave="motion-reduce:transition-none duration-200 ease-in"
        leave-from="opacity-100 translate-x-0 sm:translate-x-0 sm:scale-100"
        leave-to="opacity-0 translate-x-full sm:translate-x-0 sm:scale-95"
      >
        <div class="relative flex flex-col w-full max-w-2xl h-full overflow-hidden text-left motion-safe:transition-all transform bg-white dark:bg-gray-800 sm:shadow-xl sm:rounded-lg">
          <div class="relative overflow-hidden bg-primary-600 dark:bg-primary-500 flex-shrink-0 flex items-center px-4 md:px-6 py-4 md:py-5">
            <div class="flex-grow">
              <DialogTitle as="h2" class="text-lg font-medium font-display leading-6 text-white">
                {{ t('dashboard.details.editDialog.title') }}
              </DialogTitle>
              <DialogDescription as="p" class="hidden sm:block mt-0.5 text-sm font-medium text-white opacity-80">
                {{ t('dashboard.details.editDialog.description') }}
              </DialogDescription>
            </div>

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

          <TabGroup>
            <TabList class="flex px-4 md:px-6 space-x-6 border-b border-gray-300 dark:border-gray-600">
              <Tab
                v-for="tab of tabs"
                :key="tab.title"
                as="template"
                v-slot="{ selected }"
              >
                <button
                  :class="[
                    'flex items-center justify-center px-1 py-3 -mb-px text-sm font-medium has-ring-focus border-b-2',
                    selected
                      ? 'text-primary-600 dark:text-gray-100 hover:text-primary-600 dark:hover:text-gray-100 border-primary-600 dark:border-primary-400'
                      : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
                  ]"
                >
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
              <div
                class="flex-grow overflow-y-auto px-4 md:px-6 py-4 md:py-6"
                ref="main"
              >
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
              </div>
            </TabPanels>
          </TabGroup>

          <div class="flex-shrink-0 flex flex-row-reverse justify-start border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 md:px-6 py-3 md:py-4">
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
        </div>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { computed, nextTick, reactive, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'

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

import BookCoverSelector from '@/components/BookCoverSelector.vue'
import BookForm from '@/components/BookForm.vue'
import BookReading from '@/components/BookReading.vue'

import cloneDeep from 'lodash.clonedeep'

export default {
  components: {
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
    BookCoverSelector,
    BookForm,
    BookReading,
    CheckIcon,
    XIcon
  },

  props: {
    book: Object,
    isOpen: Boolean
  },

  emits: ['close', 'edit'],

  setup (props, context) {
    const { t, n } = useI18n()

    function closeDialog () {
      editFormInvalid.value = false
      context.emit('close')
    }

    const { isOpen, book } = toRefs(props)

    const editingBook = reactive(book.value ? cloneDeep(book.value) : {})
    const editFormInvalid = ref(false)

    function setEditFormInvalid (value) {
      editFormInvalid.value = value
    }

    watch(isOpen, newIsOpen => {
      if (newIsOpen) {
        Object.assign(editingBook, cloneDeep(book.value), {
          dimensionsStr: book.value.dimensions
            .map(dm => n(dm, 'dimensions'))
            .join(' x '),
          labelPriceValueStr: n(book.value.labelPrice.value, 'decimal'),
          paidPriceValueStr: n(book.value.paidPrice.value, 'decimal'),
          boughtAtStr: book.value.boughtAt
            ? book.value.boughtAt.toISOString().substring(0, 10)
            : ''
        })
      }
    })

    const editForm = ref(null)

    async function handleEdit () {
      if (!editFormInvalid.value) {
        context.emit('edit', editingBook)
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
      { title: t('dashboard.details.readingForm.title') }
    ])

    return {
      t,
      closeDialog,
      editForm,
      editFormInvalid,
      setEditFormInvalid,
      editingBook,
      handleEdit,
      main,
      tabs
    }
  }
}
</script>
