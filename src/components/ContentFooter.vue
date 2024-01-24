<script lang="ts" setup>
import { PencilSquareIcon } from '@heroicons/vue/24/outline'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'
import { useI18n } from '@/i18n'
import { DocumentationKey } from '@/symbols'
import { injectStrict } from '@/util'

defineProps({ githubLink: String })

const { t, locale } = useI18n({ useScope: 'global' })
const docs = injectStrict(DocumentationKey)

const route = useRoute()
const category = computed(() => String(route.params.category))
const slug = computed(() => String(route.params.slug))

const pages = computed(() => {
  const pages = docs.find(c => c.category === category.value)?.pages ?? []

  return pages.filter(p => p.locale === locale.value)
})

const currentIdx = computed(() =>
  pages.value.findIndex(p => p.slug === slug.value),
)
const previous = computed(() => pages.value[currentIdx.value - 1])
const next = computed(() => pages.value[currentIdx.value + 1])
</script>

<template>
  <footer class="content-footer">
    <a
      v-if="githubLink"
      :href="githubLink"
      class="flex items-center w-fit text-sm mb-3 font-medium text-primary-600 dark:text-primary-400 rounded has-ring-focus hocus:underline"
    >
      <span aria-hidden="true">
        <PencilSquareIcon class="w-5 h-5 mr-2" />
      </span>
      <span>{{ t('about.editThisPage') }}</span>
    </a>
    <div
      class="-mx-1 flex flex-col md:flex-row md:justify-between md:items-center pt-2.5 space-y-4 md:space-y-0 border-t border-gray-300 dark:border-gray-600"
    >
      <RouterLink
        v-if="previous"
        :to="{
          name: 'help-category-slug',
          params: { category, slug: previous.slug },
        }"
        class="link previous has-ring-focus"
      >
        <div class="flex items-center">
          <ChevronLeftIcon class="w-4 h-4 inline-block -ml-1 mr-0.5" />
          <span>{{ t('about.previous') }}</span>
        </div>
        <span class="title">{{ t(previous.title) }}</span>
      </RouterLink>
      <RouterLink
        v-if="next"
        :to="{
          name: 'help-category-slug',
          params: { category, slug: next.slug },
        }"
        class="link next has-ring-focus"
      >
        <div class="flex items-center justify-end">
          <span>{{ t('about.next') }}</span>
          <ChevronRightIcon class="w-4 h-4 inline-block ml-0.5 -mr-1" />
        </div>
        <span class="title">{{ t(next.title) }}</span>
      </RouterLink>
    </div>
  </footer>
</template>

<style lang="postcss" scoped>
.content-footer {
  @apply pt-2.5 mt-10 text-center sm:text-left;
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
