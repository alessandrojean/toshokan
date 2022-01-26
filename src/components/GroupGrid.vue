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
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4" v-else>
      <router-link
        v-for="group in groups"
        :key="group.name"
        :to="{ name: 'DashboardLibrary', query: { group: group.name } }"
        class="button justify-between py-2.5"
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
import { computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()

    const sheetLoading = computed(() => store.state.sheet.loading)
    const sheetId = computed(() => store.state.sheet.sheetId)

    const loading = computed(() => store.state.collection.filters.groups.loading)
    const groups = computed(() => store.state.collection.filters.groups.items)

    onMounted(() => {
      if (sheetId.value && groups.value.length === 0) {
        store.dispatch('collection/fetchGroups')
      }
    })

    watch(sheetId, newSheetId => {
      if (newSheetId && groups.value.length === 0) {
        store.dispatch('collection/fetchGroups')
      }
    })

    const { t, n } = useI18n()

    return {
      sheetLoading,
      loading,
      groups,
      t,
      n
    }
  }
}
</script>
