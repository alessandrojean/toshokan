<script lang="ts" setup>
import { toRefs, AnchorHTMLAttributes } from 'vue'

import {
  ArrowTopRightOnSquareIcon,
  ChevronUpIcon
} from '@heroicons/vue/20/solid'

import type { Item } from '@/components/dashboard/DashboardAsideMenu.vue'

export interface DashboardAsideButton extends AnchorHTMLAttributes {
  active: boolean
  child?: boolean
  expandable?: boolean
  item: Item
  open?: boolean
}

const props = withDefaults(defineProps<DashboardAsideButton>(), {
  child: false,
  expandable: false,
  open: false
})

const { active, item, href, expandable, open } = toRefs(props)
</script>

<template>
  <a
    :href="href"
    :target="item.external ? '_blank' : undefined"
    :class="[
      'group flex w-full items-center rounded-lg text-sm px-2.5 py-2',
      'motion-safe:transition-color',
      child ? 'font-normal' : 'font-medium',
      active
        ? 'bg-primary-100 text-primary-900 dark:text-gray-100 ' +
          ((expandable && open) || child
            ? 'dark:bg-gray-800'
            : 'dark:bg-gray-900')
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 hover:text-gray-800 dark:hover:text-gray-100 ' +
          (child ? 'dark:hover:bg-gray-600' : 'dark:hover:bg-gray-700')
    ]"
  >
    <component
      v-if="item.icon"
      :is="item.icon"
      :class="[
        'w-6 h-6 shrink-0 motion-safe:transition-color mr-3.5',
        active
          ? 'text-primary-600 dark:text-primary-400'
          : 'text-gray-500 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
      ]"
    />
    <span class="grow">{{ item.label }}</span>
    <ArrowTopRightOnSquareIcon
      v-if="item.external && !expandable"
      class="shrink-0 w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-100 motion-safe:transition-color"
    />
    <ChevronUpIcon
      v-else-if="expandable"
      :class="[
        'shrink-0 w-5 h-5',
        'motion-safe:transition',
        open && active ? '' : 'rotate-180',
        active
          ? 'text-primary-600 dark:text-primary-400'
          : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-100'
      ]"
    />
  </a>
</template>
