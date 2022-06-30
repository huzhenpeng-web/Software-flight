import axios from 'axios'
import store from '@/store/index'

// axios.interceptors.request.use((config) => {
//   config.headers.Authorization = this.$store.state.token
//   return config
// })

const http = axios.create({
  baseURL: 'http://192.168.31.50:8000/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    token: store.state.token
  }
})

export default http
