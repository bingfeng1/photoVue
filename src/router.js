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
      path: '/SignUp',
      name: 'signup',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "login" */ './views/SignUp.vue')
    },
    {
      path: '/Upload',
      name: 'upload',
      meta: {
        auth: true
      },
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "login" */ './views/Upload.vue')
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