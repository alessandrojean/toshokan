<script setup>
import { computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import LocaleSelector from '@/components/LocaleSelector.vue'

const route = useRoute()
const aboutRoute = computed(() => route.matched[0])
const categories = inject('categoryOrder')

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

const { t, locale } = useI18n({ useScope: 'global' })
</script>

<template>
  <aside class="w-56 py-12">
    <nav class="sticky top-24 text-sm">
      <LocaleSelector class="w-56" v-model="locale" />
      <div class="space-y-10 mt-8">
        <div v-for="group in categories" :key="group">
          <p
            class="uppercase tracking-wider font-semibold dark:font-bold text-xs pl-1"
          >
            {{ t('about.categories.' + group) }}
          </p>
          <ul class="space-y-3.5 mt-4 dark:text-gray-200 -ml-2">
            <li v-for="route in groups[group]" :key="route.path">
              <RouterLink
                :to="{ name: route.name }"
                class="px-3 py-1.5 has-ring-focus rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 motion-safe:transition-colors"
                active-class="font-semibold text-primary-800 hover:text-primary-800 dark:!text-gray-100 bg-primary-100 dark:bg-gray-600 hover:!bg-primary-100 dark:hover:!bg-gray-600"
              >
                {{ route.meta.title() }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </aside>
</template>
