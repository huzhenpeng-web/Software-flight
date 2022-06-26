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
