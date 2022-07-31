import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { removeDuplicates } from '@/utils/remove'

Vue.use(Vuex)
const PERSIST_PATHS = ['loginStatus', 'activePath', 'reserveForm', 'reserveFlight', 'isCollapse', 'editOrderInfo', 'token', 'user']

export default new Vuex.Store({
  state: {
    // 是否折叠菜单栏
    isCollapse: false,
    // 是否显示登录面板
    isLoginDialog: false,
    isRegisterDialog: false,
    // 激活地址
    activePath: '/home',
    // 预订的航班
    reserveFlight: {},
    // 预订表单
    reserveForm: {},
    // 航班号表单数据
    flightNoData: {},
    // 乘客信息
    passengerInfo: [],
    // 修改订单的信息
    editOrderInfo: {},
    token: '',
    user: {},
    loginStatus: false
  },
  getters: {
  },
  mutations: {
    updateCollapse (state) {
      state.isCollapse = !state.isCollapse
    },
    updateActivePath (state, value) {
      state.activePath = value
    },
    saveReserveFlight (state, value) {
      state.reserveFlight = value
    },
    saveReserveForm (state, value) {
      state.reserveForm = value
    },
    saveFlightNoData (state, value) {
      state.flightNoData = value
    },
    savePassengereInfo (state, value) {
      state.passengerInfo.push(value)
      removeDuplicates(state.passengerInfo)
    },
    // 清空乘客
    clearPassengereInfo (state) {
      state.passengerInfo.length = 0
    },
    saveIsLoginDialog (state, value) {
      state.isLoginDialog = value
    },
    saveRegisterDialog (state, value) {
      state.isRegisterDialog = value
    },
    // 更新乘客舱位等级
    updatePassengerInfo (state, value) {
      state.passengerInfo.forEach(item => {
        item.seatType = value
      })
    },
    // 保存修改订单的信息
    saveEditOrderInfo (state, value) {
      state.editOrderInfo = value
    },
    // 保存token
    saveToken (state, value) {
      state.token = value
    },
    // 清空token和user
    clearTokenAndUser (state) {
      state.token = ''
      state.user = {}
    },
    // 保存用户信息
    saveUser (state, value) {
      state.user = value
    },
    changeLoginStatus (state, value) {
      state.loginStatus = value
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [createPersistedState({
    storage: window.sessionStorage,
    paths: PERSIST_PATHS
  })]
})
