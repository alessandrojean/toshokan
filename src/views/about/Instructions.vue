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

import md from 'markdown-it'
import mdDefList from 'markdown-it-deflist'
import dedent from 'dedent'

import step1 from '@/assets/about/new-book-step-01.png'
import step2 from '@/assets/about/new-book-step-02.png'
import step3 from '@/assets/about/new-book-step-03.png'
import step4 from '@/assets/about/new-book-step-04.png'
import step5 from '@/assets/about/new-book-step-05.png'
import step6 from '@/assets/about/new-book-step-06.png'
import step7 from '@/assets/about/new-book-step-07.png'

export default {
  components: {
    Content,
    ContentBody,
    ContentFooter,
    ContentTitle
  },

  setup () {
    const { t } = useI18n()

    const markdown = md({
      html: true,
      typographer: true
    }).use(mdDefList)

    const body = ref(
      markdown.render(
        t('about.instructions.body', {
          googleDriveLink: 'https://drive.google.com/',
          templateSheetLink: '#',
          iso4217link: 'https://en.wikipedia.org/wiki/ISO_4217',
          figure1: dedent`
            <figure>
              <img src="${step1}" />
              <figcaption>${t('about.instructions.legend1')}</figcaption>
            </figure>
          `,
          figure2: dedent`
            <figure>
              <img src="${step2}" />
              <figcaption>${t('about.instructions.legend2')}</figcaption>
            </figure>
          `,
          figure3: dedent`
            <figure>
              <img src="${step3}" />
              <figcaption>${t('about.instructions.legend3')}</figcaption>
            </figure>
          `,
          figure4: dedent`
            <figure>
              <img src="${step4}" />
              <figcaption>${t('about.instructions.legend4')}</figcaption>
            </figure>
          `,
          figure5: dedent`
            <figure>
              <img src="${step5}" />
              <figcaption>${t('about.instructions.legend5')}</figcaption>
            </figure>
          `,
          figure6: dedent`
            <figure>
              <img src="${step6}" />
              <figcaption>${t('about.instructions.legend6')}</figcaption>
            </figure>
          `,
          figure7: dedent`
            <figure>
              <img src="${step7}" />
              <figcaption>${t('about.instructions.legend7')}</figcaption>
            </figure>
          `
        })
      )
    )

    return { t, body }
  }
}
</script>
