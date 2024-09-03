import axios from 'axios';

const base_url = import.meta.env.VITE_PUBLIC_API_BASE;

// Log the base URL for debugging
console.log('API Service Base URL:', base_url);

export default () => {
  return axios.create({ baseURL: base_url });
};
