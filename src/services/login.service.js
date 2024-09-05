import API from './api.service';

export default {
  login(email, password) {
    const url = '/login';
    const data = { email, password };
    return API().post(url, data);
  },
  signInWithGoogle() {
    const url = '/auth/google';
    return API().get(url);
  },
  register(body) {
    const url = '/user/create';
    return API().post(url, body);
  },
  changePassword(userId, body) {
    const url = `/user/update-password/${userId}`; 
    return API().patch(url, body);
  },
};
