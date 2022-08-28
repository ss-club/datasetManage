import axios from "axios"

const  request = axios.create({
    timeout: 5000 
})
//请求拦截器
request.interceptors.request.use(
    config => {
      // Do something before request is sent
      let url = config.url
      if(url === "/api/upload") {
        config.headers["content-type"] = "multipart/form-data"
      }
      const token = window.localStorage.getItem('token')
      token && (config.headers.Authorization = `Bearer ${token}`) // 在请求头中设置 Authorization:Bearer token
      return config
    },
    err => {
      return Promise.reject(err);
    }
  )

export default request