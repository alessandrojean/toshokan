<template>
  <nav
    :class="[
      isTransparent ? 'dark:bg-opacity-0 md:dark:bg-opacity-100' : '',
      'bg-gray-800 motion-safe:transition-opacity duration-400'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div class="flex-1 flex items-center justify-start md:items-stretch">
          <router-link
            :to="{ name: 'Home' }"
            class="flex-shrink-0 flex items-center rounded-md transition-shadow motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-gray-700"
          >
            <span aria-hidden="true" class="sm:hidden md:block">
              <LibraryIcon class="h-9 w-9 text-indigo-500" aria-hidden="true" />
            </span>
            <span class="sr-only">{{ t('dashboard.header.links.start') }}</span>
            <span class="text-gray-200 font-title font-semibold text-xl ml-3 sm:ml-0 md:ml-3 md:hidden lg:block" aria-hidden="true">
              {{ t('app.name') }}
            </span>
          </router-link>

          <div class="hidden md:block md:ml-6" role="navigation" aria-label="Menu principal" id="main-menu-desktop">
            <ul class="flex space-x-4">
              <li
                v-for="item in desktopNavigation"
                :key="item.name"
                :lang="item.lang || ''"
                class="self-stretch"
              >
                <router-link
                  :to="{ name: item.name }"
                  class="block nav-link text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-shadow motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-gray-800"
                >
                  {{ item.title }}
                </router-link>
              </li>
            </ul>
          </div>
        </div>

        <div class="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
          <!-- Search link -->
          <router-link
            v-if="showSearch"
            :to="{ name: 'DashboardSearch' }"
            class="hidden md:block lg:hidden bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white transition-shadow motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-gray-800"
          >
            <span class="sr-only">{{ t('dashboard.header.search.link') }}</span>
            <span aria-hidden="true">
              <SearchIcon class="h-6 w-6" />
            </span>
          </router-link>

          <!-- Search form -->
          <transition
            leave-active-class="transition motion-reduce:transition-none duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
            enter-active-class="transition motion-reduce:transition-none duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
          >
            <form
              role="form"
              class="relative hidden lg:block mr-2 group"
              v-if="showSearch"
              aria-labelledby="search-form-title"
              @submit.prevent="handleSearch"
            >
              <p class="sr-only" id="search-form-title" aria-hidden="true">
                {{ t('dashboard.header.search.title') }}
              </p>
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
                <SearchIcon class="w-4 h-4 text-gray-500 group-focus-within:text-gray-300 sm:text-sm" />
              </div>
              <label for="search-navbar" class="sr-only">
                {{ t('dashboard.header.search.label' )}}
              </label>
              <input
                ref="searchNavbar"
                id="search-navbar"
                type="text"
                class="focus:outline-none focus:ring-indigo-600 block w-full pl-9 pr-16 py-2 bg-gray-700 border-gray-700 rounded-md text-gray-300 text-sm"
                :placeholder="t('dashboard.header.search.placeholder')"
                v-model="searchQuery"
                aria-describedby="navbar-search-enter-hint"
              >
              <div class="key-tooltip absolute right-2 inset-y-0 hidden sm:flex justify-center items-center">
                <span class="ctrl-k text-gray-300 text-xs leading-5 px-1.5 border border-gray-500 rounded-md">
                  <span class="sr-only">{{ t('dashboard.header.search.press') }} </span>
                  <kbd class="font-sans">
                    <abbr title="Control" class="no-underline" v-if="!isMac">{{ t('dashboard.header.search.ctrl') }}&nbsp;</abbr>
                    <abbr title="Command" class="no-underline" v-else>⌘&nbsp;</abbr>
                  </kbd>
                  <span class="sr-only"> {{ t('dashboard.header.search.plus') }} </span>
                  <kbd class="font-sans">K</kbd>
                  <span class="sr-only"> {{ t('dashboard.header.search.toFocus') }}</span>
                </span>
                <span id="navbar-search-enter-hint" class="enter text-gray-300 text-xs leading-5 px-1.5 border border-gray-500 rounded-md">
                  <span class="sr-only">{{ t('dashboard.header.search.press') }} </span>
                  <kbd class="font-sans">{{ t('dashboard.header.search.enter') }}</kbd>
                  <span class="sr-only"> {{ t('dashboard.header.search.toSearch') }}</span>
                </span>
              </div>

              <button type="submit" class="sr-only">
                {{ t('dashboard.header.search.search' )}}
              </button>
            </form>
          </transition>

          <!-- Profile dropdown -->
          <Menu as="div" class="ml-3 relative">
            <div>
              <MenuButton class="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none transition-shadow motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-gray-700">
                <span class="sr-only">{{ t('dashboard.header.menu.open') }}</span>
                <img class="h-8 w-8 rounded-full" :src="profileImageUrl" alt="">
              </MenuButton>
            </div>
            <transition
              enter-active-class="transition motion-reduce:transition-none duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition motion-reduce:transition-none duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <MenuItems as="ul" class="absolute right-0 w-48 mt-2 py-1 origin-top-right bg-white dark:bg-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10 focus:outline-none">
                <div class="pb-1">
                  <MenuItem v-slot="{ active }">
                    <router-link
                      :to="{ name: 'DashboardSettings' }"
                      :class="[
                        active ? 'bg-gray-100 dark:bg-gray-600' : '',
                        'group flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-gray-700'
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
                        'group flex items-start w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-gray-700'
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
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
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

