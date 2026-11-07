import {
  CheckCircle2,
  Crown,
  Heart,
  Home,
  Sparkles,
  Store,
} from 'lucide-react';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useBridal } from '../context/BridalContext';

export default function Navbar() {
  const { brideProfile, favoritesCount, visitedCount } = useBridal();

  const navItems = [
    {
      to: '/',
      label: 'Catégories',
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
      badge: favoritesCount + visitedCount > 0 ? favoritesCount : null,
    },
    {
      to: '/espace-partenaire',
      label: 'Partenaires',
      icon: Sparkles,
    },
  ];

  return (
    <>
      {/* En-tête supérieur délicat Beige & Rose Princesse */}
      <header className="sticky top-0 z-30 bg-[#FAF6F1]/90 backdrop-blur-md border-b border-[#EAD9D5]">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-[#F9E8EC] border border-[#E5C5CD] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Crown className="w-5 h-5 text-[#B86B7D]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif-bridal text-2xl font-semibold tracking-wide text-[#4A3B39]">
                  {brideProfile?.full_name || 'Sarah'}
                </span>
                <span className="text-[11px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#F9E8EC] text-[#B86B7D] font-medium border border-[#EBCBD3]">
                  Mariée
                </span>
              </div>
              <p className="text-xs text-[#84706C]">Mon Carnet de Préparation</p>
            </div>
          </Link>

          {/* Navigation bureau + compteurs Favoris / Visités */}
          <div className="flex items-center gap-2 sm:gap-3">
            <nav className="hidden md:flex items-center gap-1 mr-2">
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

            <Link
              to="/ma-liste?tab=favoris"
              title="Mes boutiques favorites"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFDFB] border border-[#EAD9D5] hover:border-[#D98A9C] transition-colors text-xs font-medium text-[#4A3B39]"
            >
              <Heart className="w-3.5 h-3.5 text-[#D98A9C] fill-[#F3D5DD]" />
              <span>{favoritesCount}</span>
            </Link>

            <Link
              to="/ma-liste?tab=visites"
              title="Boutiques déjà visitées"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFDFB] border border-[#EAD9D5] hover:border-[#C5A387] transition-colors text-xs font-medium text-[#4A3B39]"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#9B7E64]" />
              <span>{visitedCount}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Barre de navigation mobile PWA en bas de l'écran */}
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
    </>
  );
}

