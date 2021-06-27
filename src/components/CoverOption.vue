<template>
  <div
    :class="[
      active ? 'ring-2 ring-indigo-500' : '',
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
    <div v-if="checked" class="bg-indigo-600 bg-opacity-70 absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col">
      <CheckCircleIcon class="h-8 w-8 text-white" />
    </div>
  </div>
</template>

<script>
import { computed, onMounted, toRefs } from 'vue'

import useImageLoader from '@/composables/useImageLoader'

import { CheckCircleIcon, PhotographIcon } from '@heroicons/vue/solid'

export default {
  name: 'CoverOption',

  components: {
    CheckCircleIcon,
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

  setup (props) {
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

    return {
      imageHasError,
      imageLoading,
      thumbnailUrl
    }
  }
}
</script>

<style>

</style>
