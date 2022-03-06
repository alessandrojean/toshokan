<template>
  <main class="content" id="main-content">
    <slot></slot>
  </main>
</template>

<style lang="postcss" scoped>
.content {
  @apply max-w-prose lg:min-w-[65ch] mx-auto pb-8 px-6 lg:px-0;
}
</style>
