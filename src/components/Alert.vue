<template>
  <transition
    leave-active-class="motion-safe:transition duration-100 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    enter-active-class="motion-safe:transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
  >
    <div
      v-if="show"
      role="alert"
      :class="[
        backgroundColor,
        baseTextColor,
        borderColor,
        'dark:bg-gray-700 border-l-4 dark:border-l-0 dark:rounded-md dark:text-gray-100 p-3 text-sm flex space-x-3'
      ]"
    >
      <XCircleIcon v-if="type === 'error'" class="h-5 w-5 text-red-500 dark:text-red-400" aria-hidden="true" />
      <InformationCircleIcon v-else-if="type === 'info'" class="h-5 w-5 text-blue-500 dark:text-blue-400" aria-hidden="true" />
      <ExclamationIcon v-else class="h-5 w-5 text-yellow-400 dark:text-yellow-500" aria-hidden="true" />
      <div class="space-y-2 dark:text-gray-200">
        <p
          v-if="title && title.length > 0"
          :class="[titleTextColor, 'font-display font-medium dark:text-gray-100']"
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
        return 'bg-red-50'
      } else if (type.value === 'info') {
        return 'bg-blue-50'
      } else {
        return 'bg-yellow-50'
      }
    })

    const baseTextColor = computed(() => {
      if (type.value === 'error') {
        return 'text-red-700'
      } else if (type.value === 'info') {
        return 'text-blue-700'
      } else {
        return 'text-yellow-700'
      }
    })

    const titleTextColor = computed(() => {
      if (type.value === 'error') {
        return 'text-red-800'
      } else if (type.value === 'info') {
        return 'text-blue-800'
      } else {
        return 'text-yellow-800'
      }
    })

    const borderColor = computed(() => {
      if (type.value === 'error') {
        return 'border-red-500'
      } else if (type.value === 'info') {
        return 'border-blue-500'
      } else {
        return 'border-yellow-400'
      }
    })

    return {
      backgroundColor,
      baseTextColor,
      titleTextColor,
      borderColor
    }
  }
}
</script>
