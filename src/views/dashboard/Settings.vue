<template>
  <div class="flex flex-col">
    <SimpleHeader :title="t('dashboard.settings.title')" />

    <div class="flex-1">
      <div class="max-w-7xl mx-auto py-6 px-5 md:px-8 md:grid grid-cols-4 gap-6">
        <aside
          class="flex flex-col space-y-2 mb-4 md:mb-0"
          role="tablist"
          :aria-label="t('dashboard.settings.title')"
          aria-orientation="vertical"
        >
          <button
            v-for="(tab, idx) in tabs"
            :key="tab.key"
            role="tab"
            :aria-selected="currentTab === idx"
            :aria-controls="`${tab.key}-tab`"
            :id="`${tab.key}-button`"
            :tabindex="currentTab !== idx ? '-1' : undefined"
            type="button"
            class="aside-button"
            @click="activateTab(idx, false)"
            @keydown="handleTabKeydown($event, idx)"
            @keyup="handleTabKeyup($event, idx)"
            :ref="el => { if (el) tabRefs[idx] = el }"
            :disabled="sheetLoading"
          >
            <span aria-hidden="true">
              <component :is="tab.icon" />
            </span>
            {{ tab.title }}
          </button>
        </aside>

        <div class="col-span-3">
          <transition
            mode="out-in"
            enter-active-class="transition motion-reduce:transition-none duration-500 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100 "
            leave-active-class="transition motion-reduce:transition-none duration-300 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <section
              tabindex="0"
              role="tabpanel"
              id="appearence-tab"
              aria-labelledby="appearence-button"
              :hidden="currentTab !== 0"
              v-show="currentTab === 0"
              class="relative overflow-hidden bg-white dark:bg-gray-800 rounded-md shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:ring-offset-gray-900 focus-visible:ring-indigo-600"
            >
              <div class="px-4 py-5 space-y-6 sm:p-6">
                <div>
                  <h2 class="text-lg font-medium font-title leading-6 text-gray-900 dark:text-gray-100">
                    {{ t('dashboard.settings.appearence.title') }}
                  </h2>
                  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {{ t('dashboard.settings.appearence.description') }}
                  </p>
                </div>
                <div class="divide-y dark:divide-gray-700">
                  <div class="preference">
                    <div class="preference-description">
                      <label for="locale">
                        {{ t('dashboard.settings.appearence.locale.label') }}
                      </label>
                      <p>
                        {{ t('dashboard.settings.appearence.locale.description') }}
                      </p>
                    </div>
                    <div class="relative group">
                      <span aria-hidden="true" class="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <TranslateIcon class="w-5 h-5 text-gray-500 dark:text-gray-400 group-focus-within:text-gray-700 dark:group-focus-within:text-gray-200" />
                      </span>
                      <select
                        class="select w-52 pl-10 h-auto"
                        id="locale"
                        @change="updateSetting('appearence.locale', $event.target.value)"
                      >
                        <option
                          v-for="loc in availableLocales"
                          :key="loc"
                          :value="loc"
                          :selected="loc === settings.appearence.locale"
                        >
                          {{ t('app.localeName', null, { locale: loc }) }}
                        </option>
                      </select>
                    </div>
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
                </div>
              </div>
              <div class="bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-600 px-4 py-5 sm:px-6 sm:py-3 flex justify-end">
                <button
                  type="button"
                  class="button is-primary"
                  @click.stop="saveAppearenceSettings"
                >
                  {{ t('dashboard.settings.save') }}
                </button>
              </div>
            </section>
          </transition>

          <transition
            mode="out-in"
            enter-active-class="transition motion-reduce:transition-none duration-500 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100 "
            leave-active-class="transition motion-reduce:transition-none duration-300 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <section
              tabindex="0"
              role="tabpanel"
              id="privacy-tab"
              aria-labelledby="privacy-button"
              :hidden="currentTab !== 1"
              v-show="currentTab === 1"
              class="bg-white dark:bg-gray-800 rounded-md shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:ring-offset-gray-900 focus-visible:ring-indigo-600"
            >
              <div class="px-4 py-5 space-y-6 sm:p-6">
                <div>
                  <h2 class="text-lg font-medium font-title leading-6 text-gray-900 dark:text-gray-100">
                    {{ t('dashboard.settings.privacy.title') }}
                  </h2>
                  <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {{ t('dashboard.settings.privacy.description') }}
                  </p>
                </div>
                <div class="divide-y dark:divide-gray-700">
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
            </section>
          </transition>
        </div>
      </div>
    </div>

    <DisconnectModal
      v-model:open="disconnectModalOpen"
      @click:disconnect="handleDisconnect"
    />

    <LoadingIndicator :loading="sheetLoading" animation="spin">
      <template v-slot:icon="{ cssClass }">
        <CogIcon :class="cssClass" />
      </template>
    </LoadingIndicator>
  </div>
</template>

