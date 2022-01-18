<template>
  <Listbox
    as="div"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <ListboxLabel class="sr-only">
      {{ t('dashboard.settings.appearence.locale.label') }}
    </ListboxLabel>

    <ListboxButton class="select relative w-56">
      <span class="flex items-center">
        <img
          :src="createFlagUrl(localeFlags[modelValue])"
          aria-hidden="true"
          class="shrink-0 h-5 w-5 rounded-full"
        >
        <span class="ml-2.5 block truncate">
          {{ t('app.localeName', null, { locale: modelValue }) }}
        </span>
      </span>
      <span
        class="ml-3 absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none"
        aria-hidden="true"
      >
        <SelectorIcon class="w-5 h-5 text-gray-400 dark:text-gray-500" />
      </span>
    </ListboxButton>

    <transition
      leave-active-class="motion-safe:transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <ListboxOptions class="absolute z-10 mt-1 w-56 bg-white dark:bg-gray-700/80 dark:backdrop-blur shadow-lg max-h-56 rounded-md py-1 text-base border border-gray-200 dark:border-gray-600 overflow-auto focus:outline-none sm:text-sm">
        <ListboxOption
          as="template"
          v-for="loc in availableLocales"
          :key="loc"
          :value="loc"
          v-slot="{ active, selected }"
        >
          <li
            :class="[
              active
                ? 'text-white dark:text-gray-100 bg-primary-600 dark:bg-gray-600/50'
                : 'text-gray-900 dark:text-gray-200',
              'cursor-default select-none relative py-2 pl-3 pr-9 focus:outline-none'
            ]"
          >
            <div class="flex items-center">
              <img
                :src="createFlagUrl(localeFlags[loc])"
                aria-hidden="true"
                class="shrink-0 h-5 w-5 rounded-full"
              />
              <span
                :class="[
                  selected ? 'font-semibold' : 'font-normal',
                  'ml-3 block truncate'
                ]"
              >
                {{ t('app.localeName', null, { locale: loc }) }}
              </span>
            </div>

            <span
              v-if="selected"
              :class="[
                active ? 'text-white dark:text-gray-100' : 'text-primary-600 dark:text-primary-400',
                'absolute inset-y-0 right-0 flex items-center pr-4'
              ]"
            >
              <CheckIcon class="h-5 w-5" aria-hidden="true" />
            </span>
          </li>
        </ListboxOption>
      </ListboxOptions>
    </transition>
  </Listbox>
</template>

<script>
import { useI18n } from 'vue-i18n'

import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, SelectorIcon } from '@heroicons/vue/solid'

export default {
  components: {
    Listbox,
    ListboxButton,
    ListboxLabel,
    ListboxOption,
    ListboxOptions,
    CheckIcon,
    SelectorIcon
  },

  props: {
    modelValue: {
      type: String,
      required: true
    }
  },

  emits: ['update:modelValue'],

  setup () {
    const { t, availableLocales } = useI18n()

    const localeFlags = {
      'pt-BR': 'BR',
      'en-US': 'US'
    }

    function createFlagUrl (country) {
      return `https://hatscripts.github.io/circle-flags/flags/${country.toLowerCase()}.svg`
    }

    return {
      t,
      localeFlags,
      availableLocales,
      createFlagUrl
    }
  }
}
</script>
