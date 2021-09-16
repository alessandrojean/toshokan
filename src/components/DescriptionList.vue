<template>
  <dl class="grid grid-cols-2 gap-6">
    <div
      v-for="infoLine in info"
      :key="infoLine.title"
      :class="`col-span-2 sm:col-span-${infoLine.columns || '2'}`"
    >
      <dt class="text-sm font-semibold md:font-medium text-gray-500 dark:text-gray-400">
        {{ infoLine.title }}
      </dt>
      <dd class="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:mt-0">
        <slot
          v-if="infoLine.property"
          :name="infoLine.property"
          :value="infoLine.value"
        >
          {{ infoLine.value }}
        </slot>
      </dd>
    </div>
  </dl>
</template>

<script>
export default {
  props: {
    info: {
      type: Array,
      required: true
    }
  }
}
</script>
