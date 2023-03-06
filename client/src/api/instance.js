import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const apiInstance = axios.create({ baseURL: BASE_URL });

apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = JSON.parse(token);
  } else {
    config.headers.Authorization = null;
  }

  return config;
});
