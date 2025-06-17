import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users/');
        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка получения пользователей:', err);
        if (err.response?.status === 403) {
          alert("У вас нет прав на просмотр");
          navigate('/dashboard');
        }
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        await api.delete(`/users/${userId}`);
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        console.error('Ошибка при удалении:', err);
        alert('Не удалось удалить пользователя');
      }
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="users-list-container">
      <div className="users-header">
        <h2>Список пользователей</h2>
        
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Логин</th>
            <th>Email</th>
            <th>Роль</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.login}</td>
              <td>{user.email}</td>
              <td>
                {user.id_r === 1 ? 'Администратор' : 
                 user.id_r === 2 ? 'Работник' : 'Пользователь'}
              </td>
              <td className="actions">
                <button 
                  className="edit-btn"
                  onClick={() => navigate(`/users/${user.id}`)}
                >
                  Просмотр
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(user.id)}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="header-actions">
          <button 
            className="back-btn"
            onClick={() => navigate('/dashboard')}
          >
            Назад в панель
          </button>
        </div>
    </div>
  );
};

export default Users;

// Стили
const styles = `
  .users-list-container {
    margin: 20px;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .loading {
    text-align: center;
    padding: 20px;
  }

  .users-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 15px;
  }

  .header-actions {
    display: flex;
    gap: 10px;
  }

  .users-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  .users-table th, .users-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  .users-table th {
    background-color: #f2f2f2;
    font-weight: 600;
  }

  .users-table tr:hover {
    background-color: #f5f5f5;
  }

  .actions {
    display: flex;
    gap: 5px;
  }

  button {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s;
  }

  .add-btn {
    background: #28a745;
    color: white;
  }

  .add-btn:hover {
    background: #218838;
  }

  .back-btn {
    background: #6c757d;
    color: white;
  }

  .back-btn:hover {
    background: #5a6268;
  }

  .edit-btn {
    background: #17a2b8;
    color: white;
  }

  .edit-btn:hover {
    background: #138496;
  }

  .delete-btn {
    background: #dc3545;
    color: white;
  }

  .delete-btn:hover {
    background: #c82333;
  }
`;

// Добавляем стили в документ
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);