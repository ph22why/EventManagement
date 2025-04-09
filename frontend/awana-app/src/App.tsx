import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './components/MainPage';
import ReceiptPage from './components/ReceiptPage';
import EventManagePage from './components/admin/events/EventManagePage';
import EventCreatePage from './components/admin/events/EventCreatePage';
import EventEditPage from './components/admin/events/EventEditPage';
import AdminDashboard from './components/admin/AdminDashboard';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/receipt" element={<ReceiptPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/events/manage" element={<EventManagePage />} />
        <Route path="/admin/events/create" element={<EventCreatePage />} />
        <Route path="/admin/events/edit/:id" element={<EventEditPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App; 