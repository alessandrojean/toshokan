<template>
  <v-app>
    <v-navigation-drawer
      app
      v-model="drawerModel"
    >
      <v-img
        :src="require('../assets/unsplash_bookshelf.jpg')"
        gradient="to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)"
        :aspect-ratio="1520 / 605"
      >
        <v-list dark>
          <v-list-item class="py-1">
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
      </v-img>

      <v-divider/>

      <v-list dense nav>
        <v-list-item-group
          v-model="selectedItem"
          color="primary"
          mandatory
        >
          <v-list-item
            v-for="(item, i) in drawerItems"
            :key="item.title"
            link
            @click.stop="handleItemClick(item.to)"
          >
            <v-list-item-icon>
              <v-icon>
                {{ currentIcon(i, selectedItem, item.icon) }}
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
      <v-app-bar-nav-icon
        v-if="!backButton"
        @click="updateDrawer(!drawer)"
        class="d-none d-lg-inline-flex"
      />

      <v-btn
        icon
        v-if="backButton"
        @click="handleBackButtonClick"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-toolbar-title class="pl-0 pl-lg-5">
        {{ $router.currentRoute.meta.title }}
      </v-toolbar-title>

      <v-spacer/>

      <template v-for="icon in icons">
        <v-btn
          icon
          :key="icon.title"
          :title="icon.title"
          @click="icon.click"
        >
          <v-icon>{{ icon.icon }}</v-icon>
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-fade-transition mode="out-in">
          <router-view/>
        </v-fade-transition>
      </v-container>
    </v-main>

    <v-bottom-navigation
      app
      v-model="bottomValue"
      :input-value="bottomActive"
      grow
      mandatory
      background-color="primary"
      dark
      class="d-sm-flex d-lg-none"
      :class="{ 'v-bottom-navigation--hidden': !bottomActive }"
    >
      <v-btn
        v-for="(item, i) in bottomItems"
        :key="item.title"
        @click="handleItemClick(item.to)"
      >
        <span>{{ item.title }}</span>

        <v-icon>
          {{ currentIcon(i, bottomValue, item.icon) }}
        </v-icon>
      </v-btn>
    </v-bottom-navigation>

    <v-fade-transition>
      <div class="loading-wrapper" v-if="loading">
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        />
      </div>
    </v-fade-transition>
  </v-app>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

import { bottomNavIsShowing } from '../util/appbar'

export default {
  name: 'Dashboard',

  data: () => ({
    bottomItems: [
      { title: 'Início', icon: 'mdi-home-outline', to: 'home' },
      { title: 'Coleção', icon: 'mdi-book-multiple-outline', to: 'collection' },
      { title: 'Estatísticas', icon: 'mdi-chart-box-outline' },
      { title: 'Mais', icon: 'mdi-dots-horizontal' }
    ],
    bottomValue: 0,
    drawerItems: [
      { title: 'Início', icon: 'mdi-home-outline', to: 'home' },
      { title: 'Coleção', icon: 'mdi-book-multiple-outline', to: 'collection' },
      { title: 'Estatísticas', icon: 'mdi-chart-box-outline' },
      { title: 'Configurações', icon: 'mdi-cog-outline' },
      { title: 'Sobre', icon: 'mdi-information-outline' }
    ],
    mini: true,
    selectedItem: 0
  }),

  computed: {
    drawerModel: {
      get: function () {
        return this.drawer
      },

      set: function (value) {
        this.updateDrawer(value && !bottomNavIsShowing())
      }
    },

    ...mapState('auth', [
      'signedIn',
      'profileName',
      'profileEmail',
      'profileImageUrl'
    ]),

    ...mapState('sheet', ['loading']),
    ...mapState('appbar', [
      'backButton',
      'bottomActive',
      'drawer',
      'icons'
    ])
  },

  methods: {
    currentIcon: function (i, selected, icon) {
      return i === selected ? icon.replace('-outline', '') : icon
    },

    handleBackButtonClick: function () {
      this.$router.go(-1)
      this.showDrawer()
    },

    handleItemClick: function (to) {
      if (this.$router.currentRoute.path !== '/dashboard/' + (to || 'home')) {
        this.$router.push('/dashboard/' + (to || 'home'))
      }
    },

    ...mapActions('auth', ['signOut']),
    ...mapActions('sheet', ['loadSheetData']),
    ...mapMutations('appbar', ['updateDrawer', 'showDrawer'])
  },

  created: function () {
    const currentPath = this.$router.currentRoute.path
    const currentIndex = this.drawerItems
      .findIndex(item => currentPath.includes('/dashboard/' + item.to))

    this.selectedItem = currentIndex !== -1 ? currentIndex : 0
  },

  mounted: function () {
    this.updateDrawer(!bottomNavIsShowing())

    this.loadSheetData()
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

<style lang="scss" scoped>
.v-bottom-navigation.v-bottom-navigation--hidden {
  transform: translateY(100%) !important;
}
</style>
