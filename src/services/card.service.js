import API from './api.service'

export default {
  getCart(user_id) {
    const url = `/cart/list/${user_id}`
    return API().get(url)
  },
  createCart(body) {
    const url = '/cart/create'
    return API().post(url, body)
  },
  deleteCart(cart_id) {
    const url = `/cart/delete/${cart_id}`
    return API().delete(url) // Removed `cid` from the params
  },
  getTotal(user_id) {
    const url = `/cart/total/${user_id}`
    return API().get(url)
  }
}
