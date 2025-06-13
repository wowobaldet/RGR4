import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const EventForm = ({ eventId }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [type, setType] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (eventId) {
        await api.put(`/events/${eventId}`, { name, date, time, duration, type });
      } else {
        await api.post('/events/', { name, date, time, duration, type });
      }

      navigate('/events');
    } catch (err) {
      console.error('Ошибка при отправке формы:', err);
      alert('Не удалось сохранить данные. Проверьте подключение к API.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{eventId ? 'Редактировать' : 'Создать'} событие</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Название:
          <input 
            style={styles.input}
            value={name} 
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        
        <label style={styles.label}>
          Дата:
          <input 
            type="date"
            style={styles.input}
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        
        <label style={styles.label}>
          Время:
          <input 
            type="time"
            style={styles.input}
            value={time} 
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </label>
        
        <label style={styles.label}>
          Продолжительность (часы):
          <input 
            type="number"
            style={styles.input}
            value={duration} 
            onChange={(e) => setDuration(e.target.value)}
            min="1"
            required
          />
        </label>
        
        <label style={styles.label}>
          Тип:
          <input 
            style={styles.input}
            value={type} 
            onChange={(e) => setType(e.target.value)}
            required
          />
        </label>
        
        <div style={styles.buttonContainer}>
          <button 
            type="button"
            style={styles.cancelButton}
            onClick={() => navigate('/events')}
          >
            Отмена
          </button>
          <button 
            type="submit"
            style={styles.submitButton}
          >
            Сохранить
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    color: '#343a40',
    textAlign: 'center',
    marginBottom: '25px',
    paddingBottom: '10px',
    borderBottom: '2px solid #007bff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    fontWeight: '500',
    color: '#495057',
    gap: '5px',
    fontSize: '16px',
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    fontSize: '16px',
    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
  },
  inputFocus: {
    outline: 'none',
    borderColor: '#80bdff',
    boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default EventForm;