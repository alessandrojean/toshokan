import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '../store'

import Home from '@/views/Home.vue'

import DashboardHome from '@/views/DashboardHome.vue'
import DashboardCollection from '@/views/DashboardCollection.vue'
import DashboardList from '@/views/DashboardList.vue'
import DashboardNewBook from '@/views/DashboardNewBook.vue'

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
        name: 'Início',
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
            name: 'Coleção',
            component: DashboardList,
            meta: {
              title: 'Coleção'
            }
          },
          {
            path: 'new',
            name: 'Novo',
            component: DashboardNewBook,
            meta: {
              title: 'Novo item'
            }
          }
        ]
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
    if (store.getters['auth/isSignedIn']) {
      next()
      return
    }

    next('/')
    return
  }

  next()
})

export default router
