import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  FALLBACK_CATEGORIES,
  FALLBACK_SUBCATEGORIES,
  FALLBACK_WILAYAS,
} from '../data/referenceData';

const BridalContext = createContext(null);

const LOCAL_INTERACTIONS_KEY = 'sarah_bridal_interactions_v1';

export function BridalProvider({ children }) {
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [brideProfile, setBrideProfile] = useState({
    id: '00000000-0000-0000-0000-000000000001',
    role: 'bride',
    full_name: 'Sarah',
    bride_title: 'Future Mariée',
  });
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [subcategories, setSubcategories] = useState(FALLBACK_SUBCATEGORIES);
  const [wilayas, setWilayas] = useState(FALLBACK_WILAYAS);

  const [shops, setShops] = useState([]);
  const [loadingShops, setLoadingShops] = useState(true);

  // Sauvegarde locale doublée d'une synchronisation Supabase pour les Favoris & Visités de Sarah
  const [interactionsMap, setInteractionsMap] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_INTERACTIONS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_INTERACTIONS_KEY, JSON.stringify(interactionsMap));
    } catch {
      // Ignore storage error
    }
  }, [interactionsMap]);

  // Chargement initial des métadonnées (Wilayas, Catégories, Sous-catégories)
  const fetchMetaAndInteractions = useCallback(async () => {
    try {
      const [metaRes, interRes] = await Promise.all([
        fetch('/api/catalog/meta'),
        fetch('/api/bride/interactions'),
      ]);

      if (metaRes.ok) {
        const meta = await metaRes.json();
        setSupabaseConnected(Boolean(meta.supabaseConnected));
        if (meta.brideProfile) setBrideProfile(meta.brideProfile);
        if (meta.categories?.length) setCategories(meta.categories);
        if (meta.subcategories?.length) setSubcategories(meta.subcategories);
        if (meta.wilayas?.length) setWilayas(meta.wilayas);
      }

      if (interRes.ok) {
        const interData = await interRes.json();
        if (Array.isArray(interData.interactions) && interData.interactions.length > 0) {
          setInteractionsMap((prev) => {
            const next = { ...prev };
            for (const row of interData.interactions) {
              next[row.shop_id] = {
                is_favorite: Boolean(row.is_favorite),
                is_visited: Boolean(row.is_visited),
                visited_at: row.visited_at || null,
                personal_note: row.personal_note || '',
              };
            }
            return next;
          });
        }
      }
    } catch {
      // Fonctionne avec les valeurs de référence hors-ligne
    }
  }, []);

  const fetchShops = useCallback(async () => {
    setLoadingShops(true);
    try {
      const res = await fetch('/api/shops');
      if (res.ok) {
        const data = await res.json();
        setSupabaseConnected(Boolean(data.supabaseConnected));
        setShops(Array.isArray(data.shops) ? data.shops : []);
      }
    } catch {
      setShops([]);
    } finally {
      setLoadingShops(false);
    }
  }, []);

  useEffect(() => {
    fetchMetaAndInteractions();
    fetchShops();
  }, [fetchMetaAndInteractions, fetchShops]);

  const getShopInteraction = useCallback(
    (shopId, serverInteraction) => {
      if (interactionsMap[shopId]) {
        return interactionsMap[shopId];
      }
      if (serverInteraction) {
        return {
          is_favorite: Boolean(serverInteraction.is_favorite),
          is_visited: Boolean(serverInteraction.is_visited),
          visited_at: serverInteraction.visited_at || null,
          personal_note: serverInteraction.personal_note || '',
        };
      }
      return {
        is_favorite: false,
        is_visited: false,
        visited_at: null,
        personal_note: '',
      };
    },
    [interactionsMap]
  );

  const updateInteraction = useCallback(
    async (shopId, updates) => {
      const current = getShopInteraction(shopId);
      const nextState = {
        ...current,
        ...updates,
        visited_at:
          typeof updates.is_visited === 'boolean'
            ? updates.is_visited
              ? current.visited_at || new Date().toISOString()
              : null
            : current.visited_at,
      };

      setInteractionsMap((prev) => ({
        ...prev,
        [shopId]: nextState,
      }));

      try {
        await fetch(`/api/bride/interactions/${shopId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nextState),
        });
      } catch {
        // Conservé en localStorage si hors-ligne
      }
    },
    [getShopInteraction]
  );

  const toggleFavorite = useCallback(
    (shopId) => {
      const current = getShopInteraction(shopId);
      return updateInteraction(shopId, { is_favorite: !current.is_favorite });
    },
    [getShopInteraction, updateInteraction]
  );

  const toggleVisited = useCallback(
    (shopId) => {
      const current = getShopInteraction(shopId);
      return updateInteraction(shopId, { is_visited: !current.is_visited });
    },
    [getShopInteraction, updateInteraction]
  );

  const savePersonalNote = useCallback(
    (shopId, personal_note) => {
      return updateInteraction(shopId, { personal_note });
    },
    [updateInteraction]
  );

  const favoritesCount = Object.values(interactionsMap).filter((i) => i.is_favorite).length;
  const visitedCount = Object.values(interactionsMap).filter((i) => i.is_visited).length;

  return (
    <BridalContext.Provider
      value={{
        supabaseConnected,
        brideProfile,
        categories,
        subcategories,
        wilayas,
        shops,
        loadingShops,
        refreshShops: fetchShops,
        interactionsMap,
        getShopInteraction,
        toggleFavorite,
        toggleVisited,
        savePersonalNote,
        favoritesCount,
        visitedCount,
      }}
    >
      {children}
    </BridalContext.Provider>
  );
}

export function useBridal() {
  const ctx = useContext(BridalContext);
  if (!ctx) {
    throw new Error('useBridal must be used inside a BridalProvider');
  }
  return ctx;
}

