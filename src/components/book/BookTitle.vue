<script lang="ts" setup>
import { computed, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

import Book from '@/model/Book'

export interface BookTitleProps {
  book?: Book | null
  loading?: boolean
}

const props = withDefaults(defineProps<BookTitleProps>(), {
  book: undefined,
  loading: false
})

defineEmits<{
  (e: 'click:author', author: string): void
}>()

const { book, loading } = toRefs(props)
const { t } = useI18n({ useScope: 'global' })

const separator = computed(() => {
  return t('dashboard.details.header.authorSeparator')
})

const lastSeparator = computed(() => {
  return t('dashboard.details.header.authorLastSeparator')
})
</script>

<template>
  <div class="flex flex-col sm:h-56 text-gray-700 sm:text-white/80">
    <h2
      v-if="!loading"
      class="pt-3 text-gray-900 sm:text-white/95 text-xl sm:text-2xl md:text-3xl font-display font-medium"
    >
      {{ book!.titleParts.main }}
    </h2>
    <div
      v-else
      aria-hidden="true"
      class="mt-3 skeleton w-72 h-8 mb-2 bg-white/50 dark:bg-white/30"
    />

    <p
      v-if="!loading && book!.titleParts.subtitle"
      class="font-display text-md sm:text-lg md:text-xl -mt-1 mb-2"
    >
      {{ book!.titleParts.subtitle }}
    </p>

    <div class="flex-grow hidden sm:block" aria-hidden="true" />

    <p v-if="!loading" class="text-sm md:text-base sm:text-white/90">
      <template v-for="(author, idx) of book!.authors" :key="idx">
        <a
          href="#"
          class="author has-ring-focus"
          @click.prevent="$emit('click:author', author)"
        >
          {{ author }}
        </a>
        <span
          v-if="book!.authors!.length > 1 && idx < book!.authors!.length - 1"
        >
          {{ idx === book!.authors!.length - 2 ? lastSeparator : separator }}
        </span>
      </template>
    </p>
    <div
      v-else
      class="skeleton h-6 w-44 bg-white/50 dark:bg-white/30"
      aria-hidden="true"
    />
  </div>
</template>

<style lang="postcss" scoped>
.author {
  @apply font-medium hocus:text-white relative sm:text-white/95;

  &:where(:focus-visible, :hover)::before {
    @apply content-[''] bg-white/10 w-full h-full py-0.5 px-2 box-content
      inline-block absolute -top-0.5 -left-2 rounded-md;
  }
}
</style>
