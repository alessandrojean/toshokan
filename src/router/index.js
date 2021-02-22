import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '../store'

import Home from '@/views/Home.vue'

import DashboardHome from '@/views/DashboardHome.vue'
import DashboardCollection from '@/views/DashboardCollection.vue'
import DashboardList from '@/views/DashboardList.vue'
import DashboardNewBook from '@/views/DashboardNewBook.vue'
import DashboardDetails from '@/views/DashboardDetails.vue'
import DashboardStats from '@/views/DashboardStats.vue'

Vue.use(VueRouter)

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
    path: '/dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
    children: [
      {
        path: 'home',
        name: 'dashboard-home',
        component: DashboardHome,
        meta: {
          title: 'Início'
        }
      },
      {
        path: 'collection',
        component: DashboardCollection,
        meta: {
          title: 'Coleção'
        },
        children: [
          {
            path: '',
            name: 'collection',
            component: DashboardList,
            meta: {
              title: 'Coleção'
            }
          },
          {
            path: 'new',
            name: 'new-book',
            component: DashboardNewBook,
            meta: {
              title: 'Novo item'
            }
          },
          {
            path: ':bookId',
            name: 'book-details',
            component: DashboardDetails,
            meta: {
              title: 'Detalhes'
            }
          }
        ]
      },
      {
        path: 'stats',
        name: 'stats',
        component: DashboardStats,
        meta: {
          title: 'Estatísticas'
        }
      }
    ]
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
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
      .then(() => next())
      .catch(() => next('/'))

    return
  }

  next()
})

export default router
