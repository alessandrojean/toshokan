<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t, locale } = useI18n({ useScope: 'global' })
const route = useRoute()

const pageContents = ref([])
const active = ref(-1)
const previousActive = ref(-1)
const observer = ref(null)

watch(active, (_, oldValue) => {
  previousActive.value = oldValue
})

function buildPageContents() {
  const contents = Array.from(
    document.querySelectorAll('.table-of-contents ol > li > a')
  )

  if (contents.length > 0 && pageContents.value.length !== 0) {
    observer.value.disconnect()
  }

  pageContents.value = contents.map((el) => ({
    id: el.hash,
    title: el.textContent
  }))

  // Await for the scroll to finish.
  setTimeout(() => {
    contents.forEach((el) =>
      observer.value.observe(document.querySelector(el.hash))
    )
  }, 200)
}

function initializeObserver() {
  observer.value = new IntersectionObserver(
    (entries) => {
      const current = entries.find((entry) => entry.isIntersecting)
      const hash = current?.target?.id

      const newActive = pageContents.value.findIndex(
        (content) => content.id === '#' + hash
      )

      if (
        !current &&
        newActive === -1 &&
        active.value === 0 &&
        previousActive.value === 1
      ) {
        active.value = -1
        return
      }

      active.value = newActive === -1 ? active.value : newActive
    },
    { threshold: 0.5, rootMargin: '0px 0px -80% 0px' }
  )
}

onMounted(() => {
  initializeObserver()
  buildPageContents()
})

onUnmounted(() => observer.value?.disconnect())

watch(
  () => route.path,
  async () => {
    observer.value?.disconnect()
    await nextTick()
    buildPageContents()
  }
)

watch(locale, async () => {
  await nextTick()
  buildPageContents()
})

watch(pageContents, () => {
  active.value = -1
  previousActive.value = -1
})
</script>

<template>
  <aside class="w-56 py-8 px-2">
    <nav class="sticky top-24 text-sm">
      <p class="font-semibold font-display dark:text-gray-100">
        {{ t('about.onThisPage') }}
      </p>
      <ul class="space-y-2.5 mt-5 dark:text-gray-200">
        <li v-for="(header, idx) in pageContents" :key="header.id">
          <a
            :href="header.id"
            :class="[
              'has-ring-focus rounded',
              idx === active
                ? 'font-medium'
                : 'text-gray-500 dark:text-gray-400'
            ]"
          >
            {{ header.title }}
          </a>
        </li>
      </ul>
    </nav>
  </aside>
</template>
