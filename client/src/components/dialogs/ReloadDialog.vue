<script lang="ts" setup>
import { useRegisterSW } from 'virtual:pwa-register/vue'

import chunk from 'lodash.chunk'

import { SparklesIcon } from '@heroicons/vue/24/outline'

const { needRefresh, updateServiceWorker } = useRegisterSW()

function close() {
  needRefresh.value = false
}

const { t } = useI18n({ useScope: 'global' })

const { markdown: md, renderMarkdown } = useMarkdown()

const { data: releaseNotesMarkdown } = useGitHubReleaseQuery()

const sections = computed(() => {
  if (!releaseNotesMarkdown.value) {
    return null
  }

  const parts = releaseNotesMarkdown.value.split(/## (.*)\r\n\r\n/).slice(1)

  return chunk(parts, 2).map(([title, body]) => ({
    title: md.renderInline(title),
    body: renderMarkdown(body),
  }))
})
</script>

<template>
  <TransitionRoot as="template" :show="needRefresh">
    <Dialog @close="close">
      <div class="dialog">
        <TransitionChild
          as="template"
          enter="motion-reduce:transition-none ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="motion-reduce:transition-none ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="dialog-overlay" />
        </TransitionChild>

        <TransitionChild
          as="template"
          enter="motion-reduce:transition-none motion-reduce:transform-none ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="motion-reduce:transition-none motion-result:transform-none ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <DialogPanel class="dialog-content">
            <div
              class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 grow min-h-0 sm:flex sm:items-start"
            >
              <div
                class="mx-auto shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-gray-700 sm:mx-0 sm:h-10 sm:w-10"
                aria-hidden="true"
              >
                <SparklesIcon
                  class="h-6 w-6 text-primary-600 dark:text-primary-300"
                  aria-hidden="true"
                />
              </div>
              <div
                class="mt-3 grow h-full text-center sm:mt-0 sm:ml-4 sm:text-left flex flex-col"
              >
                <DialogTitle
                  as="h3"
                  class="shrink-0 text-lg leading-6 font-display-safe font-medium text-gray-900 dark:text-gray-100"
                >
                  {{ t('pwa.newContent.title') }}
                </DialogTitle>
                <div
                  class="shrink-0 mt-2 space-y-4 text-gray-500 dark:text-gray-400 text-sm"
                >
                  <p>
                    {{ t('pwa.newContent.message') }}
                  </p>
                </div>
                <div
                  class="grow min-h-0 overflow-y-auto mt-6 text-left"
                  lang="en-US"
                >
                  <div
                    class="w-full prose prose-sm dark:prose-invert prose-ul:leading-snug"
                  >
                    <details
                      v-for="(section, idx) in sections"
                      :key="idx"
                      :open="section.title === 'Changelog'"
                    >
                      <summary>{{ section.title }}</summary>
                      <div v-html="section.body" />
                    </details>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="shrink-0 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
            >
              <Button
                kind="primary"
                class="sm:ml-3 w-full sm:w-auto justify-center sm:justify-start"
                @click="updateServiceWorker(true)"
              >
                {{ t('pwa.newContent.update') }}
              </Button>
              <Button
                class="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto justify-center sm:justify-start"
                @click="close"
              >
                {{ t('pwa.newContent.close') }}
              </Button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style lang="postcss" scoped>
.dialog {
  @apply fixed z-50 inset-0 flex flex-col
    items-center justify-end sm:justify-center
    py-4 sm:py-6 px-4 sm:px-6 md:px-0 md:py-12 lg:py-24;
}

.dialog-content {
  @apply relative flex flex-col w-full sm:max-w-lg lg:max-w-xl
    overflow-hidden text-left bg-white dark:bg-gray-800
    shadow-xl rounded-lg ring-1 ring-black/5;
}
</style>