<script>
import { computed, nextTick, onBeforeUpdate, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import { CollectionIcon, ShieldCheckIcon } from '@heroicons/vue/outline'
import { CogIcon, TranslateIcon } from '@heroicons/vue/solid'

import DisconnectModal from '@/components/DisconnectModal'
import LoadingIndicator from '@/components/LoadingIndicator'
import SimpleHeader from '@/components/SimpleHeader'

export default {
  name: 'DashboardSettings',

  components: {
    DisconnectModal,
    LoadingIndicator,
    SimpleHeader,
    CollectionIcon,
    ShieldCheckIcon,
    CogIcon,
    TranslateIcon
  },

  setup () {
    const { t, availableLocales, locale } = useI18n({ useScope: 'global' })
    const store = useStore()

    const tabs = useTabs()

    const settings = reactive({
      appearence: {
        locale: locale.value,
        viewMode: store.state.collection.viewMode,
        gridMode: store.state.collection.gridMode
      }
    })

    function updateSetting (key, newValue) {
      const path = key.split('.')
      settings[path[0]][path[1]] = newValue
    }

    function saveAppearenceSettings () {
      if (locale.value !== settings.appearence.locale) {
        locale.value = settings.appearence.locale
        store.dispatch('sheet/loadSheetData')
      }

      store.commit('collection/updateViewMode', settings.appearence.viewMode)
      store.commit('collection/updateGridMode', settings.appearence.gridMode)
    }

    const sheetLoading = computed(() => store.state.sheet.loading)

    const disconnectModalOpen = ref(false)

    function confirmRemove () {
      disconnectModalOpen.value = true
    }

    function handleDisconnect () {
      store.dispatch('auth/disconnect')
    }

    return {
      t,
      availableLocales,
      locale,
      settings,
      updateSetting,
      saveAppearenceSettings,
      sheetLoading,
      disconnectModalOpen,
      confirmRemove,
      handleDisconnect,
      ...tabs
    }
  }
}

function useTabs () {
  const { t } = useI18n({ useScope: 'global' })

  const tabs = computed(() => [
    {
      key: 'appearence',
      title: t('dashboard.settings.appearence.title'),
      icon: 'CollectionIcon'
    },
    {
      key: 'privacy',
      title: t('dashboard.settings.privacy.title'),
      icon: 'ShieldCheckIcon'
    }
  ])
  const currentTab = ref(0)
  const tabRefs = ref([])

  onBeforeUpdate(() => {
    tabRefs.value = []
  })

  function activateTab (tabIdx, setFocus) {
    setFocus = setFocus || true
    currentTab.value = tabIdx

    if (setFocus) {
      nextTick(() => tabRefs.value[tabIdx].focus())
    }
  }

  const keys = {
    end: 'End',
    home: 'Home',
    up: 'ArrowUp',
    down: 'ArrowDown',
    enter: 'Enter',
    space: ' '
  }

  const direction = {
    ArrowLeft: -1,
    ArrowUp: -1,
    ArrowRight: 1,
    ArrowDown: 1
  }

  /**
   * @param {KeyboardEvent} event
   * @param {number} tabIdx
   */
  function handleTabKeydown (event, tabIdx) {
    const key = event.key

    switch (key) {
      case keys.end:
        event.preventDefault()
        focusLastTab()
        break
      case keys.home:
        event.preventDefault()
        focusFirstTab()
        break
      case keys.up:
      case keys.down:
        determineOrientation(event, tabIdx)
        break
    }
  }

  /**
   * @param {KeyboardEvent} event
   * @param {number} tabIdx
   */
  function handleTabKeyup (event, tabIdx) {
    const key = event.key

    switch (key) {
      case keys.enter:
      case keys.space:
        activateTab(tabIdx)
        break
    }
  }

  /**
   * @param {KeyboardEvent} event
   * @param {number} tabIdx
   */
  function determineOrientation (event, tabIdx) {
    const key = event.key

    if (key === keys.up || key === keys.down) {
      event.preventDefault()
      switchTabOnArrowPress(event, tabIdx)
    }
  }

  /**
   * @param {KeyboardEvent} event
   * @param {number} tabIdx
   */
  function switchTabOnArrowPress (event, tabIdx) {
    const pressed = event.key

    if (direction[pressed] && tabIdx !== undefined) {
      if (tabRefs.value[tabIdx + direction[pressed]]) {
        tabRefs.value[tabIdx + direction[pressed]].focus()
      } else if (pressed === keys.left || pressed === keys.up) {
        focusLastTab()
      } else if (pressed === keys.right || pressed === keys.down) {
        focusFirstTab()
      }
    }
  }

  function focusFirstTab () {
    tabRefs.value[0].focus()
  }

  function focusLastTab () {
    tabRefs.value[tabRefs.value.length - 1].focus()
  }

  return {
    tabs,
    currentTab,
    tabRefs,
    activateTab,
    handleTabKeydown,
    handleTabKeyup
  }
}
</script>

<style scoped>
.aside-button {
  @apply group rounded-md font-medium text-gray-700 dark:text-gray-400 text-sm flex items-center px-2 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:ring-offset-gray-900 focus-visible:ring-indigo-600 disabled:opacity-60 disabled:cursor-default;
}

.aside-button:focus,
.aside-button:hover:not(:disabled):not([aria-selected="true"]) {
  @apply bg-white dark:bg-gray-700 bg-opacity-70 text-gray-900 dark:text-gray-200;
}

.aside-button[aria-selected="true"] {
  @apply bg-white dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200 font-semibold shadow-md;
}

.aside-button svg {
  @apply w-6 h-6 text-gray-400 dark:text-gray-500 mr-2;
}

.aside-button:focus svg,
.aside-button:hover:not(:disabled):not([aria-selected="true"]) svg {
  @apply text-gray-600 dark:text-gray-400;
}

.aside-button[aria-selected="true"] svg {
  @apply text-indigo-600 dark:text-indigo-200;
}

.preference {
  @apply flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center justify-between py-4;
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
