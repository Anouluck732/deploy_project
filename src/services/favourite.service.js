import API from './api.service'

export default {
  getFavourite(params, user_id) {
    const url = `/favorite/list/${user_id}`
    return API().get(url, { params: params })
  },
  createFavourite(body) {
    const url = '/favorite/create'
    return API().post(url, body)
  },
  deleteFavourite(fid) {
    const url = `/favorite/delete/${fid}`
    return API().delete(url, fid)
  }
}
