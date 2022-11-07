import { createRouter, createWebHistory } from 'vue-router'

import i18n from '@/i18n'
import { useAuthStore } from '@/stores/auth'
import { useStore } from '@/stores/main'

import Home from '@/views/Home.vue'
import SignIn from '@/views/SignIn.vue'

declare module 'vue-router' {
  interface RouteMeta {
    title: () => string
    category?: string
    blurNavbar?: boolean
  }
}

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
    path: '/help',
    component: () => import('../views/help/Index.vue'),
    children: [
      {
        path: 'general/about-the-project',
        name: 'About',
        component: () => import('../views/help/BaseAbout.vue'),
        meta: {
          title: () => t('app.routes.about.about'),
          category: 'general'
        },
        props: { file: 'about' }
      },
      {
        path: 'general/accessibility',
        name: 'Accessibility',
        component: () => import('../views/help/BaseAbout.vue'),
        meta: {
          title: () => t('app.routes.about.a11y'),
          category: 'general'
        },
        props: { file: 'a11y' }
      },
      {
        path: 'general/privacy-policy',
        name: 'PrivacyPolicy',
        component: () => import('../views/help/BaseAbout.vue'),
        meta: {
          title: () => t('app.routes.about.privacyPolicy'),
          category: 'general'
        },
        props: { file: 'privacy-policy' }
      },
      {
        path: 'general/terms-of-use',
        name: 'TermsOfUse',
        component: () => import('../views/help/BaseAbout.vue'),
        meta: {
          title: () => t('app.routes.about.termsOfUse'),
          category: 'general'
        },
        props: { file: 'terms-of-use' }
      },
      {
        path: 'guides/instructions',
        name: 'Instructions',
        component: () => import('../views/help/BaseAbout.vue'),
        meta: {
          title: () => t('app.routes.about.instructions'),
          category: 'guide'
        },
        props: { file: 'instructions' },
        alias: ['']
      },
      {
        path: 'guides/searching',
        name: 'Searching',
        component: () => import('../views/help/BaseAbout.vue'),
        meta: {
          title: () => t('app.routes.about.searching'),
          category: 'guide'
        },
        props: { file: 'searching' }
      },
      {
        path: 'guides/sharing',
        name: 'Sharing',
        component: () => import('../views/help/BaseAbout.vue'),
        meta: {
          title: () => t('app.routes.about.sharing'),
          category: 'guide'
        },
        props: { file: 'sharing' }
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
    path: '/share',
    name: 'Share',
    component: () => import('../views/Share.vue'),
    meta: {
      title: () => t('app.routes.share')
    }
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
  scrollBehavior(to, from) {
    if (to.name !== from.name) {
      return {
        top: 0,
        behavior: 'smooth'
      }
    }
  },
  routes
})

/**
 * Replace page title.
 */
router.afterEach((to) => {
  const routeTitle = to.meta?.title?.()
  document.title =
    (routeTitle?.length > 0 ? routeTitle + ' | ' : '') + t('app.name')
  document.body.dataset.route = to.name
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
      return { name: 'Error' }
    }
  }

  if (to.name === 'SignIn' || to.name === 'Error') {
    return
  }

  if (to.fullPath.includes('/dashboard')) {
    if (authStore.authenticated && authStore.authorized) {
      return
    }

    return { name: 'SignIn', query: { redirect: to.fullPath } }
  }
})

export default router
