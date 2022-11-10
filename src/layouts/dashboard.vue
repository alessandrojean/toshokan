<script lang="ts" setup>
import { computed, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

import { useAuthStore } from '@/stores/auth'
import { useCollectionStore } from '@/stores/collection'
import { useSheetStore } from '@/stores/sheet'
import { useStore } from '@/stores/main'
import {
  DisableSearchShortcutKey,
  EnableSearchShortcutKey,
  SetNavbarTransparentKey,
  ShowAsideDialogKey,
  ShowSearchDialogKey,
  ShowSettingsDialogKey
} from '@/symbols'

import BetaWarning from '@/components/BetaWarning.vue'
import BookOwnerBadge from '@/components/book/BookOwnerBadge.vue'
import DashboardAsideDialog from '@/components/dashboard/DashboardAsideDialog.vue'
import DashboardAsideMenu, {
  type ChildItem
} from '@/components/dashboard/DashboardAsideMenu.vue'
import DashboardFooter from '@/components/dashboard/DashboardFooter.vue'
import DashboardNavbar from '@/components/dashboard/DashboardNavbar.vue'
import FadeTransition from '@/components/transitions/FadeTransition.vue'
import SearchDialog from '@/components/dialogs/SearchDialog.vue'
import SettingsDialog from '@/components/dialogs/SettingsDialog.vue'
import useGroupsQuery from '@/queries/useGroupsQuery'

const authStore = useAuthStore()
const collectionStore = useCollectionStore()
const mainStore = useStore()
const sheetStore = useSheetStore()
const router = useRouter()

const authenticated = computed(() => authStore.authenticated)
const hasGrantedScopes = computed(() => authStore.hasGrantedScopes)
const enabled = computed(() => sheetStore.sheetId !== null)

async function findSheetId() {
  if (sheetStore.sheetId === null) {
    try {
      await sheetStore.findSheetId()
    } catch (e) {
      const error = !hasGrantedScopes.value
        ? new Error(t('errors.missingScopes'))
        : e

      mainStore.updateCriticalError(error)
      router.replace({ name: 'error' })
    }
  }
}

onMounted(findSheetId)

watch(authenticated, (newValue) => {
  if (!newValue) {
    router.replace('/')
  }
})

const { t } = useI18n({ useScope: 'global' })

const showSearch = computed(() => !sheetStore.loading)
const searchDialog = ref<InstanceType<typeof SearchDialog>>()
const searchDialogIsOpen = ref(false)

const searchShortcutDisabled = ref(false)

function showSearchDialog(query?: string) {
  if (!searchShortcutDisabled.value) {
    searchDialogIsOpen.value = true

    if (typeof query === 'string') {
      searchDialog.value?.search(query)
    }
  }
}

function closeSearchDialog() {
  searchDialogIsOpen.value = false
}

function disableSearchShortcut() {
  searchShortcutDisabled.value = true
}

function enableSearchShortcut() {
  searchShortcutDisabled.value = false
}

provide(ShowSearchDialogKey, showSearchDialog)
provide(DisableSearchShortcutKey, disableSearchShortcut)
provide(EnableSearchShortcutKey, enableSearchShortcut)

const navbarTransparent = ref(false)

function setNavbarTransparent(value: boolean) {
  navbarTransparent.value = value
}

provide(SetNavbarTransparentKey, setNavbarTransparent)

function handleKeyDown(event: KeyboardEvent) {
  if (
    (event.ctrlKey || event.metaKey) &&
    event.key === 'k' &&
    showSearch.value &&
    !searchDialogIsOpen.value &&
    !searchShortcutDisabled.value
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

const settingsDialogIsOpen = ref(false)

function showSettingsDialog(delay = 200) {
  setTimeout(() => {
    settingsDialogIsOpen.value = true
  }, delay)
}

function closeSettingsDialog() {
  settingsDialogIsOpen.value = false
}

provide(ShowSettingsDialogKey, showSettingsDialog)

const route = useRoute()
const { data: groups } = useGroupsQuery({ enabled })
const libraryGroups = computed<ChildItem[]>(() => {
  return (groups.value ?? []).map((group) => ({
    key: group.name.toLowerCase(),
    label: group.name,
    to: {
      name: 'dashboard-library',
      query: { group: group.name }
    },
    active: computed(() => {
      const isCurrentFilter =
        collectionStore.filters.groups.length === 1 &&
        collectionStore.filters.groups[0] === group.name
      const isRouteGroup = route.query.group === group.name

      return (
        route.name === 'DashboardLibrary' && isRouteGroup && isCurrentFilter
      )
    })
  }))
})

const asideDialogOpen = ref(false)

function openAsideDialog() {
  asideDialogOpen.value = true
}

function closeAsideDialog() {
  asideDialogOpen.value = false
}

provide(ShowAsideDialogKey, openAsideDialog)

const breakpoints = useBreakpoints(breakpointsTailwind)
const smAndLarger = breakpoints.greaterOrEqual('sm')
const lgAndLarger = breakpoints.greaterOrEqual('lg')

watch(lgAndLarger, (shouldHide) => {
  if (shouldHide) {
    closeAsideDialog()
  }
})

const shared = computed(() => sheetStore.shared)
</script>

<template>
  <div class="bg-white min-h-screen dark:bg-gray-900">
    <a href="#main-menu-desktop" class="jump-to hidden md:block">
      {{ t('a11y.jumpToNavigation') }}
    </a>

    <div class="flex w-full h-screen overflow-hidden">
      <DashboardAsideMenu
        class="w-72 hidden lg:block shrink-0"
        :library-groups="libraryGroups"
      >
        <template #footer v-if="enabled && shared">
          <div class="border-t border-gray-200 dark:border-gray-700 py-2">
            <BookOwnerBadge class="!border-0 !border-t-1 !px-[1.125rem]" />
          </div>
        </template>
      </DashboardAsideMenu>
      <div
        class="flex-1 flex flex-col relative overflow-y-auto"
        id="main-content"
      >
        <DashboardNavbar
          class="sticky inset-x-0 top-0 shrink-0"
          :transparent="route.meta?.transparentNavbar && smAndLarger"
        />

        <main role="main" class="flex-1">
          <RouterView v-slot="{ Component }">
            <FadeTransition>
              <component :is="Component" class="w-full" />
            </FadeTransition>
          </RouterView>
        </main>

        <DashboardFooter class="shrink-0" />
      </div>
    </div>

    <SearchDialog
      ref="searchDialog"
      :is-open="searchDialogIsOpen"
      @close="closeSearchDialog"
    />

    <SettingsDialog
      :is-open="settingsDialogIsOpen"
      @close="closeSettingsDialog"
    />

    <BetaWarning />

    <DashboardAsideDialog
      :is-open="asideDialogOpen"
      :library-groups="libraryGroups"
      @close="closeAsideDialog"
    >
      <template #footer v-if="enabled && shared">
        <div class="border-t border-gray-200 dark:border-gray-700 py-2">
          <BookOwnerBadge class="!border-0 !border-t-1 !px-[1.125rem]" />
        </div>
      </template>
    </DashboardAsideDialog>
  </div>
</template>
