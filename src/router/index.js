import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/home/Home.vue'
import Flight from '@/views/query/Flight.vue'
import FlightNo from '@/views/query/FlightNo.vue'
import Reserve from '@/views/reserve/Reserve.vue'
import Order from '@/views/order/Order.vue'
import SelectFlight from '@/views/reserve/SelectFlight.vue'
import Book from '@/views/reserve/Book.vue'
import GoBack from '@/views/reserve/GoBack/GoBack.vue'
import GbBook from '@/views/reserve/GoBack/GbBook.vue'
import Service from '@/views/reserve/Service.vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

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
  }, {
    path: '/reserve/book',
    component: Book,
    meta: {
      title: '乘机信息'
    }
  }, {
    path: '/reserve/goback',
    component: GoBack,
    meta: {
      title: '选择机票'
    }
  }, {
    path: '/reserve/goback/book',
    component: GbBook,
    meta: {
      title: '乘机信息'
    }
  }, {
    path: '/reserve/service',
    component: Service,
    meta: {
      title: '增值服务'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
