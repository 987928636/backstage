import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/',
      redirect: '/home'
    },

    {
      path: '/login',
      component: () => import('./components/Login.vue')
    },

    {
      path: '/home',
      component: () => import('./components/Home.vue'),
      //重定向路由
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: () => import('./components/Welcome.vue'),
        }, 
        {
          path: '/users',
          component: () => import('./components/Users.vue'),
        }, 
        {
          path: '/channel',
          component: () => import('./components/Channel.vue'),
        }, 
        {
          path: '/product',
          component: () => import('./components/Product.vue'),
        }, 

    ]
    },

  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next() 放行   next('/login') 强制跳转

  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router