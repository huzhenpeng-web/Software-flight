import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index'
import Home from '@/views/home/Home.vue'
import Flight from '@/views/query/Flight.vue'
import FlightNo from '@/views/query/FlightNo.vue'
import Reserve from '@/views/reserve/Reserve.vue'
import Order from '@/views/order/Order.vue'
import SelectFlight from '@/views/reserve/SelectFlight.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  }, {
    path: '/home',
    component: Home,
    meta: {
      title: '国内航班查询与预订系统'
    }
  }, {
    path: '/query',
    component: Flight,
    meta: {
      title: '查询航班'
    }
  }, {
    path: '/query/flightNo',
    component: FlightNo,
    meta: {
      title: '搜航班号'
    }
  },
  {
    path: '/reserve',
    component: Reserve,
    meta: {
      title: '机票预订'
    }
  }, {
    path: '/order',
    component: Order,
    meta: {
      title: '我的订单'
    }
  }, {
    path: '/reserve/selectFlight',
    component: SelectFlight,
    meta: {
      title: '选择机票'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  store.commit('updateActivePath', to.path)
  next()
})

export default router
