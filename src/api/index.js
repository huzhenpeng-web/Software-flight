import axios from 'axios'

// axios.interceptors.request.use((config) => {
//   config.headers.Authorization = this.$store.state.token
//   return config
// })

const http = axios.create({
  baseURL: 'http://192.168.31.50:8000/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default http
