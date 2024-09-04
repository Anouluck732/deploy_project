import API from './api.service'

export default {
  login(email, password) {
    const url = '/login'
    const data = {
      email: email,
      password: password
    }
    return API().post(url, data)
  },
  signInWithGoogle() {
    const url = '/auth/google'
    return API().get(url)
  }
}
