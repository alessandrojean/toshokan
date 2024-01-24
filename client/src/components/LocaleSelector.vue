<script lang="ts" setup>
import {
  CheckIcon,
  ChevronUpDownIcon,
  LanguageIcon,
} from '@heroicons/vue/20/solid'
import { type Locale, useI18n } from '@/i18n'
import { getFlagUrl } from '@/util'

export interface LocaleSelectorProps {
  modelValue: Locale
  top?: boolean
}

withDefaults(defineProps<LocaleSelectorProps>(), {
  top: false,
})

defineEmits<{
  (e: 'update:modelValue', modelValue: Locale): void
}>()

const { t, availableLocales } = useI18n({ useScope: 'global' })

const localeFlags: Record<Locale, string> = {
  'pt-BR': 'BR',
  'en-US': 'US',
}
</script>

<template>
  <div>
    <div class="md:hidden">
      <label for="locale" class="sr-only">
        {{ t('dashboard.settings.appearence.locale.label') }}
      </label>

      <div class="relative">
        <span
          class="absolute inset-y-0 left-0 inline-flex items-center justify-center pl-2.5"
          aria-hidden="true"
        >
          <LanguageIcon class="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </span>

        <select
          id="locale"
          class="select pl-9"
          @change="
            $emit(
              'update:modelValue',
              ($event.target! as HTMLSelectElement).value,
            )
          "
        >
          <option
            v-for="loc in availableLocales"
            :key="loc"
            :value="loc"
            :selected="loc === modelValue"
          >
            {{ t('app.localeName', {}, { locale: loc }) }}
          </option>
        </select>
      </div>
    </div>

    <Listbox
      as="div"
      class="hidden md:block relative"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <ListboxLabel class="sr-only">
        {{ t('dashboard.settings.appearence.locale.label') }}
      </ListboxLabel>

      <ListboxButton class="select relative w-56">
        <span class="flex items-center">
          <img
            :src="getFlagUrl(localeFlags[modelValue]).circle"
            aria-hidden="true"
            class="shrink-0 h-5 w-5 rounded-full"
          >
          <span class="ml-2.5 block truncate">
            {{ t('app.localeName', {}, { locale: modelValue }) }}
          </span>
        </span>
        <span
          class="ml-3 absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none"
          aria-hidden="true"
        >
          <ChevronUpDownIcon class="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="motion-safe:transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          :class="top ? 'top-0 translate-y-[calc(-100%-0.25rem)]' : 'mt-1'"
          class="absolute z-10 w-56 bg-white dark:supports-backdrop-blur:bg-gray-700/80 dark:bg-gray-700 dark:backdrop-blur shadow-lg max-h-56 rounded-md py-1 text-base border border-gray-200 dark:border-gray-600 overflow-auto focus:outline-none sm:text-sm"
        >
          <ListboxOption
            v-for="loc in availableLocales"
            :key="loc"
            v-slot="{ active, selected }"
            as="template"
            :value="loc"
          >
            <li
              :class="[
                active
                  ? 'text-white dark:text-gray-100 bg-primary-600 dark:bg-gray-600/50'
                  : 'text-gray-900 dark:text-gray-200',
                'cursor-default select-none relative py-2 pl-3 pr-9 focus:outline-none',
              ]"
            >
              <div class="flex items-center">
                <img
                  :src="getFlagUrl(localeFlags[loc as Locale]).circle"
                  aria-hidden="true"
                  class="shrink-0 h-5 w-5 rounded-full"
                >
                <span
                  :class="[
                    selected ? 'font-semibold' : 'font-normal',
                    'ml-3 block truncate',
                  ]"
                >
                  {{ t('app.localeName', {}, { locale: loc }) }}
                </span>
              </div>

              <span
                v-if="selected"
                :class="[
                  active
                    ? 'text-white dark:text-gray-100'
                    : 'text-primary-600 dark:text-primary-400',
                  'absolute inset-y-0 right-0 flex items-center pr-4',
                ]"
              >
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </Listbox>
  </div>
</template>
