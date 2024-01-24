import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

import vueI18n from '@intlify/unplugin-vue-i18n/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Pages from 'vite-plugin-pages'
import { VitePWA } from 'vite-plugin-pwa'
import Layouts from 'vite-plugin-vue-layouts'

import { HeadlessUiResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  assetsInclude: ['**/*.md'],
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(
      process.env.npm_package_version,
    ),
  },
  plugins: [
    // https://github.com/vitejs/vite/tree/main/packages/plugin-vue
    Vue(),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages(),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),

    // https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
    vueI18n({
      include: resolve(
        dirname(fileURLToPath(import.meta.url)),
        './src/i18n/messages/**',
      ),
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        'vue/macros',
        {
          '@vueuse/core': [
            'breakpointsTailwind',
            'useBreakpoints',
            'useLocalStorage',
          ],
        },
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: ['src/composables', 'src/stores', 'src/queries', 'src/mutations'],
      vueTemplate: true,
      eslintrc: {
        enabled: true,
      },
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      dts: 'src/components.d.ts',
      resolvers: [HeadlessUiResolver()],
    }),

    // https://github.com/vite-pwa/vite-plugin-pwa
    VitePWA({
      includeAssets: [
        'favicon.ico',
        'favicon.svg',
        'robots.txt',
        'img/icons/apple-touch-icon.png',
      ],
      manifest: {
        name: 'Toshokan',
        short_name: 'Toshokan',
        description: 'Utilitário para gerenciamento de coleções de mangás.',
        theme_color: '#1e293b',
        background_color: '#1e293b',
        start_url: '/dashboard',
        icons: [
          {
            src: './img/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: './img/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: './img/icons/icon-192x192-maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: './img/icons/icon-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Dashboard',
            short_name: 'Dashboard',
            description: 'Visualizar o dashboard da coleção.',
            url: '/dashboard',
            icons: [
              {
                src: './img/icons/shortcut-dashboard-192x192.png',
                sizes: '192x192',
              },
            ],
          },
          {
            name: 'Biblioteca',
            short_name: 'Biblioteca',
            description: 'Visualizar a biblioteca.',
            url: '/dashboard/library',
            icons: [
              {
                src: './img/icons/shortcut-library-192x192.png',
                sizes: '192x192',
              },
            ],
          },
          {
            name: 'Estatísticas',
            short_name: 'Estatísticas',
            description: 'Visualizar as estatísticas.',
            url: '/dashboard/stats',
            icons: [
              {
                src: './img/icons/shortcut-stats-192x192.png',
                sizes: '192x192',
              },
            ],
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '~~': resolve(__dirname, '.'),
    },
  },
  build: {
    commonjsOptions: {
      include: ['tailwind.config.js', 'node_modules/**'],
    },
  },
  server: {
    port: 8080,
    watch: {
      ignored: ['**/src/tests/**'],
    },
  },
  test: {
    environment: 'jsdom',
  },
})
