<template>
  <main class="content" id="main-content">
    <slot></slot>
  </main>
</template>

<style lang="postcss" scoped>
.content {
  @apply max-w-prose mx-auto py-16 px-6 lg:px-0;
}
</style>
