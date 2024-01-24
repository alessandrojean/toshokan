<script lang="ts" setup>
import { useI18n } from '@/i18n'
import type { DocumentationCategory } from '@/symbols'
import { DocumentationKey } from '@/symbols'
import { injectStrict } from '@/util'

const docs = injectStrict(DocumentationKey)
const { t, locale } = useI18n({ useScope: 'global' })

function currentLocalePages(category: DocumentationCategory) {
  return category.pages.filter(p => p.locale === locale.value)
}
</script>

<template>
  <aside class="w-56 py-12">
    <nav class="sticky top-24 text-sm">
      <LocaleSelector v-model="locale" class="w-56" />
      <div class="space-y-10 mt-8">
        <div v-for="group in docs" :key="group.category">
          <p
            class="uppercase tracking-wider font-semibold dark:font-bold text-xs pl-1"
          >
            {{ t(`about.categories.${group.category}`) }}
          </p>
          <ul class="space-y-3.5 mt-4 dark:text-gray-200 -ml-2">
            <li v-for="page in currentLocalePages(group)" :key="page.slug">
              <RouterLink
                :to="{
                  name: 'help-category-slug',
                  params: { category: group.category, slug: page.slug },
                }"
                class="px-3 py-1.5 has-ring-focus rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 motion-safe:transition-colors"
                active-class="font-semibold text-primary-800 hover:text-primary-800 dark:!text-gray-100 bg-primary-100 dark:bg-gray-600 hover:!bg-primary-100 dark:hover:!bg-gray-600"
              >
                {{ t(page.title) }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </aside>
</template>
