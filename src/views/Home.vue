<template>
  <v-app>
    <v-app-bar
      app
      color="white"
      flat
    >
      <v-container class="py-0 fill-height">
        <v-avatar class="mr-10" color="indigo" size="32">
          <v-icon dark>
            mdi-bookshelf
          </v-icon>
        </v-avatar>

        <v-toolbar-title>Toshokan</v-toolbar-title>

        <v-spacer/>

        <v-btn
          text
          color="primary"
          @click.stop="signIn"
          :loading="!started && !signedIn"
        >
          <v-icon left>
            mdi-google
          </v-icon>
          Entrar
        </v-btn>
      </v-container>
    </v-app-bar>
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Home',

  computed: mapState('auth', ['started', 'signedIn']),

  methods: {
    ...mapActions('auth', ['signIn'])
  },

  watch: {
    signedIn: function (newValue) {
      if (newValue) {
        this.$router.replace('/dashboard/home')
      }
    }
  }
}
</script>
