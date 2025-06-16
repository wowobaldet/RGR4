import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',  // Адрес FastAPI сервера
  headers: {
    'Content-Type': 'application/json',
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

// Перехватчик ответов для обработки ошибок
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

// Методы для работы с бэкапами
const BackupAPI = {
  /**
   * Создает новый бэкап базы данных
   * @returns {Promise<{status: string, filename: string}>}
   */
  createBackup: async () => {
    try {
      const response = await api.post('/backups');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Ошибка при создании бэкапа');
    }
  },

  /**
   * Получает список всех бэкапов
   * @returns {Promise<Array<{filename: string, created_at: string, size: number}>>}
   */
  getBackups: async () => {
    try {
      const response = await api.get('/backups');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Ошибка при получении списка бэкапов');
    }
  },

  /**
   * Восстанавливает базу из бэкапа
   * @param {string} filename - Имя файла бэкапа
   * @returns {Promise<{status: string}>}
   */
  restoreBackup: async (filename) => {
    try {
      const response = await api.post('/backups/restore', { filename });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Ошибка при восстановлении бэкапа');
    }
  },

  /**
   * Удаляет бэкап
   * @param {string} filename - Имя файла бэкапа
   * @returns {Promise<{status: string}>}
   */
  deleteBackup: async (filename) => {
    try {
      const response = await api.delete(`/backups/${filename}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Ошибка при удалении бэкапа');
    }
  },

  /**
   * Скачивает файл бэкапа
   * @param {string} filename - Имя файла бэкапа
   * @returns {Promise<Blob>}
   */
  downloadBackup: async (filename) => {
    try {
      const response = await api.get(`/backups/download/${filename}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Ошибка при скачивании бэкапа');
    }
  }
};

// Экспортируем как основной API и отдельно методы для бэкапов
export { BackupAPI };
export default api;