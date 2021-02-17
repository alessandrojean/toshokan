<template>
  <v-app>
    <v-navigation-drawer
      app
      v-model="drawer"
    >
      <v-list>
        <v-list-item class="px-2 py-1">
          <v-list-item-avatar size="48">
            <v-img :src="profileImageUrl"></v-img>
          </v-list-item-avatar>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              {{ profileName }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ profileEmail }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn
              icon
              title="Sair"
              aria-label="Sair"
              @click.stop="signOut"
            >
              <v-icon>mdi-logout-variant</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <v-divider/>

      <v-list dense nav>
        <v-list-item-group
          v-model="selectedItem"
          color="primary"
        >
          <v-list-item
            v-for="(item, i) in drawerItems"
            :key="item.title"
            link
            @click.stop="$router.push('/dashboard/' + (item.to || ''))"
          >
            <v-list-item-icon>
              <v-icon>
                {{ i === selectedItem ? item.icon.replace('-outline', '') : item.icon }}
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"/>

      <v-toolbar-title>{{ drawerItems[selectedItem].title }}</v-toolbar-title>

      <v-spacer/>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Dashboard',

  data: () => ({
    drawer: true,
    drawerItems: [
      { title: 'Início', icon: 'mdi-home-outline', to: '' },
      { title: 'Coleção', icon: 'mdi-book-multiple-outline', to: 'collection' },
      { title: 'Estatísticas', icon: 'mdi-chart-box-outline' },
      { title: 'Configurações', icon: 'mdi-cog-outline' },
      { title: 'Sobre', icon: 'mdi-information-outline' }
    ],
    mini: true,
    selectedItem: 0
  }),

  computed: mapState('auth', [
    'signedIn',
    'profileName',
    'profileEmail',
    'profileImageUrl'
  ]),

  methods: {
    ...mapActions('auth', ['signOut'])
  },

  created: function () {
    const currentPath = this.$router.currentRoute.path
    const currentIndex = this.drawerItems
      .findIndex(item => currentPath === '/dashboard/' + item.to)

    this.selectedItem = currentIndex !== -1 ? currentIndex : 0
  },

  watch: {
    signedIn: function (newValue) {
      if (!newValue) {
        this.$router.replace('/')
      }
    }
  }
}
</script>

<style>

</style>
