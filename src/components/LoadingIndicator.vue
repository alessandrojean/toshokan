<script lang="ts" setup>
export interface LoadingIndicatorProps {
  blur?: boolean
  loading?: boolean
  position?: 'absolute' | 'fixed'
  small?: boolean
  zIndex?: string
}

withDefaults(defineProps<LoadingIndicatorProps>(), {
  blur: true,
  position: 'absolute',
  small: false,
  zIndex: '',
})
</script>

<template>
  <FadeTransition>
    <div
      v-if="loading"
      aria-hidden="true"
      :class="[
        position,
        zIndex,
        'flex justify-center items-center inset-0 bg-white/75 dark:bg-gray-900/75',
        blur ? 'backdrop-blur-sm' : '',
      ]"
    >
      <LoadingSpinIcon
        :class="[
          `motion-safe:animate-spin`,
          small ? 'h-8 w-8' : 'h-10 w-18',
          'mx-auto text-primary-500',
        ]"
      />
    </div>
  </FadeTransition>
</template>
