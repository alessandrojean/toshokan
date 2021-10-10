<template>
  <h1 class="content-title">
    <slot></slot>
  </h1>
</template>

<style lang="postcss" scoped>
.content-title {
  @apply pb-16 text-center font-display font-bold leading-6 text-3xl text-gray-800 dark:text-gray-100;
}
</style>
