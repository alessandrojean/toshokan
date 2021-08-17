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
        'flex justify-center items-center inset-0 bg-opacity-75 bg-white dark:bg-gray-900 dark:bg-opacity-75'
      ]"
      v-if="loading"
    >
      <slot
        name="icon"
        :css-class="[
          `motion-safe:animate-${animation}`,
          'h-10 w-10 mx-auto text-primary-500'
        ]"
      />
    </div>
  </transition>
</template>

<script>
export default {
  name: 'LoadingIndicator',

  props: {
    animation: {
      type: String,
      default: 'pulse'
    },
    loading: Boolean,
    position: {
      type: String,
      default: 'absolute'
    }
  }
}
</script>

<style>

</style>
