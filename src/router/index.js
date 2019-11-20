import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Roles from '../components/power/Roles.vue'
import Rights from '../components/power/Rights.vue'
import Reports from '../components/reports/Reports.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import GoodsList from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'
import Order from '../components/order/Order.vue'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login'
},
{
  path: '/login',
  component: Login
},
{
  path: '/home',
  component: Home,
  redirect: '/welcome',
  children: [
    { path: '/welcome', component: Welcome },
    { path: '/users', component: Users },
    { path: '/roles', component: Roles },
    { path: '/rights', component: Rights },
    { path: '/reports', component: Reports },
    { path: '/categories', component: Cate },
    { path: '/params', component: Params },
    { path: '/goods', component: GoodsList },
    { path: '/goods/add', component: Add },
    { path: '/orders', component: Order }
  ]
}]

const router = new VueRouter({
  routes
})

// 挂载路由导航首位
router.beforeEach((to, form, next) => {
  // to 将要访问的路径
  // form 从哪个路径跳转而来
  // next是个函数,表示放行 next() next(login) //强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
