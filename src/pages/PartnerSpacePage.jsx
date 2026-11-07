import {
  CheckCircle2,
  Crown,
  Database,
  Plus,
  Sparkles,
  Store,
  Trash2,
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBridal } from '../context/BridalContext';

export default function PartnerSpacePage() {
  const navigate = useNavigate();
  const { supabaseConnected, subcategories, wilayas, refreshShops } = useBridal();

  const [form, setForm] = useState({
    name: '',
    description: '',
    service_mode: 'both',
    shop_type: 'physical',
    wilaya_code: '16',
    city_commune: '',
    address: '',
    google_maps_url: '',
    phone: '',
    whatsapp: '',
    instagram_handle: '',
    instagram_url: '',
    selectedSubcategories: ['robe-blanche'],
    images: [{ image_url: '', title: '', dress_tag: 'Robe Blanche' }],
  });

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const toggleSubcategory = (slug) => {
    setForm((prev) => {
      const exists = prev.selectedSubcategories.includes(slug);
      return {
        ...prev,
        selectedSubcategories: exists
          ? prev.selectedSubcategories.filter((s) => s !== slug)
          : [...prev.selectedSubcategories, slug],
      };
    });
  };

  const handleImageChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.images];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, images: updated };
    });
  };

  const addImageField = () => {
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, { image_url: '', title: '', dress_tag: '' }],
    }));
  };

  const removeImageField = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/vendor/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          subcategories: form.selectedSubcategories,
          images: form.images.filter((img) => img.image_url.trim() !== ''),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'ajout de la boutique");
      }

      await refreshShops();
      setFeedback({
        type: 'success',
        message: `La boutique "${data.shop.name}" a été enregistrée avec succès !`,
        slug: data.shop.slug,
      });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4 pb-8 space-y-6 overflow-x-hidden">
      {/* En-tête Architecture Multi-Rôles */}
      <section className="bg-princess-gradient rounded-[2rem] border border-[#EAD9D5] p-6 sm:p-8 shadow-princess">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDFB]/90 border border-[#E5C5CD] text-xs font-medium text-[#B86B7D]">
            <Store className="w-3.5 h-3.5" />
            <span>Espace Boutiques & Partenaires (Rôle Vendor / Admin)</span>
          </span>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
              supabaseConnected
                ? 'bg-[#EBF3ED] text-[#3F6E4D] border-[#C6DFCD]'
                : 'bg-[#FFFDFB] text-[#9B7E64] border-[#EAD9D5]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>
              {supabaseConnected
                ? 'Supabase connecté'
                : 'En attente des clés Supabase (.env)'}
            </span>
          </span>
        </div>

        <h1 className="font-serif-bridal text-3xl sm:text-4xl font-semibold text-[#4A3B39] mb-2">
          Référencer une Boutique ou Page de Robes
        </h1>
        <p className="text-xs sm:text-sm text-[#7D6A66] leading-relaxed">
          Cet espace est conçu pour l&apos;ajout de vos magasins (et demain pour permettre aux
          boutiques de créer directement leur vitrine publicitaire selon leur rôle{' '}
          <code className="px-1.5 py-0.5 rounded bg-[#FFFDFB] text-[#B86B7D]">vendor</code>).
        </p>
      </section>

      {/* Formulaire d'ajout de boutique */}
      <form onSubmit={handleSubmit} className="bg-card-bridal rounded-[2rem] p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5753] mb-1.5">
              Nom du magasin ou de la page *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: Maison Royale Caftan & Robe Blanche"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF6F1] border border-[#EAD9D5] focus:border-[#D98A9C] focus:outline-none text-sm"
            />
          </div>

          {/* Option 1 : Achat / Location */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5753] mb-1.5">
              Option 1 : Achat ou Location
            </label>
            <select
              value={form.service_mode}
              onChange={(e) => setForm({ ...form, service_mode: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF6F1] border border-[#EAD9D5] focus:border-[#D98A9C] focus:outline-none text-sm"
            >
              <option value="both">Achat & Location</option>
              <option value="buy">Achat uniquement</option>
              <option value="rent">Location uniquement</option>
            </select>
          </div>

          {/* Option 2 : Magasin physique / En ligne */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5753] mb-1.5">
              Option 2 : Type de boutique
            </label>
            <select
              value={form.shop_type}
              onChange={(e) => setForm({ ...form, shop_type: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF6F1] border border-[#EAD9D5] focus:border-[#D98A9C] focus:outline-none text-sm"
            >
              <option value="physical">Magasin physique</option>
              <option value="online">Boutique en ligne uniquement</option>
              <option value="both">Magasin physique + En ligne</option>
            </select>
          </div>

          {/* Wilaya */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5753] mb-1.5">
              Wilaya
            </label>
            <select
              value={form.wilaya_code}
              onChange={(e) => setForm({ ...form, wilaya_code: e.target.value })}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF6F1] border border-[#EAD9D5] focus:border-[#D98A9C] focus:outline-none text-sm"
            >
              {wilayas.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.code_str} - {w.name_fr}
                </option>
              ))}
            </select>
          </div>

          {/* Commune / Quartier */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5753] mb-1.5">
              Commune / Quartier
            </label>
            <input
              type="text"
              value={form.city_commune}
              onChange={(e) => setForm({ ...form, city_commune: e.target.value })}
              placeholder="Ex: Hydra, Sidi Yahia, Chéraga, Oran..."
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF6F1] border border-[#EAD9D5] focus:border-[#D98A9C] focus:outline-none text-sm"
            />
          </div>

          {/* Adresse & Lien Google Maps */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5753] mb-1.5">
              Adresse exacte (si disponible)
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Ex: Rue des Roses, à côté de..."
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF6F1] border border-[#EAD9D5] focus:border-[#D98A9C] focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5753] mb-1.5">
              Lien Google Maps (si disponible)
            </label>
            <input
              type="url"
              value={form.google_maps_url}
              onChange={(e) => setForm({ ...form, google_maps_url: e.target.value })}
              placeholder="https://maps.google.com/..."
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF6F1] border border-[#EAD9D5] focus:border-[#D98A9C] focus:outline-none text-sm"
            />
          </div>

          {/* Téléphone & Instagram */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5753] mb-1.5">
              Téléphone (si disponible)
            </label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Ex: 0550 00 00 00"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF6F1] border border-[#EAD9D5] focus:border-[#D98A9C] focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5753] mb-1.5">
              Lien Page Instagram / Facebook
            </label>
            <input
              type="url"
              value={form.instagram_url}
              onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
              placeholder="https://instagram.com/..."
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF6F1] border border-[#EAD9D5] focus:border-[#D98A9C] focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Sélection des sous-catégories de robes */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5753] mb-2">
            Catégories de tenues proposées par cette boutique
          </label>
          <div className="flex flex-wrap gap-2">
            {subcategories.map((sub) => {
              const checked = form.selectedSubcategories.includes(sub.slug);
              return (
                <button
                  key={sub.slug}
                  type="button"
                  onClick={() => toggleSubcategory(sub.slug)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-medium border transition-all ${
                    checked
                      ? 'bg-[#F9E8EC] text-[#B86B7D] border-[#D98A9C]'
                      : 'bg-[#FAF6F1] text-[#7D6A66] border-[#EAD9D5]'
                  }`}
                >
                  {checked ? '✓ ' : '+ '}
                  {sub.short_label || sub.name_fr}
                </button>
              );
            })}
          </div>
        </div>

        {/* Galerie de photos des robes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B5753]">
              Photos des robes de la boutique (URLs ou chemins d&apos;images)
            </label>
            <button
              type="button"
              onClick={addImageField}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#B86B7D] hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter une photo</span>
            </button>
          </div>

          {form.images.map((img, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
              <div className="sm:col-span-6">
                <input
                  type="text"
                  value={img.image_url}
                  onChange={(e) => handleImageChange(idx, 'image_url', e.target.value)}
                  placeholder="URL ou chemin de la photo (ex: /uploads/robe1.jpg)"
                  className="w-full px-3.5 py-2 rounded-2xl bg-[#FAF6F1] border border-[#EAD9D5] text-xs"
                />
              </div>
              <div className="sm:col-span-3">
                <input
                  type="text"
                  value={img.title}
                  onChange={(e) => handleImageChange(idx, 'title', e.target.value)}
                  placeholder="Titre (ex: Karakou prune)"
                  className="w-full px-3.5 py-2 rounded-2xl bg-[#FAF6F1] border border-[#EAD9D5] text-xs"
                />
              </div>
              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={img.dress_tag}
                  onChange={(e) => handleImageChange(idx, 'dress_tag', e.target.value)}
                  placeholder="Tag (ex: Caftan)"
                  className="w-full px-3.5 py-2 rounded-2xl bg-[#FAF6F1] border border-[#EAD9D5] text-xs"
                />
              </div>
              <div className="sm:col-span-1 flex justify-end">
                {form.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(idx)}
                    className="p-2 text-[#84706C] hover:text-[#B86B7D]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Message de retour */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm flex items-center justify-between gap-3 ${
              feedback.type === 'success'
                ? 'bg-[#EBF3ED] text-[#3F6E4D] border border-[#C6DFCD]'
                : 'bg-[#F9E8EC] text-[#B86B7D] border border-[#E5C5CD]'
            }`}
          >
            <span>{feedback.message}</span>
            {feedback.slug && (
              <button
                type="button"
                onClick={() => navigate(`/boutique/${feedback.slug}`)}
                className="px-3 py-1 rounded-full bg-white text-[#3F6E4D] font-medium shrink-0"
              >
                Voir la fiche →
              </button>
            )}
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 rounded-full bg-[#B86B7D] hover:bg-[#A3596A] disabled:opacity-50 text-white text-sm font-medium transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{submitting ? 'Enregistrement...' : 'Enregistrer la boutique'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

