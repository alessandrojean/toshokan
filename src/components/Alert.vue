<template>
  <transition
    leave-active-class="transition duration-100 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
  >
    <div
      v-if="show"
      :class="[
        backgroundColor,
        baseTextColor,
        'p-3 text-sm rounded-md flex space-x-3'
      ]"
    >
      <XCircleIcon v-if="type === 'error'" class="h-5 w-5 text-red-600 dark:text-red-300" aria-hidden="true" />
      <InformationCircleIcon v-else-if="type === 'info'" class="h-5 w-5 text-blue-500 dark:text-blue-300" aria-hidden="true" />
      <ExclamationIcon v-else class="h-5 w-5 text-yellow-400 dark:text-yellow-400" aria-hidden="true" />
      <div class="space-y-2">
        <p
          v-if="title && title.length > 0"
          :class="[titleTextColor, 'font-title font-semibold']"
        >
          {{ title }}
        </p>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
import { computed, toRefs } from 'vue'

import {
  ExclamationIcon,
  InformationCircleIcon,
  XCircleIcon
} from '@heroicons/vue/solid'

export default {
  name: 'Alert',

  components: {
    ExclamationIcon,
    InformationCircleIcon,
    XCircleIcon
  },

  props: {
    show: Boolean,
    title: String,
    type: {
      type: String,
      required: true,
      validator: value => {
        return ['info', 'error', 'warning'].indexOf(value) !== -1
      }
    }
  },

  setup (props) {
    const { type } = toRefs(props)

    const backgroundColor = computed(() => {
      if (type.value === 'error') {
        return 'bg-red-50 dark:bg-red-600'
      } else if (type.value === 'info') {
        return 'bg-blue-50 dark:bg-blue-600'
      } else {
        return 'bg-yellow-50 dark:bg-yellow-600'
      }
    })

    const baseTextColor = computed(() => {
      if (type.value === 'error') {
        return 'text-red-700 dark:text-red-50'
      } else if (type.value === 'info') {
        return 'text-blue-700 dark:text-blue-50'
      } else {
        return 'text-yellow-700 dark:text-yellow-50'
      }
    })

    const titleTextColor = computed(() => {
      if (type.value === 'error') {
        return 'text-red-800 dark:text-red-50'
      } else if (type.value === 'info') {
        return 'text-blue-800 dark:text-blue-50'
      } else {
        return 'text-yellow-800 dark:text-yellow-50'
      }
    })

    return {
      backgroundColor,
      baseTextColor,
      titleTextColor
    }
  }
}
</script>
