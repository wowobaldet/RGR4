import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Dashboard.css'; // Стили (создайте файл)

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Панель управления</h1>
        <button onClick={handleLogout} className="logout-btn">
          Выйти
        </button>
      </header>

      <main className="dashboard-main">
        <div className="nav-card" onClick={() => navigate('/users/')}>
          <h2>Пользователи</h2>
          <p>Управление пользователями системы</p>
        </div>

        <div className="nav-card" onClick={() => navigate('/events')}>
          <h2>Мероприятия</h2>
          <p>Просмотр и создание мероприятий</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;