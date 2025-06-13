import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Events = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events/');
        setEvents(res.data);
      } catch (err) {
        console.error('Ошибка получения событий:', err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          window.location.href = '/login';
        }
      }
    };
    fetchEvents();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button 
          onClick={() => navigate('/dashboard')} 
          style={styles.backButton}
        >
          ← Назад
        </button>
        <h2 style={styles.title}>Список мероприятий</h2>
        <button 
          onClick={() => navigate('/events/form')} 
          style={styles.addButton}
        >
          + Добавить
        </button>
      </div>
      
      <ul style={styles.eventList}>
        {events.map(event => (
          <li key={event.id} style={styles.eventItem}>
            <a 
              href={`/events/${event.id}`} 
              style={styles.eventLink}
            >
              {event.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Стили
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    position: 'relative',
  },
  title: {
    color: '#2c3e50',
    margin: '0',
    flexGrow: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    position: 'absolute',
    left: '0',
  },
  addButton: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s',
    position: 'absolute',
    right: '0',
  },
  eventList: {
    listStyle: 'none',
    padding: '0',
  },
  eventItem: {
    padding: '12px 15px',
    marginBottom: '10px',
    backgroundColor: 'white',
    borderRadius: '4px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  eventLink: {
    textDecoration: 'none',
    color: '#3498db',
    fontSize: '16px',
  },
};

// Добавляем hover-эффекты
Object.assign(styles.backButton, {
  ':hover': {
    backgroundColor: '#5a6268',
  },
});

Object.assign(styles.addButton, {
  ':hover': {
    backgroundColor: '#218838',
  },
});

Object.assign(styles.eventItem, {
  ':hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
});

Object.assign(styles.eventLink, {
  ':hover': {
    textDecoration: 'underline',
  },
});

export default Events;