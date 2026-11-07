import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  Circle,
  ExternalLink,
  Globe,
  Heart,
  Instagram,
  MapPin,
  MessageCircle,
  NotebookPen,
  Phone,
  ShoppingBag,
  Sparkles,
  Store,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useBridal } from '../context/BridalContext';

export default function ShopDetailPage() {
  const { slug } = useParams();
  const {
    shops,
    wilayas,
    getShopInteraction,
    toggleFavorite,
    toggleVisited,
    savePersonalNote,
  } = useBridal();

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  useEffect(() => {
    const existing = shops.find((s) => s.slug === slug);
    if (existing) {
      setShop(existing);
      setLoading(false);
    } else {
      setLoading(true);
      fetch(`/api/shops/${slug}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.shop) setShop(data.shop);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [slug, shops]);

  const interaction = shop
    ? getShopInteraction(shop.id, shop.interaction)
    : { is_favorite: false, is_visited: false, personal_note: '' };

  useEffect(() => {
    if (shop) {
      setNoteDraft(interaction.personal_note || '');
    }
  }, [shop, interaction.personal_note]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-28">
        <div className="bg-card-bridal rounded-3xl h-96 animate-pulse p-6" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-12 pb-28 text-center">
        <div className="bg-card-bridal rounded-3xl p-8 sm:p-12">
          <Sparkles className="w-8 h-8 text-[#B86B7D] mx-auto mb-3" />
          <h1 className="font-serif-bridal text-3xl font-semibold text-[#4A3B39] mb-2">
            Boutique introuvable
          </h1>
          <p className="text-sm text-[#84706C] mb-6">
            Cette boutique n&apos;existe pas encore ou a été déplacée.
          </p>
          <Link
            to="/boutiques"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B86B7D] text-white text-xs font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux boutiques</span>
          </Link>
        </div>
      </div>
    );
  }

  const wilayaObj =
    shop.wilaya || wilayas.find((w) => Number(w.code) === Number(shop.wilaya_code));

  const galleryImages =
    shop.images?.length > 0
      ? shop.images
      : shop.cover_image_url
        ? [{ id: 'cover', image_url: shop.cover_image_url, title: shop.name }]
        : [];

  const mapQuery = encodeURIComponent(
    shop.latitude && shop.longitude
      ? `${shop.latitude},${shop.longitude}`
      : [shop.name, shop.address, shop.city_commune, wilayaObj?.name_fr, 'Algérie']
          .filter(Boolean)
          .join(', ')
  );
  const mapsExternalUrl =
    shop.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  const handleSaveNote = (e) => {
    e.preventDefault();
    savePersonalNote(shop.id, noteDraft);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-28 space-y-6">
      {/* Retour */}
      <div>
        <Link
          to="/boutiques"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#84706C] hover:text-[#4A3B39] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux boutiques</span>
        </Link>
      </div>

      {/* En-tête de la boutique + Boutons Favori ❤️ & Visité ✅ */}
      <section className="bg-card-bridal rounded-[2rem] p-6 sm:p-8 shadow-princess">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
          <div className="space-y-3">
            {/* Badges Achat/Location & Magasin/En ligne */}
            <div className="flex flex-wrap items-center gap-2">
              {(shop.offers_buy ||
                shop.service_mode === 'buy' ||
                shop.service_mode === 'both') && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#FAF6F1] text-[#4A3B39] border border-[#EAD9D5] inline-flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#C5A387]" />
                  Vente (Achat)
                </span>
              )}
              {(shop.offers_rent ||
                shop.service_mode === 'rent' ||
                shop.service_mode === 'both') && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F9E8EC] text-[#B86B7D] border border-[#E5C5CD] inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Location
                </span>
              )}
              {shop.is_physical && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#4A3B39] text-[#FAF6F1] inline-flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5" />
                  Boutique physique
                </span>
              )}
              {shop.is_online && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#FFFDFB] text-[#4A3B39] border border-[#EAD9D5] inline-flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#B86B7D]" />
                  En ligne
                </span>
              )}
              {shop.is_verified && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#F9E8EC] text-[#B86B7D] border border-[#E5C5CD] inline-flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Compte vérifié
                </span>
              )}
            </div>

            <h1 className="font-serif-bridal text-3xl sm:text-5xl font-semibold text-[#4A3B39]">
              {shop.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-[#7D6A66]">
              {(wilayaObj || shop.city_commune) && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#D98A9C]" />
                  <span>
                    {wilayaObj ? `Wilaya ${wilayaObj.code_str} - ${wilayaObj.name_fr}` : ''}
                    {shop.city_commune
                      ? wilayaObj
                        ? ` • ${shop.city_commune}`
                        : shop.city_commune
                      : ''}
                  </span>
                </span>
              )}

              {shop.instagram_handle && (
                <a
                  href={shop.instagram_url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[#B86B7D] hover:underline font-medium"
                >
                  <Instagram className="w-4 h-4" />
                  <span>{shop.instagram_handle}</span>
                </a>
              )}
            </div>

            {shop.description && (
              <p className="text-sm text-[#6B5753] leading-relaxed max-w-2xl bg-[#FAF6F1] p-3.5 rounded-2xl border border-[#EAD9D5]">
                {shop.description}
              </p>
            )}

            {/* Sous-catégories de robes */}
            {shop.subcategories?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {shop.subcategories.map((sub) => (
                  <span
                    key={sub.id || sub.slug}
                    className="text-xs px-3 py-1 rounded-full bg-[#FAF6F1] text-[#6B5753] border border-[#EAD9D5]"
                  >
                    {sub.name_fr || sub.short_label}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Les 2 Boutons d'action de Sarah : Favori ❤️ & Visité ✅ */}
          <div className="flex sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => toggleFavorite(shop.id)}
              className={`flex-1 md:w-52 py-3 px-4 rounded-2xl text-xs sm:text-sm font-medium flex items-center justify-center gap-2 border transition-all ${
                interaction.is_favorite
                  ? 'bg-[#D98A9C] text-white border-[#D98A9C] shadow-xs'
                  : 'bg-[#FFFDFB] text-[#4A3B39] border-[#EAD9D5] hover:border-[#D98A9C]'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  interaction.is_favorite ? 'fill-white text-white' : 'text-[#D98A9C]'
                }`}
              />
              <span>
                {interaction.is_favorite ? 'Dans mes Favoris' : 'Garder en Favori'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => toggleVisited(shop.id)}
              className={`flex-1 md:w-52 py-3 px-4 rounded-2xl text-xs sm:text-sm font-medium flex items-center justify-center gap-2 border transition-all ${
                interaction.is_visited
                  ? 'bg-[#EBF3ED] text-[#3F6E4D] border-[#C6DFCD]'
                  : 'bg-[#FAF6F1] text-[#6B5753] border-[#EAD9D5] hover:border-[#C5A387]'
              }`}
            >
              {interaction.is_visited ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#3F6E4D]" />
                  <span>Boutique visitée ✓</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 text-[#C5A387]" />
                  <span>Marquer comme visité</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Galerie Photos des Robes */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-bridal text-2xl sm:text-3xl font-semibold text-[#4A3B39]">
            Photos des Robes & Modèles
          </h2>
          <span className="text-xs text-[#84706C]">
            {galleryImages.length} photo{galleryImages.length > 1 ? 's' : ''}
          </span>
        </div>

        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {galleryImages.map((img, idx) => (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                className="group relative aspect-3/4 rounded-3xl overflow-hidden bg-[#F3ECE2] border border-[#EAD9D5] text-left"
              >
                <img
                  src={img.image_url}
                  alt={img.title || `${shop.name} - Robe ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {(img.title || img.dress_tag) && (
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#4A3B39]/80 via-[#4A3B39]/30 to-transparent text-white">
                    {img.dress_tag && (
                      <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#F9E8EC] text-[#B86B7D] font-medium mb-1">
                        {img.dress_tag}
                      </span>
                    )}
                    {img.title && <p className="text-xs font-medium truncate">{img.title}</p>}
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-card-bridal rounded-3xl p-7 text-center space-y-3">
            <Sparkles className="w-6 h-6 text-[#C5A387] mx-auto" />
            <p className="text-sm text-[#84706C]">
              Découvrez les photos et vidéos des modèles directement sur la page officielle de{' '}
              <span className="font-medium text-[#4A3B39]">{shop.name}</span> :
            </p>
            {shop.instagram_url && (
              <a
                href={shop.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F9E8EC] hover:bg-[#F3D5DD] text-[#B86B7D] border border-[#E5C5CD] text-xs font-medium transition-colors"
              >
                <Instagram className="w-4 h-4" />
                <span>Voir les robes sur {shop.instagram_handle || 'Instagram'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </section>

      {/* Contacts (Téléphone, WhatsApp, Réseaux) & Localisation Carte */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Carte & Adresse */}
        <div className="bg-card-bridal rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#B86B7D]">
              <MapPin className="w-4 h-4" />
              <span>Localisation & Carte</span>
            </div>

            <h3 className="font-serif-bridal text-2xl font-semibold text-[#4A3B39]">
              Adresse & Accès
            </h3>

            <p className="text-sm text-[#7D6A66]">
              {shop.address ||
                shop.city_commune ||
                (wilayaObj
                  ? `${wilayaObj.code_str} - ${wilayaObj.name_fr}`
                  : 'Boutique en ligne / Livraison toutes wilayas')}
            </p>
          </div>

          {(shop.is_physical || shop.google_maps_url || wilayaObj) && (
            <div className="rounded-2xl overflow-hidden border border-[#EAD9D5] h-44 bg-[#F3ECE2]">
              <iframe
                title={`Carte ${shop.name}`}
                src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}

          {shop.google_maps_url || shop.is_physical ? (
            <a
              href={mapsExternalUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-4 rounded-2xl bg-[#FAF6F1] hover:bg-[#F9E8EC] border border-[#EAD9D5] text-xs sm:text-sm font-medium text-[#4A3B39] flex items-center justify-center gap-2 transition-colors"
            >
              <MapPin className="w-4 h-4 text-[#D98A9C]" />
              <span>Ouvrir dans Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#84706C]" />
            </a>
          ) : (
            <div className="w-full py-3 px-4 rounded-2xl bg-[#FAF6F1] border border-[#EAD9D5] text-xs text-[#84706C] text-center">
              Boutique exclusivement en ligne (sans magasin physique)
            </div>
          )}
        </div>

        {/* Numéro de téléphone & Pages Réseaux Sociaux */}
        <div className="bg-card-bridal rounded-3xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#9B7E64]">
              <Phone className="w-4 h-4" />
              <span>Contact & Réseaux</span>
            </div>

            <h3 className="font-serif-bridal text-2xl font-semibold text-[#4A3B39]">
              Joindre la boutique
            </h3>

            <p className="text-xs text-[#84706C]">
              Appelle directement ou envoie un message privé pour demander un essayage ou les
              tarifs.
            </p>
          </div>

          <div className="space-y-2.5">
            {shop.phone ? (
              <a
                href={`tel:${shop.phone.split('/')[0].replace(/\s+/g, '')}`}
                className="w-full py-3 px-4 rounded-2xl bg-[#B86B7D] hover:bg-[#A3596A] text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Appeler : {shop.phone}</span>
              </a>
            ) : (
              <div className="w-full py-3 px-4 rounded-2xl bg-[#FAF6F1] border border-[#EAD9D5] text-xs text-[#84706C] text-center">
                Contact par message privé Instagram / WhatsApp
              </div>
            )}

            {shop.whatsapp && (
              <a
                href={`https://wa.me/${shop.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-2xl bg-[#EBF3ED] hover:bg-[#DCEBDD] text-[#3F6E4D] border border-[#C6DFCD] text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contacter sur WhatsApp</span>
              </a>
            )}

            {shop.instagram_url && (
              <a
                href={shop.instagram_url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-2xl bg-[#FAF6F1] hover:bg-[#F9E8EC] border border-[#EAD9D5] text-xs font-medium text-[#4A3B39] flex items-center justify-center gap-2 transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#B86B7D]" />
                <span>Instagram : {shop.instagram_handle || shop.name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#84706C]" />
              </a>
            )}

            {shop.website_url && (
              <a
                href={shop.website_url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-2xl bg-[#FAF6F1] hover:bg-[#F9E8EC] border border-[#EAD9D5] text-xs font-medium text-[#4A3B39] flex items-center justify-center gap-2 transition-colors"
              >
                <Globe className="w-4 h-4 text-[#C5A387]" />
                <span>Site web / Liens officiels</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#84706C]" />
              </a>
            )}

            {shop.tiktok_url && (
              <a
                href={shop.tiktok_url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-2xl bg-[#FAF6F1] hover:bg-[#F9E8EC] border border-[#EAD9D5] text-xs font-medium text-[#4A3B39] flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#B86B7D]" />
                <span>Voir le compte TikTok</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#84706C]" />
              </a>
            )}

            {shop.facebook_url && (
              <a
                href={shop.facebook_url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-2xl bg-[#FAF6F1] hover:bg-[#F9E8EC] border border-[#EAD9D5] text-xs font-medium text-[#4A3B39] flex items-center justify-center gap-2 transition-colors"
              >
                <Globe className="w-4 h-4 text-[#B86B7D]" />
                <span>Voir la page Facebook</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#84706C]" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Notes personnelles d'essayage de Sarah */}
      <section className="bg-card-bridal rounded-3xl p-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#B86B7D] mb-2">
          <NotebookPen className="w-4 h-4" />
          <span>Notes personnelles de Sarah</span>
        </div>
        <h3 className="font-serif-bridal text-2xl font-semibold text-[#4A3B39] mb-3">
          Mes impressions, prix & modèles repérés
        </h3>

        <form onSubmit={handleSaveNote} className="space-y-3">
          <textarea
            rows={3}
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="Exemple : J'ai adoré le Karakou bordeaux en location, tarif intéressant, rdv essayage samedi..."
            className="w-full p-3.5 rounded-2xl bg-[#FAF6F1] border border-[#EAD9D5] focus:border-[#D98A9C] focus:outline-none text-sm text-[#4A3B39]"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#3F6E4D]">
              {noteSaved ? '✓ Note enregistrée dans ton carnet' : ''}
            </span>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#F9E8EC] hover:bg-[#F3D5DD] text-[#B86B7D] border border-[#E5C5CD] text-xs font-medium transition-colors"
            >
              Enregistrer ma note
            </button>
          </div>
        </form>
      </section>

      {/* Lightbox zoom photo robe */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-[#2A1F1D]/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-[#FAF6F1] rounded-3xl overflow-hidden border border-[#EAD9D5]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-[#FFFDFB]/90 text-[#4A3B39] flex items-center justify-center shadow-xs"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={selectedImage.image_url}
              alt={selectedImage.title || shop.name}
              className="w-full max-h-[75vh] object-contain bg-[#F3ECE2]"
            />
            {(selectedImage.title || selectedImage.dress_tag) && (
              <div className="p-4 flex items-center justify-between">
                <div>
                  {selectedImage.title && (
                    <p className="font-serif-bridal text-xl font-semibold text-[#4A3B39]">
                      {selectedImage.title}
                    </p>
                  )}
                </div>
                {selectedImage.dress_tag && (
                  <span className="text-xs px-3 py-1 rounded-full bg-[#F9E8EC] text-[#B86B7D]">
                    {selectedImage.dress_tag}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
