<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  useSettingsStore,
  THEME_SYSTEM,
  THEME_DARK,
  THEME_LIGHT
} from '@/stores/settings'

import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption
} from '@headlessui/vue'

import { MoonIcon, SunIcon } from '@heroicons/vue/outline'

import {
  DeviceMobileIcon as DeviceMobileIconSolid,
  DesktopComputerIcon as DesktopComputerIconSolid,
  MoonIcon as MoonIconSolid,
  SunIcon as SunIconSolid
} from '@heroicons/vue/solid'

defineProps({ light: Boolean })

const { t } = useI18n({ useScope: 'global' })
const settingsStore = useSettingsStore()

const theme = computed({
  get: () => settingsStore.theme,
  set: (newTheme) => settingsStore.updateTheme(newTheme)
})

const options = computed(() => [
  { key: THEME_LIGHT, icon: SunIcon, menuIcon: SunIconSolid },
  { key: THEME_DARK, icon: MoonIcon, menuIcon: MoonIconSolid },
  {
    key: THEME_SYSTEM,
    responsive: true,
    menuIcon: [DeviceMobileIconSolid, DesktopComputerIconSolid]
  }
])

const currentOption = computed(() => {
  return options.value.find((o) => o.key === theme.value)
})
</script>

<template>
  <Listbox
    v-model="theme"
    as="div"
    :class="light ? 'light' : ''"
    class="relative flex items-center justify-center"
  >
    <ListboxButton
      class="theme-chooser has-ring-focus"
      :title="t('dashboard.settings.appearence.theme.label')"
    >
      <span aria-hidden="true">
        <template v-if="theme === 'system'">
          <!-- eslint-disable-next-line prettier/prettier -->
          <component
            :is="options[0].icon"
            class="w-6 h-6 dark:hidden system"
          />
          <component
            :is="options[1].icon"
            class="w-6 h-6 hidden dark:block system"
          />
        </template>
        <component v-else :is="currentOption.icon" class="w-6 h-6 not-system" />
      </span>
      <span class="sr-only">
        {{ t('dashboard.settings.appearence.theme.label') }}
      </span>
    </ListboxButton>
    <transition
      enter-active-class="motion-safe:transition duration-100 ease-out"
      enter-from-class="scale-95 opacity-0"
      enter-to-class="scale-100 opacity-100"
      leave-active-class="motion-safe:transition duration-75 ease-in"
      leave-from-class="scale-100 opacity-100"
      leave-to-class="scale-95 opacity-0"
    >
      <ListboxOptions class="theme-options">
        <ListboxOption
          v-for="option in options"
          :key="option.key"
          :value="option.key"
          v-slot="{ active }"
          as="template"
        >
          <li :class="active ? 'active' : ''" class="theme">
            <span aria-hidden="true">
              <component
                v-if="!option.responsive"
                :is="option.menuIcon"
                class="w-5 h-5 mr-3"
              />
              <template v-else>
                <component
                  :is="option.menuIcon[0]"
                  :class="theme === 'system' ? 'system' : 'not-system'"
                  class="w-5 h-5 mr-3 lg:hidden"
                />
                <component
                  :is="option.menuIcon[1]"
                  :class="theme === 'system' ? 'system' : 'not-system'"
                  class="w-5 h-5 mr-3 hidden lg:inline-block"
                />
              </template>
            </span>
            <span>
              {{ t('dashboard.settings.appearence.theme.' + option.key) }}
            </span>
          </li>
        </ListboxOption>
      </ListboxOptions>
    </transition>
  </Listbox>
</template>

<style lang="postcss" scoped>
.theme-chooser {
  @apply w-8 h-8 flex items-center justify-center rounded-full text-gray-400;
}

.theme-chooser svg.not-system {
  @apply text-blue-300;
}

.light .theme-chooser svg.not-system {
  @apply text-blue-400;
}

.light .theme-chooser:hover svg.system {
  @apply text-gray-500 dark:text-gray-300;
}

.theme-chooser:hover {
  @apply bg-gray-700;
}

.light .theme-chooser:hover {
  @apply bg-gray-200 dark:bg-gray-700;
}

.theme-chooser:focus-visible {
  @apply ring-primary-500 ring-offset-gray-800;
}

.light .theme-chooser:focus-visible {
  @apply ring-offset-white dark:ring-offset-gray-900;
}

.theme-options {
  @apply absolute top-full right-0
    bg-white dark:bg-gray-700
    rounded-md shadow-lg overflow-hidden
    w-36 py-1 mt-2 origin-top-right
    ring-1 ring-black ring-opacity-5;
}

.theme-options:focus {
  @apply outline-none;
}

.theme {
  @apply flex items-center select-none
    w-full px-4 py-2.5 text-sm cursor-pointer
    text-gray-700 dark:text-gray-300;
}

.theme:hover,
.theme:focus-visible,
.theme.active {
  @apply bg-gray-100 dark:bg-gray-600/50
    dark:text-gray-200;
}

.theme:focus {
  @apply outline-none;
}

.theme svg {
  @apply text-gray-500 dark:text-gray-400;
}

.theme:hover svg {
  @apply text-gray-600 dark:text-gray-300;
}

.theme[aria-selected='true'] {
  @apply text-blue-500 dark:text-blue-300 font-semibold;
}

.theme[aria-selected='true'] svg {
  @apply text-blue-500 dark:text-blue-300;
}
</style>
