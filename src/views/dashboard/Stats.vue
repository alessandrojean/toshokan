<template>
  <div class="flex flex-col">
    <SimpleHeader title="Estatísticas" :loading="loading" />

    <div class="flex-1">
      <div v-if="!sheetIsEmpty && !tooEarly" class="h-full flex flex-col max-w-7xl w-full mx-auto py-6 px-6 lg:px-8 space-y-6">
        <div class="space-y-6 md:space-y-0 md:grid md:grid-cols-2 gap-6">
          <MonthlyExpenseChart />
          <MonthlyBoughtsChart />
        </div>

        <!-- More charts soon -->
        <div v-if="!loading" class="h-96 md:h-auto md:flex-1 flex flex-col items-center justify-center border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
          <span aria-hidden="true">
            <DotsHorizontalIcon class="w-10 h-10 text-gray-400 dark:text-gray-600" aria-hidden="true" />
          </span>
          <p class="text-lg text-gray-400 dark:text-gray-600">Mais estatísticas em breve.</p>
        </div>
      </div>

      <!-- Empty collection -->
      <section
        v-if="sheetIsEmpty"
        aria-labelledby="empty-sheet-title"
        class="w-full max-w-lg mx-auto h-full flex items-center justify-center flex-col px-4"
      >
        <span aria-hidden="true">
          <ExclamationCircleIcon class="h-16 w-16 mb-8 text-gray-400 dark:text-gray-600" />
        </span>
        <h2
          id="empty-sheet-title"
          class="text-xl text-center font-medium text-gray-600 dark:text-gray-400 mb-2"
        >
          Você ainda não possui nenhum livro
        </h2>
        <p class="text-center text-gray-600 dark:text-gray-400 mb-8">
          Adicione pelo menos um livro para que possamos começar a
          realizar os cálculos das estatísticas de sua biblioteca.
        </p>
        <router-link
          :to="{ name: 'DashboardNewBook' }"
          class="button is-primary text-lg"
        >
          <span aria-hidden="true">
            <PlusIcon aria-hidden="true" />
          </span>
          Novo livro
        </router-link>
      </section>

      <!-- Too early for stats -->
      <section
        v-if="tooEarly"
        aria-labelledby="too-early-title"
        class="w-full max-w-lg mx-auto h-full flex items-center justify-center flex-col px-4"
      >
        <span aria-hidden="true">
          <PresentationChartLineIcon class="h-16 w-16 mb-8 text-gray-400 dark:text-gray-600" />
        </span>
        <h2
          id="too-early-title"
          class="text-xl text-center font-medium text-gray-600 dark:text-gray-400 mb-2"
        >
          Ainda é cedo para exibir as estatísticas
        </h2>
        <p class="text-center text-gray-600 dark:text-gray-400 mb-8">
          As estatísticas serão exibidas após o cadastro de pelo menos
          dois meses de compras de livros na biblioteca.
        </p>
      </section>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

import { DotsHorizontalIcon, PlusIcon } from '@heroicons/vue/solid'
import {
  ExclamationCircleIcon,
  PresentationChartLineIcon
} from '@heroicons/vue/outline'

import MonthlyBoughtsChart from '@/components/MonthlyBoughtsChart'
import MonthlyExpenseChart from '@/components/MonthlyExpenseChart'
import SimpleHeader from '@/components/SimpleHeader'

export default {
  name: 'DashboardStats',

  components: {
    MonthlyBoughtsChart,
    MonthlyExpenseChart,
    SimpleHeader,
    DotsHorizontalIcon,
    ExclamationCircleIcon,
    PlusIcon,
    PresentationChartLineIcon
  },

  setup () {
    const store = useStore()

    const loading = computed(() => store.state.sheet.loading)
    const sheetIsEmpty = computed(() => store.getters['sheet/sheetIsEmpty'])
    const tooEarly = computed(() => store.state.sheet.stats.monthly?.length === 1)

    return { loading, sheetIsEmpty, tooEarly }
  }
}
</script>

<style>

</style>
