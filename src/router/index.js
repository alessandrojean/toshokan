import { createRouter, createWebHistory } from 'vue-router'

import store from '../store'

import Home from '@/views/Home'
import SignIn from '@/views/SignIn'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Início'
    }
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    component: SignIn,
    meta: {
      title: 'Autentique-se'
    }
  },
  {
    path: '/error',
    name: 'Error',
    component: () => import(/* webpackChunkName: "error" */ '../views/Error.vue'),
    meta: {
      title: 'Erro crítico'
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
          title: 'Acessibilidade'
        }
      },
      {
        path: 'instructions',
        name: 'Instructions',
        component: () => import(/* webpackChunkName: "about-instructions" */ '../views/about/Instructions.vue'),
        meta: {
          title: 'Instruções de uso'
        }
      },
      {
        path: 'privacy-police',
        name: 'PrivacyPolicy',
        component: () => import(/* webpackChunkName: "about-pp" */ '../views/about/PrivacyPolicy.vue'),
        meta: {
          title: 'Política de Privacidade'
        }
      },
      {
        path: 'terms-of-use',
        name: 'TermsOfUse',
        component: () => import(/* webpackChunkName: "about-tou" */ '../views/about/TermsOfUse.vue'),
        meta: {
          title: 'Termos de Uso'
        }
      }
    ]
  },
  {
    path: '/dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard/Index.vue'),
    children: [
      {
        path: 'home',
        name: 'DashboardHome',
        component: () => import(/* webpackChunkName: "dashboard-home" */ '../views/dashboard/Home.vue'),
        meta: {
          title: 'Dashboard'
        }
      },
      {
        path: 'library',
        component: () => import(/* webpackChunkName: "dashboard-collection" */ '../views/dashboard/library/Index.vue'),
        children: [
          {
            path: '',
            name: 'DashboardLibrary',
            component: () => import(/* webpackChunkName: "dashboard-collection-list" */ '../views/dashboard/library/Explorer.vue'),
            meta: {
              title: 'Biblioteca'
            }
          },
          {
            path: 'book/:bookId',
            name: 'BookDetails',
            component: () => import(/* webpackChunkName: "dashboard-details" */ '../views/dashboard/library/BookDetails.vue'),
            meta: {
              title: 'Detalhes'
            }
          },
          {
            path: 'new',
            name: 'DashboardNewBook',
            component: () => import(/* webpackChunkName: "dashboard-new-book" */ '../views/dashboard/library/NewBook.vue'),
            meta: {
              title: 'Novo livro'
            }
          }
        ]
      },
      {
        path: 'search',
        name: 'DashboardSearch',
        component: () => import(/* webpackChunkName: "dashboard-search" */ '../views/dashboard/Search.vue'),
        meta: {
          title: 'Busca'
        }
      },
      {
        path: 'stats',
        name: 'DashboardStats',
        component: () => import(/* webpackChunkName: "dashboard-stats" */ '../views/dashboard/Stats.vue'),
        meta: {
          title: 'Estatísticas'
        }
      },
      {
        path: 'settings',
        name: 'DashboardSettings',
        component: () => import(/* webpackChunkName: "dashboard-settings" */ '../views/dashboard/Settings.vue'),
        meta: {
          title: 'Configurações'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)',
    component: () => import(/* webpackChunkName: "page-not-found" */ '../views/PageNotFound.vue'),
    meta: {
      title: 'Página não encontrada'
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
  document.title = to.meta.title + ' | ' + process.env.VUE_APP_TITLE
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
      next(isSignedIn && to.path === '/sign-in' ? '/dashboard/home' : undefined)
    } catch (e) {
      next('/sign-in')
    }

    return
  }

  next()
})

export default router
