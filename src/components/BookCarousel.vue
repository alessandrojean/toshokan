<template>
  <div v-if="sheetLoading || loading">
    <div class="motion-safe:animate-pulse h-6 bg-gray-400 dark:bg-gray-600 rounded w-48 mt-8 mb-3"></div>

    <div class="-mx-5 md:mx-0 px-5 md:px-0 overflow-x-auto md:overflow-x-visible flex md:grid md:grid-cols-5 lg:grid-cols-6 gap-5">
      <div
        v-for="idx in 6"
        :key="idx"
        class="flex-shrink-0 w-2/5 sm:w-3/12 md:w-auto"
      >
        <BookCard
          :loading="true"
          :class="idx === collectionItems.length - 1 ? 'md:hidden lg:block' : ''"
        />
      </div>
    </div>
  </div>

  <section v-else-if="collectionItems.length > 0" aria-labelledby="last-added-title">
    <div class="flex justify-between items-center w-full mt-8 mb-2">
      <h2 id="last-added-title" class="font-medium font-display text-lg dark:text-gray-200">
        {{ title }}
      </h2>

      <router-link
        v-if="buttonText && buttonLink"
        class="button is-ghost -mr-3 hidden md:flex"
        :to="buttonLink"
      >
        {{ buttonText }}
        <span aria-hidden="true">
          <ArrowSmRightIcon class="is-right" />
        </span>
      </router-link>
    </div>

    <ul
      :class="[
        collectionItems.length < 3 ? 'grid grid-cols-2' : '-mx-5 md:mx-0 px-5 md:px-0 overflow-x-auto md:overflow-x-visible flex',
        'md:grid md:grid-cols-5 lg:grid-cols-6 gap-5'
      ]"
    >
      <li
        v-for="(book, bookIdx) in collectionItems"
        :key="book.id"
        :class="collectionItems.length > 2 ? 'flex-shrink-0 w-2/5 sm:w-3/12 md:w-auto' : ''"
      >
        <BookCard
          :book="book"
          :loading="loading"
          :class="bookIdx === collectionItems.length - 1 ? 'md:hidden lg:block' : ''"
        />
      </li>
    </ul>
  </section>
</template>

<script>
import { computed, onMounted, toRefs, watch } from 'vue'
import { useStore } from 'vuex'

import { ArrowSmRightIcon } from '@heroicons/vue/solid'

import BookCard from '@/components/BookCard.vue'

export default {
  name: 'LastAddedBooks',

  components: { BookCard, ArrowSmRightIcon },

  props: {
    collection: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    buttonText: {
      type: String
    },
    buttonLink: {
      type: Object
    }
  },

  setup (props) {
    const { collection } = toRefs(props)
    const store = useStore()

    const sheetLoading = computed(() => store.state.sheet.loading)
    const sheetId = computed(() => store.state.sheet.sheetId)

    const loading = computed(() => {
      return store.state.collection[collection.value].loading
    })
    const collectionItems = computed(() => {
      return store.state.collection[collection.value].items
    })

    function fetchCollectionItems () {
      const method = collection.value.substring(0, 1).toUpperCase() +
        collection.value.substring(1)
      store.dispatch(`collection/fetch${method}`)
    }

    onMounted(() => {
      if (sheetId.value && collectionItems.value.length === 0) {
        fetchCollectionItems()
      }
    })

    watch(sheetId, newSheetId => {
      if (newSheetId && collectionItems.value.length === 0) {
        fetchCollectionItems()
      }
    })

    return {
      sheetLoading,
      loading,
      collectionItems
    }
  }
}
</script>
