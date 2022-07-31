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
export function goBackQuery (data) {
  return http.get(`flight/round/${data.flightId}/${data.departureCityName}/${data.arriveCityName}/${data.beforeDate}/${data.afterDate}`)
}

// 航班号查询
export function flightNoQuery (flightNo, date) {
  return http.get(`flight/flightId/${flightNo}/${date}`)
}

// flightId查询
export function flightIdQuery (data) {
  return http.get(`flight/id/${data.flightId}/${data.flightDate}`)
}

// 价格区间查询
export function flightPriceQuery (data) {
  return http.get(`flight/money/${data.departCityName}/${data.arriveCityName}/${data.originMoney}/${data.desMoney}/${data.date}`)
}

// 航班路线推荐
export function roadRecommend (departCityName, arriveCityName) {
  return http.get(`flight/recommend/${departCityName}/${arriveCityName}`, { timeout: 10 * 60 * 1000 })
}

// 地图航班查询
export function mapQuery (cityName) {
  return http.get(`flight/name/log/${cityName}`)
}
