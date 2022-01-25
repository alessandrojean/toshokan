<template>
  <div class="bg-white dark:bg-gray-900">
    <div class="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <h1 class="text-3xl font-display font-semibold text-gray-900 dark:text-gray-100">
        {{ t('dashboard.settings.title') }}
      </h1>

      <TabGroup>
        <TabList class="flex flex-nowrap max-w-full overflow-x-auto md:overflow-x-visible overflow-y-hidden md:overflow-y-visible border-b border-gray-300 dark:border-gray-600 space-x-8 text-gray-500 dark:text-gray-400 text-sm">
          <Tab
            v-for="tab in tabs"
            :key="tab.key"
            as="template"
            v-slot="{ selected }"
          >
            <button
              :class="[
                'shrink-0 px-1 py-4 font-medium border-b-2 -mb-px has-ring-focus dark:focus-visible:ring-offset-gray-900 disabled:cursor-default',
                selected
                  ? 'text-primary-600 dark:text-gray-100 hover:text-primary-600 dark:hover:text-gray-100 border-primary-600 dark:border-primary-400'
                  : 'hover:text-gray-800 dark:hover:text-gray-300 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              ]"
            >
              {{ tab.title }}
            </button>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel
            as="section"
            class="relative md:rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:ring-offset-gray-900 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500"
          >
            <div class="py-6 space-y-6">
              <div>
                <h2 class="text-lg font-medium font-display leading-6 text-gray-900 dark:text-gray-100">
                  {{ t('dashboard.settings.appearence.title') }}
                </h2>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ t('dashboard.settings.appearence.description') }}
                </p>
              </div>
              <div class="-mx-4 sm:mx-0 divide-y dark:divide-gray-700 border-y dark:border-gray-700">
                <div class="preference">
                  <div class="preference-description">
                    <label for="locale">
                      {{ t('dashboard.settings.appearence.locale.label') }}
                    </label>
                    <p>
                      {{ t('dashboard.settings.appearence.locale.description') }}
                    </p>
                  </div>
                  <LocaleSelector
                    :model-value="settings.appearence.locale"
                    @update:model-value="updateSetting('appearence.locale', $event)"
                  />
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
          </TabPanel>

          <TabPanel
            as="section"
            class="md:rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:ring-offset-gray-900 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500"
          >
            <div class="py-6 space-y-6">
              <div>
                <h2 class="text-lg font-medium font-display leading-6 text-gray-900 dark:text-gray-100">
                  {{ t('dashboard.settings.privacy.title') }}
                </h2>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {{ t('dashboard.settings.privacy.description') }}
                </p>
              </div>
              <div class="-mx-4 sm:mx-0 border-y dark:border-gray-700">
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
                      <span>
                        {{ t('dashboard.settings.privacy.removeAccess.remove') }}
                      </span>
                      <span aria-hidden="true">
                        <ExclamationIcon class="is-right" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
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

import { CogIcon, ExclamationIcon, TranslateIcon } from '@heroicons/vue/solid'

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

import DisconnectModal from '@/components/dialogs/DisconnectDialog.vue'
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
    CogIcon,
    ExclamationIcon,
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

      if (path[0] === 'appearence') {
        saveAppearenceSettings()
      }
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

    const tabs = computed(() => [
      {
        key: 'appearence',
        title: t('dashboard.settings.appearence.title')
      },
      {
        key: 'privacy',
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
.preference {
  @apply px-4 sm:px-0 flex flex-col space-y-5 md:space-y-0 md:flex-row
    md:items-center justify-between py-4;
}

.preference-description label {
  @apply text-sm font-semibold dark:text-gray-100;
}

.preference-description p {
  @apply text-sm text-gray-500 dark:text-gray-400;
}
</style>
