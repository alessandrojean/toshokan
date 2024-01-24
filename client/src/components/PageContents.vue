<script lang="ts" setup>
const { t } = useI18n({ useScope: 'global' })

const isVisible = useBreakpoints(breakpointsTailwind).greater('xl')

interface Content {
  id: string
  title: string
  index: number
}

const pageContents = ref<Content[]>([])
const active = ref(-1)
const previousActive = ref(-1)

function buildPageContents(resetPosition?: boolean) {
  const contents = Array.from(
    document.querySelectorAll<HTMLAnchorElement>(
      '.table-of-contents ol > li > a',
    ),
  )

  pageContents.value = contents.map((el, index) => ({
    id: el.hash,
    title: el.textContent!,
    index,
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
    pageContents.value.length > 0
    && window.scrollY + window.innerHeight === document.body.offsetHeight
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

function getAnchorTop(anchor: Content) {
  const heading = document.querySelector<HTMLHeadingElement>(anchor.id)

  if (!heading) {
    return 0
  }

  return heading.offsetTop - 200
}

function isAnchorActive(
  index: number,
  anchor: Content,
  nextAnchor: Content,
): [boolean, number] {
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

function throttleAndDebounce(fn: Function, delay: number) {
  let timeout: number
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

const list = ref<HTMLUListElement>()
const indicator = reactive({
  top: 0,
  height: 17,
})

function updateIndicator() {
  if (active.value !== -1 && list.value) {
    const li = list.value.children[active.value] as HTMLLIElement
    indicator.top = li.offsetTop
    indicator.height = li.offsetHeight
  } else {
    indicator.top = 0
    indicator.height = 17
  }
}

function handleClick(event: MouseEvent) {
  const id = `#${(event.target as HTMLAnchorElement).href.split('#')[1]}`
  const heading = document.querySelector<HTMLHeadingElement>(id)

  heading?.focus()
}
</script>

<template>
  <aside v-if="pageContents.length > 0" class="w-56 py-12 px-2">
    <nav class="sticky top-24 text-sm">
      <p class="font-semibold font-display-safe dark:text-gray-100">
        {{ t('about.onThisPage') }}
      </p>
      <div class="mt-5 relative">
        <ul ref="list" class="space-y-2.5 dark:text-gray-200">
          <li v-for="(header, idx) in pageContents" :key="header.id">
            <a
              :href="header.id"
              :class="[
                'has-ring-focus rounded',
                idx === active
                  ? 'font-medium'
                  : 'text-gray-500 dark:text-gray-400',
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
            top: `${indicator.top}px`,
            height: `${indicator.height}px`,
            opacity: active === -1 ? '0' : '1',
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
