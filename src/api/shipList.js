import request from '@/utils/request'
export function fetchList(query) {
  return request({
    url: '/api/ShipList/GetListPaged',
    method: 'get',
    params: query
  })
}

export function searchList(query) {
  return request({
    url: '/api/ShipList/GetSearchList',
    method: 'get',
    params: query
  })
}
export function getSameShipList(query) {
  return request({
    url: '/api/ShipList/GetSameShipList',
    method: 'get',
    params: query
  })
}

export function fetchSupplier(id) {
  return request({
    url: '/api/CoalSupplier/GetSupplierById',
    method: 'get',
    params: {
      id
    }
  })
}

export function createShipList(data) {
  return request({
    url: '/api/ShipList/Add',
    method: 'post',
    data
  })
}

export function createShipLists(data) {
  return request({
    url: '/api/ShipList/AddShipLists',
    method: 'post',
    data
  })
}

export function updateShipList(data) {
  return request({
    url: '/api/ShipList/UpdateInfo',
    method: 'put',
    data
  })
}
export function changeAbroadToMaodi(data) {
  return request({
    url: '/api/ShipList/ChangeAbroadToMaodi',
    method: 'post',
    data
  })
}
export function backStatus(data) {
  return request({
    url: '/api/ShipList/BackToAbroad',
    method: 'post',
    data
  })
}
export function changeToKaobo(data) {
  return request({
    url: '/api/ShipList/ChangeToKaobo',
    method: 'post',
    data
  })
}

export function deleteShipList(id) {
  return request({
    url: '/api/ShipList/Delete',
    method: 'delete',
    params: {
      id
    }
  })
}
export function getShipNameList() {
  return request({
    url: '/api/Ship/GetShipNameList',
    method: 'get'
  })
}
export function getCoalNameList() {
  return request({
    url: '/api/CoalVariety/GetCoalNameList',
    method: 'get'
  })
}
export function getSupplierNameList() {
  return request({
    url: '/api/CoalSupplier/GetSupplierNameList',
    method: 'get'
  })
}
export function logout() {
  return new Promise((resolve, reject) => {
    resolve()
  })
}
