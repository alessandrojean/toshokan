<script setup>
import { computed, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

import dedent from 'dedent'
import searchQuery from 'search-query-parser'

import useMarkdown from '@/composables/useMarkdown'
import { createSearchKeywords } from '@/services/sheet/searchBooks'

import { XIcon } from '@heroicons/vue/solid'

const props = defineProps({
  search: {
    type: String,
    required: true
  }
})

defineEmits(['click', 'click:remove'])

const { t } = useI18n({ useScope: 'global' })

const { search } = toRefs(props)
const { escapeHtml } = useMarkdown()

const keywords = computed(() => Object.keys(createSearchKeywords()))

const searchText = computed(() => {
  const result = searchQuery.parse(search.value, { keywords: keywords.value })

  if (typeof result === 'string') {
    return escapeHtml(result)
  }

  let withTags = search.value

  for (const offset of result.offsets.reverse()) {
    if (offset.text) {
      withTags =
        withTags.substring(0, offset.offsetStart) +
        escapeHtml(
          search.value.substring(offset.offsetStart, offset.offsetEnd)
        ) +
        withTags.substring(offset.offsetEnd)
      continue
    }

    const isExclude = withTags[offset.offsetStart - 1] === '-'
    const startIndex = isExclude ? offset.offsetStart - 1 : offset.offsetStart

    const tag = dedent`
      <span class="bg-gray-300/40 dark:bg-gray-600/50 dark:group-hover:bg-gray-600/80 dark:group-focus-visible:bg-gray-600/80 py-px px-2 rounded inline-block">
        ${escapeHtml(search.value.substring(startIndex, offset.offsetEnd))}
      </span>
    `

    withTags =
      withTags.substring(0, startIndex) +
      tag +
      withTags.substring(offset.offsetEnd)
  }

  return withTags.replace(/\n/g, '')
})
</script>

<template>
  <a
    href="#"
    class="history-item group has-ring-focus"
    @click.prevent="$emit('click', search)"
  >
    <p
      class="flex-grow overflow-hidden whitespace-nowrap min-w-0 overflow-gradient"
      v-html="searchText"
    />
    <button
      class="remove-button has-ring-focus"
      tabindex="-1"
      :title="t('dashboard.search.removeFromHistory')"
      @click.stop="$emit('click:remove', search)"
    >
      <span class="sr-only">
        {{ t('dashboard.search.removeFromHistory') }}
      </span>
      <span aria-hidden="true">
        <XIcon class="w-5 h-5" />
      </span>
    </button>
  </a>
</template>

<style lang="postcss" scoped>
.history-item {
  @apply flex items-center relative
    text-sm transition-none
    text-gray-800 dark:text-gray-300
    bg-white dark:bg-gray-800
    pl-5 pr-10 py-3 space-x-4;
}

.history-item:where(:hover, :focus-visible) {
  @apply text-gray-800 dark:text-gray-100
    bg-gray-50 dark:bg-gray-700/40;
}

.history-item:focus-visible {
  @apply ring-inset dark:ring-offset-gray-800 z-10;
}

.remove-button {
  @apply absolute right-3 p-1 rounded hidden
    text-gray-400 dark:text-gray-500;
}

.history-item:hover .remove-button {
  @apply dark:text-gray-400;
}

.history-item:where(:hover, :focus) .remove-button {
  @apply block;
}

.remove-button:hover,
.history-item:hover .remove-button:hover,
.history-item:focus-visible .remove-button {
  @apply text-gray-600 dark:text-gray-300;
}

.overflow-gradient {
  @apply relative;
}

.overflow-gradient::after {
  @apply content-[''] absolute right-0 inset-y-0 w-20 block
    bg-gradient-to-r from-transparent to-white dark:to-gray-800;
}

.history-item:where(:hover, :focus) .overflow-gradient::after {
  @apply to-gray-50 dark:to-[#293341];
}
</style>
