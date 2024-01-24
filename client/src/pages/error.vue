<script lang="ts" setup>
import { ArrowPathIcon, IdentificationIcon } from '@heroicons/vue/20/solid'

const router = useRouter()
const authStore = useAuthStore()
const mainStore = useStore()

const { appVersion } = useAppInfo()

const hasCriticalError = computed(() => mainStore.hasCriticalError)
const criticalError = computed(() => mainStore.criticalError)

onMounted(() => {
  if (!hasCriticalError.value) {
    router.replace({ name: 'index' })
  }
})

const isDev = ref(import.meta.env.DEV)

const { t } = useI18n({ useScope: 'global' })

function refresh() {
  window.location.reload()
}

const hasGrantedScopes = computed(() => authStore.hasGrantedScopes)

async function grantPermissions() {
  await authStore.grantPermissions()
}

watch(hasGrantedScopes, (newValue) => {
  if (newValue) {
    router.replace({ name: 'dashboard' })
  }
})
</script>

<route lang="yaml">
meta:
  title: app.routes.error
</route>

<template>
  <main
    id="main-content"
    class="min-h-screen flex md:items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-2xl w-full space-y-8">
      <div class="flex flex-col md:flex-row w-full">
        <p
          class="shrink-0 font-semibold font-display-safe text-4xl text-primary-600 dark:text-primary-500"
        >
          500
        </p>
        <div class="flex-1 min-w-0">
          <header
            class="md:border-l md:border-gray-200 dark:md:border-gray-700 md:pl-6 md:ml-6"
          >
            <h2 class="font-semibold font-display-safe text-4xl dark:text-gray-100">
              {{ t('criticalError.title') }}
            </h2>
            <p class="mt-1 text-gray-500 dark:text-gray-400">
              {{ criticalError?.message || t('errors.unexpected') }}
            </p>
          </header>
          <div
            v-if="isDev && criticalError?.stack"
            class="mt-10 md:ml-6 md:pl-6"
          >
            <div
              class="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-md py-4 px-6"
            >
              <div class="w-full overflow-auto">
                <pre><code>{{ criticalError?.stack || '' }}</code></pre>
              </div>
            </div>
          </div>
          <div class="mt-10 md:pl-12 flex justify-between items-center w-full">
            <Button
              v-if="criticalError?.cause?.refresh"
              kind="primary"
              @click="refresh"
            >
              <template #left="{ iconClass }">
                <ArrowPathIcon :class="[iconClass, '-scale-x-100']" />
              </template>
              <span>{{ t('errors.refresh') }}</span>
            </Button>

            <Button
              v-if="!hasGrantedScopes"
              kind="primary"
              @click="grantPermissions"
            >
              <template #left="{ iconClass }">
                <IdentificationIcon :class="iconClass" />
              </template>
              <span>{{ t('errors.grantPermissions') }}</span>
            </Button>

            <p class="text-gray-400 text-xs hidden md:block">
              {{ t('footer.version', { version: appVersion }) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
