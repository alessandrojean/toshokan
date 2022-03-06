<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import useAppInfo from '@/composables/useAppInfo'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/solid'

import LocaleSelector from '@/components/LocaleSelector.vue'

defineProps({
  date: {
    type: String,
    required: true
  }
})

const { t, d, locale } = useI18n({ useScope: 'global' })

const route = useRoute()
const aboutRoute = computed(() => route.matched[0])
const groups = computed(() =>
  aboutRoute.value.children.reduce((groups, route) => {
    if (groups[route.meta.category]) {
      groups[route.meta.category].push(route)
    } else {
      groups[route.meta.category] = [route]
    }

    return groups
  }, {})
)

const aboutRoutes = computed(() => Object.values(groups.value).flat())

const currentIdx = computed(() =>
  aboutRoutes.value.findIndex((r) => r.name === route.name)
)
const previous = computed(() => aboutRoutes.value[currentIdx.value - 1])
const next = computed(() => aboutRoutes.value[currentIdx.value + 1])
</script>

<template>
  <footer class="content-footer">
    <div
      class="pb-4 space-y-3 sm:space-y-0 flex flex-col sm:flex-row sm:justify-between items-center text-sm border-b border-gray-300 dark:border-gray-600"
    >
      <LocaleSelector class="w-56" v-model="locale" top />
      <time :datetime="date" class="text-gray-500 dark:text-gray-400">
        {{ t('footer.lastUpdate', [d(date, 'long')]) }}
      </time>
    </div>
    <div
      class="-mx-1 flex flex-col md:flex-row md:justify-between md:items-center pt-4 space-y-4 md:space-y-0"
    >
      <RouterLink
        v-if="previous"
        :to="{ name: previous.name }"
        class="link previous has-ring-focus"
      >
        <div class="flex items-center">
          <ChevronLeftIcon class="w-4 h-4 inline-block -ml-1 mr-0.5" />
          <span>{{ t('about.previous') }}</span>
        </div>
        <span class="title">{{ previous.meta.title() }}</span>
      </RouterLink>
      <RouterLink
        v-if="next"
        :to="{ name: next.name }"
        class="link next has-ring-focus"
      >
        <div class="flex items-center justify-end">
          <span>{{ t('about.next') }}</span>
          <ChevronRightIcon class="w-4 h-4 inline-block ml-0.5 -mr-1" />
        </div>
        <span class="title">{{ next.meta.title() }}</span>
      </RouterLink>
    </div>
  </footer>
</template>

<style lang="postcss" scoped>
.content-footer {
  @apply space-y-2 sm:space-y-0 pt-3 mt-10
    text-center sm:text-left;
}

.link {
  @apply flex flex-col text-xs text-left rounded p-1;
}

.link.next {
  @apply ml-auto text-right;
}

.link .title {
  @apply text-base font-medium
    text-primary-600 dark:text-primary-400;
}

.link:where(:hover, :focus-visible) .title {
  @apply underline underline-offset-1 decoration-2
    decoration-primary-600/60 dark:decoration-primary-400/80
    text-primary-700 dark:text-primary-300;
}
</style>
