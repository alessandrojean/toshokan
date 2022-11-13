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
  iconOnly?: boolean
  item: Item
  open?: boolean
}

const props = withDefaults(defineProps<DashboardAsideButton>(), {
  child: false,
  expandable: false,
  iconOnly: false,
  open: false
})

const { active, iconOnly, item, href, expandable, open } = toRefs(props)
</script>

<template>
  <a
    :href="href"
    :target="item.external ? '_blank' : undefined"
    :class="[
      'group flex items-center flex-nowrap text-sm rounded-lg w-full has-ring-focus',
      child
        ? 'font-normal dark:focus-visible:ring-offset-gray-700'
        : 'font-medium dark:focus-visible:ring-offset-gray-800',
      item.icon ? 'h-10' : 'h-9',
      active
        ? 'bg-primary-100 text-primary-900 dark:text-gray-100 ' +
          ((expandable && open) || child
            ? 'dark:bg-gray-800'
            : 'dark:bg-gray-900')
        : 'text-gray-700 dark:text-gray-300 hocus:bg-gray-200 hocus:text-gray-800 dark:hocus:text-gray-100 ' +
          (child ? 'dark:hocus:bg-gray-600' : 'dark:hocus:bg-gray-700')
    ]"
    :title="item.label"
  >
    <div
      v-if="item.icon"
      :class="[
        'shrink-0 w-10 h-10 flex items-center justify-center',
        'motion-safe:transition-colors'
      ]"
    >
      <component
        :is="item.icon"
        :class="[
          'w-6 h-6 motion-safe:transition-colors',
          active
            ? 'text-primary-600 dark:text-gray-100'
            : 'text-gray-500 dark:text-gray-500 group-hocus:text-gray-600 dark:group-hocus:text-gray-300'
        ]"
      />
    </div>
    <span
      :class="[
        'shrink-0 pl-3 box-border truncate motion-safe:transition-all',
        item.icon
          ? expandable && open
            ? 'w-[10.5rem]'
            : 'w-[11.5rem]'
          : 'w-full'
      ]"
    >
      {{ item.label }}
    </span>
    <div
      v-if="item.external || expandable"
      class="shrink-0 w-10 h-10 flex items-center justify-center"
    >
      <ArrowTopRightOnSquareIcon
        v-if="item.external && !expandable"
        class="w-4 h-4 text-gray-500 dark:text-gray-400 group-hocus:text-gray-600 dark:group-hocus:text-gray-100 motion-safe:transition-color"
      />
      <ChevronUpIcon
        v-else-if="expandable"
        :class="[
          'w-5 h-5',
          'motion-safe:transition-transform',
          open && active ? '' : 'rotate-180',
          active
            ? 'text-primary-600 dark:text-gray-200'
            : 'text-gray-500 dark:text-gray-400 group-hocus:text-gray-600 dark:group-hocus:text-gray-100'
        ]"
      />
    </div>
  </a>
</template>
