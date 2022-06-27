/* 订单 */
import axios from 'axios'

const http = axios.create({
  baseURL: 'http://192.168.31.50:8003/order',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export function getOrder () {
  return http.get('status/1')
}

// 0待支付 1支付成功
export function classifyOrder (status) {
  return http.get(`status/all/1/${status}`)
}

export function allOrder () {
  return http.get('status/all/1')
}

// 结账
export function checkoutOrder (orderId) {
  return http.get(`pay/${orderId}`)
}

// 检查支付是否成功
export function checkOrder (orderId) {
  return http.get(`/pay/check/${orderId}`)
}
