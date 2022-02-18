<template>
  <div v-if="sheetLoading || loading">
    <div class="motion-safe:animate-pulse h-6 bg-gray-400 dark:bg-gray-600 rounded w-48 mt-8 mb-3"></div>

    <div class="-mx-5 md:mx-0 px-5 md:px-0 overflow-x-auto md:overflow-x-visible flex md:grid md:grid-cols-5 lg:grid-cols-6 gap-5">
      <div
        v-for="idx in 6"
        :key="idx"
        :class="idx === 5 ? 'md:hidden lg:block' : ''"
        class="shrink-0 w-2/5 sm:w-3/12 md:w-auto"
      >
        <BookCard loading />
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
        class="button is-ghost -mr-3 hidden md:flex group"
        :to="buttonLink"
      >
        {{ buttonText }}
        <span aria-hidden="true">
          <ArrowSmRightIcon class="is-right motion-safe:transition-transform group-hover:translate-x-1" />
        </span>
      </router-link>
    </div>

    <ul
      :class="[
        collectionItems.length < 3
          ? 'grid grid-cols-2'
          : '-mx-5 md:mx-0 px-5 md:px-0 overflow-x-auto md:overflow-x-visible snap-x md:snap-none flex md:grid',
        'md:grid-cols-5 lg:grid-cols-6 gap-5'
      ]"
      ref="carousel"
    >
      <li
        v-for="(book, bookIdx) in collectionItems"
        :key="book.id"
        :class="[
          collectionItems.length > 2 ? 'shrink-0 w-2/5 sm:w-3/12 md:w-auto snap-start md:snap-none scroll-ml-5 md:scroll-ml-0' : '',
          bookIdx === 5 ? 'md:hidden lg:block' : ''
        ]"
      >
        <BookCard
          :book="book"
          :loading="loading"
          :tabindex="focused === bookIdx ? '0' : '-1'"
          @keydown="handleKeydown"
        />
      </li>
    </ul>
  </section>
</template>

<script>
import { computed, onMounted, ref, toRefs, watch } from 'vue'

import { useSheetStore } from '@/stores/sheet'

import { ArrowSmRightIcon } from '@heroicons/vue/solid'

import BookCard from '@/components/book/BookCard.vue'
import { useCollectionStore } from '@/stores/collection'

export default {
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
    const collectionStore = useCollectionStore()
    const sheetStore = useSheetStore()

    const sheetLoading = computed(() => sheetStore.loading)
    const sheetId = computed(() => sheetStore.sheetId)

    const loading = computed(() => {
      return collectionStore.carousels[collection.value].loading
    })
    const collectionItems = computed(() => {
      return collectionStore.carousels[collection.value].items
    })

    async function fetchCollectionItems () {
      focused.value = 0

      const method = collection.value.substring(0, 1).toUpperCase() +
        collection.value.substring(1)
      await collectionStore['fetch' + method]?.()
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

    const carousel = ref(null)
    const focused = ref(0)

    /**
     * @param {KeyboardEvent} event
     */
    function handleKeydown (event) {
      const allowedKeys = ['ArrowRight', 'ArrowLeft', 'Home', 'End']
      const { key } = event

      if (key === 'Tab') {
        setTimeout(() => { focused.value = 0 })
        return
      }

      if (!allowedKeys.includes(key)) {
        return
      }

      // https://stackoverflow.com/a/21696585
      const visibleItems = Array.from(carousel.value.children)
        .filter(el => el.offsetParent !== null)
      const totalItems = visibleItems.length

      if (key === 'Home' && focused.value === 0) {
        return
      }

      if (key === 'End' && focused.value === totalItems - 1) {
        return
      }

      event.preventDefault()

      if (key === 'ArrowRight') {
        focused.value = Math.min(focused.value + 1, totalItems - 1)
      } else if (key === 'ArrowLeft') {
        focused.value = Math.max(focused.value - 1, 0)
      } else if (key === 'Home') {
        focused.value = 0
      } else if (key === 'End') {
        focused.value = totalItems - 1
      }

      const li = carousel.value?.children?.[focused.value]
      const card = li?.children?.[0]

      card?.focus()
    }

    return {
      sheetLoading,
      loading,
      collectionItems,
      carousel,
      focused,
      handleKeydown
    }
  }
}
</script>
