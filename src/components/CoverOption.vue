<template>
  <div
    :class="[
      active || checked ? 'ring-2 ring-offset-2 ring-primary-600 dark:ring-primary-500 dark:ring-offset-gray-700' : '',
      'relative shadow bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden aspect-w-2 aspect-h-3 cursor-pointer motion-safe:transition-shadow'
    ]"
  >
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
        class="w-full h-full flex justify-center items-center"
      >
        <PhotographIcon
          :class="[
            imageLoading ? 'motion-safe:animate-pulse' : '',
            'w-10 h-10 text-gray-400 dark:text-gray-500'
          ]"
          aria-hidden="true"
        />
      </div>
      <img v-else class="object-cover w-full h-full" :src="thumbnailUrl" alt="">
    </transition>
    <div
      v-if="checked"
      class="bg-gray-800 bg-opacity-40 absolute inset-0 p-2.5 flex items-start justify-start flex-col"
    >
      <div class="bg-white p-0.5 rounded-full">
        <CheckIcon class="h-4 w-4 text-primary-600" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, toRefs, watch } from 'vue'

import useImageLoader from '@/composables/useImageLoader'

import { CheckIcon, PhotographIcon } from '@heroicons/vue/solid'

export default {
  name: 'CoverOption',

  components: {
    CheckIcon,
    PhotographIcon
  },

  props: {
    active: Boolean,
    checked: Boolean,
    coverUrl: {
      type: String,
      required: true
    }
  },

  emits: ['error'],

  setup (props, context) {
    const { coverUrl } = toRefs(props)

    const thumbnailUrl = computed(() => {
      return coverUrl.value
        ? coverUrl.value.replace('_SL700_', '_SL300_')
        : ''
    })

    const {
      imageHasError,
      imageLoading,
      loadImage
    } = useImageLoader(thumbnailUrl)

    onMounted(loadImage)

    watch(imageHasError, hasError => {
      if (hasError) {
        context.emit('error')
      }
    })

    return {
      imageHasError,
      imageLoading,
      thumbnailUrl
    }
  }
}
</script>
