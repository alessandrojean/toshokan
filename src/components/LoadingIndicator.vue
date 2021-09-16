<template>
  <transition
    leave-active-class="transition motion-reduce:transition-none duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    enter-active-class="transition motion-reduce:transition-none duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
  >
    <div
      aria-hidden="true"
      :class="[
        position,
        'flex justify-center items-center inset-0 bg-opacity-75 bg-white dark:bg-gray-900 dark:bg-opacity-75',
        blur ? 'backdrop-filter backdrop-blur-sm' : ''
      ]"
      v-if="loading"
    >
      <LoadingSpinIcon
        :class="[
          `motion-safe:animate-${animation}`,
          'h-10 w-10 mx-auto text-primary-500'
        ]"
      />
    </div>
  </transition>
</template>

<script>
import LoadingSpinIcon from '@/components/icons/LoadingSpinIcon.vue'

export default {
  components: {
    LoadingSpinIcon
  },

  props: {
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
    }
  }
}
</script>
