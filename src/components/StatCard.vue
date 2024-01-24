<script lang="ts" setup>
export interface StatCardProps {
  alwaysHidden?: boolean
  loading: boolean
  sensitive?: boolean
  title: string
  showValue?: boolean
  value: string | number
}

const props = withDefaults(defineProps<StatCardProps>(), {
  alwaysHidden: false,
  sensitive: false,
  showValue: true,
})

const { alwaysHidden, showValue } = toRefs(props)
</script>

<template>
  <div v-if="loading">
    <div class="flex items-center">
      <div
        class="skeleton w-10 h-10 shrink-0 md:w-12 md:h-12 2xl:w-16 2xl:h-16 mr-3 md:mr-4 rounded-xl"
      />
      <div class="flex-1 space-y-2">
        <div class="skeleton h-3 2xl:h-4 w-24" />
        <div class="skeleton h-5 2xl:h-7 w-32" />
      </div>
    </div>
  </div>
  <div v-else class="flex items-center justify-center">
    <div
      class="flex shrink-0 w-10 h-10 md:w-12 md:h-12 2xl:w-16 2xl:h-16 mr-3 md:mr-4 items-center justify-center rounded-xl bg-primary-100 dark:bg-gray-700/50"
      aria-hidden="true"
    >
      <slot
        name="icon"
        css-class="text-primary-600 dark:text-gray-400 h-6 w-6 md:h-8 md:w-8 2xl:w-10 2xl:h-10"
      />
    </div>
    <div class="flex-1">
      <p
        class="text-gray-500 dark:text-gray-300 font-semibold text-xs 2xl:text-sm mb-0"
      >
        {{ title }}
      </p>
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
          <p
            v-if="showValue && !alwaysHidden"
            class="font-medium dark:text-gray-50 text-md sm:text-lg lg:text-xl 2xl:text-2xl mb-0"
          >
            {{ value || '' }}
          </p>
          <div
            v-else
            aria-hidden="true"
            class="h-5 sm:h-6 2xl:h-7 mt-1 bg-gray-300 dark:bg-gray-700 rounded w-32 lg:w-24"
          />
        </transition>
      </div>
    </div>
  </div>
</template>
