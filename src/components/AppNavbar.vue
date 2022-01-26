<template>
  <nav
    :class="[
      'app-navbar z-20 sm:z-30 md:z-20',
      isOnTop ? 'is-transparent' : '',
      !show ? 'is-hidden' : ''
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div class="flex-1 flex items-center justify-start md:items-stretch">
          <router-link
            :to="{ name: 'DashboardHome' }"
            :class="isOnTop ? 'opacity-95' : ''"
            class="shrink-0 flex items-center rounded-md transition-shadow motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 focus-visible:ring-offset-gray-800"
          >
            <span aria-hidden="true" class="sm:hidden md:block">
              <LibraryIcon
                :class="isOnTop ? 'text-gray-200 md:text-primary-500' : 'text-primary-500'"
                class="h-9 w-9 motion-safe:transition-colors"
              />
            </span>
            <span class="sr-only">{{ t('dashboard.header.links.start') }}</span>
            <span class="text-gray-200 font-display font-semibold text-xl ml-3 sm:ml-0 md:ml-3 md:hidden lg:block" aria-hidden="true">
              {{ t('app.name') }}
            </span>
          </router-link>

          <div class="hidden md:block md:ml-6" role="navigation" aria-label="Menu principal" id="main-menu-desktop">
            <ul class="flex space-x-4">
              <template v-for="item in desktopNavigation" :key="item.name">
                <li
                  v-if="!item.hidden"
                  :lang="item.lang || ''"
                  class="self-stretch"
                >
                  <router-link
                    :exact="item.exact"
                    :exact-active-class="item.exact ? 'is-active' : undefined"
                    :active-class="!item.exact ? 'is-active' : undefined"
                    :to="{ name: item.name }"
                    class="block nav-link text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-shadow motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 focus-visible:ring-offset-gray-800"
                  >
                    {{ item.title }}
                  </router-link>
                </li>
              </template>
            </ul>
          </div>
        </div>

        <div class="absolute inset-y-0 right-0 flex items-center sm:pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
          <!-- Search link -->
          <button
            v-if="!loading"
            @click="showSearchDialog"
            class="lg:hidden p-1 rounded-full text-gray-400 hover:text-white transition-shadow motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 focus-visible:ring-offset-gray-800"
          >
            <span class="sr-only">{{ t('dashboard.header.search.link') }}</span>
            <span aria-hidden="true">
              <SearchIcon class="h-6 w-6" />
            </span>
          </button>

          <!-- Search form -->
          <transition
            leave-active-class="transition motion-reduce:transition-none duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
            enter-active-class="transition motion-reduce:transition-none duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
          >
            <button
              class="fake-search-input has-ring-focus"
              v-if="!loading"
              @click="showSearchDialog"
            >
              <span aria-hidden="true">
                <SearchIcon class="w-4 h-4" />
              </span>
              <span class="text-sm w-56 text-left">
                {{ t('dashboard.header.search.placeholder') }}
              </span>
              <span aria-hidden="true" class="ctrl-k text-gray-300 group-hover:text-gray-200 text-xs leading-5 px-1.5 border border-gray-500 group-hover:border-gray-400 bg-gray-700 group-hover:bg-gray-700 rounded-md">
                <kbd class="font-sans">
                  <abbr title="Control" class="no-underline" v-if="!isMac">{{ t('dashboard.header.search.ctrl') }}&nbsp;</abbr>
                  <abbr title="Command" class="no-underline" v-else>⌘&nbsp;</abbr>
                </kbd>
                <kbd class="font-sans">K</kbd>
              </span>
            </button>
          </transition>

          <ThemeToggle class="ml-1" />

          <!-- Profile dropdown -->
          <Menu as="div" class="ml-3 md:relative hidden sm:inline-block" v-slot="{ open }">
            <div>
              <MenuButton class="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none transition-shadow motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 focus-visible:ring-offset-gray-700">
                <span class="sr-only">{{ t('dashboard.header.menu.open') }}</span>
                <div
                  class="w-8 h-8 rounded-full bg-cover shadow-avatar"
                  :style="{ backgroundImage: `url('${profileImageUrl}')` }"
                />
              </MenuButton>
            </div>
            <transition
              enter-active-class="transition motion-reduce:transition-none ease-out duration-100"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
              leave-active-class="transition motion-reduce:transition-none ease-in duration-75"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <div
                v-if="open"
                aria-hidden="true"
                class="md:hidden fixed z-30 inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-90 transition-opacity"
              />
            </transition>
            <transition
              enter-active-class="transition motion-reduce:transition-none duration-100 ease-out"
              enter-from-class="scale-95 opacity-0"
              enter-to-class="scale-100 opacity-100"
              leave-active-class="transition motion-reduce:transition-none duration-75 ease-in"
              leave-from-class="scale-100 opacity-100"
              leave-to-class="scale-95 opacity-0"
            >
              <MenuItems as="ul" class="fixed md:absolute z-40 left-8 md:left-auto right-8 md:right-0 bottom-8 md:bottom-auto md:w-48 mt-2 py-1 origin-bottom md:origin-top-right bg-white dark:bg-gray-700 md:dark:bg-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="pb-1">
                  <MenuItem v-slot="{ active }">
                    <router-link
                      :to="{ name: 'DashboardSettings' }"
                      :class="[
                        active ? 'bg-gray-100 dark:bg-gray-600 md:dark:bg-gray-600/50' : '',
                        'group flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:md:hover:bg-gray-600/50 dark:hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 focus-visible:ring-offset-gray-700'
                      ]"
                    >
                      <span aria-hidden="true">
                        <CogIcon class="w-5 h-5 mr-3 text-gray-500 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300" />
                      </span>
                      {{ t('dashboard.header.menu.settings') }}
                    </router-link>
                  </MenuItem>
                </div>
                <div class="pt-1">
                  <MenuItem v-slot="{ active }">
                    <button
                      type="button"
                      :class="[
                        active ? 'bg-gray-100 dark:bg-gray-600' : '',
                        'group flex items-start w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:md:hover:bg-gray-600/50 dark:hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 focus-visible:ring-offset-gray-700'
                      ]"
                      @click.stop="signOut"
                    >
                      <span aria-hidden="true">
                        <LogoutIcon class="w-5 h-5 mr-3 text-red-500 group-hover:text-red-600 dark:text-red-400 dark:group-hover:text-red-500" />
                      </span>
                      {{ t('dashboard.header.menu.signOut') }}
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed, inject, onMounted, onUnmounted, ref, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems
} from '@headlessui/vue'

