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
      :data-type="type"
      :class="[
        backgroundColor,
        baseTextColor,
        borderColor,
        'dark:bg-gray-700 border-l-4 dark:border-l-0 dark:rounded-md dark:text-gray-100 px-3 py-5 text-sm flex space-x-3'
      ]"
    >
      <div class="shrink-0">
        <XCircleIcon v-if="type === 'error'" class="h-5 w-5 text-red-500 dark:text-red-400" aria-hidden="true" />
        <InformationCircleIcon v-else-if="type === 'info'" class="h-5 w-5 text-blue-500 dark:text-blue-400" aria-hidden="true" />
        <ExclamationIcon v-else class="h-5 w-5 text-amber-400 dark:text-amber-500" aria-hidden="true" />
      </div>
      <div class="space-y-2 dark:text-gray-200">
        <p
          v-if="title && title.length > 0"
          :class="[titleTextColor, 'font-display font-medium dark:text-gray-100']"
        >
          {{ title }}
        </p>
        <slot></slot>
        <div
          v-if="$slots.actions"
          class="flex pt-3 space-x-3 alert-actions -ml-2.5"
        >
          <slot name="actions"></slot>
        </div>
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
        return 'bg-amber-50'
      }
    })

    const baseTextColor = computed(() => {
      if (type.value === 'error') {
        return 'text-red-700'
      } else if (type.value === 'info') {
        return 'text-blue-700'
      } else {
        return 'text-amber-900'
      }
    })

    const titleTextColor = computed(() => {
      if (type.value === 'error') {
        return 'text-red-800'
      } else if (type.value === 'info') {
        return 'text-blue-800'
      } else {
        return 'text-amber-800'
      }
    })

    const borderColor = computed(() => {
      if (type.value === 'error') {
        return 'border-red-500'
      } else if (type.value === 'info') {
        return 'border-blue-500'
      } else {
        return 'border-amber-400'
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

<style lang="postcss">
.alert-actions > a,
.alert-actions > button {
  @apply font-semibold rounded-md px-2.5 py-1.5
    motion-safe:transition-shadow;
}

.alert-actions a:hover,
.alert-actions a:focus-visible,
.alert-actions button:hover,
.alert-actions button:focus-visible {
  @apply underline;
}

.alert-actions a:focus,
.alert-actions button:focus {
  @apply outline-none;
}

.alert-actions a:focus-visible,
.alert-actions button:focus-visible {
  @apply ring-2 ring-current;
}
</style>
