import { createRouter, createWebHistory } from 'vue-router'

import store, { MutationTypes } from '../store'
import i18n from '../i18n'

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
        path: 'privacy-police',
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
      },
      {
        path: 'settings',
        name: 'DashboardSettings',
        component: () => import('../views/dashboard/Settings.vue'),
        meta: {
          title: () => t('app.routes.dashboard.settings'),
          more: true
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
router.beforeEach((to, _, next) => {
  document.title = to.meta.title() + ' | ' + t('app.name')
  next()
})

/**
 * Check if user is signed in in dashboard routes.
 */
router.beforeEach(async (to, _, next) => {
  if (to.fullPath.includes('/dashboard')) {
    if (store.getters['auth/isStarted'] && store.getters['auth/isSignedIn']) {
      next()
      return
    }

    if (!store.getters['auth/isStarted']) {
      let isSignedIn

      try {
        isSignedIn = await store.dispatch('auth/initApp')
        isSignedIn ? next() : next('/sign-in')
      } catch (e) {
        isSignedIn = false
        console.error(e)
        store.commit(MutationTypes.UPDATE_CRITICAL_ERROR, e)
        next('/error')
      }

      return
    }

    next('/')
    return
  }

  if (!store.getters['auth/isStarted'] && !store.getters.hasCriticalError) {
    try {
      const isSignedIn = await store.dispatch('auth/initApp')
      isSignedIn && to.path === '/sign-in' ? next('/dashboard') : next()
    } catch (e) {
      console.error(e)
      store.commit(MutationTypes.UPDATE_CRITICAL_ERROR, e)
      next('/error')
    }

    return
  }

  next()
})

export default router
