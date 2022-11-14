<script lang="ts" setup>
import { useIsFetching, useQueryClient } from '@tanstack/vue-query'
import Book from '@/model/Book'

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
  ArrowPathIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/vue/20/solid'

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
  useNextReadsQuery({ limit: 6 }, { enabled })

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

const showValues = ref(false)

const subtitle = computed(() => {
  if (!isDev.value) {
    return undefined
  }

  return shared.value
    ? t('dashboard.sheetChooser.viewing', [ownerDisplayName])
    : t('footer.dev')
})
</script>

<route lang="yaml">
meta:
  title: app.routes.dashboard.home
  layout: dashboard
</route>

<template>
  <div class="flex flex-col">
    <DashboardHeader
      :title="t('dashboard.home.hello', { name: profileName })"
      :subtitle="subtitle"
    >
      <template #avatar>
        <Avatar :picture-url="ownerPictureUrl" :shared="shared" />
      </template>
      <template #actions>
        <div class="flex space-x-2">
          <Button
            v-if="!shared"
            size="large"
            class="flex-grow sm:flex-1 md:flex-initial justify-center md:justify-start"
            @click="showValues = !showValues"
            :disabled="loading"
            :title="
              showValues
                ? t('dashboard.home.hideValues')
                : t('dashboard.home.showValues')
            "
            v-slot="{ iconClass }"
            icon-only
          >
            <Transition
              mode="out-in"
              leave-active-class="transition motion-reduce:transition-none duration-100 ease-in"
              leave-from-class="opacity-100 rotate-0"
              leave-to-class="opacity-0 rotate-180"
              enter-active-class="transition motion-reduce:transition-none duration-200 ease-out"
              enter-from-class="opacity-0 -rotate-180"
              enter-to-class="opacity-100 rotate-0"
            >
              <EyeIcon :class="iconClass" v-if="!showValues" />
              <EyeSlashIcon :class="iconClass" v-else />
            </Transition>
          </Button>
          <Button
            size="large"
            class="flex-grow sm:flex-1 md:flex-initial justify-center md:justify-start"
            @click="reload"
            :disabled="loading || isFetching > 0"
            :title="t('dashboard.home.reload')"
            v-slot="{ iconClass }"
            icon-only
          >
            <ArrowPathIcon
              :class="[
                iconClass,
                loading || isFetching ? 'motion-safe:animate-spin' : ''
              ]"
            />
          </Button>
          <Button
            v-if="canChange"
            size="large"
            class="flex-grow sm:flex-1 md:flex-initial justify-center md:justify-start"
            @click="openSheetChooser"
            :disabled="loading || isFetching > 0"
            :title="t('dashboard.sheetChooser.actionSelectSheet')"
            v-slot="{ iconClass }"
            icon-only
          >
            <RectangleStackIcon :class="iconClass" />
          </Button>
          <Button
            v-if="canEdit"
            size="large"
            class="flex-grow sm:flex-1 md:flex-initial justify-center md:justify-start"
            @click="openCreateDialog"
            :disabled="loading"
            :title="t('dashboard.home.newBook')"
            v-slot="{ iconClass }"
            icon-only
          >
            <PlusIcon :class="iconClass" />
          </Button>
        </div>
      </template>
    </DashboardHeader>

    <div class="flex-1">
      <div class="h-full max-w-7xl mx-auto py-6 px-4 sm:px-6">
        <DashboardBlock
          v-if="!sheetIsEmpty"
          :title="t('dashboard.home.overview.title')"
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
              :show-value="showValues"
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
              :show-value="showValues"
              sensitive
            >
              <template v-slot:icon="{ cssClass }">
                <FaceSmileIcon :class="cssClass" />
              </template>
            </StatCard>
          </div>
        </DashboardBlock>

        <!-- Next reads -->
        <BookCarousel
          class="mt-6"
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
            <Button
              as="RouterLink"
              kind="ghost"
              class="-mr-3 hidden md:flex group"
              :to="{ name: 'dashboard-readings' }"
            >
              <span>{{ t('dashboard.search.history') }}</span>
              <template #right="{ iconClass }">
                <ArrowRightIcon
                  :class="[
                    iconClass,
                    'motion-safe:transition-transform group-hover:translate-x-1'
                  ]"
                />
              </template>
            </Button>
          </template>
        </BookCarousel>

        <!-- Last added books -->
        <BookCarousel
          class="mt-6"
          :title="t('dashboard.home.lastAdded')"
          :mode="gridMode"
          :blur-nsfw="blurNsfw"
          :spoiler-mode="spoilerMode"
          :loading="loading || lastAddedLoading"
          :items="lastAddedItems"
        >
          <template #actions>
            <Button
              as="RouterLink"
              kind="ghost"
              class="-mr-3 hidden md:flex group"
              :to="{
                name: 'dashboard-library',
                query: { sortProperty: 'createdAt' }
              }"
            >
              <span>{{ t('dashboard.home.viewAll') }}</span>
              <template #right="{ iconClass }">
                <ArrowRightIcon
                  :class="[
                    iconClass,
                    'motion-safe:transition-transform group-hover:translate-x-1'
                  ]"
                />
              </template>
            </Button>
          </template>
        </BookCarousel>

        <!-- Latest readings -->
        <BookCarousel
          class="mt-6"
          :title="t('dashboard.home.latestReadings')"
          :button-text="t('dashboard.search.history')"
          :button-link="{
            name: 'dashboard-library',
            query: { sortProperty: 'readAt' }
          }"
          :mode="gridMode"
          :blur-nsfw="blurNsfw"
          :spoiler-mode="spoilerMode"
          :loading="loading || latestReadingsLoading"
          :items="latestReadingsItems"
        >
          <template #actions>
            <Button
              as="RouterLink"
              kind="ghost"
              class="-mr-3 hidden md:flex group"
              :to="{
                name: 'dashboard-library',
                query: { sortProperty: 'readAt' }
              }"
            >
              <span>{{ t('dashboard.search.history') }}</span>
              <template #right="{ iconClass }">
                <ArrowRightIcon
                  :class="[
                    iconClass,
                    'motion-safe:transition-transform group-hover:translate-x-1'
                  ]"
                />
              </template>
            </Button>
          </template>
        </BookCarousel>

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
          <Button
            v-if="canEdit"
            kind="primary"
            size="large"
            @click="openCreateDialog"
          >
            <template #left="{ iconClass }">
              <PlusIcon :class="iconClass" />
            </template>
            <span>{{ t('dashboard.home.newBook') }}</span>
          </Button>
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
