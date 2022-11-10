<script lang="ts" setup>
import { computed, toRefs } from 'vue'

import useMarkdown, { type UseMarkdownOptions } from '@/composables/useMarkdown'

export interface BookButtonsProps {
  blur?: boolean
  emptyMessage?: string
  loading?: boolean
  markdown?: string
  options?: UseMarkdownOptions
  title: string
}

const props = withDefaults(defineProps<BookButtonsProps>(), {
  emptyMessage: undefined,
  markdown: undefined,
  blur: false,
  loading: false,
  options: () => ({ disable: ['image'] })
})

const { markdown, blur, loading, title, emptyMessage, options } = toRefs(props)

const { renderMarkdown } = useMarkdown(options.value)

const markdownRendered = computed(() => {
  if (loading.value) {
    return ''
  }

  if (markdown.value!.length === 0) {
    return emptyMessage.value ? `<em>${emptyMessage.value}</em>` : ''
  }

  return renderMarkdown(markdown.value!)
})
</script>

<template>
  <section
    v-if="markdownRendered?.length || emptyMessage || loading"
    class="bg-gray-50 dark:bg-gray-800/70 p-4 rounded-xl"
  >
    <h3 class="text-lg font-medium font-display dark:text-gray-100">
      {{ title }}
    </h3>
    <div
      v-if="!loading"
      v-html="markdownRendered"
      :class="
        blur
          ? 'md:blur-sm md:dark:blur md:select-none md:hover:blur-none md:dark:hover:blur-none md:hover:select-auto'
          : ''
      "
      class="mt-3 prose dark:prose-invert max-w-none motion-safe:transition"
    />
    <div v-else class="flex flex-col space-y-2 mt-3" aria-hidden="true">
      <div class="skeleton w-full h-5"></div>
      <div class="skeleton w-full h-5"></div>
      <div class="skeleton w-full h-5"></div>
      <div class="skeleton w-full h-5"></div>
      <div class="skeleton w-full h-5"></div>
      <div class="skeleton w-6/12 h-5"></div>
    </div>
  </section>
</template>
