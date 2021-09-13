<template>
  <TransitionRoot :show="open" as="template">
    <Dialog
      as="div"
      class="fixed inset-0 z-20 md:p-12 lg:p-24 flex flex-col items-center justify-center"
      @close="$emit('close')"
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
        <DialogOverlay class="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-90 motion-safe:transition-opacity backdrop-filter backdrop-blur-sm" />
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
        <div
          class="relative flex flex-col items-center max-w-full max-h-full overflow-visible text-left align-middle transition-all transform bg-white shadow-xl rounded-xl"
        >
          <DialogTitle as="h3" class="sr-only">
            {{ t('dashboard.details.zoom.title') }}
          </DialogTitle>

          <img
            :src="coverUrl"
            alt=""
            class="max-w-full max-h-full rounded-lg"
          />

          <div class="absolute w-10 h-10 -right-12 -top-1">
            <button
              type="button"
              class="p-1 text-white opacity-80 hover:opacity-100 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-100 dark:focus-visible:ring-primary-500 focus-visible:opacity-100 motion-safe:transition-shadow"
              :title="t('dashboard.details.zoom.title')"
              @click="$emit('close')"
            >
              <span aria-hidden="true">
                <XIcon class="w-6 h-6" />
              </span>
              <span class="sr-only">
                {{ t('dashboard.details.zoom.close') }}
              </span>
            </button>
          </div>
        </div>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { useI18n } from 'vue-i18n'

import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogOverlay,
  DialogTitle
} from '@headlessui/vue'

import { XIcon } from '@heroicons/vue/solid'

export default {
  components: {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
    XIcon
  },

  props: {
    coverUrl: {
      type: String,
      required: true
    },
    open: {
      type: Boolean
    }
  },

  emits: ['close'],

  setup () {
    const { t } = useI18n()

    return { t }
  }
}
</script>
