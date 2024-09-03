import API from './api.service'

export default {
  gethistory(params, user_id) {
    const url = `/order/list/${user_id}`
    return API().get(url, { params: params })
  },
  createOrder(body) {
    const url = '/order/create'
    return API().post(url, body)
  },
  orderHistory(user_id) {
    const url = `/order/history/${user_id}`
    return API().get(url)
  }
}
