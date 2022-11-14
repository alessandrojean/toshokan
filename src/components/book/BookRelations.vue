<script lang="ts" setup>
import { useI18n } from '@/i18n'
import { toRefs } from 'vue'

import type { BookLink } from '@/services/links'

import {
  ArrowTopRightOnSquareIcon,
  GlobeAltIcon
} from '@heroicons/vue/20/solid'
import Button from '@/components/form/Button.vue'

export interface BookTagsProps {
  links?: BookLink[] | null
  loading?: boolean
}

const props = withDefaults(defineProps<BookTagsProps>(), {
  links: () => [],
  loading: false
})

const { links, loading } = toRefs(props)
const { t } = useI18n({ useScope: 'global' })

const SKELETON_TAG_SIZES = ['w-16', 'w-20', 'w-12', 'w-14']

function randomSize() {
  const randomIdx = Math.floor(Math.random() * SKELETON_TAG_SIZES.length)

  return SKELETON_TAG_SIZES[randomIdx]
}
</script>

<template>
  <section
    v-if="loading || links?.length"
    class="bg-block dark:bg-block-dark p-4 rounded-xl relative motion-safe:transition"
  >
    <h3 class="text-md sm:text-lg font-medium font-display dark:text-gray-100">
      {{ t('dashboard.details.relations') }}
    </h3>
    <ul v-if="!loading && links?.length" class="flex flex-wrap gap-2 mt-4">
      <li v-for="link in links" :key="link.url" class="block">
        <Button
          size="small"
          as="a"
          target="_blank"
          :href="link.url"
          class="!shadow-none group"
          rounded
        >
          <template #left="{ iconClass }">
            <component v-if="link.icon" :is="link.icon" :class="iconClass" />
            <GlobeAltIcon v-else :class="iconClass" />
          </template>
          <span>{{ link.title }}</span>
          <template #right="{ iconClass }">
            <ArrowTopRightOnSquareIcon
              :class="[iconClass, '!w-3.5 !h-3.5 group-hover:text-primary-600']"
            />
          </template>
        </Button>
      </li>
    </ul>
    <div v-else aria-hidden="true">
      <div class="flex flex-wrap gap-2 mt-4">
        <div
          v-for="link of 20"
          :key="link"
          :class="['skeleton h-5', randomSize()]"
        />
      </div>
    </div>
  </section>
</template>
