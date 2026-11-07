import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import { BridalProvider } from './context/BridalContext';
import HomePage from './pages/HomePage';
import MyListPage from './pages/MyListPage';
import PartnerSpacePage from './pages/PartnerSpacePage';
import ShopDetailPage from './pages/ShopDetailPage';
import ShopsCatalogPage from './pages/ShopsCatalogPage';

export default function App() {
  return (
    <BridalProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#FAF6F1] text-[#4A3B39]">
          <Navbar />
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

