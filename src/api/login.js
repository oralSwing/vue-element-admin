import request from '@/utils/request'
export function loginByUsername(username, password) {
  const data = {
    userName: username,
    password
  }
  return request.get('api/User/login', { params: data })
}

export function logout() {
  return new Promise((resolve, reject) => {
    resolve()
  })
}
