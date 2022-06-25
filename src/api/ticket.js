/* 票价规则 */
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://192.168.31.50:8001/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 获取票价规则
export function ticketPrice () {
  return api.get('ticket/price/info')
}

// 获取座位数
export function getSeat (id, date) {
  return api.get(`ticket/info/${id}/${date}`)
}

// 订票
export function orderTicket (data) {
  return api.post('ticket/robTicket', JSON.stringify(data))
}
