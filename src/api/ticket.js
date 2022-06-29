/* 票价规则 */
import axios from 'axios'
// import qs from 'qs'

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

// 退票
export function returnTicket (orderId) {
  return api.post('ticket/return/tickets', orderId)
}

// 改舱
export function changeSeat (orderId, seatType) {
  const data = {
    orderId: orderId,
    seatType: seatType
  }
  return api.post('ticket/change/tickets', JSON.stringify(data))
}

// 修改日期
export function changeDate (data) {
  return api.post('ticket/change/tickets/date', JSON.stringify(data))
}
