<template>
  <nav
    :class="[
      isTransparent ? 'dark:bg-gray-700 md:dark:bg-gray-800' : '',
      'bg-gray-800 motion-safe:transition-opacity duration-400'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div class="flex-1 flex items-center justify-start md:items-stretch">
          <router-link
            :to="{ name: 'DashboardHome' }"
            class="flex-shrink-0 flex items-center rounded-md transition-shadow motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 focus-visible:ring-offset-gray-800"
          >
            <span aria-hidden="true" class="sm:hidden md:block">
              <LibraryIcon class="h-9 w-9 text-primary-500" aria-hidden="true" />
            </span>
            <span class="sr-only">{{ t('dashboard.header.links.start') }}</span>
            <span class="text-gray-200 font-display font-semibold text-xl ml-3 sm:ml-0 md:ml-3 md:hidden lg:block" aria-hidden="true">
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
                  :exact="item.exact"
                  :exact-active-class="item.exact ? 'is-active' : undefined"
                  :active-class="!item.exact ? 'is-active' : undefined"
                  :to="{ name: item.name }"
                  class="block nav-link text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-shadow motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 focus-visible:ring-offset-gray-800"
                >
                  {{ item.title }}
                </router-link>
              </li>
            </ul>
          </div>
        </div>

        <div class="absolute inset-y-0 right-0 flex items-center sm:pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
          <!-- Search link -->
          <button
            v-if="showSearch"
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
              class="hidden lg:flex items-center pl-3 pr-2 py-2 bg-gray-700 hover:bg-gray-600 mr-2 group rounded-md space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 focus-visible:ring-offset-gray-800 motion-safe:transition-shadow"
              v-if="showSearch"
              @click="showSearchDialog"
            >
              <span aria-hidden="true">
                <SearchIcon class="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-300 group-focus-visible:text-gray-300 sm:text-sm" />
              </span>
              <span class="text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-300 group-focus-visible:text-gray-300 w-56 text-left">
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
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition motion-reduce:transition-none duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <MenuItems as="ul" class="fixed md:absolute z-40 left-8 md:left-auto right-8 md:right-0 bottom-8 md:bottom-auto md:w-48 mt-2 py-1 origin-bottom md:origin-top-right bg-white dark:bg-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="pb-1">
                  <MenuItem v-slot="{ active }">
                    <router-link
                      :to="{ name: 'DashboardSettings' }"
                      :class="[
                        active ? 'bg-gray-100 dark:bg-gray-600' : '',
                        'group flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 focus-visible:ring-offset-gray-700'
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
                        'group flex items-start w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 focus-visible:ring-offset-gray-700'
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

    <SearchDialog
      :is-open="searchDialogIsOpen"
      @close="closeSearchDialog"
    />
  </nav>
</template>

<script>
import { computed, onMounted, onUnmounted, ref } from 'vue'
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

import SearchDialog from '@/components/SearchDialog.vue'

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
    SearchIcon,
    SearchDialog
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
        title: t('dashboard.header.links.dashboard'),
        exact: true
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

    const showSearch = computed(() => !store.state.sheet.loading)

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

    const isMac = ref(
      navigator.userAgentData
        ? navigator.userAgentData.platform.toLowerCase().indexOf('mac') > -1
        : navigator.platform.toLowerCase().indexOf('mac') > -1
    )

    const searchDialogIsOpen = ref(false)

    function showSearchDialog () {
      searchDialogIsOpen.value = true
    }

    function closeSearchDialog () {
      searchDialogIsOpen.value = false
    }

    /**
     * @param {KeyboardEvent} event
     */
    const handleKeyDown = event => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === 'k' &&
        showSearch.value &&
        !searchDialogIsOpen.value
      ) {
        event.stopPropagation()
        event.preventDefault()
        showSearchDialog()
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
      searchDialogIsOpen,
      showSearchDialog,
      closeSearchDialog,
      isTransparent,
      t
    }
  }
}
</script>

<style scoped>
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
</style>
