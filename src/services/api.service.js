import axios from 'axios';

const base_url = import.meta.env.VITE_PUBLIC_API_BASE;
console.log('API Service Base URL:', base_url);

const api = axios.create({ baseURL: base_url });

// Function to refresh the token
const refreshToken = async () => {
  try {
    const response = await api.get('//refresh-token', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
      }
    });
    const { token, refreshToken } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    return token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    // Handle refresh token failure (e.g., logout user)
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
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh failure (e.g., redirect to login)
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default () => api;