import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',  // Адрес твоего FastAPI сервера
  headers: {
  'Content-Type': 'application/json',  // Важно для FastAPI
  },
});

// Перехватчик запросов (автоматически добавляет Bearer токен)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;