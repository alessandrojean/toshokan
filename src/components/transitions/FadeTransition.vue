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
    leave-active-class="transition motion-reduce:transition-none duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    enter-active-class="transition motion-reduce:transition-none duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
  >
    <slot></slot>
  </transition>
</template>
