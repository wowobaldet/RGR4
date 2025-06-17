import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import './Events.css'

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

  const handleDelete = async (eventId) => {
    try {
      await api.delete(`/events/${eventId}/`);
      setEvents(events.filter(event => event.id !== eventId));
    } catch (err) {
      console.error('Ошибка удаления события:', err);
    }
  };

  return (
    <div className="events-container">
      <div className="events-header">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="back-btn"
        >
          ← Назад
        </button>
        <h2>Список мероприятий</h2>
        <button 
          onClick={() => navigate('/events/form')} 
          className="add-btn"
        >
          + Добавить
        </button>
      </div>
      
      <div className="events-table-container">
        <table className="events-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td>
                  <a 
                    href={`/events/${event.id}`} 
                    className="event-link"
                  >
                    {event.name}
                  </a>
                </td>
                <td className="actions">
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(event.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Events;