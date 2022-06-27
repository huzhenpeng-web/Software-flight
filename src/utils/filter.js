/* 全局过滤器 */
import Vue from 'vue'
import moment from 'moment'

// 时间格式过滤器
Vue.filter('timeFormat', (val) => {
  if (val) {
    return val.slice(0, 5)
  }
})

// 时间转为周几
Vue.filter('dateFormat', (val) => {
  moment.locale('zh-cn')
  const date = moment(val).format('LL')
  let week = moment(val).format('E')
  const dateArr = [
    ['1', '一'],
    ['2', '二'],
    ['3', '三'],
    ['4', '四'],
    ['5', '五'],
    ['6', '六'],
    ['7', '日']
  ]
  dateArr.forEach(item => {
    if (week === item[0]) {
      week = item[1]
    }
  })
  return date.slice(5, 10) + '周' + week
})

// 预订日期截取
Vue.filter('dateSplice', (val) => {
  if (val) {
    return val.slice(0, 10) + ' ' + val.slice(11, val.length)
  }
})
