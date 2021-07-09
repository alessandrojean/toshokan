<template>
  <nav
    class="shadow-top md:hidden z-20 flex sm:flex-col items-center bg-white dark:bg-gray-800 fixed bottom-0 left-0 sm:inset-y-0 w-full sm:w-16 h-16 sm:h-screen p-2 border-t sm:border-t-0 sm:border-r border-gray-200 dark:border-gray-700"
    aria-label="Navegação principal"
  >
    <div aria-hidden="true" class="hidden sm:block mt-1.5 mb-6">
      <LibraryIconSolid class="text-indigo-500 w-9 h-9" />
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
              isActive ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : '',
              'w-full sm:w-auto sm:p-2 text-gray-500 font-medium inline-flex space-y-1 flex-col items-center justify-center rounded-md'
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
    </ul>
  </nav>
</template>

<script>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  HomeIcon,
  LibraryIcon,
  PresentationChartLineIcon,
  SearchIcon
} from '@heroicons/vue/outline'
import { LibraryIcon as LibraryIconSolid } from '@heroicons/vue/solid'

export default {
  name: 'MobileNavbar',

  components: { LibraryIconSolid },

  setup () {
    const { t } = useI18n()

    const items = computed(() => [
      { to: 'DashboardHome', title: t('dashboard.home.title'), icon: HomeIcon },
      { to: 'DashboardLibrary', title: t('dashboard.library.title'), icon: LibraryIcon },
      { to: 'DashboardSearch', title: t('dashboard.search.title'), icon: SearchIcon },
      { to: 'DashboardStats', title: t('dashboard.stats.title'), icon: PresentationChartLineIcon }
    ])

    return { items }
  }
}
</script>
