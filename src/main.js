import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import i18n from './i18n'

import './index.css'

createApp(App)
  .use(store)
  .use(router)
  .use(i18n)
  .mount('#app')
