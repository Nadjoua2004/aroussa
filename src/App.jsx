import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import {
  DisneySparklesOverlay,
  PrincessOpeningSplash,
} from './components/PrincessMagic';
import { BridalProvider } from './context/BridalContext';
import HomePage from './pages/HomePage';
import MyListPage from './pages/MyListPage';
import PartnerSpacePage from './pages/PartnerSpacePage';
import ShopDetailPage from './pages/ShopDetailPage';
import ShopsCatalogPage from './pages/ShopsCatalogPage';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <BridalProvider>
      <BrowserRouter>
        {showSplash && (
          <PrincessOpeningSplash onFinish={() => setShowSplash(false)} />
        )}
        <DisneySparklesOverlay />
        <div className="min-h-screen flex flex-col bg-[#FAF6F1] text-[#4A3B39] relative z-10">
          <Navbar onReplaySplash={() => setShowSplash(true)} />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/boutiques" element={<ShopsCatalogPage />} />
              <Route path="/boutique/:slug" element={<ShopDetailPage />} />
              <Route path="/ma-liste" element={<MyListPage />} />
              <Route path="/espace-partenaire" element={<PartnerSpacePage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </BridalProvider>
  );
}
