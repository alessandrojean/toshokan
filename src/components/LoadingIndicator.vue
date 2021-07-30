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
        'flex justify-center items-center left-0 top-0 w-full h-full bg-opacity-75 bg-white dark:bg-gray-800'
      ]"
      v-if="loading"
    >
      <slot
        name="icon"
        :css-class="[
          `motion-safe:animate-${animation}`,
          'h-10 w-10 mx-auto text-indigo-500'
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
