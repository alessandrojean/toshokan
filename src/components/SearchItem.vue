<template>
  <router-link
    :to="{ name: 'BookDetails', params: { bookId: result.id } }"
    class="group py-4 flex items-center has-ring-focus rounded-md"
    ref="searchItem"
  >
    <div class="mr-4 w-12 lg:w-16">
      <transition
        mode="out-in"
        leave-active-class="transition motion-reduce:transition-none duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        enter-active-class="transition motion-reduce:transition-none duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
      >
        <div
          v-if="imageLoading || imageHasError || thumbnailUrl.length === 0"
          class="aspect-w-2 aspect-h-3"
          aria-hidden="true"
        >
          <div class="flex justify-center items-center w-full h-full bg-gray-100 dark:bg-gray-700 rounded-md shadow-md">
            <PhotographIcon
              :class="[
                imageLoading ? 'motion-safe:animate-pulse' : '',
                'w-7 h-7 text-gray-500 dark:text-gray-400'
              ]"
            />
          </div>
        </div>
        <img
          v-else
          :src="thumbnailUrl"
          :class="spoilerMode.cover && !isRead ? 'md:filter md:blur-sm md:group-hover:blur-none motion-safe:transition-all duration-100 ease-in-out' : ''"
          class="w-full object-cover rounded-md shadow-md"
        >
      </transition>
    </div>
    <div class="flex-1 flex flex-col space-y-3">
      <div class="w-full">
        <span class="text-sm font-display font-medium dark:text-gray-100 block w-full truncate">
          {{ result.title }}
        </span>
        <span class="text-sm font-medium text-gray-600 dark:text-gray-300 block w-full truncate">
          {{ authorsFormatted }}
        </span>
      </div>
      <div class="flex items-center space-x-3 text-xs">
        <span class="text-xxs bg-white dark:bg-transparent text-gray-500 dark:text-gray-200 font-semibold px-2 py-0.5 rounded text uppercase tracking-wide border border-gray-200 dark:border-gray-600">
          {{ result.group }}
        </span>
        <span class="block text-gray-500 dark:text-gray-400">
          {{ result.publisher }}
        </span>
      </div>
    </div>
    <span aria-hidden="true">
      <ChevronRightIcon class="w-5 h-5 text-gray-500 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-gray-100" aria-hidden="true" />
    </span>
  </router-link>
</template>

<script>
import { computed, onMounted, ref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import useImageLazyLoader from '@/composables/useImageLazyLoader'

import { ChevronRightIcon, PhotographIcon } from '@heroicons/vue/outline'

import { BookStatus } from '@/model/Book'

export default {
  components: { ChevronRightIcon, PhotographIcon },

  props: {
    result: {
      type: Object,
      required: true
    }
  },

  setup (props) {
    const { result } = toRefs(props)

    const thumbnailUrl = computed(() => {
      return result.value
        ? result.value.coverUrl.replace('_SL700_', '_SL300_')
        : ''
    })

    const searchItem = ref(null)

    const {
      imageHasError,
      imageLoading,
      setupObserver,
      observerCreated
    } = useImageLazyLoader(thumbnailUrl, searchItem)

    onMounted(() => {
      if (result.value) {
        setupObserver()
      }
    })

    watch(result, newValue => {
      if (!newValue && !observerCreated.value) {
        setupObserver()
      }
    })

    const store = useStore()

    const spoilerMode = computed(() => store.state.collection.spoilerMode)

    const isRead = computed(() => {
      return result.value && result.value.status === BookStatus.READ
    })

    const { t } = useI18n()

    const authorsFormatted = computed(() => {
      const separator = t('dashboard.details.header.authorSeparator')
      let authors = (result.value.authors || []).join(separator)

      if (result.value.authors && result.value.authors.length >= 2) {
        const firstAuthors = (result.value.authors || [])
          .slice(0, -1)
          .join(separator)

        authors = t(
          'dashboard.details.header.authorListComplete',
          {
            authors: firstAuthors,
            lastAuthor: result.value.authors[result.value.authors.length - 1]
          }
        )
      }

      return authors
    })

    return {
      searchItem,
      imageHasError,
      imageLoading,
      thumbnailUrl,
      spoilerMode,
      isRead,
      authorsFormatted
    }
  }
}
</script>
