<template>
  <section class="content-body prose dark:prose-invert max-w-none">
    <slot></slot>
  </section>
</template>

<style lang="postcss">
.content-body dl {
  @apply space-y-2;
}

.content-body dl > dt {
  @apply font-semibold text-gray-800 dark:text-gray-100;
}

.content-body dl > dd {
  @apply ml-6;
}

.content-body dl > dd + dt {
  @apply pt-2;
}

.content-body kbd {
  @apply inline-flex rounded-md py-0.5 px-2 text-xs dark:text-white dark:bg-gray-700;
}
</style>
