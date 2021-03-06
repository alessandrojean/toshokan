<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" static class="fixed z-10 inset-0 overflow-y-auto" @close="$emit('update:open', false)" :open="open">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <TransitionChild
          as="template"
          enter="motion-reduce:transition-none ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="motion-reduce:transition-none ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-90 transition-opacity" />
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <TransitionChild
          as="template"
          enter="motion-reduce:transition-none motion-reduce:transform-none ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="motion-reduce:transition-none motion-result:transform-none ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-gray-700 sm:mx-0 sm:h-10 sm:w-10" aria-hidden="true">
                  <CheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <DialogTitle as="h3" class="text-lg leading-6 font-title font-medium text-gray-900 dark:text-gray-100">
                    {{ t('book.createdModal.title') }}
                  </DialogTitle>
                  <div class="mt-2 space-y-4 text-gray-500 dark:text-gray-400 text-sm">
                    <p>
                      {{ t('book.createdModal.message') }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-600 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                class="button is-primary sm:ml-3 w-full sm:w-auto justify-center sm:justify-start"
                @click="handleView"
              >
                {{ t('book.createdModal.view') }}
              </button>
              <button
                type="button"
                class="button mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto justify-center sm:justify-start"
                @click="handleNew"
              >
                {{ t('book.createdModal.newBook') }}
              </button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { useI18n } from 'vue-i18n'

import { CheckIcon } from '@heroicons/vue/outline'

import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'

export default {
  name: 'BookDeleteModal',

  components: {
    CheckIcon,
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot
  },

  props: {
    open: Boolean
  },

  emits: ['update:open', 'click:view', 'click:new'],

  setup (_, context) {
    function handleNew (event) {
      context.emit('update:open', false)
      context.emit('click:new', event)
    }

    function handleView (event) {
      context.emit('update:open', false)
      context.emit('click:view', event)
    }

    const { t } = useI18n()

    return { handleNew, handleView, t }
  }
}
</script>

<style>

</style>
