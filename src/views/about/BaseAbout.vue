<script setup>
import {
  computed,
  inject,
  nextTick,
  ref,
  toRefs,
  watch,
  watchEffect
} from 'vue'
import { useI18n } from 'vue-i18n'

import useMarkdown from '@/composables/useMarkdown'

import Alert from '@/components/Alert.vue'
import Content from '@/components/Content.vue'
import ContentTitle from '@/components/ContentTitle.vue'
import ContentBody from '@/components/ContentBody.vue'
import ContentFooter from '@/components/ContentFooter.vue'

const props = defineProps({
  file: {
    type: String,
    required: true
  }
})

const { file } = toRefs(props)

const { t, locale } = useI18n({ useScope: 'global' })

const markdownBody = ref('')
const markdownLocale = ref(locale.value)
const mounted = ref(false)
const rebuildPageContents = inject('rebuildPageContents')

const { renderMarkdown, frontmatter } = useMarkdown()

async function getMarkdownContent(locale, file) {
  try {
    const md = await import(`../../../docs/${locale}/${file}.md?raw`)
    markdownLocale.value = locale
    return md.default
  } catch (e) {
    const md = await import(`../../../docs/en-US/${file.value}.md?raw`)
    markdownLocale.value = 'en-US'
    return md.default
  }
}

watchEffect(async () => {
  markdownBody.value = await getMarkdownContent(locale.value, file.value)
  await nextTick()
  rebuildPageContents(!mounted.value)
  mounted.value = true
})

watch(locale, (newLocale) => {
  markdownLocale.value = newLocale
})

function getImageUrl(name) {
  return new URL(`../../assets/about/${name}.jpg`, import.meta.url).href
}

const body = computed(() => {
  const markdownWithAssets = markdownBody.value.replace(
    /@\/assets\/about\/(.*)\.jpg/g,
    (_, assetImage) => getImageUrl(assetImage)
  )

  return renderMarkdown(markdownWithAssets)
})

const gitHubLink = computed(
  () =>
    `https://github.com/alessandrojean/toshokan/blob/main/docs/${markdownLocale.value}/${file.value}.md`
)
</script>

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
    <ContentBody v-html="body" />
    <ContentFooter :github-link="gitHubLink" />
  </Content>
</template>
