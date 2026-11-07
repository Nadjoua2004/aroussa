import {
  BadgeCheck,
  CheckCircle2,
  Circle,
  Globe,
  Heart,
  Image as ImageIcon,
  Instagram,
  MapPin,
  Phone,
  ShoppingBag,
  Sparkles,
  Store,
} from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useBridal } from '../context/BridalContext';

export default function ShopCard({ shop }) {
  const { getShopInteraction, toggleFavorite, toggleVisited, wilayas } = useBridal();

  const interaction = getShopInteraction(shop.id, shop.interaction);
  const wilayaObj =
    shop.wilaya || wilayas.find((w) => Number(w.code) === Number(shop.wilaya_code));

  const coverImage =
    shop.cover_image_url || (shop.images?.length > 0 ? shop.images[0].image_url : null);
  const photosCount = shop.images?.length || (coverImage ? 1 : 0);

  return (
    <div className="bg-card-bridal rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-princess flex flex-col">
      {/* Visuel de la robe / boutique */}
      <div className="relative aspect-16/10 bg-[#F6ECE6] overflow-hidden">
        <Link to={`/boutique/${shop.slug}`} className="block w-full h-full">
          {coverImage ? (
            <img
              src={coverImage}
              alt={shop.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-princess-gradient p-5 text-center">
              <div className="w-10 h-10 rounded-2xl bg-[#FFFDFB]/80 border border-[#E5C5CD] flex items-center justify-center mb-2 shadow-2xs">
                <Sparkles className="w-5 h-5 text-[#B86B7D]" />
              </div>
              <span className="font-serif-bridal text-2xl font-semibold text-[#4A3B39] line-clamp-1">
                {shop.name}
              </span>
              {shop.instagram_handle && (
                <span className="text-xs text-[#B86B7D] font-medium mt-0.5 flex items-center gap-1">
                  <Instagram className="w-3 h-3" />
                  {shop.instagram_handle}
                </span>
              )}
            </div>
          )}
        </Link>

        {/* Badges Achat / Location en haut à gauche */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {(shop.offers_buy || shop.service_mode === 'buy' || shop.service_mode === 'both') && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#FFFDFB]/95 text-[#4A3B39] border border-[#EAD9D5] shadow-2xs flex items-center gap-1">
              <ShoppingBag className="w-3 h-3 text-[#C5A387]" />
              Vente
            </span>
          )}
          {(shop.offers_rent || shop.service_mode === 'rent' || shop.service_mode === 'both') && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#F9E8EC]/95 text-[#B86B7D] border border-[#E5C5CD] shadow-2xs">
              Location
            </span>
          )}
        </div>

        {/* Bouton Favori ❤️ en haut à droite */}
        <button
          type="button"
          onClick={() => toggleFavorite(shop.id)}
          aria-label={interaction.is_favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-xs ${
            interaction.is_favorite
              ? 'bg-[#D98A9C] text-white'
              : 'bg-[#FFFDFB]/90 text-[#84706C] hover:text-[#D98A9C]'
          }`}
        >
          <Heart className={`w-4 h-4 ${interaction.is_favorite ? 'fill-white' : ''}`} />
        </button>

        {/* Compteur de photos + Type de boutique en bas de l'image */}
        <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {shop.is_physical && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-[#4A3B39]/85 text-[#FAF6F1] backdrop-blur-xs flex items-center gap-1">
                <Store className="w-3 h-3" />
                Boutique physique
              </span>
            )}
            {shop.is_online && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-[#FFFDFB]/95 text-[#4A3B39] backdrop-blur-xs flex items-center gap-1 border border-[#EAD9D5]">
                <Globe className="w-3 h-3 text-[#B86B7D]" />
                En ligne
              </span>
            )}
          </div>

          {photosCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] bg-[#FFFDFB]/90 text-[#4A3B39] flex items-center gap-1 border border-[#EAD9D5]">
              <ImageIcon className="w-3 h-3 text-[#C5A387]" />
              {photosCount}
            </span>
          )}
        </div>
      </div>

      {/* Corps de la carte */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <Link
              to={`/boutique/${shop.slug}`}
              className="font-serif-bridal text-2xl font-semibold text-[#4A3B39] hover:text-[#B86B7D] transition-colors leading-tight inline-flex items-center gap-1.5"
            >
              <span>{shop.name}</span>
              {shop.is_verified && (
                <BadgeCheck
                  className="w-4 h-4 text-[#B86B7D] shrink-0"
                  title="Compte Instagram vérifié"
                />
              )}
            </Link>
          </div>

          {/* Wilaya, Ville & Téléphone */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#84706C] mb-2">
            {wilayaObj ? (
              <span className="inline-flex items-center gap-1 font-medium text-[#6B5753]">
                <MapPin className="w-3.5 h-3.5 text-[#D98A9C]" />
                {wilayaObj.code_str} - {wilayaObj.name_fr}
                {shop.city_commune && !shop.city_commune.includes(wilayaObj.name_fr)
                  ? ` (${shop.city_commune})`
                  : ''}
              </span>
            ) : shop.city_commune ? (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#D98A9C]" />
                {shop.city_commune}
              </span>
            ) : null}

            {shop.phone && (
              <span className="inline-flex items-center gap-1 text-[#6B5753]">
                <Phone className="w-3 h-3 text-[#C5A387]" />
                {shop.phone.split('/')[0].trim()}
              </span>
            )}
          </div>

          {/* Aperçu des remarques / horaires */}
          {shop.description && (
            <p className="text-xs text-[#84706C] line-clamp-2 leading-relaxed mb-3">
              {shop.description}
            </p>
          )}

          {/* Tags de robes proposées */}
          {shop.subcategories?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {shop.subcategories.map((sub) => (
                <span
                  key={sub.id || sub.slug}
                  className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#FAF6F1] text-[#7D6A66] border border-[#EAD9D5]"
                >
                  {sub.short_label || sub.name_fr}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions en bas de carte : Bouton Visité ✅ + Voir les détails */}
        <div className="pt-3 border-t border-[#F1E4E0] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => toggleVisited(shop.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              interaction.is_visited
                ? 'bg-[#EBF3ED] text-[#3F6E4D] border border-[#C6DFCD]'
                : 'bg-[#FAF6F1] text-[#84706C] hover:text-[#4A3B39] border border-[#EAD9D5]'
            }`}
          >
            {interaction.is_visited ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3F6E4D]" />
                <span>Visité</span>
              </>
            ) : (
              <>
                <Circle className="w-3.5 h-3.5 text-[#C5A387]" />
                <span>Non visité</span>
              </>
            )}
          </button>

          <Link
            to={`/boutique/${shop.slug}`}
            className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#F9E8EC] text-[#B86B7D] hover:bg-[#F3D5DD] border border-[#E5C5CD] transition-colors"
          >
            Voir la boutique →
          </Link>
        </div>
      </div>
    </div>
  );
}
