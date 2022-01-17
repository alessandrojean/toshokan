<template>
  <div class="flex flex-col">
    <SimpleHeader :title="t('dashboard.settings.title')" />

    <div class="flex-1">
      <div class="max-w-7xl mx-auto py-6 md:px-8">
        <TabGroup
          vertical
          :default-index="0"
          as="div"
          class="bg-white dark:bg-gray-800 md:rounded-lg shadow-md md:grid md:grid-cols-4"
        >
          <TabList
            as="aside"
            class="flex flex-col space-y-2 mb-4 md:mb-0 pt-4 px-0"
          >
            <Tab
              v-for="tab in tabs"
              :key="tab.key"
              class="aside-button has-ring-focus"
            >
              <span aria-hidden="true">
                <component :is="tab.icon" />
              </span>
              {{ tab.title }}
            </Tab>
          </TabList>

          <TabPanels class="col-span-3 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-600">
            <TabPanel
              as="section"
              class="relative overflow-hidden md:rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:ring-offset-gray-900 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500"
            >
              <div class="px-4 py-5 space-y-6 sm:p-6">
                <div>
                  <h2 class="text-lg font-medium font-display leading-6 text-gray-900 dark:text-gray-100">
                    {{ t('dashboard.settings.appearence.title') }}
                  </h2>
                  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {{ t('dashboard.settings.appearence.description') }}
                  </p>
                </div>
                <div class="-mx-4 sm:-mx-6 divide-y dark:divide-gray-700">
                  <div class="preference">
                    <div class="preference-description">
                      <label for="locale">
                        {{ t('dashboard.settings.appearence.locale.label') }}
                      </label>
                      <p>
                        {{ t('dashboard.settings.appearence.locale.description') }}
                      </p>
                    </div>
                    <LocaleSelector v-model="settings.appearence.locale" />
                  </div>
                  <div class="preference">
                    <div class="preference-description">
                      <label for="theme">
                        {{ t('dashboard.settings.appearence.theme.label') }}
                      </label>
                      <p>
                        {{ t('dashboard.settings.appearence.theme.description') }}
                      </p>
                    </div>
                    <select
                      class="select w-44 h-auto"
                      id="theme"
                      @change="updateSetting('appearence.theme', $event.target.value)"
                    >
                      <option value="system" :selected="'system' === settings.appearence.theme">
                        {{ t('dashboard.settings.appearence.theme.system') }}
                      </option>
                      <option value="light" :selected="'light' === settings.appearence.theme">
                        {{ t('dashboard.settings.appearence.theme.light') }}
                      </option>
                      <option value="dark" :selected="'dark' === settings.appearence.theme">
                        {{ t('dashboard.settings.appearence.theme.dark') }}
                      </option>
                    </select>
                  </div>
                  <div class="preference">
                    <div class="preference-description">
                      <label for="view-mode">
                        {{ t('dashboard.settings.appearence.viewMode.label') }}
                      </label>
                      <p>
                        {{ t('dashboard.settings.appearence.viewMode.description') }}
                      </p>
                    </div>
                    <select
                      class="select w-36 h-auto"
                      id="view-mode"
                      @change="updateSetting('appearence.viewMode', $event.target.value)"
                    >
                      <option value="grid" :selected="'grid' === settings.appearence.viewMode">
                        {{ t('dashboard.library.filters.viewMode.grid') }}
                      </option>
                      <option value="table" :selected="'table' === settings.appearence.viewMode">
                        {{ t('dashboard.library.filters.viewMode.table') }}
                      </option>
                    </select>
                  </div>
                  <div class="preference">
                    <div class="preference-description">
                      <label for="grid-mode">
                        {{ t('dashboard.settings.appearence.gridMode.label') }}
                      </label>
                      <p>
                        {{ t('dashboard.settings.appearence.gridMode.description') }}
                      </p>
                    </div>
                    <select
                      class="select w-36 h-auto"
                      id="grid-mode"
                      @change="updateSetting('appearence.gridMode', $event.target.value)"
                    >
                      <option value="compact" :selected="'compact' === settings.appearence.gridMode">
                        {{ t('dashboard.library.filters.gridMode.compact') }}
                      </option>
                      <option value="comfortable" :selected="'comfortable' === settings.appearence.gridMode">
                        {{ t('dashboard.library.filters.gridMode.comfortable') }}
                      </option>
                    </select>
                  </div>
                  <SwitchGroup as="div" class="preference">
                    <div class="preference-description">
                      <SwitchLabel>
                        {{ t('dashboard.settings.appearence.spoilerModeSynopsis.label') }}
                      </SwitchLabel>
                      <p>
                        {{ t('dashboard.settings.appearence.spoilerModeSynopsis.description') }}
                      </p>
                    </div>
                    <Switch
                      v-model="settings.appearence.spoilerMode.synopsis"
                      :class="settings.appearence.spoilerMode.synopsis ? 'bg-primary-600 dark:bg-primary-500' : 'bg-gray-200 dark:bg-gray-600'"
                      class="relative inline-flex items-center h-6 rounded-full w-11 motion-safe:transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500 dark:focus-visible:ring-offset-gray-900"
                    >
                      <span
                        aria-hidden="true"
                        :class="settings.appearence.spoilerMode.synopsis ? 'translate-x-6 dark:bg-white' : 'translate-x-1 dark:bg-gray-100'"
                        class="motion-safe:transition-transform duration-200 ease-in-out inline-block w-4 h-4 bg-white rounded-full"
                      />
                    </Switch>
                  </SwitchGroup>
                  <SwitchGroup as="div" class="preference">
                    <div class="preference-description">
                      <SwitchLabel>
                        {{ t('dashboard.settings.appearence.spoilerModeCover.label') }}
                      </SwitchLabel>
                      <p>
                        {{ t('dashboard.settings.appearence.spoilerModeCover.description') }}
                      </p>
                    </div>
                    <Switch
                      v-model="settings.appearence.spoilerMode.cover"
                      :class="settings.appearence.spoilerMode.cover ? 'bg-primary-600 dark:bg-primary-500' : 'bg-gray-200 dark:bg-gray-600'"
                      class="relative inline-flex items-center h-6 rounded-full w-11 motion-safe:transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500 dark:focus-visible:ring-offset-gray-900"
                    >
                      <span
                        aria-hidden="true"
                        :class="settings.appearence.spoilerMode.cover ? 'translate-x-6 dark:bg-white' : 'translate-x-1 dark:bg-gray-100'"
                        class="motion-safe:transition-transform duration-200 ease-in-out inline-block w-4 h-4 bg-white rounded-full"
                      />
                    </Switch>
                  </SwitchGroup>
                </div>
              </div>
              <div class="border-t border-gray-200 dark:border-gray-600 px-4 py-5 sm:px-6 sm:py-3 flex justify-end">
                <button
                  type="button"
                  class="button is-primary"
                  @click.stop="saveAppearenceSettings"
                >
                  {{ t('dashboard.settings.save') }}
                </button>
              </div>
            </TabPanel>

            <TabPanel
              as="section"
              class="md:rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:ring-offset-gray-900 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500"
            >
              <div class="px-4 py-5 space-y-6 sm:p-6">
                <div>
                  <h2 class="text-lg font-medium font-display leading-6 text-gray-900 dark:text-gray-100">
                    {{ t('dashboard.settings.privacy.title') }}
                  </h2>
                  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {{ t('dashboard.settings.privacy.description') }}
                  </p>
                </div>
                <div class="-mx-4 sm:-mx-6 divide-y dark:divide-gray-700">
                  <div class="preference">
                    <div class="preference-description">
                      <label>
                        {{ t('dashboard.settings.privacy.removeAccess.label') }}
                      </label>
                      <p>
                        {{ t('dashboard.settings.privacy.removeAccess.description') }}
                      </p>
                    </div>
                    <div>
                      <button
                        type="button"
                        class="button is-danger"
                        @click="confirmRemove"
                      >
                        {{ t('dashboard.settings.privacy.removeAccess.remove') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>

    <DisconnectModal
      v-model:open="disconnectModalOpen"
      @click:disconnect="handleDisconnect"
    />

    <LoadingIndicator
      :loading="sheetLoading"
      position="fixed"
    />
  </div>
</template>

<script>
import { computed, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import { MutationTypes } from '@/store'

import { CollectionIcon, ShieldCheckIcon } from '@heroicons/vue/outline'
import { CogIcon, TranslateIcon } from '@heroicons/vue/solid'

import {
  Switch,
  SwitchLabel,
  SwitchGroup,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels
} from '@headlessui/vue'

import DisconnectModal from '@/components/DisconnectModal.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'
import LocaleSelector from '@/components/LocaleSelector.vue'
import SimpleHeader from '@/components/SimpleHeader.vue'

export default {
  name: 'DashboardSettings',

  components: {
    DisconnectModal,
    LoadingIndicator,
    LocaleSelector,
    SimpleHeader,
    Switch,
    SwitchLabel,
    SwitchGroup,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    CollectionIcon,
    ShieldCheckIcon,
    CogIcon,
    TranslateIcon
  },

  setup () {
    const { t, locale } = useI18n({ useScope: 'global' })
    const store = useStore()

    const settings = reactive({
      appearence: {
        locale: locale.value,
        theme: store.state.theme,
        viewMode: store.state.collection.viewMode,
        gridMode: store.state.collection.gridMode,
        spoilerMode: { ...store.state.collection.spoilerMode }
      }
    })

    const theme = computed(() => store.state.theme)

    watch(theme, newTheme => {
      if (settings.appearence.theme !== newTheme) {
        settings.appearence.theme = newTheme
      }
    })

    function updateSetting (key, newValue) {
      const path = key.split('.')
      settings[path[0]][path[1]] = newValue
    }

    function saveAppearenceSettings () {
      const { appearence } = settings

      if (locale.value !== appearence.locale) {
        locale.value = appearence.locale
        store.dispatch('sheet/loadSheetData')
        store.commit(MutationTypes.COLLECTION_UPDATE_LAST_ADDED, { items: [] })
        store.commit(MutationTypes.COLLECTION_UPDATE_LATEST_READINGS, { items: [] })
        store.commit(MutationTypes.COLLECTION_UPDATE_BOOKS, { items: [] })
      }

      store.commit(MutationTypes.UPDATE_THEME, appearence.theme)
      store.commit(MutationTypes.COLLECTION_UPDATE_VIEW_MODE, appearence.viewMode)
      store.commit(MutationTypes.COLLECTION_UPDATE_GRID_MODE, appearence.gridMode)
      store.commit(MutationTypes.COLLECTION_UPDATE_SPOILER_MODE, appearence.spoilerMode)
    }

    const sheetLoading = computed(() => store.state.sheet.loading)

    const disconnectModalOpen = ref(false)

    function confirmRemove () {
      disconnectModalOpen.value = true
    }

    function handleDisconnect () {
      store.dispatch('auth/disconnect')
    }

    const tabs = ref([
      {
        key: 'appearence',
        icon: CollectionIcon,
        title: t('dashboard.settings.appearence.title')
      },
      {
        key: 'privacy',
        icon: ShieldCheckIcon,
        title: t('dashboard.settings.privacy.title')
      }
    ])

    return {
      t,
      locale,
      settings,
      updateSetting,
      saveAppearenceSettings,
      sheetLoading,
      disconnectModalOpen,
      confirmRemove,
      handleDisconnect,
      tabs
    }
  }
}
</script>

<style lang="postcss" scoped>
.aside-button {
  @apply border-l-4 border-transparent font-medium
    text-gray-700 dark:text-gray-400
    md:text-sm flex items-center px-3 py-2.5;
}

.aside-button:focus {
  @apply outline-none;
}

.aside-button:focus-visible {
  @apply dark:ring-offset-gray-900 z-10;
}

.aside-button:focus,
.aside-button:hover:not(:disabled):not([aria-selected="true"]) {
  @apply bg-white dark:bg-gray-700 bg-opacity-70
    text-gray-900 dark:text-gray-200;
}

.aside-button[aria-selected="true"] {
  @apply border-primary-600 dark:border-primary-500
    bg-primary-50 dark:bg-primary-500 dark:bg-opacity-30
    text-primary-600 dark:text-primary-100;
}

.aside-button:disabled {
  @apply opacity-60 cursor-default;
}

.aside-button svg {
  @apply w-6 h-6 text-gray-400 dark:text-gray-500 mr-4;
}

.aside-button:focus svg,
.aside-button:hover:not(:disabled):not([aria-selected="true"]) svg {
  @apply text-gray-600 dark:text-gray-400;
}

.aside-button[aria-selected="true"] svg {
  @apply text-primary-600 dark:text-primary-100;
}

.preference {
  @apply px-4 sm:px-6 flex flex-col space-y-2 md:space-y-0 md:flex-row
    md:items-center justify-between py-4;
}

.preference:first-of-type {
  @apply pt-0;
}

.preference:last-of-type {
  @apply pb-0;
}

.preference-description label {
  @apply text-sm font-semibold dark:text-gray-100;
}

.preference-description p {
  @apply text-sm text-gray-500 dark:text-gray-400;
}
</style>
