import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { removeDuplicates } from '@/utils/remove'

Vue.use(Vuex)
const PERSIST_PATHS = ['activeStep', 'reserveForm', 'reserveFlight', 'isCollapse']

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
    passengerInfo: []
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
    saveIsLoginDialog (state, value) {
      state.isLoginDialog = value
    },
    // 移出乘客
    deletePassengereInfo (state, index) {
      state.passengerInfo.splice(index, 1)
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
