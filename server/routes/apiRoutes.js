import { Router } from 'express';
import {
  getBrideInteractions,
  upsertBrideInteraction,
} from '../controllers/brideController.js';
import {
  getCatalogMeta,
  getShopBySlug,
  getShops,
} from '../controllers/catalogController.js';
import { createOrUpdateShop } from '../controllers/vendorController.js';
import { isSupabaseConfigured } from '../config/supabase.js';
import { attachUserContext } from '../middleware/roleAuth.js';

const router = Router();

// Attache le profil de Sarah (rôle 'bride') ou le profil connecté (futurs rôles 'vendor'/'admin')
router.use(attachUserContext);

// Santé de l'API & statut Supabase
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Carnet Royal de Sarah - Bridal PWA',
    supabaseConfigured: isSupabaseConfigured(),
    currentUser: req.userProfile,
  });
});

// Métadonnées du catalogue (Wilayas, Catégories, Sous-catégories de robes)
router.get('/catalog/meta', getCatalogMeta);

// Liste et filtrage des boutiques (Achat/Location, Magasin/En ligne, Wilaya, Robes)
router.get('/shops', getShops);

// Fiche détaillée d'une boutique
router.get('/shops/:slug', getShopBySlug);

// Favoris ❤️ et Visité ✅ de Sarah
router.get('/bride/interactions', getBrideInteractions);
router.post('/bride/interactions/:shopId', upsertBrideInteraction);

// Création / Intégration de boutiques (Fiche magasins + futur espace partenaire/publicité)
router.post('/vendor/shops', createOrUpdateShop);

export default router;

