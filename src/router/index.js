import { createRouter, createWebHistory } from 'vue-router'

import store from '../store'
import i18n from '../i18n'

import Home from '@/views/Home'
import SignIn from '@/views/SignIn'

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
    component: () => import(/* webpackChunkName: "error" */ '../views/Error.vue'),
    meta: {
      title: () => t('app.routes.error')
    }
  },
  {
    path: '/about',
    component: () => import(/* webpackChunkName: "about" */ '../views/about/Index.vue'),
    children: [
      {
        path: 'accessibility',
        name: 'Accessibility',
        component: () => import(/* webpackChunkName: "about-a11y" */ '../views/about/Accessibility.vue'),
        meta: {
          title: () => t('app.routes.about.a11y')
        }
      },
      {
        path: 'instructions',
        name: 'Instructions',
        component: () => import(/* webpackChunkName: "about-instructions" */ '../views/about/Instructions.vue'),
        meta: {
          title: () => t('app.routes.about.instructions')
        }
      },
      {
        path: 'privacy-police',
        name: 'PrivacyPolicy',
        component: () => import(/* webpackChunkName: "about-pp" */ '../views/about/PrivacyPolicy.vue'),
        meta: {
          title: () => t('app.routes.about.privacyPolicy')
        }
      },
      {
        path: 'terms-of-use',
        name: 'TermsOfUse',
        component: () => import(/* webpackChunkName: "about-tou" */ '../views/about/TermsOfUse.vue'),
        meta: {
          title: () => t('app.routes.about.termsOfUse')
        }
      }
    ]
  },
  {
    path: '/dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard/Index.vue'),
    children: [
      {
        path: '',
        name: 'DashboardHome',
        component: () => import(/* webpackChunkName: "dashboard-home" */ '../views/dashboard/Home.vue'),
        meta: {
          title: () => t('app.routes.dashboard.home')
        }
      },
      {
        path: 'library',
        component: () => import(/* webpackChunkName: "dashboard-library" */ '../views/dashboard/library/Index.vue'),
        children: [
          {
            path: '',
            name: 'DashboardLibrary',
            component: () => import(/* webpackChunkName: "dashboard-collection-list" */ '../views/dashboard/library/Explorer.vue'),
            meta: {
              title: () => t('app.routes.dashboard.library')
            }
          },
          {
            path: 'book/:bookId',
            name: 'BookDetails',
            component: () => import(/* webpackChunkName: "dashboard-details" */ '../views/dashboard/library/Book.vue'),
            meta: {
              title: () => t('app.routes.dashboard.details')
            }
          },
          {
            path: 'new',
            name: 'DashboardNewBook',
            component: () => import(/* webpackChunkName: "dashboard-new-book" */ '../views/dashboard/library/NewBook.vue'),
            meta: {
              title: () => t('app.routes.dashboard.newBook')
            }
          }
        ]
      },
      {
        path: 'stats',
        name: 'DashboardStats',
        component: () => import(/* webpackChunkName: "dashboard-stats" */ '../views/dashboard/Stats.vue'),
        meta: {
          title: () => t('app.routes.dashboard.stats')
        }
      },
      {
        path: 'settings',
        name: 'DashboardSettings',
        component: () => import(/* webpackChunkName: "dashboard-settings" */ '../views/dashboard/Settings.vue'),
        meta: {
          title: () => t('app.routes.dashboard.settings'),
          more: true
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)',
    component: () => import(/* webpackChunkName: "page-not-found" */ '../views/PageNotFound.vue'),
    meta: {
      title: () => t('app.routes.notFound')
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
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
router.beforeEach((to, from, next) => {
  document.title = to.meta.title() + ' | ' + t('app.name')
  next()
})

/**
 * Check if user is signed in in dashboard routes.
 */
router.beforeEach(async (to, from, next) => {
  if (to.fullPath.includes('/dashboard')) {
    if (store.getters['auth/isStarted'] && store.getters['auth/isSignedIn']) {
      next()
      return
    }

    if (!store.getters['auth/isStarted']) {
      let isSignedIn

      try {
        isSignedIn = await store.dispatch('auth/initApp')
      } catch (e) {
        isSignedIn = false
      } finally {
        next(isSignedIn ? undefined : '/sign-in')
      }

      return
    }

    next('/')
    return
  }

  if (!store.getters['auth/isStarted']) {
    try {
      const isSignedIn = await store.dispatch('auth/initApp')
      next(isSignedIn && to.path === '/sign-in' ? '/dashboard' : undefined)
    } catch (e) {
      next('/sign-in')
    }

    return
  }

  next()
})

export default router
