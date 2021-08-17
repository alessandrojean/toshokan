<template>
  <section class="content-body">
    <slot></slot>
  </section>
</template>

<style>
.content-body {
  @apply space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed;
}

.content-body h2 {
  @apply font-title leading-5 font-semibold text-2xl text-gray-800 dark:text-gray-100;
}

.content-body h3 {
  @apply font-title leading-4 font-semibold text-xl text-gray-800 dark:text-gray-100;
}

.content-body strong {
  @apply text-gray-800 dark:text-gray-100;
}

.content-body  a {
  @apply text-primary-500 dark:text-primary-400 font-semibold hover:underline rounded transition-shadow motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 dark:focus-visible:ring-offset-gray-900;
}

.content-body ol {
  @apply list-decimal list-inside space-y-2;
}

.content-body ul {
  @apply list-disc list-outside space-y-2 ml-5;
}

.content-body ul > li {
  @apply pl-2;
}

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

.content-body ol + h2,
.content-body p + h2 {
  @apply pt-6;
}

.content-body ol + h3,
.content-body p + h3,
.content-body figure + h3 {
  @apply pt-6;
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

.content-body figure legend {
  @apply mt-5 text-sm text-gray-500 dark:text-gray-400;
}

.content-body kbd {
  @apply inline-flex rounded-md py-0.5 px-2 text-xs dark:text-white dark:bg-gray-700;
}

.content-body table {
  @apply py-4 dark:text-gray-400 text-sm min-w-full text-left border-b dark:border-gray-700;
}

.content-body table > thead {
  @apply border-b dark:border-gray-700;
}

.content-body table > tbody {
  @apply divide-y dark:divide-gray-700;
}

.content-body table > thead th {
  @apply text-white font-medium whitespace-nowrap;
}

.content-body table td,
.content-body table th {
  @apply py-2;
}
</style>
