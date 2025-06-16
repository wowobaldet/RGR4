import React, { useEffect, useState } from 'react';
import api from '../api';

const Backups = () => {
  const [backups, setBackups] = useState([]);
  const [error, setError] = useState(null);

  const fetchBackups = async () => {
    try {
      const response = await api.get('/backups/list');
      setBackups(response.data);
      setError(null);
    } catch (err) {
      setError('Не удалось загрузить бэкапы');
      console.error('Backup error:', err);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleCreate = async () => {
    try {
      await api.post('/backups/create');
      alert('Бэкап создан!');
      fetchBackups(); // Обновляем список
    } catch (err) {
      alert('Ошибка при создании бэкапа');
    }
  };

  const handleRestore = async (filename) => {
    if (window.confirm(`Восстановить ${filename}?`)) {
      try {
        await api.post('/backups/restore', { filename });
        alert('База восстановлена!');
      } catch (err) {
        alert('Ошибка восстановления');
      }
    }
  };

  return (
    <div>
      <h2>Управление бэкапами</h2>
      {error && <div className="error">{error}</div>}
      
      <button onClick={handleCreate}>Создать бэкап</button>

      <ul>
        {backups.map((backup) => (
          <li key={backup.name}>
            {backup.name} ({backup.size})
            <button onClick={() => handleRestore(backup.name)}>
              Восстановить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Backups;