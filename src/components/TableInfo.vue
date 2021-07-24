<template>
  <div class="motion-safe:animate-pulse bg-gray-50 shadow rounded-md dark:bg-gray-700 w-full h-96" v-if="loading"></div>
  <section
    v-else
    class="relative bg-white shadow overflow-hidden rounded-md dark:bg-gray-800"
    aria-labelledby="table-info-title"
  >
    <div class="px-6 py-5">
      <h3 id="table-info-title" class="text-lg leading-6 font-medium font-title text-gray-900 dark:text-gray-200">
        <slot name="step-indicator"></slot>
        {{ title }}
      </h3>
      <p v-if="subtitle && subtitle.length > 0" class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {{ subtitle }}
      </p>
    </div>
    <div class="border-t border-gray-200 dark:border-gray-600">
      <dl class="divide-y dark:divide-gray-600">
        <div
          v-for="infoLine in info"
          :key="infoLine.title"
          class="odd:bg-gray-50 even:bg-white dark:odd:bg-gray-700 dark:even:bg-gray-700 px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4"
        >
          <dt class="text-sm font-semibold md:font-medium text-gray-500 dark:text-gray-100">
            {{ infoLine.title }}
          </dt>
          <dd class="mt-1 text-sm text-gray-900 dark:text-gray-300 sm:mt-0 sm:col-span-2">
            {{ infoLine.value }}
            <slot v-if="infoLine.property" :name="infoLine.property"></slot>
          </dd>
        </div>
      </dl>
    </div>
    <div v-if="$slots.footer" class="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600 px-4 py-5 sm:px-6 sm:py-3 flex justify-between">
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
