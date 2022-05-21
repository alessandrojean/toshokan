<script setup>
defineProps({
  mode: {
    type: String,
    default: 'out-in'
  },
  simultaneous: Boolean
})
</script>

<template>
  <transition
    :mode="!simultaneous ? mode : null"
    leave-active-class="transition motion-reduce:transition-none motion-reduce:transform-none duration-200 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
    enter-active-class="transition motion-reduce:transition-none motion-reduce:transform-none duration-200 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
  >
    <slot></slot>
  </transition>
</template>
