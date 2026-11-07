import {
  CheckCircle2,
  Globe,
  Heart,
  MapPin,
  RotateCcw,
  Search,
  ShoppingBag,
  Sparkles,
  Store,
} from 'lucide-react';
import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ShopCard from '../components/ShopCard';
import { useBridal } from '../context/BridalContext';

export default function ShopsCatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    subcategories,
    wilayas,
    shops,
    loadingShops,
    getShopInteraction,
  } = useBridal();

  const activeSubcategory = searchParams.get('subcategory') || 'all';
  const activeService = searchParams.get('service') || 'all'; // 'all' | 'buy' | 'rent'
  const activeType = searchParams.get('type') || 'all'; // 'all' | 'physical' | 'online'
  const activeWilaya = searchParams.get('wilaya') || 'all';
  const searchQuery = searchParams.get('q') || '';
  const onlyFavorites = searchParams.get('fav') === '1';
  const visitedFilter = searchParams.get('visited') || 'all'; // 'all' | 'yes' | 'no'

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all' || value === '0') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  };

  const resetFilters = () => {
    setSearchParams({}, { replace: true });
  };

  const filteredShops = useMemo(() => {
    return shops.filter((shop) => {
      // 1. Filtre sous-catégorie de robe
      if (activeSubcategory !== 'all') {
        const hasSub = (shop.subcategories || []).some(
          (s) => s.slug === activeSubcategory
        );
        if (!hasSub) return false;
      }

      // 2. Filtre Achat ou Location
      if (activeService === 'buy') {
        if (!shop.offers_buy && shop.service_mode !== 'buy' && shop.service_mode !== 'both') {
          return false;
        }
      } else if (activeService === 'rent') {
        if (!shop.offers_rent && shop.service_mode !== 'rent' && shop.service_mode !== 'both') {
          return false;
        }
      }

      // 3. Filtre Magasin Physique ou Boutique en ligne
      if (activeType === 'physical') {
        if (!shop.is_physical && shop.shop_type !== 'physical' && shop.shop_type !== 'both') {
          return false;
        }
      } else if (activeType === 'online') {
        if (!shop.is_online && shop.shop_type !== 'online' && shop.shop_type !== 'both') {
          return false;
        }
      }

      // 4. Filtre Wilaya
      if (activeWilaya !== 'all') {
        if (Number(shop.wilaya_code) !== Number(activeWilaya)) {
          return false;
        }
      }

      // 5. Recherche par nom ou ville
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchName = shop.name?.toLowerCase().includes(q);
        const matchCity = shop.city_commune?.toLowerCase().includes(q);
        const matchDesc = shop.description?.toLowerCase().includes(q);
        if (!matchName && !matchCity && !matchDesc) return false;
      }

      // 6. Filtres Favori & Visité de Sarah
      const inter = getShopInteraction(shop.id, shop.interaction);
      if (onlyFavorites && !inter.is_favorite) return false;
      if (visitedFilter === 'yes' && !inter.is_visited) return false;
      if (visitedFilter === 'no' && inter.is_visited) return false;

      return true;
    });
  }, [
    shops,
    activeSubcategory,
    activeService,
    activeType,
    activeWilaya,
    searchQuery,
    onlyFavorites,
    visitedFilter,
    getShopInteraction,
  ]);

  const hasActiveFilters =
    activeSubcategory !== 'all' ||
    activeService !== 'all' ||
    activeType !== 'all' ||
    activeWilaya !== 'all' ||
    Boolean(searchQuery.trim()) ||
    onlyFavorites ||
    visitedFilter !== 'all';

  return (
    <div className="max-w-5xl mx-auto px-4 pt-6 pb-28 space-y-6">
      {/* En-tête de la page */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B86B7D] font-medium">
            Catalogue de Sarah
          </span>
          <h1 className="font-serif-bridal text-3xl sm:text-4xl font-semibold text-[#4A3B39]">
            Boutiques de Robes & Tenues
          </h1>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#F9E8EC] text-[#B86B7D] border border-[#E5C5CD] hover:bg-[#F3D5DD] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser les filtres</span>
          </button>
        )}
      </div>

      {/* Panneau de filtres épuré (Beige & Rose Princesse) */}
      <div className="bg-card-bridal rounded-3xl p-4 sm:p-6 space-y-5">
        {/* Ligne 1 : Recherche + Filtre par Wilaya */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-7 relative">
            <Search className="w-4 h-4 text-[#9B7E64] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => updateParam('q', e.target.value)}
              placeholder="Rechercher une boutique, une page, une ville..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF6F1] border border-[#EAD9D5] focus:border-[#D98A9C] focus:outline-none text-sm text-[#4A3B39] placeholder:text-[#9D8985]"
            />
          </div>

          <div className="sm:col-span-5 relative">
            <MapPin className="w-4 h-4 text-[#D98A9C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={activeWilaya}
              onChange={(e) => updateParam('wilaya', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF6F1] border border-[#EAD9D5] focus:border-[#D98A9C] focus:outline-none text-sm text-[#4A3B39]"
            >
              <option value="all">Toutes les Wilayas (58)</option>
              {wilayas.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.code_str} - {w.name_fr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ligne 2 : Les 2 grandes options (Achat / Location) ET (Magasin / En ligne) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* Option Achat ou Location */}
          <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-[#FAF6F1] border border-[#EAD9D5]">
            {[
              { id: 'all', label: 'Achat & Location' },
              { id: 'buy', label: 'Achat', icon: ShoppingBag },
              { id: 'rent', label: 'Location', icon: Sparkles },
            ].map((opt) => {
              const Icon = opt.icon;
              const isSelected = activeService === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateParam('service', opt.id)}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-[#F9E8EC] text-[#B86B7D] border border-[#E5C5CD] shadow-2xs'
                      : 'text-[#7D6A66] hover:text-[#4A3B39]'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Option Magasin Physique ou Boutique en ligne */}
          <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-[#FAF6F1] border border-[#EAD9D5]">
            {[
              { id: 'all', label: 'Tous types' },
              { id: 'physical', label: 'Magasin', icon: Store },
              { id: 'online', label: 'En ligne', icon: Globe },
            ].map((opt) => {
              const Icon = opt.icon;
              const isSelected = activeType === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateParam('type', opt.id)}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-[#F9E8EC] text-[#B86B7D] border border-[#E5C5CD] shadow-2xs'
                      : 'text-[#7D6A66] hover:text-[#4A3B39]'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ligne 3 : Sous-catégories de robes (Robe blanche, Soirée, Caftan, Karakou, Djebba...) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => updateParam('subcategory', 'all')}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
              activeSubcategory === 'all'
                ? 'bg-[#4A3B39] text-[#FAF6F1] border-[#4A3B39]'
                : 'bg-[#FAF6F1] text-[#7D6A66] border-[#EAD9D5] hover:border-[#D98A9C]'
            }`}
          >
            Toutes les tenues
          </button>

          {subcategories.map((sub) => {
            const isSelected = activeSubcategory === sub.slug;
            return (
              <button
                key={sub.id || sub.slug}
                type="button"
                onClick={() => updateParam('subcategory', sub.slug)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-[#F9E8EC] text-[#B86B7D] border-[#D98A9C]'
                    : 'bg-[#FAF6F1] text-[#7D6A66] border-[#EAD9D5] hover:border-[#D98A9C]'
                }`}
              >
                {sub.short_label || sub.name_fr}
              </button>
            );
          })}
        </div>

        {/* Ligne 4 : Filtres rapides Favoris ❤️ & Visité ✅ */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F2E5E1]">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => updateParam('fav', onlyFavorites ? '0' : '1')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                onlyFavorites
                  ? 'bg-[#F9E8EC] text-[#B86B7D] border-[#D98A9C]'
                  : 'bg-[#FFFDFB] text-[#7D6A66] border-[#EAD9D5]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-[#B86B7D]' : ''}`} />
              <span>Mes Favoris uniquement</span>
            </button>

            <button
              type="button"
              onClick={() =>
                updateParam('visited', visitedFilter === 'no' ? 'all' : 'no')
              }
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                visitedFilter === 'no'
                  ? 'bg-[#F9E8EC] text-[#B86B7D] border-[#D98A9C]'
                  : 'bg-[#FFFDFB] text-[#7D6A66] border-[#EAD9D5]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Pas encore visitées</span>
            </button>

            <button
              type="button"
              onClick={() =>
                updateParam('visited', visitedFilter === 'yes' ? 'all' : 'yes')
              }
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                visitedFilter === 'yes'
                  ? 'bg-[#EBF3ED] text-[#3F6E4D] border-[#C6DFCD]'
                  : 'bg-[#FFFDFB] text-[#7D6A66] border-[#EAD9D5]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Déjà visitées</span>
            </button>
          </div>

          <span className="text-xs text-[#84706C]">
            {filteredShops.length} boutique{filteredShops.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Liste des boutiques ou État vide Princesse (sans aucune donnée démo) */}
      {loadingShops ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-card-bridal rounded-3xl h-80 animate-pulse p-4 flex flex-col justify-between"
            >
              <div className="h-44 rounded-2xl bg-[#F3ECE2]" />
              <div className="space-y-2">
                <div className="h-5 w-2/3 rounded-lg bg-[#F3ECE2]" />
                <div className="h-3 w-1/2 rounded-lg bg-[#F3ECE2]" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredShops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      ) : (
        <div className="bg-card-bridal rounded-[2rem] p-8 sm:p-12 text-center max-w-xl mx-auto my-4">
          <div className="w-14 h-14 rounded-full bg-[#F9E8EC] border border-[#E5C5CD] flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-[#B86B7D]" />
          </div>

          <h2 className="font-serif-bridal text-2xl sm:text-3xl font-semibold text-[#4A3B39] mb-2">
            {shops.length === 0
              ? 'Prêt à accueillir les boutiques de Sarah'
              : 'Aucune boutique pour ces filtres'}
          </h2>

          <p className="text-xs sm:text-sm text-[#84706C] leading-relaxed mb-6">
            {shops.length === 0
              ? "Aucune donnée démo n'a été ajoutée : la structure (Robes, Achat/Location, Magasin/En ligne, 58 Wilayas, Favoris et Visites) est prête pour intégrer vos captures d'écran et votre fiche de magasins."
              : 'Essaie de modifier la wilaya ou le type de tenue pour voir toutes les boutiques disponibles.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 rounded-full text-xs font-medium bg-[#FAF6F1] text-[#4A3B39] border border-[#EAD9D5] hover:border-[#D98A9C]"
              >
                Afficher tout
              </button>
            )}
            <Link
              to="/espace-partenaire"
              className="px-5 py-2.5 rounded-full text-xs font-medium bg-[#F9E8EC] text-[#B86B7D] border border-[#E5C5CD] hover:bg-[#F3D5DD] transition-colors"
            >
              Ajouter une boutique →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

