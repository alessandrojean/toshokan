import { readonly, ref, watch } from 'vue'
import type { Ref } from 'vue'
import { computed } from 'vue'

export default function useImageLoader(
  imageUrl?: Ref<string | undefined>,
  aspectRatioDefault = '2 / 3'
) {
  const imageHasError = ref(false)
  const imageLoading = ref(true)
  const imageWidth = ref(0)
  const imageHeight = ref(0)
  const imageAspectRatio = computed(() => {
    return imageWidth.value > 0 && imageHeight.value > 0
      ? `${imageWidth.value} / ${imageHeight.value}`
      : aspectRatioDefault
  })

  const image = new Image()

  image.onload = () => {
    if (image.naturalWidth === 1 && image.naturalHeight === 1) {
      imageHasError.value = true
    } else {
      imageHasError.value = false
    }

    imageWidth.value = image.naturalWidth
    imageHeight.value = image.naturalHeight

    imageLoading.value = false
  }

  image.onerror = () => {
    imageHasError.value = true
    imageLoading.value = false
  }

  const loadImage = () => {
    if (imageUrl?.value && imageUrl.value.length > 0) {
      image.src = imageUrl.value
    } else {
      imageLoading.value = false
      imageHasError.value = true
    }
  }

  watch(
    () => imageUrl?.value,
    () => {
      imageHasError.value = false
      imageLoading.value = true
      loadImage()
    }
  )

  return {
    imageHasError: readonly(imageHasError),
    imageLoading: readonly(imageLoading),
    imageWidth: readonly(imageWidth),
    imageHeight: readonly(imageHeight),
    imageAspectRatio,
    loadImage
  }
}
