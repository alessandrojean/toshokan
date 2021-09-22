<template>
  <section class="content-body prose dark:prose-dark max-w-none">
    <slot></slot>
  </section>
</template>

<style>
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

.content-body .command {
  @apply font-semibold text-gray-800 dark:text-gray-100;
}

.content-body figure {
  @apply max-w-full text-center py-4;
}

.content-body figure img {
  @apply mx-auto rounded-xl shadow-lg;
}

.content-body figure figcaption {
  @apply mt-5 dark:text-gray-400;
}

.content-body kbd {
  @apply inline-flex rounded-md py-0.5 px-2 text-xs dark:text-white dark:bg-gray-700;
}
</style>
