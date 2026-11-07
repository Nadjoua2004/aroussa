import {
  DEFAULT_BRIDE_PROFILE,
  DRESS_SUBCATEGORIES,
  WEDDING_CATEGORIES,
  WILAYAS,
} from '../config/constants.js';
import { getSupabaseClient, isSupabaseConfigured } from '../config/supabase.js';

/**
 * GET /api/catalog/meta
 * Retourne les 58 wilayas, les catégories principales, les sous-catégories de robes,
 * le profil de Sarah et l'état de connexion à Supabase.
 */
export async function getCatalogMeta(req, res) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return res.json({
      supabaseConnected: false,
      brideProfile: req.userProfile || DEFAULT_BRIDE_PROFILE,
      categories: WEDDING_CATEGORIES,
      subcategories: DRESS_SUBCATEGORIES,
      wilayas: WILAYAS,
    });
  }

  try {
    const [catRes, subRes, wilayaRes, profileRes] = await Promise.all([
      supabase.from('wedding_categories').select('*').order('display_order', { ascending: true }),
      supabase.from('dress_subcategories').select('*').order('display_order', { ascending: true }),
      supabase.from('wilayas').select('*').order('code', { ascending: true }),
      supabase
        .from('profiles')
        .select('*')
        .eq('id', req.userProfile?.id || DEFAULT_BRIDE_PROFILE.id)
        .maybeSingle(),
    ]);

    return res.json({
      supabaseConnected: true,
      brideProfile: profileRes.data || req.userProfile || DEFAULT_BRIDE_PROFILE,
      categories: catRes.data?.length ? catRes.data : WEDDING_CATEGORIES,
      subcategories: subRes.data?.length ? subRes.data : DRESS_SUBCATEGORIES,
      wilayas: wilayaRes.data?.length ? wilayaRes.data : WILAYAS,
    });
  } catch (error) {
    return res.json({
      supabaseConnected: isSupabaseConfigured(),
      brideProfile: req.userProfile || DEFAULT_BRIDE_PROFILE,
      categories: WEDDING_CATEGORIES,
      subcategories: DRESS_SUBCATEGORIES,
      wilayas: WILAYAS,
      warning: error.message,
    });
  }
}

/**
 * GET /api/shops
 * Filtres supportés :
 * - subcategory : slug de la sous-catégorie (ex: 'robe-blanche', 'caftan', 'karakou'...)
 * - service_mode : 'buy' (Achat) | 'rent' (Location) | 'all'
 * - shop_type : 'physical' (Magasin) | 'online' (En ligne) | 'all'
 * - wilaya : code wilaya (1..58)
 * - search : recherche texte (nom, ville, description)
 */
export async function getShops(req, res) {
  const supabase = getSupabaseClient();

  // Aucune boutique démo : si Supabase n'est pas encore configuré, retourne une liste vide propre
  if (!supabase) {
    return res.json({
      supabaseConnected: false,
      shops: [],
      total: 0,
    });
  }

  try {
    const { subcategory, service_mode, shop_type, wilaya, search } = req.query;
    const brideId = req.userProfile?.id || DEFAULT_BRIDE_PROFILE.id;

    let query = supabase
      .from('shops')
      .select(
        `
        *,
        wilaya:wilayas(code, code_str, name_fr, name_ar),
        shop_subcategories(
          subcategory:dress_subcategories(id, slug, name_fr, short_label, badge_text)
        ),
        shop_images(id, image_url, title, dress_tag, service_mode, display_order),
        bride_shop_interactions(bride_profile_id, is_favorite, is_visited, visited_at, personal_note)
      `
      )
      .eq('status', 'published')
      .order('is_sponsored', { ascending: false })
      .order('sponsored_rank', { ascending: false })
      .order('created_at', { ascending: true });

    if (wilaya && wilaya !== 'all') {
      query = query.eq('wilaya_code', Number(wilaya));
    }

    if (service_mode === 'buy') {
      query = query.eq('offers_buy', true);
    } else if (service_mode === 'rent') {
      query = query.eq('offers_rent', true);
    }

    if (shop_type === 'physical') {
      query = query.eq('is_physical', true);
    } else if (shop_type === 'online') {
      query = query.eq('is_online', true);
    }

    if (search && search.trim()) {
      const q = search.trim();
      query = query.or(`name.ilike.%${q}%,city_commune.ilike.%${q}%,description.ilike.%${q}%`);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Normalisation des sous-catégories et de l'état Favori/Visité de Sarah
    let normalizedShops = (data || []).map((shop) => {
      const subcats = (shop.shop_subcategories || [])
        .map((item) => item.subcategory)
        .filter(Boolean);

      const brideInteraction = (shop.bride_shop_interactions || []).find(
        (inter) => inter.bride_profile_id === brideId
      ) || {
        is_favorite: false,
        is_visited: false,
        visited_at: null,
        personal_note: '',
      };

      const sortedImages = [...(shop.shop_images || [])].sort(
        (a, b) => (a.display_order || 0) - (b.display_order || 0)
      );

      return {
        ...shop,
        subcategories: subcats,
        images: sortedImages,
        interaction: brideInteraction,
      };
    });

    // Filtre par sous-catégorie de robe (si sélectionné)
    if (subcategory && subcategory !== 'all') {
      normalizedShops = normalizedShops.filter((shop) =>
        shop.subcategories.some((sub) => sub.slug === subcategory)
      );
    }

    return res.json({
      supabaseConnected: true,
      shops: normalizedShops,
      total: normalizedShops.length,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Erreur lors de la récupération des boutiques',
      details: error.message,
      shops: [],
    });
  }
}

/**
 * GET /api/shops/:slug
 * Détail complet d'une boutique (photos des robes, carte, téléphone, favori, visité)
 */
export async function getShopBySlug(req, res) {
  const supabase = getSupabaseClient();
  const { slug } = req.params;

  if (!supabase) {
    return res.status(404).json({
      supabaseConnected: false,
      error: 'Base de données Supabase non connectée ou boutique introuvable.',
    });
  }

  try {
    const brideId = req.userProfile?.id || DEFAULT_BRIDE_PROFILE.id;

    const { data: shop, error } = await supabase
      .from('shops')
      .select(
        `
        *,
        wilaya:wilayas(code, code_str, name_fr, name_ar),
        shop_subcategories(
          subcategory:dress_subcategories(id, slug, name_fr, short_label, badge_text)
        ),
        shop_images(id, image_url, title, dress_tag, service_mode, display_order),
        bride_shop_interactions(bride_profile_id, is_favorite, is_visited, visited_at, personal_note)
      `
      )
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw error;
    if (!shop) {
      return res.status(404).json({ error: 'Boutique introuvable' });
    }

    const subcats = (shop.shop_subcategories || [])
      .map((item) => item.subcategory)
      .filter(Boolean);

    const brideInteraction = (shop.bride_shop_interactions || []).find(
      (inter) => inter.bride_profile_id === brideId
    ) || {
      is_favorite: false,
      is_visited: false,
      visited_at: null,
      personal_note: '',
    };

    const sortedImages = [...(shop.shop_images || [])].sort(
      (a, b) => (a.display_order || 0) - (b.display_order || 0)
    );

    return res.json({
      supabaseConnected: true,
      shop: {
        ...shop,
        subcategories: subcats,
        images: sortedImages,
        interaction: brideInteraction,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Erreur lors du chargement de la boutique',
      details: error.message,
    });
  }
}

