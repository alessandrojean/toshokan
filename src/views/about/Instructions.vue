<template>
  <Content>
    <ContentTitle>{{ t('about.instructions.title') }}</ContentTitle>
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

import dedent from 'dedent'

import step1 from '@/assets/about/new-book-step-01.png'
import step2 from '@/assets/about/new-book-step-02.png'
import step3 from '@/assets/about/new-book-step-03.png'
import step4 from '@/assets/about/new-book-step-04.png'
import step5 from '@/assets/about/new-book-step-05.png'
import step6 from '@/assets/about/new-book-step-06.png'
import step7 from '@/assets/about/new-book-step-07.png'

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
        t('about.instructions.body', {
          googleDriveLink: 'https://drive.google.com/',
          templateSheetLink: '#',
          iso4217link: 'https://en.wikipedia.org/wiki/ISO_4217',
          figure1: step1,
          figure2: step2,
          figure3: step3,
          figure4: step4,
          figure5: step5,
          figure6: step6,
          figure7: step7
        })
      )
    )

    return { t, body }
  }
}
</script>
