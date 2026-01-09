import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import SimulationPage from './pages/SimulationPage';
import LandPage from './pages/LandPage';
import LandDetailPage from './pages/LandDetailPage';
import ConstructionPage from './pages/ConstructionPage';
import ConstructionDetailPage from './pages/ConstructionDetailPage';
import AppointmentPage from './pages/AppointmentPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProperties from './pages/AdminProperties';
import AdminLands from './pages/AdminLands';
import AdminConstructions from './pages/AdminConstructions';
import AdminAppointments from './pages/AdminAppointments';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminSimulations from './pages/AdminSimulations';
import CookieConsent from './components/CookieConsent';

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/imoveis" element={<PropertiesPage />} />
            <Route path="/imoveis/:id" element={<PropertyDetailPage />} />
            <Route path="/simulacao" element={<SimulationPage />} />
            <Route path="/terrenos" element={<LandPage />} />
            <Route path="/terrenos/:id" element={<LandDetailPage />} />
            <Route path="/construcao" element={<ConstructionPage />} />
            <Route path="/construcao/:id" element={<ConstructionDetailPage />} />
            <Route path="/agendar" element={<AppointmentPage />} />
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/properties" element={<AdminProperties />} />
            <Route path="/admin/lands" element={<AdminLands />} />
            <Route path="/admin/constructions" element={<AdminConstructions />} />
            <Route path="/admin/appointments" element={<AdminAppointments />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/simulations" element={<AdminSimulations />} />
          </Routes>
          <CookieConsent />
        </BrowserRouter>
      </div>
    </ErrorBoundary>
  );
}

export default App;
