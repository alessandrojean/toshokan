<script lang="ts" setup>
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline'

import {
  ComputerDesktopIcon as ComputerDesktopIconSolid,
  DevicePhoneMobileIcon as DevicePhoneMobileIconSolid,
  MoonIcon as MoonIconSolid,
  SunIcon as SunIconSolid,
} from '@heroicons/vue/20/solid'

export interface ThemeToggleProps {
  light?: boolean
  bottom?: boolean
  transparent?: boolean
}

const props = withDefaults(defineProps<ThemeToggleProps>(), {
  light: false,
  bottom: false,
  transparent: false,
})

const { light, bottom, transparent } = toRefs(props)

const { t } = useI18n({ useScope: 'global' })
const settingsStore = useSettingsStore()

const theme = computed({
  get: () => settingsStore.theme,
  set: newTheme => settingsStore.updateTheme(newTheme),
})

const options = computed(() => [
  { key: THEME_LIGHT, icon: SunIcon, menuIcon: SunIconSolid },
  { key: THEME_DARK, icon: MoonIcon, menuIcon: MoonIconSolid },
  {
    key: THEME_SYSTEM,
    responsive: true,
    menuIcon: [DevicePhoneMobileIconSolid, ComputerDesktopIconSolid],
  },
])

const currentOption = computed(() => {
  return options.value.find(o => o.key === theme.value)
})
</script>

<template>
  <Listbox
    v-model="theme"
    as="div"
    :class="[
      'relative flex items-center justify-center',
      { light, transparent },
    ]"
  >
    <ListboxButton
      class="theme-chooser has-ring-focus"
      :title="t('dashboard.settings.appearence.theme.label')"
    >
      <span aria-hidden="true">
        <template v-if="theme === 'system'">
          <component
            :is="options[0].icon"
            class="w-6 h-6 dark:hidden system"
          />
          <component
            :is="options[1].icon"
            class="w-6 h-6 hidden dark:block system"
          />
        </template>
        <component
          :is="currentOption!.icon"
          v-else
          class="w-6 h-6 not-system"
        />
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
      <ListboxOptions :class="bottom ? 'is-bottom' : ''" class="theme-options">
        <ListboxOption
          v-for="option in options"
          :key="option.key"
          v-slot="{ active }"
          :value="option.key"
          as="template"
        >
          <li :class="active ? 'active' : ''" class="theme">
            <span aria-hidden="true">
              <component
                :is="option.menuIcon"
                v-if="!option.responsive"
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
              {{ t(`dashboard.settings.appearence.theme.${option.key}`) }}
            </span>
          </li>
        </ListboxOption>
      </ListboxOptions>
    </transition>
  </Listbox>
</template>

<style lang="postcss" scoped>
.theme-chooser {
  @apply w-8 h-8 flex items-center justify-center rounded-full text-gray-400
    motion-safe:transition;
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

.transparent .theme-chooser {
  svg.system,
  svg.not-system {
    @apply text-white/80;
  }

  &:where(:focus-visible, :hover) {
    @apply bg-white/20;

    svg.system,
    svg.not-system {
      @apply text-white/95;
    }
  }
}

.theme-options {
  @apply absolute top-full right-0
    bg-white dark:bg-gray-700
    rounded-md shadow-lg overflow-hidden
    w-36 py-1 mt-2 origin-top-right
    ring-1 ring-black ring-opacity-5;
}

.theme-options.is-bottom {
  @apply top-0 -translate-y-full origin-bottom-right -mt-2;
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
