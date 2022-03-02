<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import useMarkdown from '@/composables/useMarkdown'

import Content from '@/components/Content.vue'
import ContentTitle from '@/components/ContentTitle.vue'
import ContentBody from '@/components/ContentBody.vue'
import ContentFooter from '@/components/ContentFooter.vue'

const { t } = useI18n({ useScope: 'global' })

const { renderMarkdown } = useMarkdown({
  mdOptions: { typographer: true }
})

const body = ref(
  renderMarkdown(
    t('about.a11y.body', {
      headlessUiLink: 'https://headlessui.dev/vue/menu#keyboard-interaction'
    })
  )
)
</script>

<template>
  <Content>
    <ContentTitle>{{ t('about.a11y.title') }}</ContentTitle>
    <ContentBody v-html="body" />
    <ContentFooter date="2021-07-08T22:30:00.000-03:00" />
  </Content>
</template>
