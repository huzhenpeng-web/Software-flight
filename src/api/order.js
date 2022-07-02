import http from '@/api/index'
import store from '@/store/index'
const userId = store.state.user.id

export function getOrder () {
  return http.get(`status/${userId}`)
}

// 0待支付 1支付成功 //3已取消
export function classifyOrder (status) {
  return http.get(`status/all/${userId}/${status}`)
}

export function allOrder () {
  return http.get(`status/all/${userId}`)
}

// 结账
export function checkoutOrder (orderId) {
  return http.get(`pay/${orderId}`)
}

// 检查支付是否成功
export function checkOrder (orderId) {
  return http.get(`/pay/check/${orderId}`)
}

// 查询规则
export function queryTicketRule (tripType) {
  return http.get(`ticket/rule/${tripType}`)
}
