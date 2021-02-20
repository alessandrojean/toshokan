<template>
  <h1>Início</h1>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'DashboardHome',

  methods: {
    ...mapMutations('appbar', ['updateIcons'])
  },

  mounted: function () {
    this.updateIcons([])
  }
}
</script>

<style>

</style>
