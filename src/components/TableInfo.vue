<template>
  <div class="motion-safe:animate-pulse rounded-md w-full h-96" v-if="loading"></div>
  <section
    v-else
    class="relative px-6 sm:px-0 space-y-6 overflow-visible rounded-md"
    aria-labelledby="table-info-title"
  >
    <div>
      <h3 id="table-info-title" class="text-lg leading-6 font-medium font-display text-gray-900 dark:text-gray-200">
        <slot name="step-indicator"></slot>
        {{ title }}
      </h3>
      <p v-if="subtitle && subtitle.length > 0" class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {{ subtitle }}
      </p>
    </div>

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
    <div v-if="$slots.footer" class="flex justify-start flex-row-reverse">
      <slot name="footer"></slot>
    </div>
    <slot name="loading-indicator"></slot>
  </section>
</template>

<script>
export default {
  name: 'TableInfo',

  props: {
    info: Array,
    loading: Boolean,
    subtitle: String,
    title: String
  }
}
</script>

<style>

</style>
