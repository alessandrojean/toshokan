<template>
  <div>
    <template v-if="loading">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5">
        <BookCard
          v-for="tempBook in skeletonItems"
          :key="tempBook"
          :loading="loading"
        />
      </div>
    </template>
    <template v-else>
      <div class="bg-white dark:bg-gray-800 px-4 py-4 md:py-3 sm:px-6 shadow rounded-lg mb-6 flex flex-col md:flex-row md:justify-between items-center">
        <div>
          <p class="text-sm text-gray-700 dark:text-gray-400 mb-4 md:mb-0">
            Mostrando página
            <span class="font-medium dark:text-gray-200"> {{ paginationInfo.current_page }} </span>
            de
            <span class="font-medium dark:text-gray-200"> {{ paginationInfo.total_pages }} </span>
            de
            <span class="font-medium dark:text-gray-200"> {{ paginationInfo.total_results }} </span>
            resultados
          </p>
        </div>

        <Paginator
          v-if="paginationInfo.total_pages > 1"
          :pagination-info="paginationInfo"
          @page="handlePage"
        />
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5">
        <BookCard
          v-for="book in items"
          :key="book.id"
          :book="book"
          :loading="loading"
        />
      </div>
      <div class="mt-6 bg-white dark:bg-gray-800 px-4 py-4 md:py-3 sm:px-6 shadow rounded-lg mb-6 flex flex-col md:flex-row md:justify-between items-center">
        <div>
          <p class="text-sm text-gray-700 dark:text-gray-400 mb-4 md:mb-0">
            Mostrando página
            <span class="font-medium dark:text-gray-200"> {{ paginationInfo.current_page }} </span>
            de
            <span class="font-medium dark:text-gray-200"> {{ paginationInfo.total_pages }} </span>
            de
            <span class="font-medium dark:text-gray-200"> {{ paginationInfo.total_results }} </span>
            resultados
          </p>
        </div>

        <Paginator
          v-if="paginationInfo.total_pages > 1"
          :pagination-info="paginationInfo"
          @page="handlePage"
        />
      </div>
    </template>
  </div>
</template>

<script>
import BookCard from './BookCard.vue'
import Paginator from './Paginator.vue'

export default {
  name: 'GridBooks',

  components: {
    BookCard,
    Paginator
  },

  props: {
    items: Array,
    loading: Boolean,
    paginationInfo: Object,
    skeletonItems: Number
  },

  methods: {
    handlePage: function (page) {
      this.$emit('page', page)
    }
  }
}
</script>

<style>

</style>
