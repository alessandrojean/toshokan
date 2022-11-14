<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'
import { useI18n } from '@/i18n'

const { t, locale } = useI18n({ useScope: 'global' })

type Link = {
  route: RouteLocationRaw
  text: string
}

const links = computed<Link[]>(() => [
  { route: '/help/general/accessibility', text: t('footer.links.a11y') },
  { route: '/help/guide/instructions', text: t('footer.links.instructions') },
  {
    route: '/help/general/privacy-policy',
    text: t('footer.links.privacyPolicy')
  },
  { route: '/help/general/terms-of-use', text: t('footer.links.termsOfUse') }
])
</script>

<template>
  <footer class="footer">
    <div>
      <LocaleSelector v-model="locale" class="w-56 md:w-auto" />
    </div>

    <nav>
      <ul>
        <li v-for="(link, i) of links" :key="i">
          <RouterLink :to="link.route">
            {{ link.text }}
          </RouterLink>
        </li>
      </ul>
    </nav>

    <div class="text-center">
      <p>
        {{ t('footer.copyright', { year: new Date().getFullYear() }) }}
      </p>

      <p class="mt-5 text-xxs">
        {{ t('footer.googleTrademarks') }}
      </p>
    </div>
  </footer>
</template>

<style lang="postcss" scoped>
.footer {
  @apply max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center space-y-6 py-8 text-sm;
}

.footer nav ul {
  @apply flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 font-medium text-gray-500 dark:text-gray-400 text-center;
}

.footer p {
  @apply text-gray-500 dark:text-gray-400;
}

.footer a {
  @apply hover:underline hover:text-gray-600 dark:hover:text-gray-300 motion-safe:transition-shadow rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-gray-900 focus-visible:ring-primary-500;
}
</style>
