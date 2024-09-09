import axios from 'axios';

const BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE;
console.log('API Service Base URL:', BASE_URL);

const api = axios.create({ baseURL: BASE_URL });

const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.error('No refresh token available in localStorage');
      throw new Error('No refresh token available');
    }

    console.log('Attempting to refresh token with:', refreshToken);

    const response = await axios.post(`${BASE_URL}/refresh-token`, 
      { refreshToken }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`  // Some APIs expect the refresh token in the Authorization header
        }
      }
    );

    console.log('Refresh token response:', response.data);

    const { token, newRefreshToken } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', newRefreshToken || refreshToken);  // Use new refresh token if provided, otherwise keep the old one
    return token;
  } catch (error) {
    console.error('Error refreshing token:', error.response ? error.response.data : error.message);
    if (error.response && error.response.status === 400) {
      console.error('Bad request when refreshing token. Server response:', error.response.data);
    }
    // Don't remove tokens here, let the calling code decide what to do
    throw error;
  }
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        // Let the calling code handle the error
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default ()=>api;