import {
  ArrowRight,
  Cake,
  Camera,
  CheckCircle2,
  Crown,
  Gem,
  Globe,
  Heart,
  MapPin,
  ShoppingBag,
  Sparkles,
  Store,
} from 'lucide-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBridal } from '../context/BridalContext';

const CATEGORY_ICONS = {
  Crown,
  Sparkles,
  Gem,
  Camera,
  Cake,
};

export default function HomePage() {
  const navigate = useNavigate();
  const {
    brideProfile,
    categories,
    subcategories,
    shops,
    favoritesCount,
    visitedCount,
  } = useBridal();

  return (
    <div className="max-w-5xl mx-auto px-4 pt-6 pb-28 space-y-10">
      {/* 1. Bannière d'accueil Princesse pour Sarah */}
      <section className="relative rounded-[2rem] bg-princess-gradient border border-[#EAD9D5] p-6 sm:p-9 shadow-princess overflow-hidden">
        <div className="max-w-xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDFB]/85 border border-[#E5C5CD] text-xs font-medium text-[#B86B7D] mb-4">
            <Crown className="w-3.5 h-3.5" />
            <span>Espace Mariée • {brideProfile?.full_name || 'Sarah'}</span>
          </div>

          <h1 className="font-serif-bridal text-3xl sm:text-5xl font-semibold text-[#4A3B39] leading-tight mb-3">
            Bienvenue dans ton univers de mariée,{' '}
            <span className="italic text-[#B86B7D]">{brideProfile?.full_name || 'Sarah'}</span>
          </h1>

          <p className="text-sm sm:text-base text-[#7D6A66] leading-relaxed mb-6">
            Retrouve tes boutiques de robes blanches, robes de soirée et tenues traditionnelles
            (Caftan, Karakou, Djebba...), filtre par wilaya, achat ou location, et coche tes
            visites en toute simplicité.
          </p>

          {/* Résumé rapide : Boutiques, Favoris, Visitées */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/boutiques"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B86B7D] hover:bg-[#A3596A] text-white text-sm font-medium transition-all shadow-xs"
            >
              <span>Explorer les boutiques</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/ma-liste"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#FFFDFB]/90 hover:bg-[#FFFDFB] text-[#4A3B39] border border-[#EAD9D5] text-sm font-medium transition-all"
            >
              <Heart className="w-4 h-4 text-[#D98A9C] fill-[#F3D5DD]" />
              <span>{favoritesCount} Favoris</span>
              <span className="text-[#D8C5C0]">•</span>
              <CheckCircle2 className="w-4 h-4 text-[#9B7E64]" />
              <span>{visitedCount} Visitées</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Choix rapide : Achat ou Location & Magasin ou En ligne */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bloc Option 1 : Achat ou Location */}
        <div className="bg-card-bridal rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#B86B7D]">
              Option 1 • Formule
            </span>
            <ShoppingBag className="w-4 h-4 text-[#C5A387]" />
          </div>
          <h2 className="font-serif-bridal text-2xl font-semibold text-[#4A3B39] mb-1.5">
            Achat ou Location
          </h2>
          <p className="text-xs text-[#84706C] mb-4">
            Choisis si tu souhaites acheter ta tenue ou la louer pour le jour J.
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/boutiques?service=buy')}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#FAF6F1] hover:bg-[#F9E8EC] border border-[#EAD9D5] hover:border-[#D98A9C] text-sm font-medium text-[#4A3B39] transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-[#C5A387]" />
              <span>Achat</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/boutiques?service=rent')}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#F9E8EC]/60 hover:bg-[#F9E8EC] border border-[#E5C5CD] hover:border-[#D98A9C] text-sm font-medium text-[#B86B7D] transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#B86B7D]" />
              <span>Location</span>
            </button>
          </div>
        </div>

        {/* Bloc Option 2 : Magasin Physique ou Boutique en Ligne */}
        <div className="bg-card-bridal rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#9B7E64]">
              Option 2 • Type de Boutique
            </span>
            <Store className="w-4 h-4 text-[#C5A387]" />
          </div>
          <h2 className="font-serif-bridal text-2xl font-semibold text-[#4A3B39] mb-1.5">
            Magasin ou Boutique en ligne
          </h2>
          <p className="text-xs text-[#84706C] mb-4">
            Repère les magasins à visiter sur carte ou les pages en ligne.
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/boutiques?type=physical')}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#FAF6F1] hover:bg-[#F9E8EC] border border-[#EAD9D5] hover:border-[#D98A9C] text-sm font-medium text-[#4A3B39] transition-all"
            >
              <Store className="w-4 h-4 text-[#C5A387]" />
              <span>Magasin</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/boutiques?type=online')}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#FAF6F1] hover:bg-[#F9E8EC] border border-[#EAD9D5] hover:border-[#D98A9C] text-sm font-medium text-[#4A3B39] transition-all"
            >
              <Globe className="w-4 h-4 text-[#B86B7D]" />
              <span>En ligne</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Les Sous-Catégories de Robes & Tenues Traditionnelles */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#B86B7D] font-medium">
              Trousseau & Tasdira
            </span>
            <h2 className="font-serif-bridal text-3xl font-semibold text-[#4A3B39]">
              Robes & Tenues de Mariée
            </h2>
          </div>
          <Link
            to="/boutiques"
            className="text-xs sm:text-sm font-medium text-[#B86B7D] hover:underline flex items-center gap-1"
          >
            <span>Tout voir ({shops.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subcategories.map((sub) => (
            <Link
              key={sub.id || sub.slug}
              to={`/boutiques?subcategory=${sub.slug}`}
              className="group bg-card-bridal rounded-3xl p-5 hover:border-[#D98A9C] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#F9E8EC] text-[#B86B7D] border border-[#E5C5CD]">
                    {sub.badge_text || 'Tenue'}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#FAF6F1] border border-[#EAD9D5] flex items-center justify-center group-hover:bg-[#F9E8EC] transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 text-[#B86B7D]" />
                  </div>
                </div>

                <h3 className="font-serif-bridal text-2xl font-semibold text-[#4A3B39] group-hover:text-[#B86B7D] transition-colors mb-1.5">
                  {sub.name_fr}
                </h3>
                <p className="text-xs text-[#84706C] leading-relaxed">
                  {sub.description_fr}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F3E7E3] flex items-center justify-between text-xs text-[#9B7E64]">
                <span>Achat & Location</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#D98A9C]" />
                  58 Wilayas
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Toutes les grandes catégories du mariage (Architecture évolutive) */}
      <section className="space-y-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#9B7E64] font-medium">
            Catégories du Mariage
          </span>
          <h2 className="font-serif-bridal text-2xl sm:text-3xl font-semibold text-[#4A3B39]">
            L&apos;essentiel pour le mariage de Sarah
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {categories.map((cat) => {
            const IconComponent = CATEGORY_ICONS[cat.icon_name] || Sparkles;
            const isActive = cat.is_active;

            return (
              <div
                key={cat.id || cat.slug}
                onClick={() => {
                  if (isActive) navigate('/boutiques');
                }}
                className={`rounded-3xl p-4 sm:p-5 border transition-all flex items-center justify-between gap-4 ${
                  isActive
                    ? 'bg-card-bridal border-[#E5C5CD] cursor-pointer hover:border-[#D98A9C]'
                    : 'bg-[#FAF6F1]/60 border-[#EAD9D5]/70 opacity-75'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${
                      isActive
                        ? 'bg-[#F9E8EC] border-[#E5C5CD] text-[#B86B7D]'
                        : 'bg-[#F3ECE2] border-[#E5D7CA] text-[#9B7E64]'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif-bridal text-xl font-semibold text-[#4A3B39]">
                        {cat.name_fr}
                      </h3>
                      {isActive ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F9E8EC] text-[#B86B7D] font-medium">
                          Actif
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F3ECE2] text-[#84706C]">
                          Prochainement
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#84706C] mt-0.5">{cat.subtitle_fr}</p>
                  </div>
                </div>

                {isActive && <ArrowRight className="w-4 h-4 text-[#B86B7D] shrink-0" />}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

