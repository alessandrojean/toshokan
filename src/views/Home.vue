<template>
  <v-app>
    <v-row
      align="center"
      justify="center"
      class="deep-purple flex-column ma-0 pa-0"
    >
      <v-avatar color="deep-purple lighten-4" size="72">
        <v-icon color="primary" x-large>
          mdi-bookshelf
        </v-icon>
      </v-avatar>

      <button
        class="sign-in-button mt-10"
        @click.stop="signIn"
        :disabled="!started"
        v-if="!signedIn"
        title="Entrar com Google"
      >
      </button>
    </v-row>
    <!-- <v-app-bar
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
          v-if="!signedIn"
        >
          <v-icon left>
            mdi-google
          </v-icon>
          Entrar
        </v-btn>

        <v-btn
          text
          color="primary"
          @click.stop="$router.push({ name: 'dashboard-home' })"
          v-if="signedIn"
        >
          Painel
        </v-btn>

        <v-btn
          text
          color="primary"
          @click.stop="signOut"
          v-if="signedIn"
        >
          Sair
          <v-icon right>
            mdi-logout-variant
          </v-icon>
        </v-btn>
      </v-container>
    </v-app-bar> -->
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Home',

  computed: mapState('auth', ['started', 'signedIn']),

  methods: {
    handleSignInClick () {
      this.signIn()
        .then(() => this.$router.replace('/dashboard/home'))
    },

    ...mapActions('auth', ['signIn'])
  },

  mounted () {
    if (this.signedIn) {
      this.$router.replace('/dashboard/home')
    }
  },

  watch: {
    signedIn (signedIn) {
      if (signedIn) {
        this.$router.replace('/dashboard/home')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sign-in-button {
  font-size: 0;
  width: 191px;
  height: 46px;
  background-image: url('~@/assets/btn_google_signin_light_normal_web.png');
}

.sign-in-button:focus {
  background-image: url('~@/assets/btn_google_signin_light_focus_web.png');
  outline: none;
}

.sign-in-button:disabled {
  background-image: url('~@/assets/btn_google_signin_light_disabled_web.png');
}

.sign-in-button:active {
  background-image: url('~@/assets/btn_google_signin_light_pressed_web.png');
}
</style>
