import {
  CheckCircle2,
  Circle,
  Heart,
  Sparkles,
} from 'lucide-react';
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ShopCard from '../components/ShopCard';
import { useBridal } from '../context/BridalContext';

export default function MyListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'favoris'; // 'favoris' | 'visites' | 'a-visiter'

  const { shops, getShopInteraction } = useBridal();

  const favoriteShops = shops.filter(
    (s) => getShopInteraction(s.id, s.interaction).is_favorite
  );
  const visitedShops = shops.filter(
    (s) => getShopInteraction(s.id, s.interaction).is_visited
  );
  const toVisitFavoriteShops = favoriteShops.filter(
    (s) => !getShopInteraction(s.id, s.interaction).is_visited
  );

  const displayedShops =
    activeTab === 'visites'
      ? visitedShops
      : activeTab === 'a-visiter'
        ? toVisitFavoriteShops
        : favoriteShops;

  return (
    <div className="max-w-5xl mx-auto px-4 pt-6 pb-28 space-y-6">
      <div>
        <span className="text-xs uppercase tracking-widest text-[#B86B7D] font-medium">
          Carnet de Sarah
        </span>
        <h1 className="font-serif-bridal text-3xl sm:text-4xl font-semibold text-[#4A3B39]">
          Mes Favoris & Suivi des Visites
        </h1>
        <p className="text-xs sm:text-sm text-[#84706C] mt-1">
          Retrouve les boutiques que tu as aimées et vérifie celles que tu as déjà visitées.
        </p>
      </div>

      {/* Onglets de suivi */}
      <div className="flex flex-wrap items-center gap-2 bg-card-bridal p-2 rounded-3xl">
        <button
          type="button"
          onClick={() => setSearchParams({ tab: 'favoris' }, { replace: true })}
          className={`flex-1 py-2.5 px-4 rounded-2xl text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all ${
            activeTab === 'favoris'
              ? 'bg-[#F9E8EC] text-[#B86B7D] border border-[#E5C5CD]'
              : 'text-[#7D6A66] hover:text-[#4A3B39]'
          }`}
        >
          <Heart className="w-4 h-4 text-[#D98A9C] fill-[#F3D5DD]" />
          <span>Mes Favoris ({favoriteShops.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSearchParams({ tab: 'a-visiter' }, { replace: true })}
          className={`flex-1 py-2.5 px-4 rounded-2xl text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all ${
            activeTab === 'a-visiter'
              ? 'bg-[#F9E8EC] text-[#B86B7D] border border-[#E5C5CD]'
              : 'text-[#7D6A66] hover:text-[#4A3B39]'
          }`}
        >
          <Circle className="w-4 h-4 text-[#C5A387]" />
          <span>Favoris à visiter ({toVisitFavoriteShops.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSearchParams({ tab: 'visites' }, { replace: true })}
          className={`flex-1 py-2.5 px-4 rounded-2xl text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all ${
            activeTab === 'visites'
              ? 'bg-[#EBF3ED] text-[#3F6E4D] border border-[#C6DFCD]'
              : 'text-[#7D6A66] hover:text-[#4A3B39]'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-[#3F6E4D]" />
          <span>Déjà visitées ({visitedShops.length})</span>
        </button>
      </div>

      {/* Résultats */}
      {displayedShops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      ) : (
        <div className="bg-card-bridal rounded-[2rem] p-8 sm:p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#F9E8EC] border border-[#E5C5CD] flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-5 h-5 text-[#B86B7D]" />
          </div>
          <h2 className="font-serif-bridal text-2xl font-semibold text-[#4A3B39] mb-1.5">
            Ta liste est encore vide
          </h2>
          <p className="text-xs sm:text-sm text-[#84706C] mb-5">
            Dès que tu cliques sur le cœur ❤️ ou sur &laquo;&nbsp;Visité&nbsp;&raquo; sur une
            boutique, elle s&apos;affichera ici.
          </p>
          <Link
            to="/boutiques"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B86B7D] text-white text-xs font-medium"
          >
            Parcourir les boutiques →
          </Link>
        </div>
      )}
    </div>
  );
}

