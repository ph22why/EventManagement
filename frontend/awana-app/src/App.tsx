import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import ReceiptPage from './components/ReceiptPage';
import AdminLoginPage from './components/admin/AdminLoginPage';
import AdminDashboard from './components/admin/AdminDashboard';
import ReceiptViewPage from './components/admin/receipts/ReceiptViewPage';
import ReceiptAddPage from './components/admin/receipts/ReceiptAddPage';
import EventCreatePage from './components/admin/events/EventCreatePage';
import EventManagePage from './components/admin/events/EventManagePage';
import EventEditPage from './components/admin/events/EventEditPage';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/receipt" element={<ReceiptPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/receipts/view" element={<ReceiptViewPage />} />
          <Route path="/admin/receipts/add" element={<ReceiptAddPage />} />
          <Route path="/admin/events/create" element={<EventCreatePage />} />
          <Route path="/admin/events/manage" element={<EventManagePage />} />
          <Route path="/admin/events/edit/:id" element={<EventEditPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 