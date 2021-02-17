<template>
  <router-view/>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'App',

  data: () => ({

  }),

  methods: {
    ...mapActions('auth', ['initApp'])
  },

  mounted: function () {
    this.initApp()
  }
}
</script>
