import http from '@/api/index'

// 城市查询
export function cityQuery (name) {
  return http.get(`city/name/${name}`)
}

// 单程航班查询
export function flightQuery (departCity, arriveCity, date) {
  return http.get(`flight/city/${departCity}/${arriveCity}/${date}`)
}

// 往返航班查询

// 航班号查询
export function flightNoQuery (flightNo, date) {
  return http.get(`flight/flightId/${flightNo}/${date}`)
}
