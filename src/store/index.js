import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { removeDuplicates } from '@/utils/remove'

Vue.use(Vuex)
const PERSIST_PATHS = ['activeStep', 'reserveForm', 'reserveFlight', 'isCollapse', 'editOrderInfo', 'token']

export default new Vuex.Store({
  state: {
    // 是否折叠菜单栏
    isCollapse: false,
    // 是否显示登录面板
    isLoginDialog: false,
    // 激活地址
    activePath: '/home',
    // 激活的步骤条
    activeStep: '1',
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
    token: ''
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
    // 更新乘客舱位等级
    updatePassengerInfo (state, value) {
      state.passengerInfo.forEach(item => {
        item.seatType = value
      })
    },
    // 保存修改订单的信息
    saveEditOrderInfo (state, value) {
      state.editOrderInfo = value
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
