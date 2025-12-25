import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './pages/App.tsx'
import POI from './pages/POI.tsx'
import Home from './pages/Home.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Amaralys" element={<App />} />
        <Route path="/Amaralys/:modelId" element={<POI />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
