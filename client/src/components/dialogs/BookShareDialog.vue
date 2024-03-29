<script lang="ts" setup>
import { useClipboard } from '@vueuse/core'
import QrCode from 'qrcode'

import {
  ArrowTopRightOnSquareIcon,
  ClipboardIcon,
  XMarkIcon,
} from '@heroicons/vue/20/solid'
import { ArrowDownTrayIcon } from '@heroicons/vue/24/outline'
import { useI18n } from '@/i18n'
import Book from '@/model/Book'
import {
  downloadUrl,
  generateFile,
  generateFileSingle,
  parseFileSingle,
} from '@/services/export/androidExport'
import type { ToshokanOwner } from '@/services/export/schema/library'

export interface BookShareDialogProps {
  modelValue: boolean
  book?: Book | null | undefined
  data?: Uint8Array
  version: number
  showUrlCopier?: boolean
}

const props = withDefaults(defineProps<BookShareDialogProps>(), {
  book: undefined,
  data: undefined,
  showUrlCopier: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void
}>()

const { t } = useI18n({ useScope: 'global' })

function closeDialog() {
  emit('update:modelValue', false)
}

const { modelValue: open, book, version, data, showUrlCopier } = toRefs(props)

const { renderMarkdown } = useMarkdown()
const fileUrl = ref('')
const qrCodeDataUrl = ref('')
const shareUrl = ref('')

const authStore = useAuthStore()

const anonymous = ref(false)
const owner = computed(() => {
  if (!authStore.authorized || anonymous.value) {
    return null
  }

  return {
    name: authStore.profileName,
    pictureUrl: authStore.profileImageUrl,
  } as ToshokanOwner
})

function reset() {
  if (fileUrl.value.length > 0) {
    URL.revokeObjectURL(fileUrl.value)
  }

  anonymous.value = false
  fileUrl.value = ''
  qrCodeDataUrl.value = ''
  shareUrl.value = ''
}

watch(open, (isOpen) => {
  if (isOpen) {
    reset()
  }
})

watch([open, anonymous], async () => {
  if ((!book.value && !data.value) || !open.value) {
    return
  }

  if (fileUrl.value.length > 0) {
    URL.revokeObjectURL(fileUrl.value)
  }

  const fileSingle
    = data.value ?? generateFileSingle(book.value!, version.value, owner.value)
  const blobSingle = new Blob([fileSingle], { type: 'application/gzip' })
  const bookSingle = parseFileSingle(fileSingle)
  const bookOwner = anonymous.value ? null : bookSingle.owner

  const file = generateFile(
    [new Book(bookSingle as unknown as Partial<Book>)],
    version.value,
    bookOwner ?? owner.value,
  )
  const blob = new Blob([file], { type: 'application/gzip' })
  fileUrl.value = URL.createObjectURL(blob)

  qrCodeDataUrl.value = await QrCode.toDataURL(
    [{ data: fileSingle, mode: 'byte' }],
    {
      errorCorrectionLevel: 'H',
      margin: 2.5,
    },
  )

  if (showUrlCopier.value) {
    const fileBase64 = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve((reader.result! as string).split(',', 2)[1])
      reader.readAsDataURL(blobSingle)
    })

    const directUrl = new URL(window.location.href)
    directUrl.pathname = '/share'
    directUrl.searchParams.append('d', fileBase64)

    shareUrl.value = directUrl.href
  }
})

function downloadFile() {
  const identifier = new Date().getTime().toString(16)
  downloadUrl(fileUrl.value, `toshokan-book-${identifier}.proto.gz`)
}

const shareUrlInput = ref<HTMLInputElement>()
const showCopiedInfo = ref(false)

const { copy } = useClipboard({ source: shareUrl })

function copyShareUrl() {
  copy()
  showCopied()
}

function showCopied() {
  showCopiedInfo.value = true
  setTimeout(() => {
    showCopiedInfo.value = false
  }, 1500)
}

onUnmounted(() => {
  if (fileUrl.value.length > 0) {
    URL.revokeObjectURL(fileUrl.value)
  }
})

function select(event: Event) {
  const input = event.target as HTMLInputElement

  input.select()
}

function handleAnonymousChange(event: Event) {
  const input = event.target as HTMLInputElement

  anonymous.value = input.checked
}
</script>

