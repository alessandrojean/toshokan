import { createRouter, createWebHistory } from 'vue-router'

import store from '../store'

import Home from '@/views/Home'

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
    path: '/error',
    name: 'Error',
    component: () => import(/* webpackChunkName: "error" */ '../views/Error.vue'),
    meta: {
      title: 'Erro crítico'
    }
  },
  {
    path: '/dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
    children: [
      {
        path: 'home',
        name: 'DashboardHome',
        component: () => import(/* webpackChunkName: "dashboard-home" */ '../views/DashboardHome.vue'),
        meta: {
          title: 'Início'
        }
      },
      {
        path: 'collection',
        component: () => import(/* webpackChunkName: "dashboard-collection" */ '../views/DashboardCollection.vue'),
        meta: {
          title: 'Coleção'
        },
        children: [
          {
            path: '',
            name: 'DashboardCollection',
            component: () => import(/* webpackChunkName: "dashboard-collection-list" */ '../views/DashboardCollectionList.vue'),
            meta: {
              title: 'Coleção'
            }
          },
          {
            path: ':bookId',
            name: 'BookDetails',
            component: () => import(/* webpackChunkName: "dashboard-details" */ '../views/DashboardDetails.vue'),
            meta: {
              title: 'Detalhes'
            }
          }
        ]
      },
      {
        path: 'new',
        name: 'DashboardNewBook',
        component: () => import(/* webpackChunkName: "dashboard-new-book" */ '../views/DashboardNewBook.vue'),
        meta: {
          title: 'Novo livro'
        }
      },
      {
        path: 'search',
        name: 'DashboardSearch',
        component: () => import(/* webpackChunkName: "dashboard-search" */ '../views/DashboardSearch.vue'),
        meta: {
          title: 'Busca'
        }
      },
      {
        path: 'stats',
        name: 'DashboardStats',
        component: () => import(/* webpackChunkName: "dashboard-stats" */ '../views/DashboardStats.vue'),
        meta: {
          title: 'Estatísticas'
        }
      },
      {
        path: 'settings',
        name: 'DashboardSettings',
        component: () => import(/* webpackChunkName: "dashboard-settings" */ '../views/DashboardSettings.vue'),
        meta: {
          title: 'Configurações'
        }
      },
      {
        path: 'wishlist',
        name: 'DashboardWishlist',
        component: () => import(/* webpackChunkName: "dashboard-wishlist" */ '../views/DashboardWishlist.vue'),
        meta: {
          title: 'Lista de desejos'
        }
      }
    ]
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
router.beforeEach((to, from, next) => {
  if (to.fullPath.includes('/dashboard')) {
    if (store.getters['auth/isStarted'] && store.getters['auth/isSignedIn']) {
      next()
      return
    }

    if (!store.getters['auth/isStarted']) {
      store.dispatch('auth/initApp')
        .then(isSignedIn => next(isSignedIn ? undefined : '/'))
        .catch(() => next('/'))

      return
    }

    next('/')
    return
  }

  if (!store.getters['auth/isStarted']) {
    store.dispatch('auth/initApp')
      .then(isSignedIn => next(isSignedIn ? '/dashboard/home' : undefined))
      .catch(() => next('/'))

    return
  }

  next()
})

export default router
