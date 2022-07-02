import http from '@/api/index'

// 注册
export function registerUser (data) {
  return http.post('user/regist', JSON.stringify(data))
}

// 登录
export function loginUser (userName, password) {
  return http.post(`user/login?userName=${userName}&password=${password}`)
}
