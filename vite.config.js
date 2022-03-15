import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  assetsInclude: ['**/*.md'],
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(
      process.env.npm_package_version
    )
  },
  plugins: [
    vue(),
    VitePWA({
      includeAssets: [
        'favicon.ico',
        'favicon.svg',
        'robots.txt',
        'img/icons/apple-touch-icon.png'
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
            type: 'image/png'
          },
          {
            src: './img/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: './img/icons/icon-192x192-maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: './img/icons/icon-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
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
                sizes: '192x192'
              }
            ]
          },
          {
            name: 'Biblioteca',
            short_name: 'Biblioteca',
            description: 'Visualizar a biblioteca.',
            url: '/dashboard/library',
            icons: [
              {
                src: './img/icons/shortcut-library-192x192.png',
                sizes: '192x192'
              }
            ]
          },
          {
            name: 'Estatísticas',
            short_name: 'Estatísticas',
            description: 'Visualizar as estatísticas.',
            url: '/dashboard/stats',
            icons: [
              {
                src: './img/icons/shortcut-stats-192x192.png',
                sizes: '192x192'
              }
            ]
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'tailwind.config.js': path.resolve(__dirname, 'tailwind.config.js')
    }
  },
  optimizeDeps: {
    include: ['tailwind.config.js']
  },
  build: {
    commonjsOptions: {
      include: ['tailwind.config.js', 'node_modules/**']
    }
  },
  server: {
    port: 8080,
    watch: {
      ignored: ['**/src/tests/**']
    }
  }
})
