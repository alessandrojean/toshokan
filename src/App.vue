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

<style lang="scss">
.loading-wrapper {
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
