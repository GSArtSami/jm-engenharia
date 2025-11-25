import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegionSelector from './components/RegionSelector';
import PropertiesPage from './pages/PropertiesPage';
import CookieConsent from './components/CookieConsent';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/imoveis/sp" replace />} />
          <Route path="/imoveis/:region" element={<PropertiesPage />} />
        </Routes>
        <CookieConsent />
      </BrowserRouter>
    </div>
  );
}

export default App;
