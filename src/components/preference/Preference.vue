<script lang="ts" setup>
export interface PreferenceProps {
  alwaysHorizontal?: boolean
  controlId: string
  description: string
  title: string
}

const props = withDefaults(defineProps<PreferenceProps>(), {
  alwaysHorizontal: false
})

const { alwaysHorizontal } = toRefs(props)
</script>

<template>
  <div
    :class="[
      'flex gap-4 xl:gap-2 w-full py-4 lg:py-5 w-full',
      alwaysHorizontal
        ? 'flex-row items-center'
        : 'flex-col xl:flex-row xl:items-center'
    ]"
  >
    <div
      :class="[
        'gap-0.5',
        alwaysHorizontal ? 'flex flex-col grow' : 'xl:flex xl:flex-col xl:grow'
      ]"
    >
      <slot name="title" :controlId="controlId" :title="title">
        <label
          :for="controlId"
          class="w-full font-medium dark:text-gray-100 flex items-center"
        >
          {{ title }}
        </label>
      </slot>
      <slot name="description" :description="description">
        <p class="w-full text-sm text-gray-600 dark:text-gray-400">
          {{ description }}
        </p>
      </slot>
    </div>
    <div class="shrink-0">
      <slot />
    </div>
  </div>
</template>
