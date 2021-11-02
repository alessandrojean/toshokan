<template>
  <nav
    :class="[
      'motion-safe:transition-shadow duration-100 shadow-top md:hidden z-20 flex sm:flex-col items-center bg-white dark:bg-gray-800 fixed bottom-0 left-0 sm:inset-y-0 w-full sm:w-16 h-16 sm:h-screen p-2 border-t sm:border-t-0 sm:border-r border-gray-200 dark:border-gray-700'
      /* $route.name === 'DashboardLibrary' ? '' : 'shadow-top' */
    ]"
    aria-label="Navegação principal"
  >
    <div aria-hidden="true" class="hidden sm:block mt-1.5 mb-6">
      <LibraryIconSolid class="text-primary-500 w-9 h-9" />
    </div>
    <ul class="w-full sm:h-full flex items-center sm:justify-start sm:flex-col sm:space-y-2">
      <li
        v-for="item in items"
        :key="item.to"
        class="flex-1 sm:flex-initial"
      >
        <router-link
          custom
          :to="{ name: item.to }"
          v-slot="{ href, navigate, isActive, isExactActive }"
        >
          <a
            :lang="item.lang"
            :href="href"
            :aria-current="isExactActive ? 'page' : undefined"
            :class="[
              (item.exact ? isExactActive : isActive) ? 'text-primary-600 dark:text-primary-400' : '',
              'w-full sm:w-auto sm:p-2 text-gray-500 dark:text-gray-400 font-semibold inline-flex space-y-1 flex-col items-center justify-center rounded-md'
            ]"
            @click="navigate"
          >
            <span aria-hidden="true">
              <component :is="item.icon" class="w-6 h-6 sm:w-7 sm:h-7 motion-safe:transition-colors duration-500" />
            </span>
            <span class="text-xs sm:sr-only motion-safe:transition-colors duration-500">{{ item.title }}</span>
          </a>
        </router-link>
      </li>

      <!-- More menu -->
      <li class="flex-1 sm:hidden">
        <Popover as="div" v-slot="{ open }">
          <PopoverButton
            :class="[
              $route.meta.more ? 'text-primary-600 dark:text-primary-400' : '',
              'w-full sm:w-auto sm:p-2 text-gray-500 dark:text-gray-400 font-semibold inline-flex space-y-1 flex-col items-center justify-center rounded-md'
            ]"
          >
            <span aria-hidden="true">
              <DotsHorizontalIcon class="w-6 h-6 motion-safe:transition-colors duration-500" />
            </span>
            <span class="text-xs motion-safe:transition-colors duration-500">
              {{ t('dashboard.header.menu.more') }}
            </span>
          </PopoverButton>
          <transition
            enter-active-class="transition motion-reduce:transition-none ease-out duration-300"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition motion-reduce:transition-none ease-in duration-200"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <PopoverOverlay
              :class="!open ? 'hidden' : 'md:hidden'"
              class="dialog-overlay"
            />
          </transition>
          <transition
            enter-active-class="transition motion-reduce:transition-none duration-300 md:duration-100 ease-out"
            enter-from-class="translate-y-full opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition motion-reduce:transition-none duration-200 md:duration-75 ease-in"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="translate-y-full opacity-0"
          >
            <PopoverPanel
              as="ul"
              class="fixed md:absolute z-40 inset-x-0 bottom-0 py-1 origin-bottom bg-white dark:bg-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded-t-2xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              v-slot="{ close }"
            >
              <div class="pb-1 w-full">
                <div class="flex px-4 py-2.5 space-x-4">
                  <div
                    class="rounded-full w-10 h-10 bg-contain shadow-avatar"
                    :style="{ backgroundImage: `url('${profileImageUrl}')` }"
                  />
                  <div class="flex-1 flex flex-col justify-center text-sm text-gray-700 dark:text-gray-300">
                    <span class="font-semibold font-display truncate">{{ profileName }}</span>
                    <span class="text-xs dark:text-gray-400 truncate">{{ profileEmail }}</span>
                  </div>
                </div>
              </div>
              <div class="py-1">
                <router-link
                  :to="{ name: 'DashboardSettings' }"
                  class="group flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 focus-visible:ring-offset-gray-700 hover:bg-gray-100"
                  @click="close"
                >
                  <span aria-hidden="true">
                    <CogIcon class="w-5 h-5 mr-3 text-gray-500 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300" />
                  </span>
                  {{ t('dashboard.header.menu.settings') }}
                </router-link>
              </div>
              <div class="pt-1">
                <PopoverButton
                  class="group flex items-center w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 focus-visible:ring-offset-gray-700 hover:bg-gray-100"
                  @click="signOut(close)"
                >
                  <span aria-hidden="true">
                    <LogoutIcon class="w-5 h-5 mr-3 text-red-500 group-hover:text-red-600 dark:text-red-400 dark:group-hover:text-red-500" />
                  </span>
                  {{ t('dashboard.header.menu.signOut') }}
                </PopoverButton>
              </div>
            </PopoverPanel>
          </transition>
        </Popover>
      </li>
    </ul>
  </nav>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import {
  DotsHorizontalIcon,
  HomeIcon,
  LibraryIcon,
  PresentationChartLineIcon
} from '@heroicons/vue/outline'

import {
  CogIcon,
  LibraryIcon as LibraryIconSolid,
  LogoutIcon
} from '@heroicons/vue/solid'

import {
  Popover,
  PopoverButton,
  PopoverOverlay,
  PopoverPanel
} from '@headlessui/vue'

export default {
  name: 'MobileNavbar',

  components: {
    DotsHorizontalIcon,
    CogIcon,
    LibraryIconSolid,
    LogoutIcon,
    Popover,
    PopoverButton,
    PopoverOverlay,
    PopoverPanel
  },

  setup () {
    const { t } = useI18n()

    const items = computed(() => [
      {
        to: 'DashboardHome',
        title: t('dashboard.home.title'),
        icon: HomeIcon,
        exact: true
      },
      {
        to: 'DashboardLibrary',
        title: t('dashboard.library.title'),
        icon: LibraryIcon
      },
      {
        to: 'DashboardStats',
        title: t('dashboard.stats.title'),
        icon: PresentationChartLineIcon
      }
    ])

    const store = useStore()

    const profileEmail = computed(() => store.state.auth.profileEmail)
    const profileImageUrl = computed(() => store.state.auth.profileImageUrl)
    const profileName = computed(() => store.state.auth.profileName)

    async function signOut (close) {
      await store.dispatch('auth/signOut')
      close()
    }

    return {
      items,
      profileEmail,
      profileImageUrl,
      profileName,
      signOut,
      t
    }
  }
}
</script>
