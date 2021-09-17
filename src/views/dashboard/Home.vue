<template>
  <div class="flex flex-col">
    <header class="bg-white shadow dark:bg-gray-800">
      <div class="max-w-7xl mx-auto md:flex md:items-center md:justify-between py-4 px-4 sm:px-6 lg:px-8">
        <div class="flex-1 flex items-center space-x-4">
          <div
            class="w-12 h-12 rounded-full shadow-avatar bg-cover"
            :style="{ backgroundImage: `url('${profileImageUrl}')` }"
          />
          <div>
            <h1 class="text-xl font-semibold font-display text-gray-900 dark:text-gray-100">
              {{ t('dashboard.home.hello', { name: profileName }) }}
            </h1>
            <p v-if="isDev" class="text-sm text-gray-600 dark:text-gray-300">
              {{ t('footer.dev') }}
            </p>
          </div>
        </div>
        <div class="flex mt-5 md:mt-0 md:ml-4 space-x-4">
          <button
            class="button flex-1 md:flex-initial justify-center md:justify-start"
            @click="reload"
            :disabled="loading"
          >
            <span aria-hidden="true">
              <RefreshIcon />
            </span>
            {{ t('dashboard.home.reload') }}
          </button>
          <button
            class="button is-primary flex-1 md:flex-initial justify-center md:justify-start"
            @click="$router.push({ name: 'DashboardNewBook' })"
            :disabled="loading"
          >
            <span aria-hidden="true">
              <PlusIcon aria-hidden="true" />
            </span>
            {{ t('dashboard.home.newBook') }}
          </button>
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
          <div v-if="loading" class="motion-safe:animate-pulse h-7 bg-gray-400 dark:bg-gray-600 rounded w-40 mb-3"></div>
          <h2 v-else id="overview-title" class="font-medium font-display text-xl mb-3 dark:text-gray-200">
            {{ t('dashboard.home.overview.title') }}
          </h2>

          <ul class="sr-only" v-if="!loading">
            <li>
              {{ t('dashboard.home.overview.stats.count') }}:
              {{ t('dashboard.home.overview.item', stats.count, { n: n(stats.count, 'integer') }) }}
            </li>
            <li>
              {{ t('dashboard.home.overview.stats.read') }}:
              {{ n(stats.status?.percent || 0.0, 'percent') }}
            </li>
            <li>
              {{ t('dashboard.home.overview.stats.totalExpense') }}:
              {{ n(stats.money?.totalSpentPaid || 0.0, 'currency', { currency: stats.money.currency }) }}
            </li>
            <li>
              {{ t('dashboard.home.overview.stats.totalSavings') }}:
              {{ n(stats.money?.saved || 0.0, 'currency', { currency: stats.money.currency }) }}</li>
          </ul>

          <!-- Stats -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 rounded-md sm:rounded-none overflow-hidden sm:overflow-visible shadow sm:shadow-none divide-y sm:divide-y-0 divide-gray-200 dark:divide-gray-700"
            aria-hidden="true"
          >
            <StatCard
              :title="t('dashboard.home.overview.stats.count')"
              :value="n(stats.count || 0.0, 'integer')"
              :loading="loading"
            >
              <template v-slot:icon="{ cssClass }">
                <BookOpenIcon :class="cssClass" />
              </template>
            </StatCard>

            <StatCard
              :title="t('dashboard.home.overview.stats.read')"
              :value="n(stats.status?.percent || 0.0, 'percent')"
              :loading="loading"
            >
              <template v-slot:icon="{ cssClass }">
                <BookmarkIcon :class="cssClass" />
              </template>
            </StatCard>

            <StatCard
              :title="t('dashboard.home.overview.stats.totalExpense')"
              :value="n(stats.money?.totalSpentPaid || 0.0, 'currency', { currency: stats.money?.currency || 'USD' })"
              :loading="loading"
              :sensitive="true"
            >
              <template v-slot:icon="{ cssClass }">
                <CurrencyDollarIcon :class="cssClass" />
              </template>
            </StatCard>

            <StatCard
              :title="t('dashboard.home.overview.stats.totalSavings')"
              :value="n(stats.money?.saved || 0.0, 'currency', { currency: stats.money?.currency || 'USD' })"
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
        <BookCarousel
          :title="t('dashboard.home.lastAdded')"
          collection="lastAdded"
          :button-text="t('dashboard.home.viewAll')"
          :button-link="{ name: 'DashboardLibrary', query: { sortProperty: 'createdAt' } }"
        />

        <!-- Latest readings -->
        <BookCarousel
          :title="t('dashboard.home.latestReadings')"
          collection="latestReadings"
          :button-text="t('dashboard.home.viewAll')"
          :button-link="{ name: 'DashboardLibrary', query: { sortProperty: 'readAt' } }"
        />

        <!-- Groups -->
        <GroupGrid />

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
            {{ t('dashboard.home.empty.title') }}
          </h2>
          <p class="text-center text-gray-600 dark:text-gray-400 mb-8">
            {{ t('dashboard.home.empty.description') }}
          </p>
          <router-link
            :to="{ name: 'DashboardNewBook' }"
            class="button is-primary text-lg"
            aria-describedby="empty-sheet-title"
          >
            <span aria-hidden="true">
              <PlusIcon aria-hidden="true" />
            </span>
            {{ t('dashboard.home.newBook') }}
          </router-link>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import { MutationTypes } from '@/store'

import {
  BookOpenIcon,
  BookmarkIcon,
  CurrencyDollarIcon,
  EmojiHappyIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/outline'

import { PlusIcon, RefreshIcon } from '@heroicons/vue/solid'

import BetaWarning from '@/components/BetaWarning'
import BookCarousel from '@/components/BookCarousel'
import GroupGrid from '@/components/GroupGrid'
import StatCard from '@/components/StatCard'

export default {
  name: 'DashboardHome',

  components: {
    BetaWarning,
    BookCarousel,
    GroupGrid,
    StatCard,
    BookOpenIcon,
    BookmarkIcon,
    CurrencyDollarIcon,
    EmojiHappyIcon,
    ExclamationCircleIcon,
    PlusIcon,
    RefreshIcon
  },

  setup () {
    const store = useStore()
    const { n, t } = useI18n()

    const sheetIsEmpty = computed(() => store.getters['sheet/sheetIsEmpty'])

    const profileImageUrl = computed(() => store.state.auth.profileImageUrl)
    const profileName = computed(() => store.state.auth.profileName)
    const loading = computed(() => store.state.sheet.loading)
    const stats = computed(() => store.state.sheet.stats)

    const isDev = ref(process.env.NODE_ENV === 'development')

    function reload () {
      store.dispatch('sheet/loadSheetData')
      store.dispatch('collection/fetchLastAdded')
      store.dispatch('collection/fetchLatestReadings')
      store.dispatch('collection/fetchGroups')
      store.commit(MutationTypes.COLLECTION_UPDATE_BOOKS, { items: [] })
    }

    return {
      sheetIsEmpty,
      loading,
      profileImageUrl,
      profileName,
      stats,
      isDev,
      reload,
      n,
      t
    }
  }
}
</script>

<style>

</style>
