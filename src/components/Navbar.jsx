import {
  CheckCircle2,
  Crown,
  Heart,
  Home,
  Sparkles,
  Store,
  Wand2,
} from 'lucide-react';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useBridal } from '../context/BridalContext';

export default function TopAppBar({ onReplaySplash }) {
  const { brideProfile, favoritesCount, visitedCount } = useBridal();

  return (
    <header className="shrink-0 z-30 bg-[#FAF6F1]/95 backdrop-blur-md border-b border-[#EAD9D5] pt-[env(safe-area-inset-top)]">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#F9E8EC] border border-[#E5C5CD] flex items-center justify-center shadow-2xs">
            <Crown className="w-4 h-4 text-[#B86B7D]" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-serif-bridal text-2xl font-semibold text-[#4A3B39]">
              {brideProfile?.full_name || 'Sarah'}
            </span>
            <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#F9E8EC] text-[#B86B7D] font-semibold border border-[#EBCBD3]">
              Mariée
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1.5">
          {/* Baguette magique pour revoir la princesse */}
          <button
            type="button"
            onClick={onReplaySplash}
            title="Animation Princesse"
            className="w-8 h-8 rounded-full bg-[#FFFDFB] border border-[#EAD9D5] flex items-center justify-center text-[#B86B7D] active:scale-95"
          >
            <Wand2 className="w-3.5 h-3.5" />
          </button>

          <Link
            to="/ma-liste?tab=favoris"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFFDFB] border border-[#EAD9D5] text-xs font-medium text-[#4A3B39]"
          >
            <Heart className="w-3.5 h-3.5 text-[#D98A9C] fill-[#F3D5DD]" />
            <span>{favoritesCount}</span>
          </Link>

          <Link
            to="/ma-liste?tab=visites"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFFDFB] border border-[#EAD9D5] text-xs font-medium text-[#4A3B39]"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#9B7E64]" />
            <span>{visitedCount}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export function BottomTabBar() {
  const { favoritesCount } = useBridal();

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
      badge: favoritesCount > 0 ? favoritesCount : null,
    },
    {
      to: '/espace-partenaire',
      label: 'Ajouter',
      icon: Sparkles,
    },
  ];

  return (
    <nav className="shrink-0 z-30 bg-[#FFFDFB]/95 backdrop-blur-lg border-t border-[#EAD9D5] px-3 py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center py-1.5 rounded-2xl transition-all active:scale-95 ${
                  isActive
                    ? 'bg-[#F9E8EC] text-[#B86B7D] font-semibold'
                    : 'text-[#84706C]'
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
  );
}
