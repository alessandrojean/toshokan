<script setup>
import FadeTransition from './transitions/FadeTransition.vue'
import LoadingSpinIcon from '@/components/icons/LoadingSpinIcon.vue'

defineProps({
  animation: {
    type: String,
    default: 'spin'
  },
  blur: {
    type: Boolean,
    default: true
  },
  loading: Boolean,
  position: {
    type: String,
    default: 'absolute'
  },
  small: Boolean,
  zIndex: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <FadeTransition>
    <div
      aria-hidden="true"
      :class="[
        position,
        zIndex,
        'flex justify-center items-center inset-0 bg-white/75 dark:bg-gray-900/75',
        blur ? 'backdrop-blur-sm' : ''
      ]"
      v-if="loading"
    >
      <LoadingSpinIcon
        :class="[
          `motion-safe:animate-${animation}`,
          small ? 'h-8 w-8' : 'h-10 w-18',
          'mx-auto text-primary-500'
        ]"
      />
    </div>
  </FadeTransition>
</template>
