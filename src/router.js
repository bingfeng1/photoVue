import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index.vue'
import {getUserInfo} from '@/assets/js/common'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      name: '/',
      component: Index
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
    },
    {
      path: '/signUp',
      name: 'signup',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "login" */ './views/SignUp.vue')
    },
    {
      path: '/user',
      name: 'user',
      meta: {
        auth: true
      },
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "user" */ './views/User.vue'),
      children:[
        {
          path: 'upload',
          name: 'upload',
          meta: {
            auth: true
          },
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "user" */ './views/Upload.vue')
        },
        {
          path: 'collect',
          name: 'collect',
          meta: {
            auth: true
          },
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "user" */ './views/Collect.vue')
        },
        {
          path: 'self',
          name: 'self',
          meta: {
            auth: true
          },
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "user" */ './views/Self.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.auth) { //权限判断
    let userInfo = getUserInfo();
    if (userInfo.token) { //读取token值
      //  成功
      next()
    } else {
      next({ path: '/' })
    }
  } else {
    // 没有meta.auth 不用管
    next()
  }
});

export default router