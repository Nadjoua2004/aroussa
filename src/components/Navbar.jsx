import {
  CheckCircle2,
  Crown,
  Download,
  Heart,
  Home,
  Sparkles,
  Store,
  Wand2,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useBridal } from '../context/BridalContext';

export default function Navbar({ onReplaySplash }) {
  const { brideProfile, favoritesCount, visitedCount } = useBridal();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      setShowInstallHelp(true);
    }
  };

  const navItems = [
    {
      to: '/',
      label: 'Accueil',
      icon: Home,
      end: true,
    },
    {
      to: '/boutiques',
      label: 'Boutiques',
      icon: Store,
    },
    {
      to: '/ma-liste',
      label: 'Ma Liste',
      icon: Heart,
      badge: favoritesCount > 0 ? favoritesCount : null,
    },
    {
      to: '/espace-partenaire',
      label: 'Ajouter',
      icon: Sparkles,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#FAF6F1]/90 backdrop-blur-md border-b border-[#EAD9D5]">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-[#F9E8EC] border border-[#E5C5CD] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Crown className="w-5 h-5 text-[#B86B7D]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif-bridal text-2xl font-semibold tracking-wide text-[#4A3B39]">
                  {brideProfile?.full_name || 'Sarah'}
                </span>
                <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#F9E8EC] text-[#B86B7D] font-semibold border border-[#EBCBD3]">
                  Princesse
                </span>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <nav className="hidden md:flex items-center gap-1 mr-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#F3D5DD]/80 text-[#4A3B39] border border-[#E3B8C3]'
                        : 'text-[#7D6A66] hover:text-[#4A3B39] hover:bg-[#F3ECE2]/60'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Bouton Baguette Magique (Rejouer l'animation Princesse) */}
            <button
              type="button"
              onClick={onReplaySplash}
              title="Animation Princesse Magique"
              className="w-9 h-9 rounded-full bg-[#FFFDFB] border border-[#EAD9D5] hover:border-[#D98A9C] flex items-center justify-center text-[#B86B7D] transition-transform hover:scale-105"
            >
              <Wand2 className="w-4 h-4" />
            </button>

            {/* Bouton Installer l'application PWA */}
            <button
              type="button"
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F9E8EC] hover:bg-[#F3D5DD] text-[#B86B7D] border border-[#E5C5CD] text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Installer l&apos;App</span>
            </button>

            <Link
              to="/ma-liste?tab=favoris"
              title="Mes Favoris"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#FFFDFB] border border-[#EAD9D5] text-xs font-medium text-[#4A3B39]"
            >
              <Heart className="w-3.5 h-3.5 text-[#D98A9C] fill-[#F3D5DD]" />
              <span>{favoritesCount}</span>
            </Link>

            <Link
              to="/ma-liste?tab=visites"
              title="Boutiques visitées"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#FFFDFB] border border-[#EAD9D5] text-xs font-medium text-[#4A3B39]"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#9B7E64]" />
              <span>{visitedCount}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Barre de navigation mobile PWA */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FFFDFB]/95 backdrop-blur-lg border-t border-[#EAD9D5] px-3 py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `relative flex flex-col items-center justify-center py-1.5 rounded-2xl transition-all ${
                    isActive
                      ? 'bg-[#F9E8EC] text-[#B86B7D] font-semibold'
                      : 'text-[#84706C] hover:text-[#4A3B39]'
                  }`
                }
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span className="text-[11px]">{item.label}</span>
                {item.badge ? (
                  <span className="absolute top-1 right-4 min-w-4 h-4 px-1 rounded-full bg-[#D98A9C] text-white text-[10px] flex items-center justify-center font-semibold">
                    {item.badge}
                  </span>
                ) : null}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Modale d'aide à l'installation PWA (iPhone / Android / Bureau) */}
      {showInstallHelp && (
        <div
          className="fixed inset-0 z-50 bg-[#2A1F1D]/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowInstallHelp(false)}
        >
          <div
            className="bg-[#FAF6F1] border border-[#EAD9D5] rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-princess"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#B86B7D]" />
                <h3 className="font-serif-bridal text-2xl font-semibold text-[#4A3B39]">
                  Installer l&apos;App de Sarah
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInstallHelp(false)}
                className="p-1 text-[#84706C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-[#6B5753]">
              <div className="p-3 rounded-2xl bg-[#FFFDFB] border border-[#EAD9D5]">
                <p className="font-semibold text-[#B86B7D] mb-1">📱 Sur iPhone (Safari) :</p>
                <p>
                  Appuie sur le bouton <strong>Partager</strong> en bas de l&apos;écran puis sur{' '}
                  <strong>&laquo; Sur l&apos;écran d&apos;accueil &raquo;</strong>.
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-[#FFFDFB] border border-[#EAD9D5]">
                <p className="font-semibold text-[#B86B7D] mb-1">✨ Sur Android / Chrome :</p>
                <p>
                  Ouvre le menu <strong>⋮</strong> en haut à droite puis choisis{' '}
                  <strong>&laquo; Installer l&apos;application &raquo;</strong>.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowInstallHelp(false)}
              className="w-full py-2.5 rounded-full bg-[#B86B7D] text-white text-xs font-medium"
            >
              Compris ✨
            </button>
          </div>
        </div>
      )}
    </>
  );
}
