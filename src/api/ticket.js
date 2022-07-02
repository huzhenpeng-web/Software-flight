/* 票价规则 */
import http from '@/api/index'

// 获取票价规则
export function ticketPrice () {
  return http.get('ticket/price/info')
}

// 获取座位数
export function getSeat (id, date) {
  return http.get(`ticket/info/${id}/${date}`)
}

// 订票
export function orderTicket (data) {
  return http.post('ticket/robTicket', JSON.stringify(data))
}

// 退票
export function returnTicket (orderId) {
  return http.post('ticket/return/tickets', orderId)
}

// 改舱
export function changeSeat (orderId, seatType) {
  const data = {
    orderId: orderId,
    seatType: seatType
  }
  return http.post('ticket/change/tickets', JSON.stringify(data))
}

// 修改日期
export function changeDate (data) {
  return http.post('ticket/change/tickets/date', JSON.stringify(data))
}
