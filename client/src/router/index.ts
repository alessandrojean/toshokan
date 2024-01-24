import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'

import i18n from '@/i18n'
import { useAuthStore } from '@/stores/auth'
import { useStore } from '@/stores/main'

declare module 'vue-router' {
  interface RouteMeta {
    title: string
    category?: string
    transparentNavbar?: boolean
  }
}

const { t } = i18n.global

const routes = setupLayouts(generatedRoutes)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return (
      savedPosition ?? {
        top: 0,
        behavior: 'smooth',
      }
    )
  },
  routes,
})

/**
 * Replace page title.
 */
router.afterEach((to) => {
  const routeTitle = to.meta?.title ?? ''
  document.title
    = routeTitle.length > 0
      ? `${t(routeTitle)} | ${t('app.name')}`
      : t('app.name')
  document.body.dataset.route = String(to.name)
})

/**
 * Check if user is signed in in dashboard routes.
 */
router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const mainStore = useStore()

  if (!authStore.started && !mainStore.hasCriticalError) {
    try {
      await authStore.initApp()
    } catch (e) {
      console.error(e)
      mainStore.updateCriticalError(e)
      return { name: 'error' }
    }
  }

  if (to.name === 'sign-in' || to.name === 'error') {
    return
  }

  if (to.fullPath.includes('/dashboard')) {
    if (authStore.authenticated && authStore.authorized) {
      return
    }

    return { name: 'sign-in', query: { redirect: to.fullPath } }
  }
})

// router.beforeEach(() => {
//   const mainContent = document.querySelector<HTMLDivElement>('#main-content')

//   if (mainContent) {
//     mainContent.scroll({ top: 0, behavior: 'smooth' })
//   }
// })

export default router
