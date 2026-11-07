import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import TopAppBar, { BottomTabBar } from './components/Navbar';
import {
  DisneySparklesOverlay,
  PrincessOpeningSplash,
} from './components/PrincessMagic';
import { BridalProvider } from './context/BridalContext';
import HomePage from './pages/HomePage';
import LandingInstallPage from './pages/LandingInstallPage';
import MyListPage from './pages/MyListPage';
import PartnerSpacePage from './pages/PartnerSpacePage';
import ShopDetailPage from './pages/ShopDetailPage';
import ShopsCatalogPage from './pages/ShopsCatalogPage';

function detectStandalonePwa() {
  if (typeof window === 'undefined') return false;
  const isStandaloneDisplay = window.matchMedia?.('(display-mode: standalone)')?.matches;
  const isIosStandalone = window.navigator?.standalone === true;
  const hasPwaParam = new URLSearchParams(window.location.search).get('pwa') === '1';
  const unlockedSession = sessionStorage.getItem('sarah_pwa_unlocked') === '1';
  return Boolean(isStandaloneDisplay || isIosStandalone || hasPwaParam || unlockedSession);
}

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPwaMode, setIsPwaMode] = useState(detectStandalonePwa);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia?.('(display-mode: standalone)');
    const handleChange = (e) => {
      if (e.matches) setIsPwaMode(true);
    };
    mediaQuery?.addEventListener?.('change', handleChange);
    return () => mediaQuery?.removeEventListener?.('change', handleChange);
  }, []);

  const isInstallRoute = location.pathname === '/install';

  const handleEnterFullApp = () => {
    sessionStorage.setItem('sarah_pwa_unlocked', '1');
    setIsPwaMode(true);
    setShowSplash(true);
    if (isInstallRoute) {
      navigate('/', { replace: true });
    }
  };

  // Si on est sur le lien dédié /install OU sur le navigateur web (non installé en PWA) :
  // Affiche la Landing Page minimaliste (uniquement les catégories + bouton d'installation PWA)
  if (isInstallRoute || !isPwaMode) {
    return (
      <>
        <DisneySparklesOverlay />
        <LandingInstallPage onEnterFullApp={handleEnterFullApp} />
      </>
    );
  }

  // Mode PWA installée : Coque d'application mobile native fixe (aucun mouvement gauche/droite)
  return (
    <div className="fixed inset-0 h-[100dvh] w-full max-w-full overflow-hidden flex flex-col bg-[#FAF6F1] text-[#4A3B39]">
      {showSplash && (
        <PrincessOpeningSplash onFinish={() => setShowSplash(false)} />
      )}
      <DisneySparklesOverlay />

      <TopAppBar onReplaySplash={() => setShowSplash(true)} />

      <main className="flex-1 w-full native-app-scroll">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/boutiques" element={<ShopsCatalogPage />} />
          <Route path="/boutique/:slug" element={<ShopDetailPage />} />
          <Route path="/ma-liste" element={<MyListPage />} />
          <Route path="/espace-partenaire" element={<PartnerSpacePage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      <BottomTabBar />
    </div>
  );
}

export default function App() {
  return (
    <BridalProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </BridalProvider>
  );
}