<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog
      as="div"
      class="fixed z-30 inset-0 flex flex-col items-center justify-end md:justify-center px-6 sm:py-6 md:px-0 md:py-12 lg:py-16"
      @close="closeDialog"
    >
      <TransitionChild
        as="template"
        enter="motion-reduce:transition-none duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="motion-reduce:transition-none duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="dialog-overlay" />
      </TransitionChild>

      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0 scale-95"
        enter-to="opacity-100 scale-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100 scale-100"
        leave-to="opacity-0 scale-95"
      >
        <DialogPanel
          class="flex flex-col md:inline-block w-full max-w-2xl lg:max-w-3xl px-6 py-4 my-8 overflow-hidden md:overflow-visible text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-lg space-y-3 ring-1 ring-black/5"
        >
          <div class="flex justify-between items-center flex-shrink-0">
            <DialogTitle
              as="h3"
              class="text-lg leading-6 font-display-safe font-medium text-gray-900 dark:text-gray-100"
            >
              {{ t('dashboard.details.share.title') }}
            </DialogTitle>
            <button
              class="shrink-0 p-2 -mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus-visible:text-gray-600 dark:focus-visible:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md has-ring-focus"
              :title="t('dashboard.details.share.actionClose')"
              @click="closeDialog"
            >
              <span aria-hidden="true">
                <XMarkIcon class="w-5 h-5" />
              </span>
              <span class="sr-only">
                {{ t('dashboard.details.share.actionClose') }}
              </span>
            </button>
          </div>

          <div
            class="flex-grow md:flex-grow-0 overflow-y-auto w-full md:flex md:items-start md:space-x-6"
          >
            <div
              class="flex md:block flex-shrink-0 justify-center mb-6 md:mb-0"
            >
              <div
                class="w-full sm:w-1/2 md:w-64 lg:w-80 relative rounded-lg overflow-hidden border border-gray-300 dark:border-0 dark:opacity-90"
              >
                <div class="aspect-w-1 aspect-h-1">
                  <img
                    v-if="qrCodeDataUrl.length > 0"
                    :src="qrCodeDataUrl"
                    class="w-full h-full"
                  >

                  <LoadingIndicator
                    :loading="qrCodeDataUrl.length === 0"
                    :blur="false"
                  />
                </div>
              </div>
            </div>

            <div class="flex-grow">
              <h2 class="font-display-safe font-medium text-base mb-4">
                {{ t('dashboard.details.share.qrCodeInstructions.title') }}
              </h2>

              <div
                class="prose prose-sm max-w-full min-w-0 dark:prose-invert prose-h4:text-base prose-h4:font-medium prose-h4:pb-2"
                v-html="
                  renderMarkdown(
                    t('dashboard.details.share.qrCodeInstructions.body'),
                  )
                "
              />

              <div
                v-if="showUrlCopier && shareUrl.length > 0"
                class="mt-8 bg-gray-200 dark:bg-gray-700 dark:text-gray-200 p-1.5 rounded-md hidden md:flex md:items-center focus-within:ring-2 focus-within:ring-primary-600 dark:focus-within:ring-primary-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-800 motion-safe:transition-shadow"
              >
                <input
                  ref="shareUrlInput"
                  type="text"
                  class="bg-transparent md:text-sm md:py-1.5 w-full min-w-0 border-none focus:ring-0 focus:outline-none focus:border-none"
                  readonly
                  :value="shareUrl"
                  @focus="select"
                >

                <Button
                  size="small"
                  class="flex-shrink-0"
                  @click="copyShareUrl"
                >
                  <template #left="{ iconClass }">
                    <ClipboardIcon :class="iconClass" />
                  </template>
                  <span v-if="showCopiedInfo">
                    {{ t('dashboard.details.share.copied') }}
                  </span>
                  <span v-else>
                    {{ t('dashboard.details.share.actionCopy') }}
                  </span>
                </Button>

                <Button
                  v-slot="{ iconClass }"
                  as="a"
                  size="small"
                  icon-only
                  target="_blank"
                  class="flex-shrink-0 ml-0.5"
                  :href="shareUrl"
                  :title="t('dashboard.details.share.actionOpen')"
                >
                  <ArrowTopRightOnSquareIcon :class="iconClass" />
                </Button>
              </div>
            </div>
          </div>

          <div
            v-if="fileUrl.length > 0"
            :class="[
              'w-full flex flex-col md:flex-row pt-2 flex-shrink-0',
              showUrlCopier ? 'md:justify-between' : 'md:justify-end',
            ]"
          >
            <div
              v-if="showUrlCopier"
              class="flex items-center space-x-2.5 mb-4 md:mb-0"
            >
              <input
                id="anonymous"
                type="checkbox"
                class="checkbox"
                name="anonymous"
                :checked="anonymous"
                @change="handleAnonymousChange"
              >
              <label for="anonymous" class="label mb-0">
                {{ t('dashboard.details.share.anonymous') }}
              </label>
            </div>

            <div class="space-y-2">
              <div v-if="showUrlCopier" class="flex space-x-2">
                <button
                  type="button"
                  class="md:hidden button flex-1 md:w-auto justify-center md:justify-start"
                  @click="copyShareUrl"
                >
                  <span aria-hidden="true">
                    <ClipboardIcon />
                  </span>
                  <span v-if="showCopiedInfo">
                    {{ t('dashboard.details.share.copied') }}
                  </span>
                  <span v-else>
                    {{ t('dashboard.details.share.actionCopyUrl') }}
                  </span>
                </button>

                <a
                  class="md:hidden button flex-1 md:w-auto justify-center md:justify-start"
                  target="_blank"
                  :href="shareUrl"
                >
                  <span aria-hidden="true">
                    <ArrowTopRightOnSquareIcon />
                  </span>
                  <span>
                    {{ t('dashboard.details.share.actionOpen') }}
                  </span>
                </a>
              </div>

              <Button
                class="w-full md:w-auto justify-center md:justify-start"
                @click="downloadFile"
              >
                <template #left="{ iconClass }">
                  <ArrowDownTrayIcon :class="iconClass" />
                </template>
                <span>
                  {{ t('dashboard.details.share.actionExport') }}
                </span>
              </Button>
            </div>
          </div>
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
