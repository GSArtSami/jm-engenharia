import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import SimulationPage from './pages/SimulationPage';
import LandPage from './pages/LandPage';
import ConstructionPage from './pages/ConstructionPage';
import CookieConsent from './components/CookieConsent';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/imoveis" element={<PropertiesPage />} />
          <Route path="/simulacao" element={<SimulationPage />} />
          <Route path="/terrenos" element={<LandPage />} />
          <Route path="/construcao" element={<ConstructionPage />} />
        </Routes>
        <CookieConsent />
      </BrowserRouter>
    </div>
  );
}

export default App;
