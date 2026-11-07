import { DRESS_SUBCATEGORIES } from '../config/constants.js';
import { getSupabaseClient } from '../config/supabase.js';

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/**
 * POST /api/vendor/shops
 * Crée une boutique avec ses sous-catégories et sa galerie de robes.
 * Prêt pour :
 * 1) L'intégration de votre fiche de magasins & captures d'écran
 * 2) Le futur espace Boutique / Publicité (rôle 'vendor' / 'admin')
 */
export async function createOrUpdateShop(req, res) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return res.status(400).json({
      error: 'Veuillez configurer SUPABASE_URL et SUPABASE_ANON_KEY dans le fichier .env',
    });
  }

  try {
    const {
      name,
      slug,
      description,
      service_mode = 'both', // 'buy' | 'rent' | 'both'
      shop_type = 'physical', // 'physical' | 'online' | 'both'
      wilaya_code,
      city_commune,
      address,
      google_maps_url,
      latitude,
      longitude,
      phone,
      whatsapp,
      instagram_handle,
      instagram_url,
      facebook_url,
      tiktok_url,
      website_url,
      cover_image_url,
      subcategories = [], // tableau de slugs ex: ['robe-blanche', 'caftan', 'karakou']
      images = [], // tableau d'objets { image_url, title, dress_tag, service_mode }
      status = 'published',
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Le nom de la boutique est obligatoire.' });
    }

    const finalSlug = slug ? slugify(slug) : slugify(name);
    const offers_buy = service_mode === 'buy' || service_mode === 'both';
    const offers_rent = service_mode === 'rent' || service_mode === 'both';
    const is_physical = shop_type === 'physical' || shop_type === 'both';
    const is_online = shop_type === 'online' || shop_type === 'both';

    const shopPayload = {
      name: name.trim(),
      slug: finalSlug,
      description: description || null,
      service_mode,
      offers_buy,
      offers_rent,
      shop_type,
      is_physical,
      is_online,
      wilaya_code: wilaya_code ? Number(wilaya_code) : null,
      city_commune: city_commune || null,
      address: address || null,
      google_maps_url: google_maps_url || null,
      latitude: latitude || null,
      longitude: longitude || null,
      phone: phone || null,
      whatsapp: whatsapp || null,
      instagram_handle: instagram_handle || null,
      instagram_url: instagram_url || null,
      facebook_url: facebook_url || null,
      tiktok_url: tiktok_url || null,
      website_url: website_url || null,
      cover_image_url: cover_image_url || (images[0]?.image_url ?? null),
      status,
      updated_at: new Date().toISOString(),
    };

    const { data: createdShop, error: shopError } = await supabase
      .from('shops')
      .upsert(shopPayload, { onConflict: 'slug' })
      .select('*')
      .single();

    if (shopError) throw shopError;

    // Liaison avec les sous-catégories de robes
    if (Array.isArray(subcategories) && subcategories.length > 0) {
      await supabase.from('shop_subcategories').delete().eq('shop_id', createdShop.id);

      const matchedSubIds = subcategories
        .map((slugOrId) => {
          const found = DRESS_SUBCATEGORIES.find(
            (s) => s.slug === slugOrId || s.id === slugOrId
          );
          return found ? { shop_id: createdShop.id, subcategory_id: found.id } : null;
        })
        .filter(Boolean);

      if (matchedSubIds.length > 0) {
        await supabase.from('shop_subcategories').insert(matchedSubIds);
      }
    }

    // Galerie d'images des robes
    if (Array.isArray(images) && images.length > 0) {
      await supabase.from('shop_images').delete().eq('shop_id', createdShop.id);

      const imageRows = images
        .filter((img) => img && img.image_url)
        .map((img, index) => ({
          shop_id: createdShop.id,
          image_url: img.image_url,
          title: img.title || null,
          dress_tag: img.dress_tag || null,
          service_mode: img.service_mode || null,
          display_order: img.display_order ?? index + 1,
        }));

      if (imageRows.length > 0) {
        await supabase.from('shop_images').insert(imageRows);
      }
    }

    return res.status(201).json({
      message: 'Boutique enregistrée avec succès',
      shop: createdShop,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erreur lors de l'enregistrement de la boutique",
      details: error.message,
    });
  }
}

