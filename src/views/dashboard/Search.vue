<template>
  <div class="md:max-w-2xl mx-auto py-5 md:py-10 px-4 md:px-8 space-y-5 md:space-y-10">
    <form @submit.prevent="handleSubmit" class="md:py-3">
      <label for="search" class="sr-only">
        {{ t('dashboard.search.label') }}
      </label>
      <div class="flex w-full rounded-md shadow-sm focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 -space-x-1">
        <div class="group relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
            <SearchIcon class="w-5 h-5 text-gray-500 dark:group-focus-within:text-gray-300 sm:text-sm" aria-hidden="true" />
          </div>
          <input
            ref="searchInput"
            type="text"
            name="search"
            id="search"
            :placeholder="t('dashboard.search.placeholder')"
            v-model="searchQuery"
            class="input text-lg pl-10 md:pr-16"
            :disabled="searchLoading"
          >
          <p class="hidden md:group-focus-within:flex absolute right-3 inset-y-0 justify-center items-center" aria-hidden="true">
            <span class="font-medium text-gray-400 dark:text-gray-300 text-xs leading-5 px-1.5 border border-gray-300 dark:border-gray-500 rounded-md">
              <span class="sr-only">{{ t('dashboard.newBook.autoFill.press') }} </span>
              <kbd class="font-sans">{{ t('dashboard.newBook.autoFill.enter') }}</kbd>
              <span class="sr-only"> {{ t('dashboard.newBook.autoFill.toSearch') }}</span>
            </span>
          </p>
        </div>
      </div>
    </form>

    <transition
      mode="out-in"
      leave-active-class="transition motion-reduce:transition-none duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      enter-active-class="transition motion-reduce:transition-none duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
    >
      <div
        v-if="searchLoading"
        class="w-full flex items-start justify-center pt-5"
      >
        <SearchIcon class="w-10 h-10 text-primary-600 dark:text-gray-400 motion-safe:animate-pulse" />
      </div>

      <ul
        class="rounded-md shadow-md divide-y bg-white dark:bg-gray-800 dark:divide-gray-700 darkdark:bg-gray-800 focus:outline-none"
        v-else-if="searchResults.length > 0"
        tabindex="-1"
        ref="results"
      >
        <li
          v-for="result in searchResults"
          :key="result.id"
          class="result"
        >
          <SearchItem :result="result" />
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
import { computed, nextTick, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

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
    const results = ref(null)

    const loading = computed(() => store.state.sheet.loading)

    const query = route.query.q || store.state.collection.search.query

    const searchQuery = ref(query)
    const searchLoading = computed(() => store.state.collection.search.loading)
    const searchResults = computed(() => store.state.collection.search.results)

    onMounted(async () => {
      if (route.query.q) {
        await search(searchQuery.value)

        nextTick(() => {
          if (results.value) {
            results.value.focus()
          }
        })

        return
      }

      nextTick(() => {
        if (searchInput.value) {
          searchInput.value.focus()
        }
      })
    })

    async function search (query) {
      const searchTerm = query || searchQuery.value

      if (!loading.value && !searchLoading.value && searchTerm.length > 0) {
        await store.dispatch('collection/search', { query: searchTerm })

        if (searchResults.value.length > 0) {
          results.value.focus()
        }
      }
    }

    async function handleSubmit (event) {
      event.preventDefault()
      await search()
    }

    onMounted(() => {
      if (loading.value) {
        router.replace({ name: 'DashboardHome' })
      }
    })

    const { t } = useI18n()

    return {
      searchInput,
      searchQuery,
      searchLoading,
      searchResults,
      handleSubmit,
      results,
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
