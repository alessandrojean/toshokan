<script lang="ts" setup>
import { XMarkIcon } from '@heroicons/vue/20/solid'
import { useI18n } from '@/i18n'
import { DisableSearchShortcutKey, EnableSearchShortcutKey } from '@/symbols'
import { injectStrict } from '@/util'

const props = defineProps<{ modelValue: boolean }>()

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void
}>()

const { t } = useI18n({ useScope: 'global' })

function closeDialog() {
  emit('update:modelValue', false)
}

const { modelValue: open } = toRefs(props)

const disableSearchShortcut = injectStrict(DisableSearchShortcutKey)
const enableSearchShortcut = injectStrict(EnableSearchShortcutKey)

watch(open, (newOpen) => {
  newOpen ? disableSearchShortcut() : enableSearchShortcut()
})
</script>

<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog
      as="div"
      class="fixed z-30 inset-0 flex flex-col items-center justify-end md:justify-center px-6 sm:py-6 md:px-0 md:py-12 lg:py-16"
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
        <div class="dialog-overlay" />
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
        <DialogPanel
          class="inline-block w-full max-w-lg px-6 py-4 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-lg space-y-3 ring-1 ring-black/5"
        >
          <div class="flex justify-between items-center">
            <DialogTitle
              as="h3"
              class="text-lg leading-6 font-display-safe font-medium text-gray-900 dark:text-gray-100"
            >
              {{ t('footer.donate.actionDonate') }}
            </DialogTitle>
            <button
              class="shrink-0 p-2 -mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus-visible:text-gray-600 dark:focus-visible:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md has-ring-focus"
              :title="t('footer.donate.actionClose')"
              @click="closeDialog"
            >
              <span aria-hidden="true">
                <XMarkIcon class="w-5 h-5" />
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
            <a href="https://ko-fi.com/F1F2FRCOX" target="_blank">
              <img
                class="h-[36px] border-none"
                src="https://storage.ko-fi.com/cdn/kofi3.png?v=3"
                alt="Buy Me a Coffee at ko-fi.com"
              >
            </a>
          </div>
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
