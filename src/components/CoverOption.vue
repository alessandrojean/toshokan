<script lang="ts" setup>
import { CheckIcon, PhotoIcon } from '@heroicons/vue/20/solid'

const props = defineProps<{
  active: boolean | undefined
  checked: boolean | undefined
  coverUrl: string
}>()

const emit = defineEmits(['error'])

const { coverUrl } = toRefs(props)

const thumbnailUrl = computed(() => {
  return coverUrl.value ? coverUrl.value.replace('_SL700_', '_SL300_') : ''
})

const { imageHasError, imageLoading, loadImage } = useImageLoader(thumbnailUrl)

onMounted(loadImage)

watch(imageHasError, (hasError) => {
  if (hasError) {
    emit('error')
  }
})
</script>

<template>
  <div
    :class="[
      active || checked
        ? 'ring-2 ring-offset-2 ring-primary-600 dark:ring-primary-500 dark:ring-offset-gray-700'
        : '',
      'relative shadow bg-gray-200 dark:bg-gray-700 rounded-md overflow-hidden aspect-w-2 aspect-h-3 cursor-pointer motion-safe:transition-shadow',
    ]"
  >
    <FadeTransition>
      <div
        v-if="imageLoading || imageHasError"
        class="w-full h-full flex justify-center items-center"
      >
        <PhotoIcon
          :class="[
            imageLoading ? 'motion-safe:animate-pulse' : '',
            'w-10 h-10 text-gray-400 dark:text-gray-500',
          ]"
          aria-hidden="true"
        />
      </div>
      <img
        v-else
        class="object-cover w-full h-full"
        :src="thumbnailUrl"
        alt=""
      >
    </FadeTransition>
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
