import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/home/Home.vue'
// const Home = () => import(/* webpackChunkName:"login_home_welcome" */ '@/views/home/Home.vue')
import Flight from '@/views/query/Flight.vue'
import FlightNo from '@/views/query/FlightNo.vue'
import Reserve from '@/views/reserve/Reserve.vue'
import Order from '@/views/order/Order.vue'
import OrderPay from '@/views/order/Pay.vue'
import OrderAll from '@/views/order/All.vue'
import OrderGo from '@/views/order/Go.vue'
import OrderRefund from '@/views/order/Refund.vue'
import EditSeat from '@/views/order/modify/EditSeat.vue'
import EditDate from '@/views/order/modify/EditDate.vue'
import SelectFlight from '@/views/reserve/SelectFlight.vue'
import Book from '@/views/reserve/Book.vue'
import GoBack from '@/views/reserve/GoBack/GoBack.vue'
import GbBook from '@/views/reserve/GoBack/GbBook.vue'
import Service from '@/views/reserve/Service.vue'
import GbService from '@/views/reserve/GoBack/GbService.vue'
import Pay from '@/views/reserve/Pay/Pay.vue'
import Result from '@/views/reserve/Pay/Result.vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store/index'

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
    },
    children: [
      { path: 'pay', component: OrderPay },
      { path: 'all', component: OrderAll },
      { path: 'go', component: OrderGo },
      { path: 'refund', component: OrderRefund },
      { path: 'editseat', component: EditSeat },
      { path: 'editdate', component: EditDate }
    ]
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
      title: '【国内航班查询与预定系统】抢购成功'
    }
  }, {
    path: '/reserve/gbservice',
    component: GbService,
    meta: {
      title: '【国内航班查询与预定系统】抢购成功'
    }
  }, {
    path: '/reserve/pay',
    component: Pay,
    meta: {
      title: '支付页面'
    }
  }, {
    path: '/reserve/result',
    component: Result,
    meta: {
      title: '支付结果'
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
  if (to.path.includes('/home')) {
    store.commit('updateActivePath', '/home')
  }
  if (to.path.includes('/order/all')) {
    store.commit('updateActivePath', '/order/all')
  }
  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
