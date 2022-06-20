/* 全局过滤器 */
import Vue from 'vue'

// 时间格式过滤器
Vue.filter('timeFormat', (val) => {
  return val.slice(0, 5)
})
