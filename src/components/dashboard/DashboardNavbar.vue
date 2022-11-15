<script lang="ts" setup>
import { ShowAsideDialogKey, ShowSearchDialogKey } from '@/symbols'
import { injectStrict } from '@/util'

import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/vue/20/solid'

import FadeTransition from '@/components/transitions/FadeTransition.vue'
import ProfileMenu from '@/components/ProfileMenu.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import ToshokanLogo from '@/components/ToshokanLogo.vue'

export interface DashboardNavbarProps {
  transparent?: boolean
}

const props = withDefaults(defineProps<DashboardNavbarProps>(), {
  transparent: false
})
const { transparent } = toRefs(props)

const sheetStore = useSheetStore()

const { t } = useI18n({ useScope: 'global' })

const loading = computed(() => sheetStore.loading)

const isMac = ref(
  // @ts-ignore
  navigator.userAgentData
    ? // @ts-ignore
      navigator.userAgentData.platform.toLowerCase().indexOf('mac') > -1
    : navigator.platform.toLowerCase().indexOf('mac') > -1
)

const showAsideDialog = injectStrict(ShowAsideDialogKey)
const showSearchDialog = injectStrict(ShowSearchDialogKey)

const isScrolling = ref(false)

function handleScroll() {
  isScrolling.value = window.scrollY > 0
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <nav
    :class="[
      'app-navbar z-20',
      { 'app-navbar-transparent': transparent && !isScrolling }
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="flex items-center h-16">
        <button
          @click="showAsideDialog()"
          class="lg:hidden p-1 mr-2 rounded-full text-gray-300 hover:text-white transition-shadow motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 focus-visible:ring-offset-gray-800"
        >
          <span class="sr-only">
            {{ t('dashboard.header.menu.mobileOpen') }}
          </span>
          <span aria-hidden="true">
            <Bars3Icon class="h-6 w-6" />
          </span>
        </button>

        <ToshokanLogo
          class="ml-1 lg:hidden"
          :label="t('app.name')"
          dark
          icon-only
        />

        <FadeTransition>
          <button
            class="fake-search-input has-ring-focus group"
            v-if="!loading"
            @click="showSearchDialog()"
          >
            <span aria-hidden="true">
              <MagnifyingGlassIcon class="w-5 h-5" />
            </span>
            <span class="text-sm w-56 text-left">
              {{ t('dashboard.header.search.placeholder') }}
            </span>
            <span
              aria-hidden="true"
              class="ctrl-k motion-safe:transition-colors motion-safe:duration-300 text-gray-300 text-xs leading-5 px-1.5 bg-gray-800 rounded-md"
            >
              <kbd class="font-sans">
                <abbr title="Control" class="no-underline" v-if="!isMac">
                  {{ t('dashboard.header.search.ctrl') }}&nbsp;
                </abbr>
                <abbr title="Command" class="no-underline" v-else>⌘&nbsp;</abbr>
              </kbd>
              <kbd class="font-sans">K</kbd>
            </span>
          </button>
        </FadeTransition>

        <div class="ml-auto inline-flex">
          <FadeTransition>
            <button
              v-if="!loading"
              @click="showSearchDialog()"
              :class="[
                'lg:hidden p-1 mr-2 rounded-full transition-shadow motion-reduce:transition-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 focus-visible:ring-offset-gray-800',
                transparent && !isScrolling
                  ? 'text-white/80 hover:text-white/95'
                  : 'text-gray-400 hover:text-white'
              ]"
            >
              <span class="sr-only">{{
                t('dashboard.header.search.link')
              }}</span>
              <span aria-hidden="true">
                <MagnifyingGlassIcon class="h-6 w-6" />
              </span>
            </button>
          </FadeTransition>

          <ThemeToggle :transparent="transparent && !isScrolling" />

          <ProfileMenu :transparent="transparent && !isScrolling" />
        </div>
      </div>
    </div>
  </nav>
</template>

<style lang="postcss" scoped>
.app-navbar {
  @apply bg-gray-800 supports-backdrop-blur:bg-gray-800/95
    backdrop-blur sm:backdrop-filter-none md:backdrop-blur
    transition duration-300 ease-in-out sm:left-16 md:left-0
    dark:border-b dark:border-gray-700 motion-safe:transition-colors motion-safe:duration-300;

  &.app-navbar-transparent {
    @apply bg-transparent backdrop-blur-none border-transparent;
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
      bg-gray-700 rounded-lg space-x-3 text-gray-300/80
      motion-safe:transition-colors motion-safe:duration-300;

    &:where(:hover, :focus-visible) {
      @apply bg-gray-600 text-gray-200;
    }

    &:focus-visible {
      @apply ring-offset-gray-800 ring-primary-500;
    }
  }

  &.app-navbar-transparent .fake-search-input {
    @apply bg-white/80 supports-backdrop-blur:bg-white/70
      dark:bg-gray-900/70 dark:supports-backdrop-blur:bg-gray-900/60
      backdrop-blur text-gray-600 dark:text-gray-400;

    &:where(:hover, :focus-visible) {
      @apply bg-white/90 supports-backdrop-blur:bg-white/80
        dark:bg-gray-900/80 dark:supports-backdrop-blur:bg-gray-900/70
        text-gray-800 dark:text-gray-300 ring-primary-400;
    }

    .ctrl-k {
      @apply bg-gray-100/80 dark:bg-gray-500/50
        text-gray-600 dark:text-gray-300
        border-gray-400 dark:border-gray-400/30;
    }
  }
}
</style>
