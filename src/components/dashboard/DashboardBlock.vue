<script lang="ts" setup>
export interface DashboardBlockProps {
  as?: keyof HTMLElementTagNameMap
  title?: string
}

const props = withDefaults(defineProps<DashboardBlockProps>(), {
  as: 'section',
})

const { as } = toRefs(props)
</script>

<template>
  <component
    :is="as"
    class="bg-block dark:bg-block-dark p-4 rounded-xl relative motion-safe:transition"
  >
    <slot
      name="title"
      title-classes="text-md sm:text-lg font-medium font-display-safe dark:text-gray-100"
    >
      <h2
        v-if="title"
        class="text-md sm:text-lg font-medium font-display-safe dark:text-gray-100"
      >
        {{ title }}
      </h2>
    </slot>
    <div :class="{ 'mt-4': title }">
      <slot />
    </div>
  </component>
</template>
