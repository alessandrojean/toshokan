<template>
  <div v-if="loading">
    <div class="motion-safe:animate-pulse h-6 bg-gray-400 dark:bg-gray-600 rounded w-48 mt-8 mb-3"></div>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5">
      <BookCard
        v-for="idx in 6"
        :key="idx"
        :loading="loading"
        :class="idx === lastAdded.length - 1 ? 'md:hidden lg:block' : ''"
      />
    </div>
  </div>

  <section v-else-if="lastAdded.length > 0" aria-labelledby="last-added-title">
    <h2 id="last-added-title" class="font-medium font-title text-xl mt-8 mb-3 dark:text-gray-200">
      Últimos adicionados
    </h2>

    <ul
      :class="[
        lastAdded.length < 3 ? 'grid grid-cols-2' : '-mx-5 md:mx-0 px-5 md:px-0 overflow-x-auto md:overflow-x-hidden flex',
        'md:grid md:grid-cols-5 lg:grid-cols-6 gap-5'
      ]"
    >
      <li
        v-for="(book, bookIdx) in lastAdded"
        :key="book.id"
        :class="lastAdded.length > 2 ? 'flex-shrink-0 w-2/5 sm:w-3/12 md:w-auto' : ''"
      >
        <BookCard
          :book="book"
          :loading="loading"
          :class="bookIdx === lastAdded.length - 1 ? 'md:hidden lg:block' : ''"
        />
      </li>
    </ul>
  </section>
</template>

<script>
import BookCard from '@/components/BookCard'

export default {
  name: 'LastAddedBooks',

  components: { BookCard },

  props: {
    lastAdded: {
      type: Array,
      required: true
    },
    loading: Boolean
  }
}
</script>
