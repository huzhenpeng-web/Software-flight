import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store/index'
// import Home from '@/views/home/Home.vue'
const Home = () => import(/* webpackChunkName:"home" */ '@/views/home/Home.vue')
// import Flight from '@/views/query/Flight.vue'
const Flight = () => import(/* webpackChunkName:"flight_flightNo" */ '@/views/query/Flight.vue')
// import FlightNo from '@/views/query/FlightNo.vue'
const FlightNo = () => import(/* webpackChunkName:"flight_flightNo" */ '@/views/query/FlightNo.vue')
// import Reserve from '@/views/reserve/Reserve.vue'
const Reserve = () => import(/* webpackChunkName:"reserve" */ '@/views/reserve/Reserve.vue')
// import Order from '@/views/order/Order.vue'
const Order = () => import(/* webpackChunkName:"order" */ '@/views/order/Order.vue')
// import OrderPay from '@/views/order/Pay.vue'
const OrderPay = () => import(/* webpackChunkName:"order" */ '@/views/order/Pay.vue')
// import OrderAll from '@/views/order/All.vue'
const OrderAll = () => import(/* webpackChunkName:"order" */ '@/views/order/All.vue')
// import OrderGo from '@/views/order/Go.vue'
const OrderGo = () => import(/* webpackChunkName:"order" */ '@/views/order/Go.vue')
// import OrderRefund from '@/views/order/Refund.vue'
const OrderRefund = () => import(/* webpackChunkName:"order" */ '@/views/order/Refund.vue')
// import EditSeat from '@/views/order/modify/EditSeat.vue'
const EditSeat = () => import(/* webpackChunkName:"order" */ '@/views/order/modify/EditSeat.vue')
// import EditDate from '@/views/order/modify/EditDate.vue'
const EditDate = () => import(/* webpackChunkName:"order" */ '@/views/order/modify/EditDate.vue')
// import SelectFlight from '@/views/reserve/SelectFlight.vue'
const SelectFlight = () => import(/* webpackChunkName:"reserve" */ '@/views/reserve/SelectFlight.vue')
// import Book from '@/views/reserve/Book.vue'
const Book = () => import(/* webpackChunkName:"reserve" */ '@/views/reserve/Book.vue')
// import GoBack from '@/views/reserve/GoBack/GoBack.vue'
const GoBack = () => import(/* webpackChunkName:"reserve" */ '@/views/reserve/GoBack/GoBack.vue')
// import GbBook from '@/views/reserve/GoBack/GbBook.vue'
const GbBook = () => import(/* webpackChunkName:"reserve" */ '@/views/reserve/GoBack/GbBook.vue')
// import Service from '@/views/reserve/Service.vue'
const Service = () => import(/* webpackChunkName:"reserve" */ '@/views/reserve/Service.vue')
// import GbService from '@/views/reserve/GoBack/GbService.vue'
const GbService = () => import(/* webpackChunkName:"reserve" */ '@/views/reserve/GoBack/GbService.vue')
// import Pay from '@/views/reserve/Pay/Pay.vue'
const Pay = () => import(/* webpackChunkName:"reserve" */ '@/views/reserve/Pay/Pay.vue')
// import Result from '@/views/reserve/Pay/Result.vue'
const Result = () => import(/* webpackChunkName:"reserve" */ '@/views/reserve/Pay/Result.vue')
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  }, {
    path: '/home',
    component: Home,
    meta: {
      title: '?????????????????????????????????'
    }
  }, {
    path: '/query',
    component: Flight,
    meta: {
      title: '????????????'
    }
  }, {
    path: '/query/flightNo',
    component: FlightNo,
    meta: {
      title: '????????????'
    }
  },
  {
    path: '/reserve',
    component: Reserve,
    meta: {
      title: '????????????'
    }
  }, {
    path: '/order',
    component: Order,
    meta: {
      title: '????????????',
      login: true
    },
    children: [
      { path: 'pay', component: OrderPay, meta: { login: true } },
      { path: 'all', component: OrderAll, meta: { login: true } },
      { path: 'go', component: OrderGo, meta: { login: true } },
      { path: 'refund', component: OrderRefund, meta: { login: true } },
      { path: 'editseat', component: EditSeat, meta: { login: true } },
      { path: 'editdate', component: EditDate, meta: { login: true } }
    ]
  }, {
    path: '/reserve/selectFlight',
    component: SelectFlight,
    meta: {
      title: '????????????'
    }
  }, {
    path: '/reserve/book',
    component: Book,
    meta: {
      title: '????????????',
      login: true
    }
  }, {
    path: '/reserve/goback',
    component: GoBack,
    meta: {
      title: '????????????'
    }
  }, {
    path: '/reserve/goback/book',
    component: GbBook,
    meta: {
      title: '????????????',
      login: true
    }
  }, {
    path: '/reserve/service',
    component: Service,
    meta: {
      title: '???????????????????????????????????????????????????',
      login: true
    }
  }, {
    path: '/reserve/gbservice',
    component: GbService,
    meta: {
      title: '???????????????????????????????????????????????????',
      login: true
    }
  }, {
    path: '/reserve/pay',
    component: Pay,
    meta: {
      title: '????????????',
      login: true
    }
  }, {
    path: '/reserve/result',
    component: Result,
    meta: {
      title: '????????????',
      login: true
    }
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const token = store.state.token
  NProgress.start()
  if (to.meta.title) document.title = to.meta.title
  if (to.path.includes('/home')) {
    store.commit('updateActivePath', '/home')
  } else if (to.path.includes('/order/all')) {
    store.commit('updateActivePath', '/order/all')
  }
  if (to.meta.login) { // ?????????????????????
    if (token) {
      next()
    } else { // token?????????
      Vue.prototype.$message.warning('????????????,?????????????????????')
      store.commit('saveIsLoginDialog', true)
      NProgress.done()
    }
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
