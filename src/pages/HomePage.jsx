import {
  ArrowRight,
  CheckCircle2,
  Crown,
  Globe,
  Heart,
  ShoppingBag,
  Sparkles,
  Store,
} from 'lucide-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DressDrawing } from '../components/DressIllustrations';
import { useBridal } from '../context/BridalContext';

export default function HomePage() {
  const navigate = useNavigate();
  const {
    brideProfile,
    subcategories,
    shops,
    favoritesCount,
    visitedCount,
  } = useBridal();

  // Compte le nombre de boutiques par sous-catégorie
  const getCountForSub = (slug) =>
    shops.filter((s) => (s.subcategories || []).some((sub) => sub.slug === slug)).length;

  return (
    <div className="max-w-5xl mx-auto px-4 pt-5 pb-28 space-y-8">
      {/* 1. Bannière Princesse Sarah épurée */}
      <section className="relative rounded-[2.2rem] bg-princess-gradient border border-[#EAD9D5] p-6 sm:p-8 shadow-princess overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDFB]/90 border border-[#E5C5CD] text-xs font-medium text-[#B86B7D]">
            <Crown className="w-3.5 h-3.5" />
            <span>Carnet de Mariée • {brideProfile?.full_name || 'Sarah'}</span>
          </div>

          <h1 className="font-serif-bridal text-3xl sm:text-5xl font-semibold text-[#4A3B39] leading-tight">
            Bonjour Princesse{' '}
            <span className="italic text-[#B86B7D]">{brideProfile?.full_name || 'Sarah'}</span> ✨
          </h1>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
            <Link
              to="/boutiques"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B86B7D] hover:bg-[#A3596A] text-white text-sm font-medium transition-all shadow-xs"
            >
              <span>Toutes les boutiques ({shops.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/ma-liste"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FFFDFB]/90 text-[#4A3B39] border border-[#EAD9D5] text-xs sm:text-sm font-medium"
            >
              <Heart className="w-4 h-4 text-[#D98A9C] fill-[#F3D5DD]" />
              <span>{favoritesCount} Favoris</span>
              <span className="text-[#D8C5C0]">•</span>
              <CheckCircle2 className="w-4 h-4 text-[#9B7E64]" />
              <span>{visitedCount} Visitées</span>
            </Link>
          </div>
        </div>

        {/* Dessin Robe de Mariée à droite */}
        <div className="shrink-0">
          <DressDrawing slug="robe-blanche" className="w-28 h-28 sm:w-36 sm:h-36" />
        </div>
      </section>

      {/* 2. ÉTAPE 1 : Choisir le type de robe (Avec dessins de chaque tenue !) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#F9E8EC] border border-[#E5C5CD] text-[#B86B7D] text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h2 className="font-serif-bridal text-2xl sm:text-3xl font-semibold text-[#4A3B39]">
              Choisis ta tenue
            </h2>
          </div>

          <Link
            to="/boutiques"
            className="text-xs font-medium text-[#B86B7D] hover:underline flex items-center gap-1"
          >
            <span>Voir tout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {subcategories.map((sub) => {
            const count = getCountForSub(sub.slug);
            return (
              <Link
                key={sub.id || sub.slug}
                to={`/boutiques?subcategory=${sub.slug}`}
                className="group bg-card-bridal rounded-3xl p-4 hover:border-[#D98A9C] hover:shadow-princess transition-all flex flex-col items-center text-center"
              >
                <div className="mb-2 group-hover:scale-105 transition-transform duration-300">
                  <DressDrawing slug={sub.slug} className="w-24 h-24 sm:w-28 sm:h-28" />
                </div>

                <h3 className="font-serif-bridal text-xl sm:text-2xl font-semibold text-[#4A3B39] group-hover:text-[#B86B7D] leading-snug">
                  {sub.short_label || sub.name_fr}
                </h3>

                <span className="mt-1.5 text-[11px] px-3 py-0.5 rounded-full bg-[#F9E8EC] text-[#B86B7D] font-medium border border-[#E5C5CD]">
                  {count} boutique{count > 1 ? 's' : ''}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. ÉTAPE 2 : Achat ou Location ? & Magasin ou En Ligne ? (Grands boutons visuels clairs) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Option Achat ou Location */}
        <div className="bg-card-bridal rounded-3xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#F9E8EC] border border-[#E5C5CD] text-[#B86B7D] text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h2 className="font-serif-bridal text-2xl font-semibold text-[#4A3B39]">
              Achat ou Location ?
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => navigate('/boutiques?service=buy')}
              className="group flex flex-col items-center justify-center gap-2 py-5 px-4 rounded-2xl bg-[#FAF6F1] hover:bg-[#F9E8EC] border border-[#EAD9D5] hover:border-[#D98A9C] transition-all"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#FFFDFB] border border-[#EAD9D5] flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-5 h-5 text-[#C5A387]" />
              </div>
              <span className="font-serif-bridal text-xl font-semibold text-[#4A3B39]">
                Acheter (Vente)
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/boutiques?service=rent')}
              className="group flex flex-col items-center justify-center gap-2 py-5 px-4 rounded-2xl bg-[#F9E8EC]/65 hover:bg-[#F9E8EC] border border-[#E5C5CD] hover:border-[#D98A9C] transition-all"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#FFFDFB] border border-[#E5C5CD] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 text-[#B86B7D]" />
              </div>
              <span className="font-serif-bridal text-xl font-semibold text-[#B86B7D]">
                Louer (Location)
              </span>
            </button>
          </div>
        </div>

        {/* Option Magasin ou En ligne */}
        <div className="bg-card-bridal rounded-3xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#F9E8EC] border border-[#E5C5CD] text-[#B86B7D] text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h2 className="font-serif-bridal text-2xl font-semibold text-[#4A3B39]">
              Magasin ou En ligne ?
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => navigate('/boutiques?type=physical')}
              className="group flex flex-col items-center justify-center gap-2 py-5 px-4 rounded-2xl bg-[#FAF6F1] hover:bg-[#F9E8EC] border border-[#EAD9D5] hover:border-[#D98A9C] transition-all"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#FFFDFB] border border-[#EAD9D5] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Store className="w-5 h-5 text-[#C5A387]" />
              </div>
              <span className="font-serif-bridal text-xl font-semibold text-[#4A3B39]">
                En Magasin
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/boutiques?type=online')}
              className="group flex flex-col items-center justify-center gap-2 py-5 px-4 rounded-2xl bg-[#FAF6F1] hover:bg-[#F9E8EC] border border-[#EAD9D5] hover:border-[#D98A9C] transition-all"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#FFFDFB] border border-[#EAD9D5] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Globe className="w-5 h-5 text-[#B86B7D]" />
              </div>
              <span className="font-serif-bridal text-xl font-semibold text-[#4A3B39]">
                En Ligne
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
