<template>
  <router-link
    :to="{ name: 'BookDetails', params: { bookId: result.id } }"
    class="group px-4 py-4 sm:px-7 md:px-4 flex items-center bg-gray-50 dark:bg-gray-700 hover:bg-primary-500 dark:hover:bg-gray-600 has-ring-focus rounded-md"
    ref="searchItem"
  >
    <div class="mr-4 w-12">
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
          class="w-12 h-12 flex justify-center items-center"
          aria-hidden="true"
        >
          <PhotographIcon
            :class="[
              imageLoading ? 'motion-safe:animate-pulse' : '',
              'w-7 h-7 text-gray-500 dark:text-gray-500 group-hover:text-white'
            ]"
            aria-hidden="true"
          />
        </div>
        <img
          v-else
          :src="thumbnailUrl"
          :class="spoilerMode.cover && !isRead ? 'md:filter md:blur-sm md:group-hover:blur-none motion-safe:transition-all duration-100 ease-in-out' : ''"
          class="w-12 h-12 object-cover rounded"
        >
      </transition>
    </div>
    <div class="flex-1 flex flex-col">
      <span class="text-sm font-semibold dark:text-gray-200 group-hover:text-white">
        {{ result.title }}
      </span>
      <span class="text-xs text-gray-500 dark:text-gray-400 group-hover:text-white dark:group-hover:text-gray-200">
        {{ result.group }} · {{ result.publisher }}
      </span>
    </div>
    <span aria-hidden="true">
      <ChevronRightIcon class="w-6 h-6 text-gray-500 group-hover:text-white dark:text-gray-400 dark:group-hover:text-gray-200" aria-hidden="true" />
    </span>
  </router-link>
</template>

<script>
import { computed, onMounted, ref, toRefs, watch } from 'vue'
import { useStore } from 'vuex'

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

    return {
      searchItem,
      imageHasError,
      imageLoading,
      thumbnailUrl,
      spoilerMode,
      isRead
    }
  }
}
</script>
