import React, { useEffect, useState } from 'react';
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    login: '',
    email: '',
    id_r: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setUser(res.data);
        setFormData({
          login: res.data.login,
          email: res.data.email,
          id_r: res.data.id_r
        });
      } catch (err) {
        console.error('Ошибка получения пользователя:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert("У вас нет прав для редактирования")
          navigate('/dashboard')
        }
      }
    };

    fetchUser();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'id_r' ? parseInt(value) : value
    }));
  };

  const handleSave = async () => {
    try {
      await api.put(`/users/${id}`, formData);
      setUser({ ...user, ...formData });
      setIsEditing(false);
    } catch (err) {
      console.error('Ошибка при обновлении:', err);
      alert('Не удалось обновить данные');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        await api.delete(`/users/${id}`);
        navigate('/users');
      } catch (err) {
        console.error('Ошибка при удалении:', err);
        alert('Не удалось удалить пользователя');
      }
    }
  };

  if (!user) return <div className="loading">Загрузка...</div>;

  return (
    <div className="user-detail-container">
      <h2>Детали пользователя</h2>
      
      {isEditing ? (
        <div className="edit-form">
          <label>
            Логин:
            <input 
              name="login"
              value={formData.login} 
              onChange={handleInputChange} 
            />
          </label>
          <label>
            Email:
            <input 
              name="email"
              value={formData.email} 
              onChange={handleInputChange} 
            />
          </label>
          <label>
            Роль:
            <select 
              name="id_r"
              value={formData.id_r} 
              onChange={handleInputChange}
            >
              <option value="3">Обычный пользователь</option>
              <option value="2">Работник</option>
              <option value="1">Администратор</option>
            </select>
          </label>
          <div className="button-group">
            <button className="save-btn" onClick={handleSave}>Сохранить</button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>Отмена</button>
          </div>
        </div>
      ) : (
        <div className="user-info">
          <p><strong>Логин:</strong> {user.login}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Роль:</strong> 
            {user.id_r === 1 ? ' Администратор' : 
             user.id_r === 2 ? ' Работник' : ' Обычный пользователь'}
          </p>
        </div>
      )}

      <div className="button-group">
        {!isEditing && (
          <>
            <button className="edit-btn" onClick={() => setIsEditing(true)}>Редактировать</button>
            <button className="delete-btn" onClick={handleDelete}>Удалить</button>
          </>
        )}
        <button className="back-btn" onClick={() => navigate(-1)}>Назад</button>
      </div>
    </div>
  );
};

export default UserDetail;

// Стили
const styles = `
  .user-detail-container {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .loading {
    text-align: center;
    padding: 20px;
  }

  .user-info {
    margin-bottom: 20px;
  }

  .user-info p {
    margin: 10px 0;
    padding: 8px;
    background: white;
    border-radius: 4px;
  }

  .edit-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 20px;
  }

  .edit-form label {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .edit-form input, .edit-form select {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .button-group {
    display: flex;
    gap: 10px;
    margin-top: 15px;
  }

  button {
    padding: 8px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.2s;
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

  .save-btn {
    background: #28a745;
    color: white;
  }

  .save-btn:hover {
    background: #218838;
  }

  .cancel-btn {
    background: #ffc107;
    color: #212529;
  }

  .cancel-btn:hover {
    background: #e0a800;
  }
`;

// Добавляем стили в документ
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);