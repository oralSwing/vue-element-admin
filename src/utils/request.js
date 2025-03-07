import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
// import { duration } from 'moment'
// import qs from 'qs'
// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 15000 // request timeout
})

// request interceptor拦截器
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      config.headers.Authorization = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor拦截器
service.interceptors.response.use(
  response => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  //   response => {
  //     if (response.status === 401) {
  //       // 请自行在引入 MessageBox
  //       // import { Message, MessageBox } from 'element-ui'
  //       Message.confirm(
  //         '你已被登出，可以取消继续留在该页面，或者重新登录',
  //         '确定登出',
  //         {
  //           confirmButtonText: '重新登录',
  //           cancelButtonText: '取消',
  //           type: 'warning'
  //         }
  //       ).then(() => {
  //         store.dispatch('FedLogOut').then(() => {
  //           location.reload() // 为了重新实例化vue-router对象 避免bug
  //         })
  //       })
  //     } else if (response.status === 403) {
  //       Message.error('无权进行此操作')
  //     }
  //     return response
  //     // const res = response.data
  //     // if (res.code !== 20000) {
  //     //   Message({
  //     //     message: res.message,
  //     //     type: 'error',
  //     //     duration: 5 * 1000
  //     //   })
  //     //   // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //     //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //     //     // 请自行在引入 MessageBox
  //     //     // import { Message, MessageBox } from 'element-ui'
  //     //     Message.confirm(
  //     //       '你已被登出，可以取消继续留在该页面，或者重新登录',
  //     //       '确定登出',
  //     //       {
  //     //         confirmButtonText: '重新登录',
  //     //         cancelButtonText: '取消',
  //     //         type: 'warning'
  //     //       }
  //     //     ).then(() => {
  //     //       store.dispatch('FedLogOut').then(() => {
  //     //         location.reload() // 为了重新实例化vue-router对象 避免bug
  //     //       })
  //     //     })
  //     //   }
  //     //   return Promise.reject('error')
  //     // } else {
  //     //   return response.data
  //     // }
  //   },
  error => {
    console.log('err' + error) // for debug
    if (error.response.status === 401) {
      Message.error({ message: '权限验证失败，将跳转至登录页', duration: 2000 })
      store.dispatch('FedLogOut').then(() => {
        location.reload()
      }) // 为了重新实例化vue-router对象 避免bug
    } else if (error.response.status === 403) {
      Message.error('无权进行此操作')
      //   window.vm.$router.go(-1)
    }
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
