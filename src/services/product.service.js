import API from './api.service'

export default {
  getProduct(user_id, ptid = null, name = null) {
    const url = '/product/list'
    const params = { user_id }
    
    if (ptid !== null) {
      params.ptid = ptid
    }
    
    if (name !== null && name.trim() !== '') {
      params.name = name.trim()
    }
    
    return API().get(url, { params })
  },
  getProductid(pid) {
    console.log(pid)
    const url = `/product/detail/${pid}`
    return API().get(url)
  },
  getPopularProduct() {
    const url = '/product/popular'
    return API().get(url)
  }
}
