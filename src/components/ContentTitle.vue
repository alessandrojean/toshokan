<template>
  <h1 class="content-title">
    <slot></slot>
  </h1>
</template>

<style lang="postcss" scoped>
.content-title {
  @apply py-20 md:py-24 text-center font-display
    font-bold leading-7 text-3xl md:text-4xl
    text-gray-800 dark:text-gray-100;
}
</style>
