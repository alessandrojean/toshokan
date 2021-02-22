<template>
  <div>
    <router-view/>

    <v-fade-transition>
      <div class="loading-wrapper" v-if="loading || !started">
        <v-progress-circular
          :size="50"
          color="#673AB7"
          indeterminate
        />
      </div>
    </v-fade-transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',

  computed: {
    ...mapState('auth', ['started']),
    ...mapState('sheet', ['loading'])
  }
}
</script>

<style lang="scss">
.loading-wrapper {
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
