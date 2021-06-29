<template>
  <div class="flex flex-col">
    <!-- <SimpleHeader title="Dashboard" :loading="loading" /> -->
    <header class="bg-white shadow dark:bg-gray-800">
      <div class="max-w-7xl mx-auto md:flex md:items-center md:justify-between py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex-1 flex items-center space-x-4">
          <img :src="profileImageUrl" class="h-12 w-12 rounded-full" alt="">
          <div>
            <h1 class="text-2xl font-semibold font-title text-gray-900 dark:text-gray-100">
              Olá, {{ profileName }}!
            </h1>
            <p v-if="isDev" class="text-sm text-gray-600 dark:text-gray-400">
              Ambiente de desenvolvimento
            </p>
          </div>
        </div>
        <div class="flex mt-5 md:mt-0 md:ml-4">
          <router-link
            :to="{ name: 'DashboardNewBook' }"
            class="button is-primary"
          >
            <span aria-hidden="true">
              <PlusIcon aria-hidden="true" />
            </span>
            Novo livro
          </router-link>
        </div>
      </div>
    </header>

    <div class="flex-1">
      <div class="h-full max-w-7xl mx-auto py-6 px-5 md:px-8">
        <BetaWarning />

        <section
          v-if="!sheetIsEmpty"
          :aria-labelledby="loading? '' : 'overview-title'"
        >
          <div v-if="loading" class="motion-safe:animate-pulse h-6 bg-gray-400 dark:bg-gray-600 rounded w-40 mb-3"></div>
          <h2 v-else id="overview-title" class="font-medium font-title text-xl mb-3 dark:text-gray-200">Visão geral</h2>

          <ul class="sr-only" v-if="!loading">
            <li>Contagem: {{ countFormatted + (countFormatted.length === 1 ? ' item' : ' items') }}</li>
            <li>Leitura: {{ stats.status?.percent }}</li>
            <li>Gasto total: {{ stats.money?.totalSpentPaid }}</li>
            <li>Economia total: {{ stats.money?.saved }}</li>
          </ul>

          <!-- Stats -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-5 lg:grid-cols-4"
            aria-hidden="true"
          >
            <StatCard
              title="Contagem"
              :value="countFormatted"
              :loading="loading"
            >
              <template v-slot:icon="{ cssClass }">
                <BookOpenIcon :class="cssClass" />
              </template>
            </StatCard>

            <StatCard
              title="Leitura"
              :value="stats.status?.percent"
              :loading="loading"
            >
              <template v-slot:icon="{ cssClass }">
                <BookmarkIcon :class="cssClass" />
              </template>
            </StatCard>

            <StatCard
              title="Gasto total"
              :value="stats.money?.totalSpentPaid"
              :loading="loading"
              :sensitive="true"
            >
              <template v-slot:icon="{ cssClass }">
                <CurrencyDollarIcon :class="cssClass" />
              </template>
            </StatCard>

            <StatCard
              title="Economia total"
              :value="stats.money?.saved"
              :loading="loading"
              :sensitive="true"
            >
              <template v-slot:icon="{ cssClass }">
                <EmojiHappyIcon :class="cssClass" />
              </template>
            </StatCard>
          </div>
        </section>

        <!-- Last added books -->
        <LastAddedBooks
          :loading="loading"
          :last-added="lastAdded"
        />

        <!-- Empty collection -->
        <section
          v-if="sheetIsEmpty && !loading"
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
            Adicione pelo menos um livro para que as informações
            possam ser calculadas e disponibilizadas nesta página.
          </p>
          <router-link
            :to="{ name: 'DashboardNewBook' }"
            class="button is-primary text-lg"
            aria-describedby="empty-sheet-title"
          >
            <span aria-hidden="true">
              <PlusIcon aria-hidden="true" />
            </span>
            Novo livro
          </router-link>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

import {
  BookOpenIcon,
  BookmarkIcon,
  CurrencyDollarIcon,
  EmojiHappyIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/outline'

import { PlusIcon } from '@heroicons/vue/solid'

import BetaWarning from '@/components/BetaWarning'
import LastAddedBooks from '@/components/LastAddedBooks'
import StatCard from '@/components/StatCard'

const formatter = new Intl.NumberFormat('pt-BR')

export default {
  name: 'DashboardHome',

  components: {
    BetaWarning,
    LastAddedBooks,
    StatCard,
    BookOpenIcon,
    BookmarkIcon,
    CurrencyDollarIcon,
    EmojiHappyIcon,
    ExclamationCircleIcon,
    PlusIcon
  },

  setup () {
    const store = useStore()

    const sheetIsEmpty = computed(() => store.getters['sheet/sheetIsEmpty'])

    const countFormatted = computed(() => {
      const statsCount = store.state.sheet.stats.count
      return statsCount ? formatter.format(statsCount) : ''
    })

    const profileImageUrl = computed(() => store.state.auth.profileImageUrl)
    const profileName = computed(() => store.state.auth.profileName)
    const lastAdded = computed(() => store.state.sheet.lastAdded)
    const loading = computed(() => store.state.sheet.loading)
    const stats = computed(() => store.state.sheet.stats)

    const isDev = ref(process.env.NODE_ENV === 'development')

    return {
      sheetIsEmpty,
      countFormatted,
      lastAdded,
      loading,
      profileImageUrl,
      profileName,
      stats,
      isDev
    }
  }
}
</script>

<style>

</style>
