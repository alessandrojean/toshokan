<template>
  <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <router-link :to="{ name: 'DashboardHome' }" class="flex-shrink-0">
            <LibraryIcon class="h-10 w-10 text-indigo-500" />
          </router-link>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <template v-for="item in desktopNavigation" :key="item.name">
                <router-link
                  :to="{ name: item.name }"
                  class="nav-link text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  {{ item.title }}
                </router-link>
              </template>
            </div>
          </div>
        </div>
        <div class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6">
            <transition
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
            >
              <div class="relative hidden md:block mr-2 group" v-if="showSearch">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon class="w-4 h-4 text-gray-500 group-focus-within:text-gray-300 sm:text-sm" aria-hidden="true" />
                </div>
                <label for="search-navbar" class="sr-only">Buscar por</label>
                <input
                  ref="searchNavbar"
                  id="search-navbar"
                  type="text"
                  class="focus:outline-none focus:ring-indigo-600 block w-full pl-9 pr-16 py-2 bg-gray-700 border-gray-700 rounded-md text-gray-300 text-sm"
                  placeholder="Pesquisar na coleção"
                  v-model="searchQuery"
                  @keyup.enter.stop="handleSearch"
                >
                <div class="key-tooltip absolute right-2 inset-y-0 hidden sm:flex justify-center items-center">
                  <span class="ctrl-k text-gray-300 text-xs leading-5 px-1.5 border border-gray-500 rounded-md">
                    <span class="sr-only">Pressione </span>
                    <kbd class="font-sans">
                      <abbr title="Control" class="no-underline">Ctrl </abbr>
                    </kbd>
                    <span class="sr-only"> mais </span>
                    <kbd class="font-sans">K</kbd>
                    <span class="sr-only"> para focar</span>
                  </span>
                  <span class="enter text-gray-300 text-xs leading-5 px-1.5 border border-gray-500 rounded-md">
                    <span class="sr-only">Pressione </span>
                    <kbd class="font-sans">Enter</kbd>
                    <span class="sr-only"> para pesquisar</span>
                  </span>
                </div>
              </div>
            </transition>

            <!-- Profile dropdown -->
            <Menu as="div" class="ml-3 relative">
              <div>
                <MenuButton class="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  <span class="sr-only">Abrir menu de usuário</span>
                  <img class="h-8 w-8 rounded-full" :src="profileImageUrl" alt="">
                </MenuButton>
              </div>
              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <MenuItems as="ul" class="absolute right-0 w-48 mt-2 py-1 origin-top-right bg-white dark:bg-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10 focus:outline-none">
                  <div class="pb-1">
                    <MenuItem as="li" v-slot="{ active }">
                      <router-link
                        :to="{ name: 'DashboardSettings' }"
                        :class="[
                          active ? 'bg-gray-100 dark:bg-gray-600' : '',
                          'group flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-gray-200'
                        ]"
                      >
                        <CogIcon
                          class="w-5 h-5 mr-3 text-gray-500 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300"
                          aria-hidden="true"
                        />
                        Configurações
                      </router-link>
                    </MenuItem>
                  </div>
                  <div class="pt-1">
                    <MenuItem as="li" v-slot="{ active }">
                      <button
                        type="button"
                        :class="[
                          active ? 'bg-gray-100 dark:bg-gray-600' : '',
                          'group flex items-start w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-gray-200'
                        ]"
                        @click.stop="signOut"
                      >
                        <LogoutIcon
                          class="w-5 h-5 mr-3 text-red-500 group-hover:text-red-600 dark:text-red-400 dark:group-hover:text-red-500"
                          aria-hidden="true"
                        />
                        Sair
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
        <div class="mr-2 flex md:hidden">
          <!-- Mobile menu button -->
          <DisclosureButton class="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
            <span class="sr-only">Abrir o menu principal</span>
            <MenuIcon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
      </div>
    </div>

    <DisclosurePanel class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <DisclosureButton
          as="template"
          v-for="item in navigation"
          :key="item.name"
        >
          <router-link
            :to="{ name: item.name }"
            class="nav-mobile-link text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            {{ item.title }}
          </router-link>
        </DisclosureButton>
      </div>
      <div class="pt-4 pb-3 border-t border-gray-700">
        <div class="flex items-center px-5">
          <div class="flex-shrink-0">
            <img class="h-10 w-10 rounded-full" :src="profileImageUrl" alt="" />
          </div>
          <div class="ml-3 space-y-1">
            <div class="text-base font-medium leading-none text-white">
              {{ profileName }}
            </div>
            <div class="text-sm font-medium leading-none text-gray-400">
              {{ profileEmail }}
            </div>
          </div>
        </div>
        <div class="mt-3 px-2 space-y-1">
          <DisclosureButton as="template">
            <router-link
              :to="{ name: 'DashboardSettings' }"
              class="nav-mobile-link text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Configurações
            </router-link>
          </DisclosureButton>
          <button
            type="button"
            @click.stop="signOut"
            class="nav-mobile-link w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Sair
          </button>
        </div>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems
} from '@headlessui/vue'

import {
  CogIcon,
  LibraryIcon,
  LogoutIcon,
  MenuIcon,
  SearchIcon,
  XIcon
} from '@heroicons/vue/solid'

export default {
  name: 'AppNavbar',

  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    CogIcon,
    LibraryIcon,
    LogoutIcon,
    MenuIcon,
    SearchIcon,
    XIcon
  },

  setup () {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const open = ref(false)
    const navigation = ref([
      { name: 'DashboardHome', title: 'Dashboard' },
      { name: 'DashboardCollection', title: 'Coleção' },
      { name: 'DashboardStats', title: 'Estatísticas' },
      { name: 'DashboardWishlist', title: 'Lista de desejos' },
      { name: 'DashboardSearch', title: 'Pesquisa', mobileOnly: true }
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

    // Focus on search input by pressing Ctrl + K
    const focusOnSearch = () => {
      nextTick(() => {
        searchNavbar.value.focus()
      })
    }

    const handleKeyDown = event => {
      if (event.ctrlKey && event.key === 'k' && showSearch.value) {
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

    return {
      handleSearch,
      open,
      navigation,
      desktopNavigation,
      profileEmail,
      profileImageUrl,
      profileName,
      searchNavbar,
      searchQuery,
      showSearch,
      signOut
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
