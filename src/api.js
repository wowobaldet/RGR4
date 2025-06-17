// api.js (Frontend)
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик запросов
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Перехватчик ответов
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        message: error.response.data?.detail || 'Unknown error',
      });
    } else {
      console.error('API Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

const BackupAPI = {
  manageBackups: async (action, params = {}) => {
    try {
      let response;
      
      switch (action) {
        case 'list':
          response = await api.get('/backups');
          return { 
            success: true, 
            data: response.data 
          };
          
        case 'create':
          response = await api.post('/backups', { action: 'create' });
          return { 
            success: true, 
            data: response.data 
          };
          
        case 'restore':
          response = await api.post('/backups', { 
            action: 'restore',
            filename: params.filename,
            clean: true
          });
          return { 
            success: true, 
            data: response.data 
          };
          
        default:
          return { 
            success: false, 
            error: 'Неизвестное действие' 
          };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || error.message 
      };
    }
  },
 
};

const UserAPI = {
  getCurrentUser: async () => {
    try {
      const response = await api.get('/me');
      return response.data;
    } catch (error) {
      console.error('Ошибка получения данных пользователя:', error);
      throw error;
    }
  },

  checkIsAdmin: async () => {
    try {
      const user = await UserAPI.getCurrentUser();
      return user.id_r === 1;
    } catch (error) {
      if (error.response?.status === 401) {
        return false;
      }
      throw error;
    }
  },
};

export { BackupAPI, UserAPI };
export default api;