import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from '@/App.vue'
import router from '@/router'
import i18n from '@/i18n'
import { getTheme } from '@/stores/settings'

import './index.pcss'

getTheme()

createApp(App)
  .use(createPinia())
  .use(VueQueryPlugin)
  .use(router)
  .use(i18n)
  .mount('#app')
