<template>
  <div
    :class="[
      loading || !bookFound ? 'motion-safe:animate-pulse' : '',
      'book-image hidden md:block bg-white dark:bg-gray-700 shadow overflow-hidden sm:rounded-lg'
    ]"
    role="img"
    aria-label="Imagem de capa do livro"
  >
    <div class="aspect-w-2 aspect-h-3">
      <transition
        mode="out-in"
        leave-active-class="transition motion-reduce:transition-none duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        enter-active-class="transition motion-reduce:transition-none duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
      >
        <div v-if="loading || !bookFound || imageLoading || imageHasError" class="w-full h-full flex justify-center items-center">
          <PhotographIcon
            :class="[
              imageLoading ? 'motion-safe:animate-pulse' : '',
              'w-10 h-10 text-gray-400 dark:text-gray-500'
            ]"
            aria-hidden="true"
          />
        </div>
        <img v-else class="w-full h-full object-cover" :src="book.coverUrl" alt="">
      </transition>
    </div>
  </div>
</template>

<script>
import { PhotographIcon } from '@heroicons/vue/solid'

export default {
  name: 'BookImage',

  components: { PhotographIcon },

  props: {
    book: Object,
    bookFound: Boolean,
    imageHasError: Boolean,
    imageLoading: Boolean,
    loading: Boolean
  }
}
</script>

<style lang="postcss" scoped>
.book-image {
  height: fit-content;
}
</style>
