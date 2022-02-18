<template>
  <Content>
    <ContentTitle>{{ t('about.termsOfUse.title') }}</ContentTitle>
    <ContentBody v-html="body" />
    <ContentFooter date="2021-07-08T22:30:00.000-03:00" />
  </Content>
</template>

<script>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import Content from '@/components/Content.vue'
import ContentTitle from '@/components/ContentTitle.vue'
import ContentBody from '@/components/ContentBody.vue'
import ContentFooter from '@/components/ContentFooter.vue'

import useMarkdown from '@/composables/useMarkdown'

export default {
  components: {
    Content,
    ContentBody,
    ContentFooter,
    ContentTitle
  },

  setup () {
    const { t } = useI18n({ useScope: 'global' })

    const { renderMarkdown } = useMarkdown({
      mdOptions: { typographer: true }
    })

    const body = ref(
      renderMarkdown(
        t('about.termsOfUse.body', {
          googleSignInLink: 'https://developers.google.com/identity/sign-in/web',
          googleTermsLink: 'https://policies.google.com/terms?hl=pt-BR',
          googlePrivacyPolicyLink: 'https://policies.google.com/privacy?hl=pt-BR'
        })
      )
    )

    return { t, body }
  }
}
</script>
