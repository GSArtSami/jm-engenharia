import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegionSelector from './components/RegionSelector';
import PropertiesPage from './pages/PropertiesPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RegionSelector />} />
          <Route path="/imoveis/:region" element={<PropertiesPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
