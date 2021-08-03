<template>
  <router-link
    :to="{ name: 'BookDetails', params: { bookId: result.id } }"
    class="group px-5 py-5 sm:px-7 md:px-5 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 has-ring-focus"
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
          v-if="imageLoading || imageHasError"
          class="w-12 h-12 flex justify-center items-center"
          aria-hidden="true"
        >
          <PhotographIcon
            :class="[
              imageLoading ? 'motion-safe:animate-pulse' : '',
              'w-7 h-7 text-gray-400 dark:text-gray-500'
            ]"
            aria-hidden="true"
          />
        </div>
        <img v-else :src="thumbnailUrl" class="w-12 h-12 object-cover rounded">
      </transition>
    </div>
    <div class="flex-1 flex flex-col">
      <span class="text-sm font-medium dark:text-gray-100">
        {{ result.titleParts[0] }}
      </span>
      <span class="text-xs text-gray-500 dark:text-gray-400">
        {{ volumeText }}
      </span>
    </div>
    <span aria-hidden="true">
      <ChevronRightIcon class="w-6 h-6 text-gray-400 group-hover:text-indigo-600 dark:text-gray-400 dark:group-hover:text-gray-200" aria-hidden="true" />
    </span>
  </router-link>
</template>

<script>
import { computed, onMounted, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import useImageLazyLoader from '@/composables/useImageLazyLoader'

import { ChevronRightIcon } from '@heroicons/vue/solid'
import { PhotographIcon } from '@heroicons/vue/outline'

export default {
  components: { ChevronRightIcon, PhotographIcon },

  props: {
    result: {
      type: Object,
      required: true
    }
  },

  setup (props) {
    const { t } = useI18n()

    const { result } = toRefs(props)

    const volumeText = computed(() => {
      const isSingle = result.value.titleParts[1] === undefined

      return t(
        isSingle ? 'book.single' : 'book.volume',
        isSingle ? undefined : { number: result.value.titleParts[1] }
      )
    })

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

    return {
      volumeText,
      searchItem,
      imageHasError,
      imageLoading,
      thumbnailUrl
    }
  }
}
</script>

<style>

</style>
