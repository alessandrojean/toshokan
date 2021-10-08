<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog
      as="div"
      class="fixed z-20 inset-0 flex flex-col items-center justify-end md:justify-center px-6 sm:py-6 md:px-0 md:py-12 lg:py-16"
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
        <DialogOverlay class="dialog-overlay" />
      </TransitionChild>

      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0 scale-95"
        enter-to="opacity-100 scale-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100 scale-100"
        leave-to="opacity-0 scale-95"
      >
        <div
          class="inline-block w-full max-w-lg px-6 py-4 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-lg space-y-3"
        >
          <div class="flex justify-between items-center">
            <DialogTitle
              as="h3"
              class="text-lg leading-6 font-display font-medium text-gray-900 dark:text-gray-100"
            >
              {{ t('footer.donate.actionDonate') }}
            </DialogTitle>
            <button
              class="flex-shrink-0 p-2 -mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus-visible:text-gray-600 dark:focus-visible:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md has-ring-focus"
              :title="t('footer.donate.actionClose')"
              @click="closeDialog"
            >
              <span aria-hidden="true">
                <XIcon class="w-5 h-5" />
              </span>
              <span class="sr-only">
                {{ t('footer.donate.actionClose') }}
              </span>
            </button>
          </div>

          <p class="text-gray-600 dark:text-gray-300 leading-snug">
            {{ t('footer.donate.description') }}
          </p>

          <div class="flex items-center justify-center p-6">
            <div class="w-48 h-48 relative rounded overflow-hidden border border-gray-300 dark:border-0 bg-white p-1 dark:opacity-90">
              <img src="@/assets/donations/qrcode-picpay.svg" class="w-full h-full">

              <div
                aria-hidden="true"
                class="p-2 bg-picpay absolute right-0 bottom-0 rounded-tl-xl"
              >
                <PicPayIcon class="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { useI18n } from 'vue-i18n'

import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'
import { XIcon } from '@heroicons/vue/solid'

import PicPayIcon from '@/components/icons/PicPayIcon.vue'

export default {
  components: {
    Dialog,
    DialogOverlay,
    DialogTitle,
    PicPayIcon,
    TransitionChild,
    TransitionRoot,
    XIcon
  },

  props: {
    modelValue: Boolean
  },

  emits: ['update:modelValue'],

  setup (_, context) {
    const { t } = useI18n()

    function closeDialog () {
      context.emit('update:modelValue', false)
    }

    return {
      t,
      closeDialog
    }
  }
}
</script>

<style>

</style>
