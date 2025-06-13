import React, { useEffect, useState } from 'react';
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './EventDetail.module.css';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data);
        setEditedEvent(res.data);
      } catch (err) {
        console.error('Ошибка получения события:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          window.location.href = '/login';
        }
      }
    };

    fetchEvent();
  }, [id]);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      await api.put(`/events/${id}`, editedEvent);
      setEvent(editedEvent);
      setIsEditing(false);
    } catch (err) {
      console.error('Ошибка при обновлении события:', err);
    }
  };

  const handleCancel = () => {
    setEditedEvent(event);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent(prev => ({ ...prev, [name]: value }));
  };

  if (!event) return <p>Загрузка...</p>;

  return (
    <div className={styles.container}>
      {isEditing ? (
        <div>
          <h2 className={styles.header}>Редактирование мероприятия</h2>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Название:</label>
            <input
              type="text"
              name="name"
              value={editedEvent.name || ''}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Дата:</label>
            <input
              type="date"
              name="date"
              value={editedEvent.date || ''}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Время:</label>
            <input
              type="time"
              name="time"
              value={editedEvent.time || ''}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Продолжительность (ч.):</label>
            <input
              type="number"
              name="duration"
              value={editedEvent.duration || ''}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Тип:</label>
            <input
              type="text"
              name="type"
              value={editedEvent.type || ''}
              onChange={handleChange}
              className={styles.formInput}
            />
          </div>
          
          <div className={styles.buttonGroup}>
            <button onClick={handleSave} className={`${styles.button} ${styles.buttonPrimary}`}>
              Сохранить
            </button>
            <button onClick={handleCancel} className={`${styles.button} ${styles.buttonSecondary}`}>
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className={styles.header}>{event.name}</h2>
          <p className={styles.detailItem}>
            <span className={styles.detailLabel}>Дата:</span> {event.date}
          </p>
          <p className={styles.detailItem}>
            <span className={styles.detailLabel}>Время:</span> {event.time}
          </p>
          <p className={styles.detailItem}>
            <span className={styles.detailLabel}>Продолжительность:</span> {event.duration} ч.
          </p>
          <p className={styles.detailItem}>
            <span className={styles.detailLabel}>Тип:</span> {event.type}
          </p>

          <div className={styles.buttonGroup}>
            <button onClick={() => navigate(-1)} className={`${styles.button} ${styles.buttonSecondary}`}>
              Назад
            </button>
            <button onClick={handleEdit} className={`${styles.button} ${styles.buttonPrimary}`}>
              Редактировать
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;