<script lang="ts" setup>
export interface TypewriterProps {
  textClass?: string
  speed?: number
  deleteSpeed?: number
  nextWordInterval?: number
  words?: string[]
}

const props = withDefaults(defineProps<TypewriterProps>(), {
  speed: 500,
  deleteSpeed: 166,
  nextWordInterval: 1200,
  words: () => [],
})

const { speed, deleteSpeed, nextWordInterval, words } = toRefs(props)

type Timeout = ReturnType<typeof setTimeout>

const currentWord = ref<string[]>([])
const displayText = ref(words.value[0].split(''))
const wordIdx = ref(0)
const animate = ref<Timeout>()
const isWaitingNextWord = ref(true)

const timeoutSpeed = ref<number>()

function start() {
  if (words.value && words.value.length > 0) {
    // currentWord.value = words.value[wordIdx.value].split('')
    timeoutSpeed.value = nextWordInterval.value
    animate.value = setTimeout(type, timeoutSpeed.value)
  }
}

function type() {
  if (currentWord.value.length > 0) {
    displayText.value.push(currentWord.value.shift()!)
  } else if (
    !isWaitingNextWord.value
    && currentWord.value.length === 0
    && displayText.value.length === words.value[wordIdx.value].length
  ) {
    timeoutSpeed.value = nextWordInterval.value
    isWaitingNextWord.value = true
  } else if (currentWord.value.length === 0 && displayText.value.length > 0) {
    timeoutSpeed.value = deleteSpeed.value
    displayText.value.pop()
  } else if (currentWord.value.length === 0 && displayText.value.length === 0) {
    if (wordIdx.value < words.value.length - 1) {
      wordIdx.value++
    } else {
      wordIdx.value = 0
    }

    timeoutSpeed.value = speed.value
    isWaitingNextWord.value = false
    currentWord.value = words.value[wordIdx.value].split('')
    displayText.value.push(currentWord.value.shift()!)
  }

  animate.value = setTimeout(type, timeoutSpeed.value)
}

onMounted(() => start())
onBeforeUnmount(() => {
  if (animate.value) {
    clearTimeout(animate.value)
  }
})
</script>

<template>
  <span class="typewriter">
    <span :class="textClass" aria-hidden="true">{{
      displayText.join('')
    }}</span>
    <span class="cursor" aria-hidden="true" />
    <span class="sr-only">{{ words[wordIdx] }}</span>
  </span>
</template>

<style lang="postcss" scoped>
.cursor {
  @apply inline-block ml-1.5 w-1 h-[1em] align-bottom
    animate-pulse bg-gray-400 dark:bg-gray-500;
}
</style>
