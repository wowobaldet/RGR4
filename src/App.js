import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Импортируем компоненты
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Users from './pages/Users';
import EventDetail from './pages/Eventdetail';
import EventForm from './pages/Eventform';
import UserDetail from './pages/Userdetail';
import PrivateRoute from './components/PrivateRoute';
import Backups from './pages/Backups';

function App() {
  return (
    <Router>
      <Routes>
        {/* Общие маршруты */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PrivateRoute />}>
    <Route path="/" element={<Dashboard />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/events" element={<Events />} />
    <Route path="/events/:id" element={<EventDetail />} />
    <Route path="/events/form" element={<EventForm />} />
    <Route path="/users/" element={<Users />} />
    <Route path="/users/:id" element={<UserDetail />} />
    <Route path="/backups" element={<Backups />} />
  </Route>
        {/* Неизвестный маршрут */}
        <Route path="*" element={<h2>Страница не найдена</h2>} />
      </Routes>
    </Router>
  );
}

export default App;