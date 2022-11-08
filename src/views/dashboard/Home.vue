<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useIsFetching, useQueryClient } from 'vue-query'

import useEditBookMutation from '@/mutations/useEditBookMutation'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import { useSheetStore } from '@/stores/sheet'
import useStatisticsQuery from '@/queries/useStatisticsQuery'

import {
  BookOpenIcon,
  BookmarkIcon,
  CurrencyDollarIcon,
  FaceSmileIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

import {
  ArrowRightIcon,
  RectangleStackIcon,
  PlusIcon,
  ArrowPathIcon
} from '@heroicons/vue/20/solid'

import Avatar from '@/components/Avatar.vue'
import BookCarousel from '@/components/book/BookCarousel.vue'
import BookCreateDialog from '@/components/dialogs/BookCreateDialog.vue'
import GroupGrid from '@/components/GroupGrid.vue'
import SheetChooserDialog from '@/components/dialogs/SheetChooserDialog.vue'
import StatCard from '@/components/StatCard.vue'
import useLastAddedQuery from '@/queries/useLastAddedQuery'
import useLatestReadingsQuery from '@/queries/useLatestReadingsQuery'
import useNextReadsQuery from '@/queries/useNextReadsQuery'
import Book from '@/model/Book'

const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const sheetStore = useSheetStore()
const { n, t } = useI18n({ useScope: 'global' })

const sheetIsEmpty = computed(() => sheetStore.isEmpty)

const ownerDisplayName = computed(() => sheetStore.ownerDisplayName)
const ownerPictureUrl = computed(() => sheetStore.ownerPictureUrl)
const profileName = computed(() => authStore.profileName)
const loading = computed(() => sheetStore.loading)
const shared = computed(() => sheetStore.shared)
const enabled = computed(() => sheetStore.sheetId !== null)

const {
  data: stats,
  isLoading: statsLoading,
  isSuccess: statsSuccess
} = useStatisticsQuery({ enabled })

// eslint-disable-next-line prettier/prettier
const { isLoading: lastAddedLoading, data: lastAddedItems } =
  useLastAddedQuery({ enabled })

const { isLoading: latestReadingsLoading, data: latestReadingsItems } =
  useLatestReadingsQuery({ enabled })

// eslint-disable-next-line prettier/prettier
const { isLoading: nextReadsLoading, data: nextReadsItems } =
  useNextReadsQuery({ enabled })

const isDev = ref(import.meta.env.DEV)
const queryClient = useQueryClient()
const isFetching = useIsFetching()

async function reload() {
  queryClient.resetQueries()
  queryClient.refetchQueries()
}

const createDialogOpen = ref(false)

function openCreateDialog() {
  createDialogOpen.value = true
}

function closeCreateDialog() {
  createDialogOpen.value = false
}

const canChange = computed(() => sheetStore.canChange)
const canEdit = computed(() => sheetStore.canEdit)

const sheetChooserOpen = ref(false)

function openSheetChooser() {
  sheetChooserOpen.value = true
}

function closeSheetChooser() {
  sheetChooserOpen.value = false
}

const gridMode = computed(() => settingsStore.gridMode)
const blurNsfw = computed(() => settingsStore.blurNsfw)
const spoilerMode = computed(() => settingsStore.spoilerMode)

const { mutate: edit } = useEditBookMutation()
const editingIds = ref([] as string[])

function removeFromEditing(id: string) {
  const index = editingIds.value.indexOf(id)

  if (index >= 0) {
    editingIds.value.splice(index, 1)
  }
}

function handleMarkAsRead(book: Book) {
  if (book.id! in editingIds.value) {
    return
  }

  editingIds.value.push(book.id!)

  edit(book, {
    onSuccess: () => removeFromEditing(book.id!),
    onError: () => removeFromEditing(book.id!)
  })
}
</script>

<template>
  <div class="flex flex-col">
    <header class="bg-white shadow dark:bg-gray-800">
      <div
        class="max-w-7xl mx-auto md:flex md:items-center md:justify-between py-4 px-4 sm:px-6 lg:px-8"
      >
        <div class="flex-1 flex items-center space-x-4">
          <Avatar :picture-url="ownerPictureUrl" :shared="shared" />
          <div>
            <h1
              class="text-xl font-semibold font-display text-gray-900 dark:text-gray-100"
            >
              {{ t('dashboard.home.hello', { name: profileName }) }}
            </h1>
            <p
              v-if="isDev || shared"
              class="text-sm text-gray-600 dark:text-gray-300"
            >
              {{
                shared
                  ? t('dashboard.sheetChooser.viewing', [ownerDisplayName])
                  : t('footer.dev')
              }}
            </p>
          </div>
        </div>
        <div class="flex mt-5 md:mt-0 md:ml-4 space-x-4">
          <button
            class="button flex-grow sm:flex-1 md:flex-initial justify-center md:justify-start"
            @click="reload"
            :disabled="loading || isFetching > 0"
          >
            <span
              aria-hidden="true"
              :class="loading || isFetching ? 'motion-safe:animate-spin' : ''"
              class="origin-center w-5 h-5 -ml-1 mr-2"
            >
              <ArrowPathIcon class="-scale-x-100 !mx-0" />
            </span>
            {{ t('dashboard.home.reload') }}
          </button>
          <button
            v-if="canChange"
            class="button flex-grow sm:flex-1 md:flex-initial justify-center md:justify-start"
            @click="openSheetChooser"
            :disabled="loading || isFetching > 0"
          >
            <span aria-hidden="true">
              <RectangleStackIcon />
            </span>
            {{ t('dashboard.sheetChooser.actionSelectSheet') }}
          </button>
          <button
            v-if="canEdit"
            class="hidden sm:flex button is-primary flex-1 md:flex-initial justify-center md:justify-start"
            @click="openCreateDialog"
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
        <section
          v-if="!sheetIsEmpty"
          :aria-labelledby="loading ? '' : 'overview-title'"
        >
          <div v-if="loading" class="skeleton h-6 w-40 mb-3"></div>
          <h2
            v-else
            id="overview-title"
            class="font-medium font-display text-lg mb-2 dark:text-gray-200"
          >
            {{ t('dashboard.home.overview.title') }}
          </h2>

          <!-- Stats -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 rounded-md sm:rounded-none overflow-hidden sm:overflow-visible shadow sm:shadow-none divide-y sm:divide-y-0 divide-gray-200 dark:divide-gray-700"
          >
            <StatCard
              :title="t('dashboard.home.overview.stats.count')"
              :value="n(stats?.count || 0.0, 'integer')"
              :loading="!statsSuccess"
            >
              <template v-slot:icon="{ cssClass }">
                <BookOpenIcon :class="cssClass" />
              </template>
            </StatCard>

            <StatCard
              :title="t('dashboard.home.overview.stats.read')"
              :value="n(stats?.status?.percent || 0.0, 'percent')"
              :loading="!statsSuccess"
            >
              <template v-slot:icon="{ cssClass }">
                <BookmarkIcon :class="cssClass" />
              </template>
            </StatCard>

            <StatCard
              :title="t('dashboard.home.overview.stats.totalExpense')"
              :value="
                n(stats?.money?.totalSpentPaid || 0.0, 'currency', {
                  currency: stats?.money?.currency || 'USD'
                })
              "
              :loading="!statsSuccess"
              :always-hidden="shared"
              sensitive
            >
              <template v-slot:icon="{ cssClass }">
                <CurrencyDollarIcon :class="cssClass" />
              </template>
            </StatCard>

            <StatCard
              :title="t('dashboard.home.overview.stats.totalSavings')"
              :value="
                n(stats?.money?.saved || 0.0, 'currency', {
                  currency: stats?.money?.currency || 'USD'
                })
              "
              :loading="!statsSuccess"
              :always-hidden="shared"
              sensitive
            >
              <template v-slot:icon="{ cssClass }">
                <FaceSmileIcon :class="cssClass" />
              </template>
            </StatCard>
          </div>
        </section>

        <!-- Next reads -->
        <BookCarousel
          :title="t('dashboard.home.nextReads')"
          :mode="gridMode"
          :blur-nsfw="blurNsfw"
          :spoiler-mode="spoilerMode"
          :loading="loading || nextReadsLoading"
          :items="nextReadsItems"
          :editing-ids="editingIds"
          show-reading-actions
          @mark-as-read="handleMarkAsRead"
        >
          <template #actions>
            <RouterLink
              class="button is-ghost -mr-3 hidden md:flex group"
              :to="{
                name: 'DashboardLibrary',
                query: { sortProperty: 'readAt' }
              }"
            >
              {{ t('dashboard.search.history') }}
              <span aria-hidden="true">
                <ArrowRightIcon
                  class="is-right motion-safe:transition-transform group-hover:translate-x-1"
                />
              </span>
            </RouterLink>
          </template>
        </BookCarousel>

        <!-- Last added books -->
        <BookCarousel
          :title="t('dashboard.home.lastAdded')"
          :mode="gridMode"
          :blur-nsfw="blurNsfw"
          :spoiler-mode="spoilerMode"
          :loading="loading || lastAddedLoading"
          :items="lastAddedItems"
        >
          <template #actions>
            <RouterLink
              class="button is-ghost -mr-3 hidden md:flex group"
              :to="{
                name: 'DashboardLibrary',
                query: { sortProperty: 'createdAt' }
              }"
            >
              {{ t('dashboard.home.viewAll') }}
              <span aria-hidden="true">
                <ArrowRightIcon
                  class="is-right motion-safe:transition-transform group-hover:translate-x-1"
                />
              </span>
            </RouterLink>
          </template>
        </BookCarousel>

        <!-- Latest readings -->
        <BookCarousel
          :title="t('dashboard.home.latestReadings')"
          :button-text="t('dashboard.search.history')"
          :button-link="{
            name: 'DashboardLibrary',
            query: { sortProperty: 'readAt' }
          }"
          :mode="gridMode"
          :blur-nsfw="blurNsfw"
          :spoiler-mode="spoilerMode"
          :loading="loading || latestReadingsLoading"
          :items="latestReadingsItems"
        >
          <template #actions>
            <RouterLink
              class="button is-ghost -mr-3 hidden md:flex group"
              :to="{
                name: 'DashboardLibrary',
                query: { sortProperty: 'readAt' }
              }"
            >
              {{ t('dashboard.search.history') }}
              <span aria-hidden="true">
                <ArrowRightIcon
                  class="is-right motion-safe:transition-transform group-hover:translate-x-1"
                />
              </span>
            </RouterLink>
          </template>
        </BookCarousel>

        <!-- Groups -->
        <GroupGrid />

        <!-- Empty collection -->
        <section
          v-if="sheetIsEmpty && !loading"
          aria-labelledby="empty-sheet-title"
          class="w-full max-w-lg mx-auto h-full flex items-center justify-center flex-col px-4"
        >
          <span aria-hidden="true">
            <ExclamationCircleIcon
              class="h-16 w-16 mb-8 text-gray-400 dark:text-gray-600"
            />
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
          <button
            v-if="canEdit"
            class="button is-primary text-lg"
            @click="openCreateDialog"
          >
            <span aria-hidden="true">
              <PlusIcon aria-hidden="true" />
            </span>
            {{ t('dashboard.home.newBook') }}
          </button>
        </section>
      </div>
    </div>

    <BookCreateDialog :is-open="createDialogOpen" @close="closeCreateDialog" />

    <SheetChooserDialog
      :is-open="sheetChooserOpen"
      @close="closeSheetChooser"
    />
  </div>
</template>
