<script setup>
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteUpdate } from 'vue-router'
import { useBreakpoints } from '@vueuse/core'

import useTailwindTheme from '@/composables/useTailwindTheme'

const { t, locale } = useI18n({ useScope: 'global' })
const { breakpoints } = useTailwindTheme()

const isVisible = useBreakpoints(breakpoints).greater('xl')

const pageContents = ref([])
const active = ref(-1)
const previousActive = ref(-1)

function buildPageContents(resetPosition) {
  const contents = Array.from(
    document.querySelectorAll('.table-of-contents ol > li > a')
  )

  pageContents.value = contents.map((el, index) => ({
    id: el.hash,
    title: el.textContent,
    index
  }))

  if (resetPosition) {
    active.value = -1
    previousActive.value = -1
  }

  nextTick(() => updateIndicator())
}

/**
 * Based on Vue.js official website algorithm.
 * https://github.com/vuejs/theme/blob/main/src/vitepress/composables/outline.ts
 */
function setActiveLink() {
  if (!isVisible.value) {
    return
  }

  // Page bottom, highlight last one.
  if (
    pageContents.value.length > 0 &&
    window.scrollY + window.innerHeight === document.body.offsetHeight
  ) {
    active.value = pageContents.value.length - 1
    updateIndicator()
    return
  }

  for (let i = 0; i < pageContents.value.length; i++) {
    const anchor = pageContents.value[i]
    const nextAnchor = pageContents.value[i + 1]

    const [isActive, index] = isAnchorActive(i, anchor, nextAnchor)

    if (isActive) {
      active.value = index
      updateIndicator()
      return
    }
  }
}

function getAnchorTop(anchor) {
  const heading = document.querySelector(anchor.id)

  if (!heading) {
    return 0
  }

  return heading.offsetTop - 200
}

function isAnchorActive(index, anchor, nextAnchor) {
  const scrollTop = window.scrollY

  if (index === 0 && scrollTop === 0) {
    return [true, -1]
  }

  if (scrollTop < getAnchorTop(anchor)) {
    return [false, -1]
  }

  if (!nextAnchor || scrollTop < getAnchorTop(nextAnchor)) {
    return [true, anchor.index]
  }

  return [false, -1]
}

function throttleAndDebounce(fn, delay) {
  let timeout
  let called = false

  return () => {
    if (timeout) {
      clearTimeout(timeout)
    }

    if (!called) {
      fn()
      called = true
      setTimeout(() => {
        called = false
      }, delay)
    } else {
      timeout = setTimeout(fn, delay)
    }
  }
}

const handleScroll = throttleAndDebounce(setActiveLink, 100)

onMounted(() => {
  buildPageContents()
  requestAnimationFrame(setActiveLink)
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => window.removeEventListener('scroll', handleScroll))

onBeforeRouteUpdate((to, from) => {
  if (to.name !== from.name) {
    active.value = -1
    updateIndicator()
  }
})

defineExpose({ buildPageContents })

const list = ref(null)
const indicator = reactive({
  top: 0,
  height: 17
})

function updateIndicator() {
  if (active.value !== -1 && list.value) {
    const li = list.value.children[active.value]
    indicator.top = li.offsetTop
    indicator.height = li.offsetHeight
  } else {
    indicator.top = 0
    indicator.height = 17
  }
}

/**
 * @param {Event} event
 */
function handleClick(event) {
  const id = '#' + event.target.href.split('#')[1]
  const heading = document.querySelector(id)

  heading?.focus()
}
</script>

<template>
  <aside class="w-56 py-12 px-2" v-if="pageContents.length > 0">
    <nav class="sticky top-24 text-sm">
      <p class="font-semibold font-display dark:text-gray-100">
        {{ t('about.onThisPage') }}
      </p>
      <div class="mt-5 relative">
        <ul class="space-y-2.5 dark:text-gray-200" ref="list">
          <li v-for="(header, idx) in pageContents" :key="header.id">
            <a
              :href="header.id"
              :class="[
                'has-ring-focus rounded',
                idx === active
                  ? 'font-medium'
                  : 'text-gray-500 dark:text-gray-400'
              ]"
              @click="handleClick"
            >
              {{ header.title }}
            </a>
          </li>
        </ul>

        <div
          aria-hidden="true"
          class="indicator"
          :style="{
            top: indicator.top + 'px',
            height: indicator.height + 'px',
            opacity: active === -1 ? '0' : '1'
          }"
        />
      </div>
    </nav>
  </aside>
</template>

<style lang="postcss" scoped>
.indicator {
  @apply absolute -left-2.5 w-1 rounded
    motion-safe:transition-[top,height,opacity]
    bg-primary-600 dark:bg-primary-500;
}
</style>
