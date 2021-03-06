<template>
  <transition
    leave-active-class="transition motion-reduce:transition-none duration-100 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    enter-active-class="transition motion-reduce:transition-none duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
  >
    <div
      v-if="show"
      role="alert"
      :class="[
        'alert-' + type,
        backgroundColor,
        baseTextColor,
        'dark:text-gray-100 p-3 text-sm rounded-md flex space-x-3'
      ]"
    >
      <XCircleIcon v-if="type === 'error'" class="h-5 w-5 text-red-600 dark:text-red-500" aria-hidden="true" />
      <InformationCircleIcon v-else-if="type === 'info'" class="h-5 w-5 text-blue-500 dark:text-blue-500" aria-hidden="true" />
      <ExclamationIcon v-else class="h-5 w-5 text-yellow-400 dark:text-yellow-500" aria-hidden="true" />
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
        return 'text-red-800 dark:text-red-500'
      } else if (type.value === 'info') {
        return 'text-blue-800 dark:text-blue-500'
      } else {
        return 'text-yellow-800 dark:text-yellow-500'
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

<style scoped>
@media (prefers-color-scheme: dark) {
  .alert-error {
    background: linear-gradient(to right, rgba(239, 68, 68, 0.25), rgba(55, 65, 81, 0.6) 25%);
  }

  .alert-info {
    background: linear-gradient(to right, rgba(59, 130, 246, 0.25), rgba(55, 65, 81, 0.6) 25%);
  }

  .alert-warning {
    background: linear-gradient(to right, rgba(245, 158, 11, 0.25), rgba(55, 65, 81, 0.6) 25%);
  }
}
</style>
