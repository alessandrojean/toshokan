import { ref, watch } from 'vue'

export default function useImageLoader (imageUrl) {
  const imageHasError = ref(false)
  const imageLoading = ref(true)
  const imageWidth = ref(0)
  const imageHeight = ref(0)

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
    if (imageUrl.value && imageUrl.value.length > 0) {
      image.src = imageUrl.value
    } else {
      imageLoading.value = false
      imageHasError.value = true
    }
  }

  watch(imageUrl, () => {
    imageHasError.value = false
    imageLoading.value = true
    loadImage()
  })

  return {
    imageHasError,
    imageLoading,
    imageWidth,
    imageHeight,
    loadImage
  }
}
