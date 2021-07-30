<template>
  <div class="md:max-w-2xl mx-auto md:py-6 md:px-8">
    <form
      class="md:mt-6 md:rounded-md shadow-md py-5 px-4 sm:px-7 md:px-5 bg-white dark:bg-gray-800"
      @submit.prevent="handleSubmit"
    >
      <label for="search" class="sr-only">
        {{ t('dashboard.search.label') }}
      </label>
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
            :placeholder="t('dashboard.search.placeholder')"
            v-model="searchQuery"
            class="input text-lg pl-10"
          >
        </div>
      </div>
    </form>

    <ul
      class="md:mt-6 md:rounded-md shadow-md border-t md:border-t-0 border-gray-200 dark:border-gray-700 divide-y bg-white dark:bg-gray-800 dark:divide-gray-700 darkdark:bg-gray-800"
      v-if="searchResults.length > 0"
    >
      <li
        v-for="result in searchResults"
        :key="result.item.id"
        class="result"
      >
        <SearchItem :result="result" />
      </li>
    </ul>
  </div>
</template>

<script>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import useDebouncedRef from '@/composables/useDebouncedRef'

import { SearchIcon } from '@heroicons/vue/solid'

import SearchItem from '@/components/SearchItem'

export default {
  name: 'DashboardSearch',

  components: {
    SearchIcon,
    SearchItem
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

    function search (query) {
      store.dispatch('collection/search', { query: query || searchQuery.value })
    }

    function handleSubmit (event) {
      event.preventDefault()
      search()
    }

    watch(searchQuery, newQuery => search(newQuery))

    onMounted(() => {
      if (loading.value) {
        router.replace({ name: 'DashboardHome' })
      }
    })

    const { t } = useI18n()

    return {
      searchInput,
      searchQuery,
      searchResults,
      handleSubmit,
      t
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
