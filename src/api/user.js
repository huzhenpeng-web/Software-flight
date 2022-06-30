import axios from 'axios'
// import qs from 'qs'

const server = axios.create({
  baseURL: 'http://192.168.31.50:8004/user/',
  headers: {
    'Content-Type': 'application/json'
  }
})

// 注册
export function registerUser (data) {
  return server.post('regist', JSON.stringify(data))
}

// 登录
export function loginUser (userName, password) {
  // const params = { userName: userName, password: password }
  return server.post(`login?userName=${userName}&password=${password}`)
}
