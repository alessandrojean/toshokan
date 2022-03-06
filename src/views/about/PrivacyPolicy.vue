<script setup>
import { computed } from 'vue'
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

const body = computed(() =>
  renderMarkdown(
    t('about.privacyPolicy.body', {
      googleHelpLink:
        'https://support.google.com/accounts/answer/3466521?hl=pt-BR#remove-access',
      demoBuildLink: 'https://toshokan-app.netlify.com',
      googleLgpdLink:
        'https://support.google.com/authorizedbuyers/answer/9928204?hl=pt-BR',
      lgpdLawLink:
        'http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm'
    })
  )
)
</script>

<template>
  <Content>
    <ContentTitle>{{ t('about.privacyPolicy.title') }}</ContentTitle>
    <ContentBody v-html="body" />

    <ContentFooter date="2021-07-08T22:30:00.000-03:00" />
  </Content>
</template>
