import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './login.css';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { login, password });
      localStorage.setItem('token', res.data.access_token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Ошибка входа:', error);
      setError(error.response?.data?.detail || 'Неверный логин или пароль');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className="form-title">Вход в систему</h1>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="login" className="form-label">Логин</label>
            <input
              id="login"
              type="text"
              className="form-input"
              placeholder="Введите ваш логин"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Пароль</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Введите ваш пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-button">
            <i className="fas fa-sign-in-alt"></i> Войти
          </button>
        </form>

        <div className="login-footer">
          <p>Нет аккаунта? <a href="/register">Зарегистрируйтесь</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;