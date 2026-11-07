import { DEFAULT_BRIDE_PROFILE } from '../config/constants.js';
import { getSupabaseClient } from '../config/supabase.js';

/**
 * GET /api/bride/interactions
 * Récupère toutes les boutiques mises en Favoris ❤️ ou cochées Visitées ✅ par Sarah
 */
export async function getBrideInteractions(req, res) {
  const supabase = getSupabaseClient();
  const brideId = req.userProfile?.id || DEFAULT_BRIDE_PROFILE.id;

  if (!supabase) {
    return res.json({
      supabaseConnected: false,
      interactions: [],
    });
  }

  try {
    const { data, error } = await supabase
      .from('bride_shop_interactions')
      .select('*')
      .eq('bride_profile_id', brideId);

    if (error) throw error;

    return res.json({
      supabaseConnected: true,
      interactions: data || [],
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Impossible de charger la liste de Sarah',
      details: error.message,
      interactions: [],
    });
  }
}

/**
 * POST /api/bride/interactions/:shopId
 * Met à jour le bouton Favori (is_favorite), le bouton Visité (is_visited) ou une note personnelle
 */
export async function upsertBrideInteraction(req, res) {
  const supabase = getSupabaseClient();
  const { shopId } = req.params;
  const brideId = req.userProfile?.id || DEFAULT_BRIDE_PROFILE.id;
  const { is_favorite, is_visited, personal_note } = req.body;

  if (!supabase) {
    return res.status(200).json({
      supabaseConnected: false,
      localOnly: true,
      interaction: {
        bride_profile_id: brideId,
        shop_id: shopId,
        is_favorite: Boolean(is_favorite),
        is_visited: Boolean(is_visited),
        visited_at: is_visited ? new Date().toISOString() : null,
        personal_note: personal_note || '',
      },
    });
  }

  try {
    // Récupère l'état existant pour ne modifier que les champs envoyés
    const { data: existing } = await supabase
      .from('bride_shop_interactions')
      .select('*')
      .eq('bride_profile_id', brideId)
      .eq('shop_id', shopId)
      .maybeSingle();

    const nextFavorite =
      typeof is_favorite === 'boolean' ? is_favorite : Boolean(existing?.is_favorite);
    const nextVisited =
      typeof is_visited === 'boolean' ? is_visited : Boolean(existing?.is_visited);
    const nextNote =
      typeof personal_note === 'string' ? personal_note : existing?.personal_note || null;

    const payload = {
      bride_profile_id: brideId,
      shop_id: shopId,
      is_favorite: nextFavorite,
      is_visited: nextVisited,
      visited_at: nextVisited ? existing?.visited_at || new Date().toISOString() : null,
      personal_note: nextNote,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('bride_shop_interactions')
      .upsert(payload, { onConflict: 'bride_profile_id,shop_id' })
      .select('*')
      .single();

    if (error) throw error;

    return res.json({
      supabaseConnected: true,
      interaction: data,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Erreur lors de la sauvegarde du statut Favori / Visité',
      details: error.message,
    });
  }
}