import {
  CogIcon,
  LibraryIcon,
  LogoutIcon,
  SearchIcon
} from '@heroicons/vue/solid'

import ThemeToggle from '@/components/ThemeToggle.vue'

export default {
  name: 'AppNavbar',

  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    ThemeToggle,
    CogIcon,
    LibraryIcon,
    LogoutIcon,
    SearchIcon
  },

  props: {
    transparent: Boolean
  },

  setup (props) {
    const store = useStore()

    const { t } = useI18n({ useScope: 'global' })

    const open = ref(false)
    const { transparent } = toRefs(props)

    const shared = computed(() => store.getters['sheet/shared'])
    const loading = computed(() => store.state.sheet.loading)

    const navigation = computed(() => [
      {
        name: 'DashboardHome',
        title: t('dashboard.header.links.dashboard'),
        exact: true
      },
      {
        name: 'DashboardLibrary',
        title: t('dashboard.header.links.library')
      },
      {
        name: 'DashboardStats',
        title: t('dashboard.header.links.statistics'),
        hidden: shared.value || loading.value
      }
    ])
    const searchQuery = ref('')
    const searchNavbar = ref(null)

    const desktopNavigation = computed(() => {
      return navigation.value.filter(navItem => !navItem.mobileOnly)
    })

    const profileEmail = computed(() => store.state.auth.profileEmail)
    const profileImageUrl = computed(() => store.state.auth.profileImageUrl)
    const profileName = computed(() => store.state.auth.profileName)

    const signOut = () => store.dispatch('auth/signOut')

    const isMac = ref(
      navigator.userAgentData
        ? navigator.userAgentData.platform.toLowerCase().indexOf('mac') > -1
        : navigator.platform.toLowerCase().indexOf('mac') > -1
    )

    const showSearchDialog = inject('showSearchDialog')

    const currentScrollPosition = ref(0)
    const lastScrollPosition = ref(0)
    const show = ref(true)

    function handleScroll () {
      currentScrollPosition.value = document.documentElement.scrollTop

      if (currentScrollPosition.value < 0) {
        return
      }

      if (Math.abs(currentScrollPosition.value - lastScrollPosition.value) < 60) {
        return
      }

      show.value = currentScrollPosition.value < lastScrollPosition.value
      lastScrollPosition.value = currentScrollPosition.value
    }

    const isOnTop = computed(() => {
      return transparent.value && currentScrollPosition.value <= 30
    })

    onMounted(() => window.addEventListener('scroll', handleScroll))
    onUnmounted(() => window.removeEventListener('scroll', handleScroll))

    return {
      open,
      navigation,
      desktopNavigation,
      profileEmail,
      profileImageUrl,
      profileName,
      isMac,
      searchNavbar,
      searchQuery,
      loading,
      signOut,
      showSearchDialog,
      isOnTop,
      show,
      t
    }
  }
}
</script>

<style lang="postcss" scoped>
.app-navbar {
  @apply fixed inset-x-0 bg-gray-800/95
    backdrop-blur sm:backdrop-filter-none md:backdrop-blur
    transition duration-300 ease-in-out sm:left-16 md:left-0;
}

.app-navbar.is-transparent {
  @apply bg-transparent md:bg-gray-800/95;
}

.app-navbar.is-hidden:not(:focus-within) {
  transform: translate3d(0, -100%, 0);
}

.app-navbar.is-hidden.is-transparent {
  @apply bg-gray-800/95;
}

.nav-link.is-active {
  @apply bg-gray-900 text-white hover:bg-gray-900;
}

abbr[title].no-underline {
  -webkit-text-decoration: none;
  text-decoration: none;
}

.enter {
  @apply hidden;
}

#search-navbar:focus + .key-tooltip .enter,
#search-form:focus-within .key-tooltip .enter {
  @apply md:block;
}

#search-navbar:focus + .key-tooltip .ctrl-k,
#search-form:focus-within .key-tooltip .ctrl-k {
  @apply hidden;
}

.fake-search-input {
  @apply hidden lg:flex items-center pl-3 pr-2 py-2 mr-2
    bg-gray-700 rounded-md space-x-2
    text-gray-500 dark:text-gray-400;
}

.fake-search-input:hover {
  @apply bg-gray-600 text-gray-300 dark:text-gray-300;
}

.fake-search-input:focus-visible {
  @apply ring-primary-500 ring-offset-gray-800 dark:ring-offset-gray-800
    text-gray-300 dark:text-gray-300;
}
</style>
