<script lang="ts" setup>
import Book from '@/model/Book'
import type { GridMode, SpoilerMode } from '@/stores/settings'

export type Kind = 'default' | 'readings'
export interface BookGridProps {
  blurNsfw?: boolean
  current?: String
  imageOnly?: boolean
  items?: Book[]
  kind?: Kind
  loading?: boolean
  mode?: GridMode
  skeletonItems?: number
  spoilerMode?: SpoilerMode
}

const props = withDefaults(defineProps<BookGridProps>(), {
  blurNsfw: false,
  imageOnly: false,
  items: () => [],
  kind: 'default',
  loading: false,
  mode: 'comfortable',
  spoilerMode: () => ({
    cover: false,
    synopsis: false
  })
})

const grid = ref<HTMLUListElement>()
const { items, loading, kind } = toRefs(props)

const gridColumns: Record<Kind, string> = {
  default: 'grid-cols-3 md:grid-cols-5 xl:grid-cols-6',
  readings: 'grid-cols-3 md:grid-cols-4 xl:grid-cols-5'
}

defineExpose({
  focus: () => grid.value?.focus()
})
</script>

<template>
  <DashboardBlock class="border dark:border-gray-700">
    <div v-if="loading" :class="['grid gap-2.5 sm:gap-4', gridColumns[kind]]">
      <BookCard
        v-for="tempBook in skeletonItems"
        :key="tempBook"
        loading
        :mode="mode"
        :spoiler-mode="spoilerMode"
        :blur-nsfw="blurNsfw"
      />
    </div>
    <ul v-else :class="['grid gap-2.5 sm:gap-4', gridColumns[kind]]" ref="grid">
      <li v-for="book in items" :key="book.id!">
        <BookCard
          class="scroll-mt-20"
          :book="book"
          :loading="loading"
          :current="book.id === current"
          :mode="mode"
          :spoiler-mode="spoilerMode"
          :blur-nsfw="blurNsfw"
          :image-only="imageOnly"
        >
          <template #actions v-if="$slots.actions">
            <slot name="actions" :book="book" />
          </template>
        </BookCard>
      </li>
    </ul>
  </DashboardBlock>
</template>
