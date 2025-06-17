import React, { useEffect, useState } from 'react';
import { BackupAPI, UserAPI } from '../api';
import { useNavigate } from 'react-router-dom';
import './Backups.css'; 

const Backups = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchBackups = async () => {
    setLoading(true);
    const { success, data, error } = await BackupAPI.manageBackups('list');
    
    if (success) {
      setBackups(data);
      setError(null);
    } else {
      setError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleCreate = async () => {
    setLoading(true);
    const { success, error } = await BackupAPI.manageBackups('create');
    
    if (success) {
      alert('Бэкап успешно создан!');
      await fetchBackups();
    } else {
      alert(error);
    }
    setLoading(false);
  };

  const handleRestore = async (filename) => {
    if (window.confirm(`Восстановить базу из ${filename}? ВНИМАНИЕ: Все текущие данные будут удалены!`)) {
      setLoading(true);
      const { success, error } = await BackupAPI.manageBackups('restore', { filename });
      
      alert(success ? 'База успешно восстановлена!' : error);
      setLoading(false);
    }
  };

  const formatSize = (bytes) => {
    const mb = bytes / (1024 * 1024);
    return mb > 1 ? `${mb.toFixed(2)} MB` : `${(bytes/1024).toFixed(2)} KB`;
  };

  return (
    <div className="backups-container">
      <h2>Управление бэкапами</h2>
      
      {error && <div className="error">{error}</div>}
      
      <div className="controls">
        <button 
          onClick={handleCreate} 
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Создание...' : 'Создать бэкап'}
        </button>
        <button 
          onClick={() => navigate("/dashboard")}
          className="btn btn-return"
        >
          Вернуться
        </button>
      </div>

      {loading && backups.length === 0 ? (
        <div className="loading">Загрузка списка бэкапов...</div>
      ) : (
        <table className="backups-table">
          <thead>
            <tr>
              <th>Имя файла</th>
              <th>Размер</th>
              <th>Дата создания</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {backups.map(backup => (
              <tr key={backup.name}>
                <td>{backup.name}</td>
                <td>{formatSize(backup.size)}</td>
                <td>{new Date(backup.created_at).toLocaleString()}</td>
                <td>
                  <button 
                    onClick={() => handleRestore(backup.name)}
                    disabled={loading}
                    className="btn btn-warning"
                  >
                    Восстановить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Backups;