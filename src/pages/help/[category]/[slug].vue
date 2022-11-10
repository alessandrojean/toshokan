<script lang="ts" setup>
import { computed, nextTick, ref, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

import useMarkdown from '@/composables/useMarkdown'
import { useI18n } from '@/i18n'
import {
  ChangeTitleKey,
  DocumentationKey,
  DocumentationPage,
  RebuildPageContentsKey
} from '@/symbols'
import { injectStrict } from '@/util'

import Alert from '@/components/Alert.vue'
import Content from '@/components/Content.vue'
import ContentTitle from '@/components/ContentTitle.vue'
import ContentBody from '@/components/ContentBody.vue'
import ContentFooter from '@/components/ContentFooter.vue'

const route = useRoute()
const category = computed(() => String(route.params.category))
const slug = computed(() => String(route.params.slug))
const { t, locale } = useI18n({ useScope: 'global' })

const markdownBody = ref('')
const markdownLocale = ref(locale.value)
const pageTitle = ref('')
const mounted = ref(false)
const rebuildPageContents = injectStrict(RebuildPageContentsKey)

const { renderMarkdown, frontmatter } = useMarkdown()
const docs = injectStrict(DocumentationKey)
const changeTitle = injectStrict(ChangeTitleKey)

function getMarkdownContent(
  locale: string,
  category: string,
  pageSlug: string
): DocumentationPage {
  const categoryPages = docs.find((c) => c.category === category)?.pages ?? []
  const page = categoryPages.filter((p) => p.slug === pageSlug)
  const localePage = page.find((p) => p.locale === locale)
  const englishPage = page.find((p) => p.locale === 'en-US')!

  return localePage ?? englishPage
}

watchEffect(async () => {
  const page = getMarkdownContent(locale.value, category.value, slug.value)

  if (!page) {
    return
  }

  markdownBody.value = await page.content()
  pageTitle.value = page.title
  changeTitle(t(page.title))

  await nextTick()
  rebuildPageContents(!mounted.value)
  mounted.value = true
})

watch(locale, (newLocale) => {
  markdownLocale.value = newLocale
  changeTitle(t(pageTitle.value))
})

function getImageUrl(name: string) {
  return new URL(`../../assets/about/${name}.jpg`, import.meta.url).href
}

const body = computed(() => {
  const markdownWithAssets = markdownBody.value.replace(
    /@\/assets\/about\/(.*)\.jpg/g,
    (_, assetImage) => getImageUrl(assetImage)
  )

  return renderMarkdown(markdownWithAssets) ?? ''
})

const gitHubLink = computed(
  () =>
    `https://github.com/alessandrojean/toshokan/blob/main/docs/${markdownLocale.value}/${slug.value}.md`
)
</script>

<route lang="yaml">
meta:
  layout: help-center
</route>

<template>
  <Content>
    <ContentTitle :date="frontmatter?.date">
      {{ frontmatter?.title }}
    </ContentTitle>
    <Alert
      :show="markdownLocale !== locale && locale !== 'en-US'"
      type="info"
      class="mb-10 !py-3"
    >
      {{ t('about.englishOnly') }}

      <template #actions>
        <a :href="gitHubLink" target="_blank">
          {{ t('about.helpTranslate') }}
        </a>
      </template>
    </Alert>
    <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -->
    <ContentBody v-html="body" />
    <ContentFooter :github-link="gitHubLink" />
  </Content>
</template>
