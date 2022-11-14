<script lang="ts" setup>
import {
  computed,
  FunctionalComponent,
  Ref,
  ref,
  watch,
  type WritableComputedRef
} from 'vue'
import { useQueryClient } from '@tanstack/vue-query'

import { useI18n } from '@/i18n'
import { useSettingsStore } from '@/stores/settings'
import { useSheetStore } from '@/stores/sheet'

import { Switch, SwitchLabel, SwitchGroup } from '@headlessui/vue'
import {
  ArrowDownTrayIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/20/solid'

import Button, { type ButtonProps } from '@/components/form/Button.vue'
import type { Item } from '@/components/dashboard/DashboardAsideMenu.vue'
import DashboardAsideButton from '@/components/dashboard/DashboardAsideButton.vue'
import LocaleSelector from '@/components/LocaleSelector.vue'
import Preference from '@/components/preference/Preference.vue'
import SimpleHeader from '@/components/SimpleHeader.vue'
import { useBrowserLocation } from '@vueuse/core'

const { t, locale } = useI18n({ useScope: 'global' })
const isDev = ref(import.meta.env.DEV)

const sections = computed<Item[]>(() => {
  const buttons: Item[] = [
    {
      key: 'appearence',
      label: t('dashboard.settings.appearence.title'),
      to: '#appearence'
    },
    {
      key: 'export',
      label: t('dashboard.settings.export.title'),
      to: '#export'
    },
    {
      key: 'privacy',
      label: t('dashboard.settings.privacy.title'),
      to: '#privacy'
    }
  ]

  if (isDev.value) {
    buttons.push({
      key: 'development',
      label: t('dashboard.settings.development.title'),
      to: '#development'
    })
  }

  return buttons
})

interface PreferenceBase {
  key: string
  title: string
  description: string
  controlId: string
}

type LocalePreference = PreferenceBase & { type: 'locale' }
type ActionPreference = PreferenceBase & {
  type: 'action'
  buttonTitle: string
  buttonProps?: ButtonProps
  leftIcon?: FunctionalComponent
  rightIcon?: FunctionalComponent
  action: () => void | Promise<void>
}
type SelectPreference = PreferenceBase & {
  type: 'select'
  options: { value: string; title: string }[]
  modelValue: WritableComputedRef<string>
}
type SwitchPreference = PreferenceBase & {
  type: 'switch'
  modelValue: WritableComputedRef<boolean>
}

type Preference =
  | LocalePreference
  | ActionPreference
  | SelectPreference
  | SwitchPreference
type PreferenceGroup = {
  key: string
  title: string
  preferences: Preference[]
  hide?: boolean
}

const settingsStore = useSettingsStore()
const sheetStore = useSheetStore()

const theme = computed({
  get: () => settingsStore.theme,
  set: (value) => settingsStore.updateTheme(value)
})

const viewMode = computed({
  get: () => settingsStore.viewMode,
  set: (value) => settingsStore.updateViewMode(value)
})

const gridMode = computed({
  get: () => settingsStore.gridMode,
  set: (value) => settingsStore.updateGridMode(value)
})

const spoilerModeSynopsis = computed({
  get: () => settingsStore.spoilerMode.synopsis,
  set: (value) => settingsStore.updateSpoilerMode({ synopsis: value })
})

const spoilerModeCover = computed({
  get: () => settingsStore.spoilerMode.cover,
  set: (value) => settingsStore.updateSpoilerMode({ cover: value })
})

const blurNsfwCover = computed({
  get: () => settingsStore.blurNsfw,
  set: (value) => settingsStore.updateBlurNsfw(value)
})

const useDevSheet = computed({
  get: () => settingsStore.useDevSheet,
  set: (value) => settingsStore.updateUseDevSheet(value)
})

const groups = computed<PreferenceGroup[]>(() => [
  {
    key: 'appearence',
    title: t('dashboard.settings.appearence.title'),
    preferences: [
      {
        key: 'locale',
        type: 'locale',
        title: t('dashboard.settings.appearence.locale.label'),
        description: t('dashboard.settings.appearence.locale.description'),
        controlId: 'locale'
      },
      {
        key: 'theme',
        type: 'select',
        title: t('dashboard.settings.appearence.theme.label'),
        description: t('dashboard.settings.appearence.theme.description'),
        controlId: 'theme',
        modelValue: theme,
        options: [
          {
            value: 'system',
            title: t('dashboard.settings.appearence.theme.system')
          },
          {
            value: 'light',
            title: t('dashboard.settings.appearence.theme.light')
          },
          {
            value: 'dark',
            title: t('dashboard.settings.appearence.theme.dark')
          }
        ]
      },
      {
        key: 'view-mode',
        type: 'select',
        title: t('dashboard.settings.appearence.viewMode.label'),
        description: t('dashboard.settings.appearence.viewMode.description'),
        controlId: 'view-mode',
        modelValue: viewMode,
        options: [
          {
            value: 'grid',
            title: t('dashboard.library.filters.viewMode.grid')
          },
          {
            value: 'table',
            title: t('dashboard.library.filters.viewMode.table')
          }
        ]
      },
      {
        key: 'grid-mode',
        type: 'select',
        title: t('dashboard.settings.appearence.gridMode.label'),
        description: t('dashboard.settings.appearence.gridMode.description'),
        controlId: 'grid-mode',
        modelValue: gridMode,
        options: [
          {
            value: 'compact',
            title: t('dashboard.library.filters.gridMode.compact')
          },
          {
            value: 'comfortable',
            title: t('dashboard.library.filters.gridMode.comfortable')
          }
        ]
      },
      {
        key: 'spoiler-mode-synopsis',
        type: 'switch',
        title: t('dashboard.settings.appearence.spoilerModeSynopsis.label'),
        description: t(
          'dashboard.settings.appearence.spoilerModeSynopsis.description'
        ),
        controlId: 'spoiler-mode-synopsis',
        modelValue: spoilerModeSynopsis
      },
      {
        key: 'spoiler-mode-cover',
        type: 'switch',
        title: t('dashboard.settings.appearence.spoilerModeCover.label'),
        description: t(
          'dashboard.settings.appearence.spoilerModeCover.description'
        ),
        controlId: 'spoiler-mode-cover',
        modelValue: spoilerModeCover
      },
      {
        key: 'blur-nsfw-cover',
        type: 'switch',
        title: t('dashboard.settings.appearence.blurNsfwCover.label'),
        description: t(
          'dashboard.settings.appearence.blurNsfwCover.description'
        ),
        controlId: 'blur-nsfw-cover',
        modelValue: blurNsfwCover
      }
    ]
  },
  {
    key: 'export',
    title: t('dashboard.settings.export.title'),
    preferences: [
      {
        key: 'android',
        type: 'action',
        title: t('dashboard.settings.export.android.label'),
        description: t('dashboard.settings.export.android.description'),
        controlId: 'android',
        buttonTitle: t('dashboard.settings.export.android.export'),
        leftIcon: ArrowDownTrayIcon,
        action: () => {}
      }
    ]
  },
  {
    key: 'privacy',
    title: t('dashboard.settings.privacy.title'),
    preferences: [
      {
        key: 'remove-access',
        type: 'action',
        title: t('dashboard.settings.privacy.removeAccess.label'),
        description: t('dashboard.settings.privacy.removeAccess.description'),
        controlId: 'remove-access',
        buttonTitle: t('dashboard.settings.privacy.removeAccess.remove'),
        leftIcon: ExclamationTriangleIcon,
        buttonProps: {
          kind: 'danger'
        },
        action: () => {}
      }
    ]
  },
  {
    key: 'development',
    title: t('dashboard.settings.development.title'),
    hide: !isDev.value,
    preferences: [
      {
        key: 'use-dev-sheet',
        type: 'switch',
        title: t('dashboard.settings.development.useDevSheet.label'),
        description: t(
          'dashboard.settings.development.useDevSheet.description'
        ),
        controlId: 'use-dev-sheet',
        modelValue: useDevSheet
      }
    ]
  }
])

function updateSelectPreference(preference: SelectPreference, event: Event) {
  const target = event.target as HTMLSelectElement
  preference.modelValue.value = target.value
}

function updateSwitchPreference(preference: SwitchPreference, value: boolean) {
  preference.modelValue.value = value
}

const queryClient = useQueryClient()

watch(locale, () => {
  queryClient.invalidateQueries(['statistics'])
  queryClient.invalidateQueries(['last-added'])
  queryClient.invalidateQueries(['latest-readings'])
  queryClient.invalidateQueries(['books'])
  queryClient.invalidateQueries(['book'])
})

watch(useDevSheet, async () => {
  await sheetStore.findSheetId()
  queryClient.resetQueries()
  queryClient.refetchQueries()
})

const location = useBrowserLocation()

function handleNavigation(event: Event) {
  const target = event.target as HTMLSelectElement
  const element = document.querySelector(target.value)

  element?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<route lang="yaml">
meta:
  title: app.routes.dashboard.settings
  layout: dashboard
</route>

<template>
  <div class="w-full">
    <SimpleHeader :title="t('dashboard.settings.title')" class="mb-3 md:mb-0" />

    <div class="md:hidden px-4 sm:px-6">
      <label class="sr-only" for="navigate-to">
        {{ t('dashboard.settings.navigateTo') }}
      </label>

      <select
        id="navigate-to"
        class="select w-full text-base"
        @change="handleNavigation"
      >
        <option
          v-for="section in sections"
          :key="section.key"
          :value="String(section.to)"
          :selected="location.host === String(section.to)"
        >
          {{ section.label }}
        </option>
      </select>
    </div>

    <div class="max-w-7xl w-full mx-auto py-6 px-4 sm:px-6">
      <div class="w-full md:flex gap-8">
        <div class="w-48 shrink-0 hidden md:block">
          <aside class="flex flex-col gap-2 sticky top-24">
            <DashboardAsideButton
              v-for="section in sections"
              :key="section.key"
              :to="section.to"
              :item="section"
              :href="String(section.to)"
              :active="false"
            />
          </aside>
        </div>
        <div class="grow min-w-0 space-y-16 md:-mt-3">
          <template v-for="group in groups" :key="group.key">
            <div v-if="!group.hide" :id="group.key" class="w-full scroll-mt-20">
              <h2
                class="text-lg sm:text-xl font-medium font-display sticky top-16 bg-white dark:bg-gray-900 py-3 border-b dark:border-b-gray-700 z-10"
              >
                {{ group.title }}
              </h2>
              <Preference
                v-for="preference in group.preferences"
                :key="preference.key"
                :control-id="preference.controlId"
                :title="preference.title"
                :description="preference.description"
                :always-horizontal="preference.type === 'switch'"
              >
                <LocaleSelector
                  v-if="preference.type === 'locale'"
                  v-model="locale"
                  class="w-56"
                />
                <select
                  v-else-if="preference.type === 'select'"
                  class="select w-44 h-auto"
                  :id="preference.controlId"
                  @change="updateSelectPreference(preference, $event)"
                >
                  <option
                    v-for="option in preference.options"
                    :key="option.value"
                    :value="option.value"
                    :selected="option.value === preference.modelValue.value"
                  >
                    {{ option.title }}
                  </option>
                </select>
                <SwitchGroup as="div" v-else-if="preference.type === 'switch'">
                  <SwitchLabel class="sr-only">
                    {{ preference.title }}
                  </SwitchLabel>
                  <Switch
                    :model-value="preference.modelValue.value"
                    @update:model-value="
                      updateSwitchPreference(preference, $event)
                    "
                    :class="
                      preference.modelValue.value
                        ? 'bg-primary-600 dark:bg-primary-500'
                        : 'bg-gray-200 dark:bg-gray-600'
                    "
                    class="relative inline-flex items-center h-8 rounded-full w-14 motion-safe:transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500 dark:focus-visible:ring-offset-gray-900"
                  >
                    <div
                      aria-hidden="true"
                      :class="
                        preference.modelValue.value
                          ? 'translate-x-7 dark:bg-white'
                          : 'translate-x-1 dark:bg-gray-100'
                      "
                      class="motion-safe:transition-transform duration-200 ease-in-out inline-block w-6 h-6 bg-white rounded-full flex items-center justify-center"
                    >
                      <CheckIcon
                        :class="[
                          'w-4 h-4 motion-safe:transition-opacity duration-200 ease-in-out',
                          'text-primary-600 dark:text-primary-500',
                          preference.modelValue.value
                            ? 'opacity-100'
                            : 'opacity-0'
                        ]"
                      />
                    </div>
                  </Switch>
                </SwitchGroup>
                <Button
                  v-else-if="preference.type === 'action'"
                  v-bind="preference.buttonProps"
                  :id="preference.controlId"
                  @click="preference.action"
                >
                  <template #left="{ iconClass }" v-if="preference.leftIcon">
                    <component :is="preference.leftIcon" :class="iconClass" />
                  </template>
                  <template #right="{ iconClass }" v-if="preference.rightIcon">
                    <component :is="preference.rightIcon" :class="iconClass" />
                  </template>
                  <span>{{ preference.buttonTitle }}</span>
                </Button>
              </Preference>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
