<template>
  <div class="select-none rounded-lg border border-gray-300 dark:border-0 dark:bg-gray-800 divide-y divide-gray-300 dark:divide-gray-700 flex flex-col">
    <div
      v-for="(step, i) in filteredSteps"
      :key="i"
      :class="[
        'group px-4 py-3 flex items-center space-x-4 motion-safe:transition-colors',
        modelValue === i + 1 ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
      ]"
    >
      <span
        :class="[
          'text-xs font-semibold leading-none flex items-center justify-center w-8 h-8 border-2 border-gray-300 dark:border-gray-600 rounded-full motion-safe:transition-colors',
          modelValue === i + 1 ? 'border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400' : '',
          modelValue > i + 1 ? 'bg-primary-600 dark:bg-primary-500 border-primary-600 dark:border-primary-500' : ''
        ]"
        aria-hidden="true"
      >
        <CheckIcon v-if="modelValue > i + 1" class="w-5 h-5 text-white" />
        <template v-else>{{ `0${i + 1}` }}</template>
      </span>
      <span
        :class="[
          'font-medium text-sm motion-safe:transition-colors',
          modelValue > i + 1 ? 'text-gray-800 dark:text-gray-200' : ''
        ]"
      >
        {{ step.title }}
      </span>
    </div>
  </div>
</template>

<script>
import { computed, toRefs } from 'vue'

import { CheckIcon } from '@heroicons/vue/solid'

export default {
  components: {
    CheckIcon
  },

  props: {
    modelValue: {
      type: Number,
      required: true
    },
    steps: {
      type: Array,
      required: true
    }
  },

  setup (props) {
    const { steps } = toRefs(props)

    const filteredSteps = computed(() => {
      return steps.value.filter(st => st.visible === undefined || st.visible)
    })

    return { filteredSteps }
  }
}
</script>
