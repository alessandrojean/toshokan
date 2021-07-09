<template>
  <div class="bg-gray-50 shadow rounded-md dark:bg-gray-700" v-if="loading">
    <div class="motion-safe:animate-pulse flex items-center p-3 md:p-4">
      <div class="w-10 h-10 md:w-12 md:h-12 mr-3 md:mr-4 rounded-md bg-gray-400 dark:bg-gray-500"></div>
      <div class="flex-1 space-y-2">
        <div class="h-3 bg-gray-400 dark:bg-gray-500 rounded w-24"></div>
        <div class="h-5 bg-gray-400 dark:bg-gray-500 rounded w-32"></div>
      </div>
    </div>
  </div>
  <div class="flex items-center justify-center bg-white dark:bg-gray-700 p-3 md:p-4 rounded-md shadow hover:shadow-md motion-safe:transition-shadow" v-else>
    <div class="flex w-10 h-10 md:w-12 md:h-12 mr-3 md:mr-4 items-center justify-center rounded-md bg-indigo-500" aria-hidden="true">
      <slot name="icon" css-class="text-white h-6 w-6 md:h-8 md:w-8"></slot>
    </div>
    <div class="flex-1">
      <p class="text-gray-400 font-semibold text-xs mb-0">{{ title }}</p>
      <div class="flex justify-between w-full">
        <transition
          mode="out-in"
          leave-active-class="transition motion-reduce:transition-none transform motion-reduce:transform-none duration-200 ease-in"
          leave-from-class="opacity-100 translate-x-0"
          leave-to-class="opacity-0 translate-x-2"
          enter-active-class="transition motion-reduce:transition-none transform motion-reduce:transform-none duration-200 ease-out"
          enter-from-class="opacity-0 -translate-x-2"
          enter-to-class="opacity-100 translate-x-0"
        >
          <p class="font-semibold dark:text-gray-100 text-md sm:text-lg lg:text-xl mb-0" v-if="showValue">
            {{ value || '' }}
          </p>
          <div v-else class="h-5 sm:h-6 mt-1 bg-gray-500 dark:bg-gray-600 rounded w-32 lg:w-24"></div>
        </transition>
      </div>
    </div>
    <button
      v-if="sensitive"
      type="button"
      class="button is-ghost is-darker is-icon-only -mr-1 sm:-mr-2 p-1 sm:p-2"
      @click.stop="showValue = !showValue"
    >
      <transition
        mode="out-in"
        leave-active-class="transition motion-reduce:transition-none duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        enter-active-class="transition motion-reduce:transition-none duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
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

    const { t } = useI18n()

    return { showValue, t }
  }
}
</script>
