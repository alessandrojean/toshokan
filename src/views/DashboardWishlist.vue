<template>
  <div class="flex flex-col">
    <SimpleHeader title="Lista de desejos" />

    <div class="flex-1">
      <div class="h-full max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <!-- In progress -->
        <section
          aria-labelledby="in-progress-title"
          class="w-full max-w-lg mx-auto h-full flex items-center justify-center flex-col px-4"
        >
          <span aria-hidden="true">
            <PuzzleIcon class="h-16 w-16 mb-8 text-gray-400 dark:text-gray-600" />
          </span>
          <h2
            id="in-progress-title"
            class="text-xl text-center font-medium text-gray-600 dark:text-gray-400 mb-2"
          >
            Esta página ainda está em construção
          </h2>
          <p class="text-center text-gray-600 dark:text-gray-400 mb-8">
            Em breve você poderá gerenciar seus itens da lista de desejos.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { PuzzleIcon } from '@heroicons/vue/outline'

import SimpleHeader from '@/components/SimpleHeader'

export default {
  name: 'DashboardWishlist',

  components: {
    PuzzleIcon,
    SimpleHeader
  }
}
</script>

<style>

</style>
