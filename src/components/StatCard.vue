<template>
  <div class="bg-gray-50 sm:shadow sm:rounded-md dark:bg-gray-800" v-if="loading">
    <div class="flex items-center p-4">
      <div class="skeleton w-10 h-10 shrink-0 md:w-12 md:h-12 mr-3 md:mr-4 rounded-md"></div>
      <div class="flex-1 space-y-2">
        <div class="skeleton h-3 w-24"></div>
        <div class="skeleton h-5 w-32"></div>
      </div>
    </div>
  </div>
  <div class="flex items-center justify-center bg-white dark:bg-gray-800 p-4 sm:rounded-md sm:shadow sm:hover:shadow-md motion-safe:transition-shadow" v-else>
    <div class="flex shrink-0 w-10 h-10 md:w-12 md:h-12 mr-3 md:mr-4 items-center justify-center rounded-md bg-primary-100 dark:bg-gray-800" aria-hidden="true">
      <slot name="icon" css-class="text-primary-600 dark:text-gray-500 h-6 w-6 md:h-8 md:w-8"></slot>
    </div>
    <div class="flex-1">
      <p class="text-gray-500 dark:text-gray-300 font-semibold text-xs mb-0">{{ title }}</p>
      <div class="flex justify-between w-full">
        <transition
          mode="out-in"
          leave-active-class="transition motion-reduce:transition-none motion-reduce:transform-none duration-200 ease-in"
          leave-from-class="opacity-100 translate-x-0"
          leave-to-class="opacity-0 translate-x-2"
          enter-active-class="transition motion-reduce:transition-none motion-reduce:transform-none duration-200 ease-out"
          enter-from-class="opacity-0 -translate-x-2"
          enter-to-class="opacity-100 translate-x-0"
        >
          <p class="font-semibold dark:text-gray-50 text-md sm:text-lg lg:text-xl mb-0" v-if="showValue && !alwaysHidden">
            {{ value || '' }}
          </p>
          <div v-else class="h-5 sm:h-6 mt-1 bg-gray-300 dark:bg-gray-700 rounded w-32 lg:w-24"></div>
        </transition>
      </div>
    </div>
    <button
      v-if="sensitive && !alwaysHidden"
      type="button"
      class="button is-ghost is-icon-only -mr-2 p-2"
      @click.stop="showValue = !showValue"
    >
      <transition
        mode="out-in"
        leave-active-class="transition motion-reduce:transition-none duration-100 ease-in"
        leave-from-class="opacity-100 rotate-0"
        leave-to-class="opacity-0 rotate-180"
        enter-active-class="transition motion-reduce:transition-none duration-200 ease-out"
        enter-from-class="opacity-0 -rotate-180"
        enter-to-class="opacity-100 rotate-0"
      >
        <EyeIcon class="text-gray-500" v-if="!showValue" />
        <EyeOffIcon class="text-gray-500" v-else />
      </transition>
      <span class="sr-only">
        {{ t(`dashboard.home.overview.${!showValue ? 'showValue' : 'hideValue'}`, { title }) }}
      </span>
    </button>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { EyeIcon, EyeOffIcon } from '@heroicons/vue/solid'

export default {
  name: 'StatCard',

  components: {
    EyeIcon,
    EyeOffIcon
  },

  props: {
    alwaysHidden: Boolean,
    loading: {
      type: Boolean,
      required: true
    },
    sensitive: Boolean,
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number]
    }
  },

  setup (props) {
    const showValue = ref(!props.sensitive)

    const { t } = useI18n({ useScope: 'global' })

    return { showValue, t }
  }
}
</script>
