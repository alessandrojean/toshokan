import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

import colors from 'vuetify/lib/util/colors'
import pt from 'vuetify/es5/locale/pt'

Vue.use(Vuetify)

export default new Vuetify({
  lang: {
    locales: { pt },
    current: 'pt'
  },
  theme: {
    themes: {
      light: {
        primary: colors.deepPurple,
        secondary: colors.grey.darken1,
        accent: colors.deepPurple.accent1,
        error: colors.red.accent3
      }
    }
  }
})