export default {
  name: 'AppNavbar',

  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    CogIcon,
    LibraryIcon,
    LogoutIcon,
    SearchIcon
  },

  setup () {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const { t } = useI18n({ useScope: 'global' })

    const open = ref(false)
    const navigation = computed(() => [
      {
        name: 'DashboardHome',
        title: t('dashboard.header.links.dashboard')
      },
      {
        name: 'DashboardLibrary',
        title: t('dashboard.header.links.library')
      },
      {
        name: 'DashboardStats',
        title: t('dashboard.header.links.statistics')
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

    const showSearch = computed(() => {
      return route.name !== 'DashboardSearch' && !store.state.sheet.loading
    })

    const handleSearch = () => {
      router.push({
        name: 'DashboardSearch',
        query: {
          q: searchQuery.value
        }
      })

      searchQuery.value = ''
    }

    const signOut = () => store.dispatch('auth/signOut')

    const isMac = ref(navigator.platform.toLowerCase().indexOf('mac') > -1)

    // Focus on search input by pressing Ctrl + K
    const focusOnSearch = () => {
      nextTick(() => {
        searchNavbar.value.focus()
      })
    }

    /**
     * @param {KeyboardEvent} event
     */
    const handleKeyDown = event => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k' && showSearch.value) {
        event.stopPropagation()
        event.preventDefault()
        focusOnSearch()
      }
    }

    onMounted(() => {
      document.addEventListener('keydown', handleKeyDown)
    })

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeyDown)
    })

    const isTransparent = computed(() => {
      return route.name === 'BookDetails'
    })

    return {
      handleSearch,
      open,
      navigation,
      desktopNavigation,
      profileEmail,
      profileImageUrl,
      profileName,
      isMac,
      searchNavbar,
      searchQuery,
      showSearch,
      signOut,
      isTransparent,
      t
    }
  }
}
</script>

<style scoped>
.nav-link.router-link-active {
  @apply bg-gray-900 text-white hover:bg-gray-900;
}

.nav-mobile-link.router-link-active {
  @apply bg-gray-900 text-white hover:bg-gray-900;
}

abbr[title].no-underline {
  -webkit-text-decoration: none;
  text-decoration: none;
}

.enter {
  @apply hidden;
}

#search-navbar:focus + .key-tooltip .enter {
  @apply block;
}

#search-navbar:focus + .key-tooltip .ctrl-k {
  @apply hidden;
}
</style>
