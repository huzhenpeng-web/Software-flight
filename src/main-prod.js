import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入全局样式
import '@/assets/css/global.css'
// import '@/plugins/element'
import '@/utils/focus'
import '@/utils/filter'
// import 'default-passive-events'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
