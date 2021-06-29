<template>
  <div class="md:max-w-2xl mx-auto md:py-6 md:px-8">
    <div class="md:mt-6 md:rounded-md shadow-md py-5 px-4 sm:px-7 md:px-5 bg-white dark:bg-gray-800">
      <label for="search" class="sr-only">Buscar por</label>
      <div class="flex w-full rounded-md shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 -space-x-1">
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon class="w-5 h-5 text-gray-500 dark:text-gray-300 sm:text-sm" aria-hidden="true" />
          </div>
          <input
            ref="searchInput"
            type="text"
            name="search"
            id="search"
            placeholder="O quê você deseja buscar?"
            v-model="searchQuery"
            class="input text-lg pl-10"
          >
        </div>
      </div>
    </div>

    <ul
      class="md:mt-6 md:rounded-md shadow-md divide-y bg-white dark:bg-gray-700 dark:divide-gray-600 darkdark:bg-gray-800"
      v-if="searchResults.length > 0"
    >
      <li
        v-for="result in searchResults"
        :key="result.item.id"
        class="result"
      >
        <router-link
          :to="{ name: 'BookDetails', params: { bookId: result.item.id } }"
          class="group p-5 flex items-center hover:bg-gray-50 dark:hover:bg-gray-600 has-ring-focus"
        >
          <div class="mr-4 w-12">
            <img :src="result.item.coverUrl" class="w-12 h-12 object-cover rounded">
          </div>
          <div class="flex-1 flex flex-col">
            <span class="text-sm font-medium dark:text-gray-100">
              {{ result.item.titleParts[0] }}
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              Volume {{ result.item.titleParts[1] ? '#' + result.item.titleParts[1] : 'único' }}
            </span>
          </div>
          <ChevronRightIcon class="w-6 h-6 text-gray-400 group-hover:text-indigo-600 dark:text-gray-400 dark:group-hover:text-gray-200" aria-hidden="true" />
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

import useDebouncedRef from '@/composables/useDebouncedRef'

import {
  ChevronRightIcon,
  SearchIcon
} from '@heroicons/vue/solid'

export default {
  name: 'DashboardSearch',

  components: {
    ChevronRightIcon,
    SearchIcon
  },

  setup () {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const searchInput = ref(null)

    const loading = computed(() => store.state.sheet.loading)

    const query = route.query.q || store.state.collection.search.query

    const searchQuery = useDebouncedRef(query, 400)

    const searchResults = computed(() => store.state.collection.search.results)

    onMounted(() => {
      if (route.query.q && !loading.value) {
        store.dispatch('collection/search', { query: searchQuery.value })
      }

      nextTick(() => {
        searchInput.value.focus()
      })
    })

    watch(searchQuery, newQuery => {
      store.dispatch('collection/search', { query: newQuery })
    })

    onMounted(() => {
      if (loading.value) {
        router.replace({ name: 'DashboardHome' })
      }
    })

    return {
      searchInput,
      searchQuery,
      searchResults
    }
  }
}
</script>

<style scoped>
.result:first-child > a {
  @apply rounded-t;
}

.result:last-child > a {
  @apply rounded-b;
}
</style>
