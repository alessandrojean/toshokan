import { defineComponent, onMounted } from 'vue'
import { action } from '@storybook/addon-actions'
import { themes } from '@storybook/theming'
import { setup } from '@storybook/vue3'
import i18n, { useI18n } from '@/i18n'
import '../src/index.pcss'

const MockedRouterLink = defineComponent({
  name: 'RouterLink',
  props: ['to'],
  methods: {
    log() {
      action('onNavigate')(this.to)
    }
  },
  template: '<a class="cursor-pointer" @click="log()"><slot/></a>'
})

setup((app) => {
  app.use(i18n)
  app.component('RouterLink', MockedRouterLink)
})

export const globalTypes = {
  locale: {
    title: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en-US',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en-US', right: '🇺🇸', title: 'English' },
        { value: 'pt-BR', right: '🇧🇷', title: 'Português (Brasil)' }
      ],
    },
  },
}

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: { disable: true },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  darkMode: {
    current: 'light',
    classTarget: 'html',
    stylePreview: true,
    dark: themes.dark,
    light: themes.light
  }
}

const withThemeProvider = (story) => ({
  components: { story },
  setup: () => {
    onMounted(() => {
      document.documentElement.style.height = '100vh'

      const style = document.createElement('style')
      style.textContent = 'html.dark { background-color: #0f172a; }'
      document.head.appendChild(style)
    })
  },
  template: `<story />`
})

const withLocaleProvider = (story, context) => ({
  components: { story },
  setup: () => {
    const { locale } = useI18n()

    locale.value = context.globals.locale
  },
  template: `<story />`
})

export const decorators = [withThemeProvider, withLocaleProvider]
