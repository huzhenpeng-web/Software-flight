import axios from 'axios'
import store from '@/store/index'

axios.interceptors.request.use((config) => {
  config.headers.Authorization = store.state.token
  return config
})

const http = axios.create({
  baseURL: 'http://47.114.90.231:9527/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default http
