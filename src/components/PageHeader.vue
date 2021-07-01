<template>
  <header class="h-16">
    <div class="max-w-prose mx-auto flex items-center h-full">
      <router-link
        :to="{ name: 'Home' }"
        class="flex items-center rounded-md transition-shadow motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-offset-gray-900"
      >
        <span aria-hidden="true">
          <LibraryIcon class="h-9 w-9 text-indigo-500" />
        </span>
        <span class="sr-only">Início</span>
        <span class="text-gray-800 dark:text-gray-200 font-title font-semibold text-xl ml-3" aria-hidden="true">
          Toshokan
        </span>
      </router-link>
    </div>
  </header>
</template>

<script>
import { LibraryIcon } from '@heroicons/vue/solid'

export default {
  components: { LibraryIcon }
}
</script>
