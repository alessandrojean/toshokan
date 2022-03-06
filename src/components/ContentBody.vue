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
  @apply inline-flex rounded-md py-0.5 px-2 text-xs select-none
    font-sans supports-var-font:font-sans-var
    bg-gray-200/80 dark:bg-gray-700 dark:text-white
    border-b-2 border-gray-300 dark:border-gray-600;
}

.content-body :where(h1, h2, h3, h4, h5, h6) {
  @apply scroll-mt-24;
}

.content-body .table-of-contents {
  @apply sr-only;
}
</style>
