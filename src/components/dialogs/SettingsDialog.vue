<script setup>
import { computed, inject, reactive, ref, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQueryClient } from 'vue-query'

import useMarkdown from '@/composables/useMarkdown'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import { useSheetStore } from '@/stores/sheet'
import androidExport from '@/services/export/androidExport'

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Switch,
  SwitchLabel,
  SwitchGroup,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  TransitionChild,
  TransitionRoot
} from '@headlessui/vue'

import {
  CheckIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/vue/20/solid'

import Alert from '@/components/Alert.vue'
import LocaleSelector from '@/components/LocaleSelector.vue'

const props = defineProps({ isOpen: Boolean })

const emit = defineEmits(['close'])

const { t, locale } = useI18n({ useScope: 'global' })

function closeDialog() {
  emit('close')
}

const { isOpen } = toRefs(props)

const disableSearchShortcut = inject('disableSearchShortcut')
const enableSearchShortcut = inject('enableSearchShortcut')

const isDev = ref(import.meta.env.DEV)

const tabs = computed(() => {
  const buttons = [
    {
      key: 'appearence',
      title: t('dashboard.settings.appearence.title')
    },
    {
      key: 'export',
      title: t('dashboard.settings.export.title')
    },
    {
      key: 'privacy',
      title: t('dashboard.settings.privacy.title')
    }
  ]

  if (isDev.value) {
    buttons.push({
      key: 'development',
      title: t('dashboard.settings.development.title')
    })
  }

  return buttons
})

const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const sheetStore = useSheetStore()
const queryClient = useQueryClient()

const settings = reactive({
  appearence: {
    locale: locale.value,
    theme: settingsStore.theme,
    viewMode: settingsStore.viewMode,
    gridMode: settingsStore.gridMode,
    spoilerMode: { ...settingsStore.spoilerMode },
    blurNsfw: settingsStore.blurNsfw
  },
  development: {
    useDevSheet: settingsStore.useDevSheet
  }
})

watch(isOpen, (newIsOpen) => {
  if (newIsOpen) {
    Object.assign(settings, {
      appearence: {
        locale: locale.value,
        theme: settingsStore.theme,
        viewMode: settingsStore.viewMode,
        gridMode: settingsStore.gridMode,
        spoilerMode: { ...settingsStore.spoilerMode },
        blurNsfw: settingsStore.blurNsfw
      },
      development: {
        useDevSheet: settingsStore.useDevSheet
      }
    })

    disableSearchShortcut()
  } else {
    enableSearchShortcut()
  }
})

const theme = computed(() => settingsStore.theme)

watch(theme, (newTheme) => {
  if (settings.appearence.theme !== newTheme) {
    settings.appearence.theme = newTheme
  }
})

function updateSetting(key, newValue) {
  const path = key.split('.')

  if (path[2]) {
    settings[path[0]][path[1]][path[2]] = newValue
  } else {
    settings[path[0]][path[1]] = newValue
  }

  if (key === 'appearence.locale') {
    saveLocale()
  } else if (key === 'appearence.theme') {
    settingsStore.updateTheme(settings.appearence.theme)
  }
}

function saveLocale() {
  const { appearence } = settings

  if (locale.value !== appearence.locale) {
    locale.value = appearence.locale
    queryClient.invalidateQueries('statistics')
    queryClient.invalidateQueries('last-added')
    queryClient.invalidateQueries('latest-readings')
    queryClient.invalidateQueries('books')
    queryClient.invalidateQueries('book')
  }
}

function saveAppearenceSettings() {
  const { appearence } = settings

  saveLocale()
  settingsStore.updateTheme(appearence.theme)
  settingsStore.updateBlurNsfw(appearence.blurNsfw)
  settingsStore.updateGridMode(appearence.gridMode)
  settingsStore.updateSpoilerMode(appearence.spoilerMode)
  settingsStore.updateViewMode(appearence.viewMode)
}

async function saveDevelopmentSettings() {
  const { development } = settings

  if (development.useDevSheet !== settingsStore.useDevSheet) {
    settingsStore.updateUseDevSheet(development.useDevSheet)

    await sheetStore.findSheetId()
    queryClient.resetQueries()
    queryClient.refetchQueries()
  }
}

async function handleSave() {
  saveAppearenceSettings()
  await saveDevelopmentSettings()
  closeDialog()
}

function handleDisconnect() {
  closeDialog()
  authStore.disconnect()
}

const exporting = ref(false)
const { renderMarkdown } = useMarkdown()

const exportInstructions = computed(() => {
  return renderMarkdown(
    t('dashboard.settings.export.android.instructions.text')
  )
})

async function exportAsAndroid() {
  exporting.value = true

  try {
    await androidExport(sheetStore.sheetId)
  } catch (e) {
    console.error(e)
  } finally {
    exporting.value = false
  }
}
</script>

<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog static as="template" :open="isOpen" @close="closeDialog">
      <div class="dialog">
        <TransitionChild
          as="template"
          enter="motion-reduce:transition-none duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="motion-reduce:transition-none duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="hidden sm:block dialog-overlay" />
        </TransitionChild>

        <TransitionChild
          as="template"
          class="transform"
          enter="motion-reduce:transition-none duration-300 ease-out"
          enter-from="opacity-0 translate-x-full sm:translate-x-0 sm:scale-95"
          enter-to="opacity-100 translate-x-0 sm:translate-x-0 sm:scale-100"
          leave="motion-reduce:transition-none duration-200 ease-in"
          leave-from="opacity-100 translate-x-0 sm:translate-x-0 sm:scale-100"
          leave-to="opacity-0 translate-x-full sm:translate-x-0 sm:scale-95"
        >
          <DialogPanel class="dialog-content">
            <div class="dialog-header">
              <div class="flex-grow">
                <DialogTitle as="h2" class="dialog-title">
                  {{ t('dashboard.settings.title') }}
                </DialogTitle>
              </div>

              <button class="close-button has-ring-focus" @click="closeDialog">
                <span aria-hidden="true">
                  <XMarkIcon class="w-5 h-5" />
                </span>
              </button>

              <span aria-hidden="true" class="absolute left-2">
                <svg
                  class="text-white opacity-30 block h-48 w-48"
                  viewBox="0 0 184 184"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M182 184a2 2 0 110-4 2 2 0 010 4zm-20-20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm-20 0a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm-20 0a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm-20 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm-20 40a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm-20 60a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm-20 80a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zM22 144a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zM2 144a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0 20a2 2 0 110-4 2 2 0 010 4zm0-60a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zm0-20a2 2 0 110-4 2 2 0 010 4zM2 4a2 2 0 110-4 2 2 0 010 4z"
                    fill="currentColor"
                    fill-rule="evenodd"
                    opacity="0.503"
                  ></path>
                </svg>
              </span>
            </div>

            <TabGroup>
              <TabList class="tab-list">
                <Tab
                  v-for="tab of tabs"
                  :key="tab.key"
                  as="template"
                  :disabled="tab.disabled"
                >
                  <button class="tab-button has-ring-focus">
                    {{ tab.title }}
                  </button>
                </Tab>
              </TabList>

              <TabPanels as="template">
                <div class="tab-panels" ref="main">
                  <TabPanel
                    class="has-ring-focus rounded-md focus-visible:ring-inset"
                  >
                    <div class="divide-y dark:divide-gray-700">
                      <div class="preference">
                        <div class="preference-description">
                          <label for="locale">
                            {{
                              t('dashboard.settings.appearence.locale.label')
                            }}
                          </label>
                          <p>
                            {{
                              t(
                                'dashboard.settings.appearence.locale.description'
                              )
                            }}
                          </p>
                        </div>
                        <LocaleSelector
                          :model-value="settings.appearence.locale"
                          @update:model-value="
                            updateSetting('appearence.locale', $event)
                          "
                        />
                      </div>
                      <div class="preference">
                        <div class="preference-description">
                          <label for="theme">
                            {{ t('dashboard.settings.appearence.theme.label') }}
                          </label>
                          <p>
                            {{
                              t(
                                'dashboard.settings.appearence.theme.description'
                              )
                            }}
                          </p>
                        </div>
                        <select
                          class="select w-44 h-auto"
                          id="theme"
                          @change="
                            updateSetting(
                              'appearence.theme',
                              $event.target.value
                            )
                          "
                        >
                          <option
                            value="system"
                            :selected="'system' === settings.appearence.theme"
                          >
                            {{
                              t('dashboard.settings.appearence.theme.system')
                            }}
                          </option>
                          <option
                            value="light"
                            :selected="'light' === settings.appearence.theme"
                          >
                            {{ t('dashboard.settings.appearence.theme.light') }}
                          </option>
                          <option
                            value="dark"
                            :selected="'dark' === settings.appearence.theme"
                          >
                            {{ t('dashboard.settings.appearence.theme.dark') }}
                          </option>
                        </select>
                      </div>
                      <div class="preference">
                        <div class="preference-description">
                          <label for="view-mode">
                            {{
                              t('dashboard.settings.appearence.viewMode.label')
                            }}
                          </label>
                          <p>
                            {{
                              t(
                                'dashboard.settings.appearence.viewMode.description'
                              )
                            }}
                          </p>
                        </div>
                        <select
                          class="select w-36 h-auto"
                          id="view-mode"
                          @change="
                            updateSetting(
                              'appearence.viewMode',
                              $event.target.value
                            )
                          "
                        >
                          <option
                            value="grid"
                            :selected="'grid' === settings.appearence.viewMode"
                          >
                            {{ t('dashboard.library.filters.viewMode.grid') }}
                          </option>
                          <option
                            value="table"
                            :selected="'table' === settings.appearence.viewMode"
                          >
                            {{ t('dashboard.library.filters.viewMode.table') }}
                          </option>
                        </select>
                      </div>
                      <div class="preference">
                        <div class="preference-description">
                          <label for="grid-mode">
                            {{
                              t('dashboard.settings.appearence.gridMode.label')
                            }}
                          </label>
                          <p>
                            {{
                              t(
                                'dashboard.settings.appearence.gridMode.description'
                              )
                            }}
                          </p>
                        </div>
                        <select
                          class="select w-36 h-auto"
                          id="grid-mode"
                          :disabled="settings.appearence.viewMode !== 'grid'"
                          @change="
                            updateSetting(
                              'appearence.gridMode',
                              $event.target.value
                            )
                          "
                        >
                          <option
                            value="compact"
                            :selected="
                              'compact' === settings.appearence.gridMode
                            "
                          >
                            {{
                              t('dashboard.library.filters.gridMode.compact')
                            }}
                          </option>
                          <option
                            value="comfortable"
                            :selected="
                              'comfortable' === settings.appearence.gridMode
                            "
                          >
                            {{
                              t(
                                'dashboard.library.filters.gridMode.comfortable'
                              )
                            }}
                          </option>
                        </select>
                      </div>
                      <SwitchGroup as="div" class="preference">
                        <div class="preference-description">
                          <SwitchLabel>
                            {{
                              t(
                                'dashboard.settings.appearence.spoilerModeSynopsis.label'
                              )
                            }}
                          </SwitchLabel>
                          <p>
                            {{
                              t(
                                'dashboard.settings.appearence.spoilerModeSynopsis.description'
                              )
                            }}
                          </p>
                        </div>
                        <Switch
                          :model-value="
                            settings.appearence.spoilerMode.synopsis
                          "
                          @update:model-value="
                            updateSetting(
                              'appearence.spoilerMode.synopsis',
                              $event
                            )
                          "
                          :class="
                            settings.appearence.spoilerMode.synopsis
                              ? 'bg-primary-600 dark:bg-primary-500'
                              : 'bg-gray-200 dark:bg-gray-600'
                          "
                          class="relative inline-flex items-center h-6 rounded-full w-11 motion-safe:transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500 dark:focus-visible:ring-offset-gray-900"
                        >
                          <span
                            aria-hidden="true"
                            :class="
                              settings.appearence.spoilerMode.synopsis
                                ? 'translate-x-6 dark:bg-white'
                                : 'translate-x-1 dark:bg-gray-100'
                            "
                            class="motion-safe:transition-transform duration-200 ease-in-out inline-block w-4 h-4 bg-white rounded-full"
                          />
                        </Switch>
                      </SwitchGroup>
                      <SwitchGroup as="div" class="preference">
                        <div class="preference-description">
                          <SwitchLabel>
                            {{
                              t(
                                'dashboard.settings.appearence.spoilerModeCover.label'
                              )
                            }}
                          </SwitchLabel>
                          <p>
                            {{
                              t(
                                'dashboard.settings.appearence.spoilerModeCover.description'
                              )
                            }}
                          </p>
                        </div>
                        <Switch
                          :model-value="settings.appearence.spoilerMode.cover"
                          @update:model-value="
                            updateSetting(
                              'appearence.spoilerMode.cover',
                              $event
                            )
                          "
                          :class="
                            settings.appearence.spoilerMode.cover
                              ? 'bg-primary-600 dark:bg-primary-500'
                              : 'bg-gray-200 dark:bg-gray-600'
                          "
                          class="relative inline-flex items-center h-6 rounded-full w-11 motion-safe:transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500 dark:focus-visible:ring-offset-gray-900"
                        >
                          <span
                            aria-hidden="true"
                            :class="
                              settings.appearence.spoilerMode.cover
                                ? 'translate-x-6 dark:bg-white'
                                : 'translate-x-1 dark:bg-gray-100'
                            "
                            class="motion-safe:transition-transform duration-200 ease-in-out inline-block w-4 h-4 bg-white rounded-full"
                          />
                        </Switch>
                      </SwitchGroup>
                      <SwitchGroup as="div" class="preference">
                        <div class="preference-description">
                          <SwitchLabel>
                            {{
                              t(
                                'dashboard.settings.appearence.blurNsfwCover.label'
                              )
                            }}
                          </SwitchLabel>
                          <p>
                            {{
                              t(
                                'dashboard.settings.appearence.blurNsfwCover.description'
                              )
                            }}
                          </p>
                        </div>
                        <Switch
                          :model-value="settings.appearence.blurNsfw"
                          @update:model-value="
                            updateSetting('appearence.blurNsfw', $event)
                          "
                          v-model="settings.appearence.blurNsfw"
                          :class="
                            settings.appearence.blurNsfw
                              ? 'bg-primary-600 dark:bg-primary-500'
                              : 'bg-gray-200 dark:bg-gray-600'
                          "
                          class="relative inline-flex items-center h-6 rounded-full w-11 motion-safe:transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500 dark:focus-visible:ring-offset-gray-900"
                        >
                          <span
                            aria-hidden="true"
                            :class="
                              settings.appearence.blurNsfw
                                ? 'translate-x-6 dark:bg-white'
                                : 'translate-x-1 dark:bg-gray-100'
                            "
                            class="motion-safe:transition-transform duration-200 ease-in-out inline-block w-4 h-4 bg-white rounded-full"
                          />
                        </Switch>
                      </SwitchGroup>
                    </div>
                  </TabPanel>
                  <TabPanel
                    class="has-ring-focus rounded-md focus-visible:ring-inset"
                  >
                    <div class="preference">
                      <div class="preference-description">
                        <label>
                          {{ t('dashboard.settings.export.android.label') }}
                        </label>
                        <p>
                          {{
                            t('dashboard.settings.export.android.description')
                          }}
                        </p>
                      </div>
                      <div>
                        <button
                          type="button"
                          class="button"
                          :disabled="exporting"
                          @click="exportAsAndroid"
                        >
                          <span aria-hidden="true">
                            <ArrowDownTrayIcon />
                          </span>
                          <span>
                            {{ t('dashboard.settings.export.android.export') }}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div class="w-full px-6">
                      <Alert
                        :title="
                          t(
                            'dashboard.settings.export.android.instructions.title'
                          )
                        "
                        type="info"
                        show
                      >
                        <div
                          class="prose-sm max-w-none prose-ol:list-decimal"
                          v-html="exportInstructions"
                        />
                      </Alert>
                    </div>
                  </TabPanel>
                  <TabPanel
                    class="has-ring-focus rounded-md focus-visible:ring-inset"
                  >
                    <div class="preference">
                      <div class="preference-description">
                        <label>
                          {{
                            t('dashboard.settings.privacy.removeAccess.label')
                          }}
                        </label>
                        <p>
                          {{
                            t(
                              'dashboard.settings.privacy.removeAccess.description'
                            )
                          }}
                        </p>
                      </div>
                      <div>
                        <button
                          type="button"
                          class="button is-danger"
                          @click="handleDisconnect"
                        >
                          <span aria-hidden="true">
                            <ExclamationTriangleIcon />
                          </span>
                          <span>
                            {{
                              t(
                                'dashboard.settings.privacy.removeAccess.remove'
                              )
                            }}
                          </span>
                        </button>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel
                    v-if="isDev"
                    class="has-ring-focus rounded-md focus-visible:ring-inset"
                  >
                    <div class="divide-y dark:divide-gray-700">
                      <SwitchGroup as="div" class="preference">
                        <div class="preference-description">
                          <SwitchLabel>
                            <span aria-hidden="true">
                              <ExclamationTriangleIcon
                                class="w-5 h-5 mr-1 text-red-600 dark:text-red-400"
                              />
                            </span>
                            <span>
                              {{
                                t(
                                  'dashboard.settings.development.useDevSheet.label'
                                )
                              }}
                            </span>
                          </SwitchLabel>
                          <p>
                            {{
                              t(
                                'dashboard.settings.development.useDevSheet.description'
                              )
                            }}
                          </p>
                        </div>
                        <Switch
                          :model-value="settings.development.useDevSheet"
                          @update:model-value="
                            updateSetting('development.useDevSheet', $event)
                          "
                          :class="
                            settings.development.useDevSheet
                              ? 'bg-primary-600 dark:bg-primary-500'
                              : 'bg-gray-200 dark:bg-gray-600'
                          "
                          class="relative inline-flex items-center h-6 rounded-full w-11 motion-safe:transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500 dark:focus-visible:ring-offset-gray-900"
                        >
                          <span
                            aria-hidden="true"
                            :class="
                              settings.development.useDevSheet
                                ? 'translate-x-6 dark:bg-white'
                                : 'translate-x-1 dark:bg-gray-100'
                            "
                            class="motion-safe:transition-transform duration-200 ease-in-out inline-block w-4 h-4 bg-white rounded-full"
                          />
                        </Switch>
                      </SwitchGroup>
                    </div>
                  </TabPanel>
                </div>
              </TabPanels>
            </TabGroup>

            <div class="dialog-footer">
              <button
                type="button"
                class="button is-primary ml-2"
                @click.stop="handleSave"
              >
                <CheckIcon aria-hidden="true" />
                {{ t('dashboard.details.editForm.finish') }}
              </button>

              <button
                type="button"
                class="button is-ghost"
                @click.stop="closeDialog"
              >
                {{ t('dashboard.details.editForm.cancel') }}
              </button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style lang="postcss" scoped>
.dialog {
  @apply fixed z-30 inset-0 flex flex-col items-center
    sm:py-6 sm:px-6 md:px-0 md:py-12 lg:py-16;
}

.dialog-content {
  @apply relative flex flex-col w-full max-w-3xl h-full
    overflow-hidden text-left bg-white dark:bg-gray-800
    sm:shadow-xl sm:rounded-lg ring-1 ring-black/5;
}

.dialog-header {
  @apply relative overflow-hidden
    bg-primary-600 dark:bg-primary-500
    shrink-0 flex items-center
    px-4 md:px-6 py-4 md:py-5;
}

.dialog-title {
  @apply text-lg font-medium font-display leading-6 text-white;
}

.dialog-description {
  @apply hidden sm:block mt-0.5 text-sm font-medium text-white opacity-80;
}

.dialog-footer {
  @apply shrink-0 flex flex-row-reverse justify-start
    border-t border-gray-200 dark:border-gray-600
    bg-gray-50 dark:bg-gray-800
    px-4 md:px-6 py-3 md:py-4;
}

.close-button {
  @apply shrink-0 p-2 -mr-2 text-primary-200 rounded;
}

.close-button:hover {
  @apply text-white bg-primary-500 dark:bg-primary-400;
}

.close-button:focus-visible {
  @apply text-white ring-primary-300
    ring-offset-primary-600 dark:ring-offset-primary-500;
}

.tab-list {
  @apply flex flex-nowrap w-full shrink-0
    overflow-x-auto md:overflow-x-visible overflow-y-visible
    px-4 md:px-6 space-x-6
    border-b border-gray-300 dark:border-gray-600;
}

.tab-button {
  @apply flex shrink-0 items-center justify-center
    px-1 py-2.5 -mb-px
    text-sm font-medium border-b-2 border-transparent
    text-gray-600 dark:text-gray-400;
}

.tab-button:not(:disabled):hover {
  @apply border-gray-300 dark:border-gray-600
    text-gray-800 dark:text-gray-300;
}

.tab-button[aria-selected='true'] {
  @apply text-primary-600 dark:text-gray-100
     border-primary-600 dark:border-primary-400;
}

.tab-button[aria-selected='true']:hover {
  @apply text-primary-600 dark:text-gray-100
    border-primary-600 dark:border-primary-400;
}

.tab-button:disabled {
  @apply opacity-50 cursor-default;
}

.tab-panels {
  @apply flex-grow overflow-y-auto;
}

.preference {
  @apply px-4 md:px-6 flex flex-col space-y-5 md:space-y-0 md:flex-row
    md:items-center justify-between py-4 md:py-5;
}

.preference-description label {
  @apply text-sm font-semibold dark:text-gray-100
    flex items-center;
}

.preference-description p {
  @apply text-sm text-gray-500 dark:text-gray-400;
}
</style>
