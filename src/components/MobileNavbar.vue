<template>
  <nav
    class="shadow-top md:hidden z-20 flex items-center bg-white dark:bg-gray-800 fixed bottom-0 left-0 w-full h-16 p-2 border-t border-gray-200 dark:border-gray-700"
    aria-label="Navegação principal"
  >
    <ul class="w-full flex">
      <li
        v-for="item in items"
        :key="item.to"
        class="flex-1"
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
              'w-full text-gray-500 font-medium inline-flex space-y-1 flex-col items-center justify-center rounded-md'
            ]"
            @click="navigate"
          >
            <span aria-hidden="true">
              <component :is="item.icon" class="w-6 h-6 motion-safe:transition-colors duration-500" />
            </span>
            <span class="text-xs motion-safe:transition-colors duration-500">{{ item.title }}</span>
          </a>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import { ref } from 'vue'

import {
  HomeIcon,
  LibraryIcon,
  PresentationChartLineIcon,
  SearchIcon,
  ShoppingBagIcon
} from '@heroicons/vue/outline'

export default {
  name: 'MobileNavbar',

  setup () {
    const items = ref([
      { to: 'DashboardHome', title: 'Dashboard', lang: 'en', icon: HomeIcon },
      { to: 'DashboardLibrary', title: 'Biblioteca', icon: LibraryIcon },
      { to: 'DashboardSearch', title: 'Pesquisa', icon: SearchIcon },
      { to: 'DashboardStats', title: 'Estatísticas', icon: PresentationChartLineIcon },
      { to: 'DashboardWishlist', title: 'Wishlist', lang: 'en', icon: ShoppingBagIcon }
    ])

    return { items }
  }
}
</script>
