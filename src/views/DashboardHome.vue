<template>
  <div>
    <!-- <SimpleHeader title="Dashboard" :loading="loading" /> -->
    <header class="bg-white shadow dark:bg-gray-800">
      <div class="max-w-7xl mx-auto lg:flex lg:items-center lg:justify-between py-6 px-4 sm:px-6 lg:px-8">
        <div class="flex-1 flex items-center space-x-4">
          <img :src="profileImageUrl" class="h-12 w-12 rounded-full" alt="">
          <h1 class="text-2xl font-semibold font-title text-gray-900 dark:text-gray-100">
            Olá, {{ profileName }}!
          </h1>
        </div>
        <div class="flex mt-5 lg:mt-0 lg:ml-4">
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

    <div class="max-w-7xl mx-auto py-6 px-5 md:px-8">
      <BetaWarning />

      <section :aria-labelledby="loading? '' : 'overview-title'">
        <div v-if="loading" class="motion-safe:animate-pulse h-6 bg-gray-400 dark:bg-gray-600 rounded w-40 mb-3"></div>
        <h2 v-else id="overview-title" class="font-medium font-title text-xl mb-3 dark:text-gray-200">Visão geral</h2>

        <ul class="sr-only" v-if="!loading">
          <li>Contagem: {{ count + (count.length === 1 ? ' item' : ' items') }}</li>
          <li>Leitura: {{ stats.status?.percent }}</li>
          <li>Gasto total: {{ stats.money?.totalSpentPaid }}</li>
          <li>Economia total: {{ stats.money?.saved }}</li>
        </ul>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 lg:grid-cols-4" aria-hidden="true">
          <StatCard
            title="Contagem"
            :value="count"
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
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

import {
  BookOpenIcon,
  BookmarkIcon,
  CurrencyDollarIcon,
  EmojiHappyIcon
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
    PlusIcon
  },

  setup () {
    const store = useStore()

    const count = computed(() => {
      const statsCount = store.state.sheet.stats.count
      return statsCount ? formatter.format(statsCount) : ''
    })

    const profileImageUrl = computed(() => store.state.auth.profileImageUrl)
    const profileName = computed(() => store.state.auth.profileName)
    const lastAdded = computed(() => store.state.sheet.lastAdded)
    const loading = computed(() => store.state.sheet.loading)
    const stats = computed(() => store.state.sheet.stats)

    return {
      count,
      lastAdded,
      loading,
      profileImageUrl,
      profileName,
      stats
    }
  }
}
</script>

<style>

</style>
