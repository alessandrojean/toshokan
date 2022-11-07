<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

import { useSheetStore } from '@/stores/sheet'
import { ShowSearchDialogKey } from '@/symbols'
import { injectStrict } from '@/utils'

import {
  BuildingLibraryIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/20/solid'

import FadeTransition from '@/components/transitions/FadeTransition.vue'
import ProfileMenu from '@/components/ProfileMenu.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const props = withDefaults(defineProps<{ transparent: boolean }>(), {
  transparent: false
})

const sheetStore = useSheetStore()

const { t } = useI18n({ useScope: 'global' })

const { transparent } = toRefs(props)

const shared = computed(() => sheetStore.shared)
const loading = computed(() => sheetStore.loading)

type NavigationItem = {
  name: string
  title: string
  exact?: boolean
  mobileOnly?: boolean
  lang?: string
  hidden?: boolean
}

const navigation = computed<NavigationItem[]>(() => [
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

const desktopNavigation = computed(() => {
  return navigation.value.filter((navItem) => !navItem.mobileOnly)
})

const isMac = ref(
  // @ts-ignore
  navigator.userAgentData
    ? // @ts-ignore
      navigator.userAgentData.platform.toLowerCase().indexOf('mac') > -1
    : navigator.platform.toLowerCase().indexOf('mac') > -1
)

const showSearchDialog = injectStrict(ShowSearchDialogKey)

const currentScrollPosition = ref(0)
const lastScrollPosition = ref(0)
const show = ref(true)

function handleScroll() {
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
</script>

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
        <div class="flex-1 flex items-center justify-start">
          <router-link
            :to="{ name: 'Home' }"
            :class="isOnTop ? 'opacity-95' : ''"
            class="shrink-0 flex items-center rounded-md hocus:bg-gray-700 group px-2 py-1 -ml-2 has-ring-focus focus-visible:ring-offset-gray-800"
          >
            <span aria-hidden="true" class="sm:hidden md:block">
              <BuildingLibraryIcon
                :class="[
                  'h-9 w-9 motion-safe:transition-colors md:motion-safe:transition-none',
                  isOnTop
                    ? 'text-gray-200 md:text-primary-500'
                    : 'text-primary-500',
                  'md:group-hover:text-gray-100 md:group-focus-visible:text-gray-100'
                ]"
              />
            </span>
            <span class="sr-only">{{ t('dashboard.header.links.start') }}</span>
            <span
              class="text-gray-200 group-hover:text-gray-100 group-focus-visible:text-gray-100 font-display font-semibold text-xl ml-3 sm:ml-0 md:ml-3 md:hidden lg:block"
              aria-hidden="true"
            >
              {{ t('app.name') }}
            </span>
            <sup
              class="text-gray-400 group-hover:text-gray-300 group-focus-visible:text-gray-300 font-semibold text-[0.6rem] align-super ml-0.5"
              aria-hidden="true"
            >
              BETA
            </sup>
          </router-link>

          <div
            class="hidden md:block md:ml-2 h-fit"
            role="navigation"
            aria-label="Menu principal"
            id="main-menu-desktop"
          >
            <ul class="flex space-x-2">
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
                    class="block nav-link text-gray-300 hocus:bg-gray-700 hocus:text-white px-3 py-2 rounded-md text-sm font-medium has-ring-focus focus-visible:ring-offset-gray-800"
                  >
                    {{ item.title }}
                  </router-link>
                </li>
              </template>
            </ul>
          </div>
        </div>

        <div
          class="absolute inset-y-0 right-0 flex items-center sm:pr-2 md:static md:inset-auto md:ml-6 md:pr-0"
        >
          <!-- Search link -->
          <button
            v-if="!loading"
            @click="showSearchDialog()"
            class="lg:hidden p-1 rounded-full text-gray-400 hover:text-white transition-shadow motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 focus-visible:ring-offset-gray-800"
          >
            <span class="sr-only">{{ t('dashboard.header.search.link') }}</span>
            <span aria-hidden="true">
              <MagnifyingGlassIcon class="h-6 w-6" />
            </span>
          </button>

          <!-- Search form -->
          <FadeTransition>
            <button
              class="fake-search-input has-ring-focus group"
              v-if="!loading"
              @click="showSearchDialog()"
            >
              <span aria-hidden="true">
                <MagnifyingGlassIcon class="w-4 h-4" />
              </span>
              <span class="text-sm w-56 text-left">
                {{ t('dashboard.header.search.placeholder') }}
              </span>
              <span
                aria-hidden="true"
                class="ctrl-k text-gray-300 group-hover:text-gray-200 group-focus-visible:text-gray-200 text-xs leading-5 px-1.5 border border-gray-500 group-hover:border-gray-400 group-focus-visible:border-gray-400 bg-gray-700 group-hover:bg-gray-700 group-focus-visible:bg-gray-700 rounded-md"
              >
                <kbd class="font-sans">
                  <abbr title="Control" class="no-underline" v-if="!isMac"
                    >{{ t('dashboard.header.search.ctrl') }}&nbsp;</abbr
                  >
                  <abbr title="Command" class="no-underline" v-else
                    >⌘&nbsp;</abbr
                  >
                </kbd>
                <kbd class="font-sans">K</kbd>
              </span>
            </button>
          </FadeTransition>

          <ThemeToggle class="ml-1" />

          <ProfileMenu />
        </div>
      </div>
    </div>
  </nav>
</template>

<style lang="postcss" scoped>
.app-navbar {
  @apply fixed inset-x-0
    bg-gray-800 supports-backdrop-blur:bg-gray-800/95
    backdrop-blur sm:backdrop-filter-none md:backdrop-blur
    transition duration-300 ease-in-out sm:left-16 md:left-0;
}

.app-navbar.is-transparent {
  @apply bg-transparent
    supports-backdrop-blur:md:bg-gray-800/95 md:bg-gray-800;
}

.app-navbar.is-hidden:not(:focus-within) {
  transform: translate3d(0, -100%, 0);
}

.app-navbar.is-hidden.is-transparent {
  @apply supports-backdrop-blur:bg-gray-800/95 bg-gray-800;
}

.nav-link.is-active {
  @apply bg-gray-900 text-white hocus:bg-gray-900;
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
    bg-gray-700 rounded-lg space-x-2
    text-gray-300/80;
}

.fake-search-input:where(:hover, :focus-visible) {
  @apply bg-gray-600 text-gray-300;
}

.fake-search-input:focus-visible {
  @apply ring-offset-gray-800;
}
</style>
