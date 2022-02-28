import { createRouter, createWebHistory } from 'vue-router'

import i18n from '../i18n'
import { useAuthStore } from '@/stores/auth'
import { useStore } from '@/stores/main'

import Home from '@/views/Home.vue'
import SignIn from '@/views/SignIn.vue'

const { t } = i18n.global

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: () => t('app.routes.home')
    }
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    component: SignIn,
    meta: {
      title: () => t('app.routes.signIn')
    }
  },
  {
    path: '/error',
    name: 'Error',
    component: () => import('../views/Error.vue'),
    meta: {
      title: () => t('app.routes.error')
    }
  },
  {
    path: '/about',
    component: () => import('../views/about/Index.vue'),
    children: [
      {
        path: 'accessibility',
        name: 'Accessibility',
        component: () => import('../views/about/Accessibility.vue'),
        meta: {
          title: () => t('app.routes.about.a11y')
        }
      },
      {
        path: 'instructions',
        name: 'Instructions',
        component: () => import('../views/about/Instructions.vue'),
        meta: {
          title: () => t('app.routes.about.instructions')
        }
      },
      {
        path: 'privacy-policy',
        name: 'PrivacyPolicy',
        component: () => import('../views/about/PrivacyPolicy.vue'),
        meta: {
          title: () => t('app.routes.about.privacyPolicy')
        }
      },
      {
        path: 'terms-of-use',
        name: 'TermsOfUse',
        component: () => import('../views/about/TermsOfUse.vue'),
        meta: {
          title: () => t('app.routes.about.termsOfUse')
        }
      }
    ]
  },
  {
    path: '/dashboard',
    component: () => import('../views/dashboard/Index.vue'),
    children: [
      {
        path: '',
        name: 'DashboardHome',
        component: () => import('../views/dashboard/Home.vue'),
        meta: {
          title: () => t('app.routes.dashboard.home')
        }
      },
      {
        path: 'library',
        component: () => import('../views/dashboard/library/Index.vue'),
        children: [
          {
            path: '',
            name: 'DashboardLibrary',
            component: () => import('../views/dashboard/library/Explorer.vue'),
            meta: {
              title: () => t('app.routes.dashboard.library')
            }
          },
          {
            path: 'book/:bookId',
            name: 'BookDetails',
            component: () => import('../views/dashboard/library/Book.vue'),
            meta: {
              title: () => t('app.routes.dashboard.details'),
              blurNavbar: true
            }
          }
        ]
      },
      {
        path: 'stats',
        name: 'DashboardStats',
        component: () => import('../views/dashboard/Stats.vue'),
        meta: {
          title: () => t('app.routes.dashboard.stats')
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)',
    component: () => import('../views/PageNotFound.vue'),
    meta: {
      title: () => t('app.routes.notFound')
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior () {
    return {
      top: 0,
      behavior: 'smooth'
    }
  },
  routes
})

/**
 * Replace page title.
 */
router.afterEach(to => {
  document.title = to.meta.title() + ' | ' + t('app.name')
})

/**
 * Check if user is signed in in dashboard routes.
 */
router.beforeEach(async (to, _, next) => {
  const authStore = useAuthStore()
  const mainStore = useStore()

  if (to.fullPath.includes('/dashboard')) {
    if (authStore.isStarted && authStore.isSignedIn) {
      next()
      return
    }

    if (!authStore.isStarted) {
      let isSignedIn

      try {
        isSignedIn = await authStore.initApp()
        isSignedIn ? next() : next('/sign-in')
      } catch (e) {
        isSignedIn = false
        console.error(e)
        mainStore.updateCriticalError(e)
        next('/error')
      }

      return
    }

    next('/')
    return
  }

  if (!authStore.isStarted && !mainStore.hasCriticalError) {
    try {
      const isSignedIn = await authStore.initApp()
      isSignedIn && to.path === '/sign-in' ? next('/dashboard') : next()
    } catch (e) {
      console.error(e)
      mainStore.updateCriticalError(e)
      next('/error')
    }

    return
  }

  next()
})

export default router
