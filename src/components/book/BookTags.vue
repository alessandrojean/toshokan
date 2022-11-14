<script lang="ts" setup>
import { useI18n } from '@/i18n'

export interface BookTagsProps {
  group?: boolean
  loading?: boolean
  tags?: string[] | null
}

const props = withDefaults(defineProps<BookTagsProps>(), {
  group: false,
  loading: false,
  tags: () => []
})

defineEmits<{
  (e: 'click:tag', tag: string): void
}>()

const { group, loading, tags } = toRefs(props)
const { t } = useI18n({ useScope: 'global' })

const SKELETON_TAG_SIZES = ['w-16', 'w-20', 'w-12', 'w-14']

function randomSize() {
  const randomIdx = Math.floor(Math.random() * SKELETON_TAG_SIZES.length)

  return SKELETON_TAG_SIZES[randomIdx]
}

const groupedTags = computed(() => {
  const allTagsHaveGroups =
    group.value && tags.value?.every((tag) => tag.includes(':'))

  if (allTagsHaveGroups !== true) {
    return null
  }

  return tags.value!.reduce((record, tag) => {
    const [title, ...value] = tag.split(': ')
    const lowercaseTitle = title.toLowerCase()

    if (record[lowercaseTitle]) {
      record[lowercaseTitle].push(value.join(': '))
    } else {
      record[lowercaseTitle] = [value.join(': ')]
    }

    return record
  }, {} as Record<string, string[]>)
})
</script>

<template>
  <DashboardBlock :title="t('book.properties.tags')">
    <ul
      v-if="!loading && tags?.length && !groupedTags"
      class="flex flex-wrap gap-2 mt-4"
    >
      <li v-for="tag in tags" :key="tag" class="block">
        <a
          href="#"
          class="tag has-ring-focus block"
          :title="t('dashboard.search.searchBy', [tag])"
          @click.prevent="$emit('click:tag', tag)"
        >
          <span aria-hidden="true" class="bullet"></span>
          <span>{{ tag }}</span>
        </a>
      </li>
    </ul>
    <div
      v-else-if="!loading && tags?.length && groupedTags"
      class="space-y-4 mt-2"
    >
      <div v-for="(tags, group) in groupedTags" :key="group">
        <p
          class="text-sm font-medium text-gray-600 dark:text-gray-300 first-letter:capitalize"
        >
          {{ group }}
        </p>

        <ul class="flex flex-wrap gap-2 mt-2">
          <li v-for="tag in tags" :key="tag" class="block">
            <a
              href="#"
              class="tag has-ring-focus block"
              :title="t('dashboard.search.searchBy', [`${group}: ${tag}`])"
              @click.prevent="$emit('click:tag', `${group}: ${tag}`)"
            >
              <span aria-hidden="true" class="bullet"></span>
              <span>{{ tag }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <p
      v-else-if="tags?.length === 0 && !loading"
      class="mt-4 italic text-gray-700 dark:text-gray-300"
    >
      {{ t('book.emptyTags') }}
    </p>
    <div v-else-if="loading" aria-hidden="true">
      <div class="flex flex-wrap gap-2 mt-4">
        <div
          v-for="tag of 20"
          :key="tag"
          :class="['skeleton h-6', randomSize()]"
        />
      </div>
    </div>
  </DashboardBlock>
</template>
