<template>
  <div>
    <div class="h-full flex flex-col">
      <SimpleHeader title="Estatísticas" :loading="loading" />

      <div class="max-w-7xl w-full mx-auto py-6 px-6 lg:px-8 space-y-6">
        <div class="space-y-6 md:space-y-0 md:grid md:grid-cols-2 gap-6">
          <MonthlyExpenseChart />
          <MonthlyBoughtsChart />
        </div>
      </div>

      <div v-if="!loading" class="max-w-7xl w-full mx-auto pb-6 px-6 lg:px-8 flex-1">
        <div class="h-96 md:h-full flex flex-col items-center justify-center border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
          <span aria-hidden="true">
            <DotsHorizontalIcon class="w-10 h-10 text-gray-400 dark:text-gray-600" aria-hidden="true" />
          </span>
          <p class="text-lg text-gray-400 dark:text-gray-600">Mais estatísticas em breve.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

import { DotsHorizontalIcon } from '@heroicons/vue/solid'

import MonthlyBoughtsChart from '@/components/MonthlyBoughtsChart'
import MonthlyExpenseChart from '@/components/MonthlyExpenseChart'
import SimpleHeader from '@/components/SimpleHeader'

export default {
  name: 'DashboardStats',

  components: {
    MonthlyBoughtsChart,
    MonthlyExpenseChart,
    SimpleHeader,
    DotsHorizontalIcon
  },

  setup () {
    const store = useStore()

    const loading = computed(() => store.state.sheet.loading)

    return { loading }
  }
}
</script>

<style>

</style>
