<script lang="ts" setup>
import { useI18n } from '@/i18n'
import { toRefs } from 'vue'

export interface BookTagsProps {
  loading?: boolean
  tags?: string[] | null
}

const props = withDefaults(defineProps<BookTagsProps>(), {
  loading: false,
  tags: () => []
})

defineEmits<{
  (e: 'click:tag', tag: string): void
}>()

const { loading, tags } = toRefs(props)
const { t } = useI18n({ useScope: 'global' })

const SKELETON_TAG_SIZES = ['w-16', 'w-20', 'w-12', 'w-14']

function randomSize() {
  const randomIdx = Math.floor(Math.random() * SKELETON_TAG_SIZES.length)

  return SKELETON_TAG_SIZES[randomIdx]
}
</script>

<template>
  <section
    class="bg-gray-50 dark:bg-gray-800/70 p-4 rounded-xl relative motion-safe:transition"
  >
    <h3 class="text-lg font-medium font-display dark:text-gray-100">
      {{ t('book.properties.tags') }}
    </h3>
    <ul v-if="!loading && tags?.length" class="flex flex-wrap gap-2 mt-4">
      <li v-for="tag in tags" :key="tag" class="block">
        <a
          href="#"
          class="tag has-ring-focus block"
          @click.prevent="$emit('click:tag', tag)"
        >
          <span aria-hidden="true" class="bullet"></span>
          <span>{{ tag }}</span>
        </a>
      </li>
    </ul>
    <p
      v-else-if="tags?.length === 0"
      class="mt-4 italic text-gray-700 dark:text-gray-300"
    >
      {{ t('book.emptyTags') }}
    </p>
    <div v-else-if="loading" aria-hidden="true">
      <div class="flex flex-wrap gap-2 mt-4">
        <div
          v-for="tag of 20"
          :key="tag"
          :class="['skeleton h-5', randomSize()]"
        />
      </div>
    </div>
  </section>
</template>
