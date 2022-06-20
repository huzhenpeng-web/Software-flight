import Vue from 'vue'

Vue.directive('focus', { // 获取焦点
  inserted: function (el) {
    if (el.querySelector('input')) {
      el.querySelector('input').focus()
    }
  }
})
