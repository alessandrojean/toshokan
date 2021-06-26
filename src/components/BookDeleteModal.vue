<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" static class="fixed z-10 inset-0 overflow-y-auto" @close="$emit('update:open', false)" :open="open">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <DialogOverlay class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-90 transition-opacity" />
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-gray-700 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationIcon class="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <DialogTitle as="h3" class="text-lg leading-6 font-title font-medium text-gray-900 dark:text-gray-100">
                    Deletar livro
                  </DialogTitle>
                  <div class="mt-2 space-y-1 text-gray-500 dark:text-gray-400 text-sm">
                    <p>
                      Você tem certeza de que deseja deletar este livro?
                    </p>
                    <p>
                      Esta ação não pode ser revertida.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-600 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="button" class="button is-danger sm:ml-3 w-full sm:w-auto justify-center sm:justify-start" @click="handleDelete">
                Deletar
              </button>
              <button type="button" class="button mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto justify-center sm:justify-start" @click="$emit('update:open', false)">
                Cancelar
              </button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { ExclamationIcon } from '@heroicons/vue/outline'

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
    ExclamationIcon,
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot
  },

  props: {
    open: Boolean
  },

  emits: ['update:open', 'click:delete'],

  setup (_, context) {
    function handleDelete (event) {
      context.emit('update:open', false)
      context.emit('click:delete', event)
    }

    return { handleDelete }
  }
}
</script>

<style>

</style>
