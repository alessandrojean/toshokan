<script setup>
import { computed, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  },
  steps: {
    type: Array,
    required: true
  }
})

const { t } = useI18n({ useScope: 'global' })
const { modelValue: step, steps } = toRefs(props)

const stepText = computed(() => {
  const currentStep = step.value
  const totalSteps = steps.value.length

  return t('dashboard.newBook.step', [currentStep, totalSteps])
})
</script>

<template>
  <div
    class="flex items-center space-x-3"
    role="progressbar"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="Math.ceil(((modelValue - 1) / steps.length) * 100)"
    :aria-valuetext="`${stepText}: ${steps[modelValue - 1]}`"
  >
    <span
      v-for="(_, i) in steps"
      :key="i"
      :class="[
        'ring-4 w-2.5 h-2.5 rounded-lg',
        modelValue < i + 1 ? 'bg-primary-400' : '',
        modelValue > i + 1 ? 'bg-primary-100' : '',
        modelValue === i + 1
          ? 'bg-white ring-primary-400'
          : 'ring-primary-600 dark:ring-primary-500'
      ]"
      aria-hidden="true"
    />
    <span class="sr-only"> {{ stepText }}: {{ steps[modelValue - 1] }} </span>
  </div>
</template>
