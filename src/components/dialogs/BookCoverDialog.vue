<script setup>
import { inject, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogOverlay,
  DialogTitle
} from '@headlessui/vue'

import { XIcon } from '@heroicons/vue/solid'

const props = defineProps({
  coverUrl: {
    type: String,
    required: true
  },
  open: {
    type: Boolean
  }
})

defineEmits(['close'])

const { t } = useI18n({ useScope: 'global' })

const { open } = toRefs(props)

const disableSearchShortcut = inject('disableSearchShortcut')
const enableSearchShortcut = inject('enableSearchShortcut')

watch(open, (newOpen) => {
  newOpen ? disableSearchShortcut() : enableSearchShortcut()
})
</script>

<template>
  <TransitionRoot :show="open" as="template">
    <Dialog as="template" @close="$emit('close')">
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
          <DialogOverlay class="dialog-overlay" />
        </TransitionChild>

        <TransitionChild
          as="div"
          class="dialog-content transform"
          enter="motion-reduce:transition-none duration-300 ease-out"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="motion-reduce:transition-none duration-200 ease-in"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogTitle as="h3" class="sr-only">
            {{ t('dashboard.details.zoom.title') }}
          </DialogTitle>

          <img
            :src="coverUrl"
            alt=""
            class="min-w-0 max-w-full min-h-0 max-h-full rounded-lg"
          />

          <div class="absolute w-10 h-10 -right-12 -top-1">
            <button
              type="button"
              class="close-button"
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
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style lang="postcss" scoped>
.dialog {
  @apply fixed inset-0 z-20 md:p-12 lg:p-24
    flex flex-col items-center justify-center;
}

.dialog-content {
  @apply relative flex flex-col items-center align-middle
    min-w-0 max-w-full max-h-full overflow-visible
    text-left bg-white dark:bg-gray-800
    shadow-xl rounded-xl ring-1 ring-black/5;
}

.close-button {
  @apply p-1 text-white opacity-80 rounded-md motion-safe:transition-shadow;
}

.close-button:hover,
.close-button:focus {
  @apply opacity-100;
}

.close-button:focus {
  @apply outline-none;
}

.close-button:focus-visible {
  @apply ring-2 ring-primary-100 dark:ring-primary-500;
}
</style>
