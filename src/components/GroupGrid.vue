<template>
  <section
    v-if="groups.length > 0 || sheetLoading || loading"
    aria-labelledby="groups-title"
    class="w-full mb-3 mt-8"
  >
    <div v-if="sheetLoading || loading" class="motion-safe:animate-pulse h-6 bg-gray-400 dark:bg-gray-600 rounded w-40 mb-3"></div>
    <h2 v-else id="groups-title" class="font-medium font-display text-lg mb-2 dark:text-gray-200">
      {{ t('dashboard.home.groups') }}
    </h2>

    <div
      class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
      v-if="sheetLoading || loading"
    >
      <div
        v-for="i in 4"
        :key="i"
        class="motion-safe:animate-pulse h-10 bg-gray-400 dark:bg-gray-600 rounded w-full"
      />
    </div>
    <div
      v-else
      class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
      ref="container"
    >
      <router-link
        v-for="(group, idx) in groups"
        :key="group.name"
        class="button justify-between py-2.5"
        :to="{ name: 'DashboardLibrary', query: { group: group.name } }"
        :tabindex="focused === idx ? '0' : '-1'"
        @keydown="handleKeydown"
      >
        <span class="flex-1 truncate">
          {{ group.name }}
        </span>
        <span aria-hidden="true" class="ml-2 bg-primary-100 dark:bg-gray-600 dark:group-hover:bg-gray-500 text-primary-700 dark:text-gray-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {{ n(group.count, 'integer') }}
        </span>
      </router-link>
    </div>
  </section>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { useCollectionStore } from '@/stores/collection'
import { useSheetStore } from '@/stores/sheet'

export default {
  setup () {
    const collectionStore = useCollectionStore()
    const sheetStore = useSheetStore()

    const sheetLoading = computed(() => sheetStore.loading)
    const sheetId = computed(() => sheetStore.sheetId)

    const loading = computed(() => collectionStore.filters.groups.loading)
    const groups = computed(() => collectionStore.filters.groups.items)

    onMounted(async () => {
      if (sheetId.value && groups.value.length === 0) {
        await collectionStore.fetchGroups()
      }
    })

    watch(sheetId, async newSheetId => {
      if (newSheetId && groups.value.length === 0) {
        await collectionStore.fetchGroups()
      }
    })

    const { t, n } = useI18n({ useScope: 'global' })

    const container = ref(null)
    const focused = ref(0)

    const columnSize = {
      '1024px': 5, // lg
      '768px': 4 // md
    }

    function getColumnSize () {
      const match = Object.entries(columnSize)
        .find(([minWidth]) => {
          return window.matchMedia(`(min-width: ${minWidth})`).matches
        })

      return match?.[1] || 2
    }

    /**
     * @param {KeyboardEvent} event
     */
    function handleKeydown (event) {
      const allowedKeys = [
        'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown',
        'Home', 'End'
      ]
      const { key } = event

      if (key === 'Tab') {
        setTimeout(() => { focused.value = 0 })
        return
      }

      if (!allowedKeys.includes(key)) {
        return
      }

      const totalItems = groups.value.length
      const columns = getColumnSize()
      const lines = Math.ceil(totalItems / columns)
      const row = Math.floor(focused.value / columns) + 1

      if (key === 'Home' && focused.value === 0) {
        return
      }

      if (key === 'End' && focused.value === totalItems - 1) {
        return
      }

      if (key === 'ArrowUp' && row === 1) {
        return
      }

      if (key === 'ArrowDown' && row === lines) {
        return
      }

      event.preventDefault()

      if (key === 'ArrowRight') {
        focused.value = Math.min(focused.value + 1, totalItems - 1)
      } else if (key === 'ArrowLeft') {
        focused.value = Math.max(focused.value - 1, 0)
      } else if (key === 'ArrowDown') {
        focused.value = row < lines
          ? Math.min(totalItems - 1, focused.value + columns)
          : focused.value
      } else if (key === 'ArrowUp') {
        focused.value = row > 1
          ? Math.max(0, focused.value - columns)
          : focused.value
      } else if (key === 'Home') {
        focused.value = 0
      } else if (key === 'End') {
        focused.value = totalItems - 1
      }

      const group = container.value?.children?.[focused.value]

      group?.focus()
    }

    return {
      sheetLoading,
      loading,
      groups,
      container,
      focused,
      handleKeydown,
      t,
      n
    }
  }
}
</script>
