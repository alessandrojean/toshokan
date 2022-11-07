<script lang="ts" setup>
export type InfoLine = {
  title: string
  columns?: number
  property: string
  value: string | null
}

defineProps<{ info: InfoLine[] }>()

function colSpan(columns?: number) {
  const map: Record<number, string> = {
    0: '',
    1: 'sm:col-span-1',
    2: 'sm:col-span-2',
    3: 'sm:col-span-3',
    4: 'sm:col-span-4'
  }

  return map[columns ?? 0]
}
</script>

<template>
  <dl class="grid grid-cols-2 gap-6">
    <div
      v-for="infoLine in info"
      :key="infoLine.title"
      :class="`col-span-2 ${colSpan(infoLine.columns)}`"
    >
      <dt
        class="text-sm font-semibold md:font-medium text-gray-500 dark:text-gray-400"
      >
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
