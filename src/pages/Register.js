import React, { useState } from 'react';
import api from '../api';
import './register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    email: '',
    id_r: 3
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'id_r' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      await api.post('/users/register', formData);
      alert('Регистрация успешна!');
      window.location.href = '/login';
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      setError(error.response?.data?.detail || 'Не удалось зарегистрироваться');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Создать аккаунт</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="login" className="form-label">Логин</label>
            <input
              id="login"
              name="login"
              type="text"
              className="form-input"
              value={formData.login}
              onChange={handleChange}
              required
              minLength="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Пароль</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">Роль</label>
            <select
              id="role"
              name="id_r"
              className="form-select"
              value={formData.id_r}
              onChange={handleChange}
            >
              <option value="3">Обычный пользователь</option>
              <option value="2">Работник</option>
              <option value="1">Администратор</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="spinner"></span>
            ) : (
              'Зарегистрироваться'
            )}
          </button>
        </form>

        <div className="login-link">
          Уже есть аккаунт? <a href="/login">Войти</a>
        </div>
      </div>
    </div>
  );
};

export default Register;