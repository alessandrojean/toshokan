<script lang="ts" setup>
import { nextTick, onMounted, provide, ref, watch } from 'vue'

import { useAuthStore } from '@/stores/auth'
import { DocumentationKey, RebuildPageContentsKey } from '@/symbols'
import type { Documentation, DocumentationCategory } from '@/symbols'

import FadeTransition from '@/components/transitions/FadeTransition.vue'
import PageAside from '@/components/PageAside.vue'
import PageContents from '@/components/PageContents.vue'
import PageHeader from '@/components/PageHeader.vue'

const authStore = useAuthStore()

watch(
  () => authStore.started,
  async () => await handleHash()
)
onMounted(async () => await handleHash())

async function handleHash() {
  if (window.location.hash && authStore.started) {
    await nextTick()
    await nextTick()

    document
      .querySelector(window.location.hash)
      ?.scrollIntoView({ behavior: 'smooth' })
  }
}

const pageContents = ref<InstanceType<typeof PageContents>>()

function rebuildPageContents(resetPosition?: boolean) {
  if (resetPosition) {
    handleHash()
  }

  pageContents.value?.buildPageContents(resetPosition)
}

provide(RebuildPageContentsKey, rebuildPageContents)

function groupBy<T, R extends string | number | symbol>(
  collection: T[],
  predicate: (item: T) => R
): Record<R, T[]> {
  return collection.reduce((record, item) => {
    const key = predicate(item)

    if (record[key]) {
      record[key].push(item)
    } else {
      record[key] = [item]
    }

    return record
  }, {} as Record<R, T[]>)
}

const files = import.meta.glob('/docs/**/*.md', { as: 'raw' })
const pages = Object.entries(files).map(([key, content]) => {
  const [locale, category, page] = key.replace('/docs/', '').split('/')
  const [categoryOrder, categorySlug] = category.split('.')
  const [pageOrder, pageSlug] = page.split('.')

  return {
    locale,
    categoryOrder,
    categorySlug,
    pageOrder,
    pageSlug,
    content
  }
})

// eslint-disable-next-line prettier/prettier
const docs: Documentation = Object
  .entries(groupBy(pages, (item) => item.categorySlug))
  .map<DocumentationCategory>(([category, pages]) => ({
    order: Number(pages[0].categoryOrder),
    category,
    pages: pages
      .map((page) => ({
        order: Number(page.pageOrder),
        slug: page.pageSlug,
        locale: page.locale,
        title:
          'app.routes.about.' +
          page.pageSlug.replace(/-([a-z])/g, (g) => g[1].toUpperCase()),
        content: page.content
      }))
      .sort((a, b) => a.order - b.order)
  }))
  .sort((a, b) => a.order - b.order)

provide(DocumentationKey, docs)
</script>

<template>
  <div>
    <PageHeader />
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 flex">
      <PageAside class="hidden md:block" />
      <router-view v-slot="{ Component, route }">
        <FadeTransition>
          <component :is="Component" :key="route.path" />
        </FadeTransition>
      </router-view>
      <PageContents class="hidden xl:block" ref="pageContents" />
    </div>
  </div>
</template>
