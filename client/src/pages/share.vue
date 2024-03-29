<script lang="ts" setup>
import { BuildingLibraryIcon, QrCodeIcon } from '@heroicons/vue/20/solid'
import {
  BookOpenIcon,
  FaceFrownIcon,
  ShareIcon,
} from '@heroicons/vue/24/outline'
import { useI18n } from '@/i18n'
import { parseFileSingle } from '@/services/export/androidExport'
import type { ToshokanBook } from '@/services/export/schema/library'

const router = useRouter()
const route = useRoute()

const { t, locale } = useI18n({ useScope: 'global' })

onMounted(() => {
  if (!route.query.d || route.query.d.length === 0) {
    router.replace({ name: 'index' })
    return
  }

  parseDataQuery()
})

function base64toUint8Array(base64String: string) {
  // const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  // const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64String)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

const loading = ref(true)
const data = ref<Uint8Array>()
const book = ref<ToshokanBook>()
const error = ref<any>()

const listFormatter = computed(() => {
  return new Intl.ListFormat(locale.value, {
    style: 'long',
    type: 'conjunction',
  })
})

const { renderMarkdown } = useMarkdown()

const bookCoverUrl = computed(() => book.value?.coverUrl)
const bookAuthors = computed(() => {
  if (!book.value?.authors || book.value.authors.length === 0) {
    return null
  }

  return listFormatter.value.format(book.value.authors)
})
const bookSynopsis = computed(() => renderMarkdown(book.value?.synopsis ?? ''))
const bookMetadata = computed(() => {
  const metadata = [book.value?.publisher, book.value?.group, book.value?.code]

  return metadata
    .filter(Boolean)
    .filter(mt => mt!.length > 0)
    .join(' · ')
})

const { imageHasError, imageLoading, loadImage } = useImageLoader(bookCoverUrl)

function parseDataQuery() {
  loading.value = true

  try {
    data.value = base64toUint8Array(route.query.d as string)
    book.value = parseFileSingle(data.value)

    if (!book.value) {
      throw new Error('Invalid data')
    }
  } catch (e: any) {
    error.value = e.message
    console.error(e)
  } finally {
    loading.value = false
    loadImage()
  }
}

const shareDialogOpen = ref(false)
</script>

<route lang="yaml">
meta:
  title: app.routes.share
</route>

<template>
  <main
    id="main-content"
    class="min-h-screen relative flex flex-col md:items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <LoadingIndicator :loading="loading" />

    <div class="max-w-2xl w-full space-y-8 flex flex-col items-center md:block">
      <RouterLink
        :to="{ name: 'index' }"
        class="inline-flex items-center rounded-md has-ring-focus dark:focus-visible:ring-offset-gray-800"
      >
        <span aria-hidden="true">
          <BuildingLibraryIcon class="h-9 w-9 text-primary-500" />
        </span>
        <span class="sr-only">{{ t('app.routes.home') }}</span>
        <span
          class="text-gray-800 dark:text-gray-200 font-display-safe font-semibold text-xl ml-3"
          aria-hidden="true"
        >
          {{ t('app.name') }}
        </span>
        <sup
          class="text-gray-500 dark:text-gray-400 font-semibold text-[0.6rem] align-super ml-0.5"
          aria-hidden="true"
        >
          BETA
        </sup>
      </RouterLink>
      <FadeTransition>
        <div
          v-if="book"
          class="flex flex-col md:flex-row items-center md:items-start w-full md:space-x-8"
        >
          <div class="w-56 flex-shrink-0 mb-8 md:mb-0">
            <div
              class="aspect-w-2 aspect-h-3 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 ring ring-primary-600/30 dark:ring-gray-100/5"
            >
              <FadeTransition>
                <div
                  v-if="imageLoading || imageHasError"
                  class="w-full h-full flex items-center justify-center"
                >
                  <BookOpenIcon
                    :class="[
                      imageLoading ? 'motion-safe:animate-pulse' : '',
                      'w-14 h-14 stroke-[1.5] text-gray-400 dark:text-gray-500',
                    ]"
                  />
                </div>
                <img
                  v-else
                  class="w-full h-full object-cover"
                  :src="bookCoverUrl"
                  :alt="book.title"
                >
              </FadeTransition>
            </div>
            <Button
              class="w-full justify-center mt-4"
              @click="shareDialogOpen = true"
            >
              <template #left="{ iconClass }">
                <QrCodeIcon :class="iconClass" />
              </template>
              <span>
                {{ t('share.actionQrCode') }}
              </span>
            </Button>
          </div>
          <div class="flex-grow px-4 md:px-0">
            <p
              v-if="book.owner"
              class="text-gray-600 dark:text-gray-400 font-display-safe font-medium inline-flex items-center text-sm"
            >
              <span aria-hidden="true">
                <ShareIcon class="w-5 h-5 mr-2.5" />
              </span>
              <i18n-t keypath="share.sharingOwner" tag="span">
                <span class="font-semibold text-gray-800 dark:text-gray-200">{{
                  book.owner.name
                }}</span>
              </i18n-t>
            </p>

            <h2 class="font-display-safe font-semibold text-2xl">
              {{ book.title }}
            </h2>
            <p
              v-if="bookAuthors"
              class="text-gray-700 dark:text-gray-300 font-medium"
            >
              {{ bookAuthors }}
            </p>

            <div
              v-if="bookSynopsis"
              class="prose md:prose-sm dark:prose-invert max-w-none mt-8"
              v-html="bookSynopsis"
            />

            <ul v-if="book.tags.length > 0" class="tag-list mt-4">
              <li v-for="tag in book.tags" :key="tag" class="mr-2 mt-2">
                <span class="tag has-ring-focus cursor-default">
                  <span aria-hidden="true" class="bullet" />
                  {{ tag }}
                </span>
              </li>
            </ul>

            <p
              v-if="bookMetadata.length > 0"
              class="mt-6 text-sm md:text-xs text-gray-600 dark:text-gray-300"
            >
              {{ bookMetadata }}
            </p>
          </div>
        </div>
        <div v-else-if="error" class="flex flex-col md:flex-row w-full">
          <div
            aria-hidden="true"
            class="shrink-0 font-semibold font-display-safe text-4xl text-primary-600 dark:text-primary-500"
          >
            <FaceFrownIcon class="w-10 h-10" />
          </div>
          <div class="flex-1 min-w-0">
            <header
              class="md:border-l md:border-gray-200 dark:md:border-gray-700 md:pl-6 md:ml-6"
            >
              <h2
                class="font-semibold font-display-safe text-2xl dark:text-gray-100"
              >
                {{ t('share.errorTitle') }}
              </h2>
              <div
                class="mt-4 text-gray-500 dark:text-gray-400 prose md:prose-sm"
                v-html="renderMarkdown(t('share.errorDescription'))"
              />
            </header>
          </div>
        </div>
      </FadeTransition>
    </div>

    <BookShareDialog
      v-if="book"
      v-model="shareDialogOpen"
      :data="data"
      :version="book.sheetVersion ?? 0"
      :show-url-copier="false"
    />
  </main>
</template>
