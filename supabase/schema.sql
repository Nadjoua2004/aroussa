-- ============================================================================
-- AROUSSA (SARAH BRIDAL PWA) - SUPABASE POSTGRESQL SCHEMA
-- Base évolutive : Profil Mariée (Sarah) + Future plateforme Multi-Rôles
-- (Boutiques / Prestataires / Publicités / Administration)
-- AUCUNE DONNÉE DÉMO DE BOUTIQUE N'EST INSÉRÉE (uniquement les tables de base :
-- 58 Wilayas, Catégories de robes et Profil par défaut de Sarah).
-- ============================================================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Types énumérés (Enums) pour l'architecture évolutive
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('bride', 'vendor', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE service_type AS ENUM ('buy', 'rent', 'both');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE shop_channel AS ENUM ('physical', 'online', 'both');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE shop_status AS ENUM ('draft', 'pending_review', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 3. Table de référence : Les 58 Wilayas d'Algérie
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.wilayas (
    code INTEGER PRIMARY KEY CHECK (code >= 1 AND code <= 58),
    code_str VARCHAR(2) NOT NULL,
    name_fr TEXT NOT NULL,
    name_ar TEXT
);

INSERT INTO public.wilayas (code, code_str, name_fr, name_ar) VALUES
(1, '01', 'Adrar', 'أدرار'),
(2, '02', 'Chlef', 'الشلف'),
(3, '03', 'Laghouat', 'الأغواط'),
(4, '04', 'Oum El Bouaghi', 'أم البواقي'),
(5, '05', 'Batna', 'باتنة'),
(6, '06', 'Béjaïa', 'بجاية'),
(7, '07', 'Biskra', 'بسكرة'),
(8, '08', 'Béchar', 'بشار'),
(9, '09', 'Blida', 'البليدة'),
(10, '10', 'Bouira', 'البويرة'),
(11, '11', 'Tamanrasset', 'تمنراست'),
(12, '12', 'Tébessa', 'تبسة'),
(13, '13', 'Tlemcen', 'تلمسان'),
(14, '14', 'Tiaret', 'تيارت'),
(15, '15', 'Tizi Ouzou', 'تيزي وزو'),
(16, '16', 'Alger', 'الجزائر'),
(17, '17', 'Djelfa', 'الجلفة'),
(18, '18', 'Jijel', 'جيجل'),
(19, '19', 'Sétif', 'سطيف'),
(20, '20', 'Saïda', 'سعيدة'),
(21, '21', 'Skikda', 'سكيكدة'),
(22, '22', 'Sidi Bel Abbès', 'سيدي بلعباس'),
(23, '23', 'Annaba', 'عنابة'),
(24, '24', 'Guelma', 'قالمة'),
(25, '25', 'Constantine', 'قسنطينة'),
(26, '26', 'Médéa', 'المدية'),
(27, '27', 'Mostaganem', 'مستغانم'),
(28, '28', 'M''Sila', 'المسيلة'),
(29, '29', 'Mascara', 'معسكر'),
(30, '30', 'Ouargla', 'ورقلة'),
(31, '31', 'Oran', 'وهران'),
(32, '32', 'El Bayadh', 'البيض'),
(33, '33', 'Illizi', 'إليزي'),
(34, '34', 'Bordj Bou Arréridj', 'برج بوعريريج'),
(35, '35', 'Boumerdès', 'بومرداس'),
(36, '36', 'El Tarf', 'الطارف'),
(37, '37', 'Tindouf', 'تندوف'),
(38, '38', 'Tissemsilt', 'تيسمسيلت'),
(39, '39', 'El Oued', 'الوادي'),
(40, '40', 'Khenchela', 'خنشلة'),
(41, '41', 'Souk Ahras', 'سوق أهراس'),
(42, '42', 'Tipaza', 'تيبازة'),
(43, '43', 'Mila', 'ميلة'),
(44, '44', 'Aïn Defla', 'عين الدفلى'),
(45, '45', 'Naâma', 'النعامة'),
(46, '46', 'Aïn Témouchent', 'عين تموشنت'),
(47, '47', 'Ghardaïa', 'غرداية'),
(48, '48', 'Relizane', 'غليزان'),
(49, '49', 'Timimoun', 'تيميمون'),
(50, '50', 'Bordj Badji Mokhtar', 'برج باجي مختار'),
(51, '51', 'Ouled Djellal', 'أولاد جلال'),
(52, '52', 'Béni Abbès', 'بني عباس'),
(53, '53', 'In Salah', 'عين صالح'),
(54, '54', 'In Guezzam', 'عين قزام'),
(55, '55', 'Touggourt', 'تقرت'),
(56, '56', 'Djanet', 'جانت'),
(57, '57', 'El M''Ghair', 'المغير'),
(58, '58', 'El Meniaa', 'المنيعة')
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- 4. Table des Profils & Rôles (Bride / Vendor / Admin)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE, -- Lié à auth.users quand l'authentification multi-utilisateurs sera activée
    role user_role NOT NULL DEFAULT 'bride',
    full_name TEXT NOT NULL,
    bride_title TEXT DEFAULT 'La Mariée',
    phone TEXT,
    wilaya_code INTEGER REFERENCES public.wilayas(code),
    wedding_date DATE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Profil par défaut de Sarah (accès direct immédiat)
INSERT INTO public.profiles (id, role, full_name, bride_title)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'bride',
    'Sarah',
    'Future Mariée'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 5. Grandes Catégories du Mariage (Tenues & Robes en premier, prêt pour la suite)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.wedding_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name_fr TEXT NOT NULL,
    subtitle_fr TEXT,
    icon_name TEXT NOT NULL DEFAULT 'Sparkles',
    display_order INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.wedding_categories (id, slug, name_fr, subtitle_fr, icon_name, display_order, is_active) VALUES
('10000000-0000-0000-0000-000000000001', 'tenues-robes', 'Robes & Tenues Traditionnelles', 'Robe blanche, soirée, caftan, karakou, djebba...', 'Crown', 1, true),
('10000000-0000-0000-0000-000000000002', 'mise-en-beaute', 'Coiffure & Maquillage', 'Salons de beauté, maquilleuses et coiffeuses mariée', 'Sparkles', 2, false),
('10000000-0000-0000-0000-000000000003', 'bijoux-accessoires', 'Bijoux & Accessoires', 'Parures traditionnelles, couronnes, chaussures', 'Gem', 3, false),
('10000000-0000-0000-0000-000000000004', 'photographe-video', 'Photographe & Vidéaste', 'Souvenirs photo et film de mariage', 'Camera', 4, false),
('10000000-0000-0000-0000-000000000005', 'gateaux-traiteur', 'Gâteaux & Prestige', 'Gâteaux traditionnels, pièce montée et traiteurs', 'Cake', 5, false)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 6. Sous-catégories de Robes & Tenues (Trousseau & Tasdira)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.dress_subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.wedding_categories(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    name_fr TEXT NOT NULL,
    short_label TEXT NOT NULL,
    description_fr TEXT,
    badge_text TEXT,
    display_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.dress_subcategories (id, category_id, slug, name_fr, short_label, description_fr, badge_text, display_order) VALUES
(
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'robe-blanche',
    'Robe Blanche (Mariée)',
    'Robe Blanche',
    'Robes de mariée princesse, sirène, bohème et haute couture',
    'Mariée',
    1
),
(
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'robe-soiree',
    'Robe de Soirée',
    'Robe Soirée',
    'Robes de soirée, fiançailles, gala et cérémonies',
    'Soirée',
    2
),
(
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000001',
    'caftan',
    'Caftan (9oftan)',
    'Caftan',
    'Caftans royaux, marocains et algériens brodés main',
    'Traditionnel',
    3
),
(
    '20000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000001',
    'karakou',
    'Karakou',
    'Karakou',
    'Karakou algérois en velours brodé fetla et mejboud, moderne ou traditionnel',
    'Traditionnel',
    4
),
(
    '20000000-0000-0000-0000-000000000005',
    '10000000-0000-0000-0000-000000000001',
    'djebba-traditionnelle',
    'Djebba Kabyle, Chaoui, Fergani & Constantinois',
    'Djebba & Régional',
    'Djebba Kabyle, Melhfa Chaouia, Djebba Fergani constantinoise et tenues du patrimoine',
    'Patrimoine',
    5
),
(
    '20000000-0000-0000-0000-000000000006',
    '10000000-0000-0000-0000-000000000001',
    'badroune-blouza-chedda',
    'Badroune, Blouza & Chedda',
    'Badroune & Blouza',
    'Badroune algérois, Blouza oranaise, Chedda tlemcenienne et autres tenues de tasdira',
    'Tasdira',
    6
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 7. Table des Boutiques (Magasins physiques & Boutiques en ligne)
-- Conçue pour accueillir les futures inscriptions de boutiques & publicités
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.shops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    category_id UUID NOT NULL DEFAULT '10000000-0000-0000-0000-000000000001' REFERENCES public.wedding_categories(id),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    
    -- Options Achat / Location ('buy', 'rent', 'both')
    service_mode service_type NOT NULL DEFAULT 'both',
    offers_buy BOOLEAN NOT NULL DEFAULT true,
    offers_rent BOOLEAN NOT NULL DEFAULT true,
    
    -- Options Boutique Physique / En ligne ('physical', 'online', 'both')
    shop_type shop_channel NOT NULL DEFAULT 'physical',
    is_physical BOOLEAN NOT NULL DEFAULT true,
    is_online BOOLEAN NOT NULL DEFAULT false,
    
    -- Localisation & Carte
    wilaya_code INTEGER REFERENCES public.wilayas(code),
    city_commune TEXT,
    address TEXT,
    google_maps_url TEXT,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    
    -- Contacts & Réseaux Sociaux (très utile pour les pages Instagram/Facebook)
    phone TEXT,
    whatsapp TEXT,
    instagram_handle TEXT,
    instagram_url TEXT,
    facebook_url TEXT,
    tiktok_url TEXT,
    website_url TEXT,
    
    -- Visuels
    cover_image_url TEXT,
    logo_url TEXT,
    
    -- Champs pour le futur modèle économique (Rôle Boutique / Publicité)
    status shop_status NOT NULL DEFAULT 'published',
    is_verified BOOLEAN NOT NULL DEFAULT true,
    is_sponsored BOOLEAN NOT NULL DEFAULT false,
    sponsored_rank INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 8. Liaison Boutiques <-> Sous-catégories de robes (Une boutique peut avoir plusieurs styles)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.shop_subcategories (
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    subcategory_id UUID NOT NULL REFERENCES public.dress_subcategories(id) ON DELETE CASCADE,
    PRIMARY KEY (shop_id, subcategory_id)
);

-- ============================================================================
-- 9. Galerie Photos des Robes par Boutique
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.shop_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    subcategory_id UUID REFERENCES public.dress_subcategories(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    title TEXT,
    dress_tag TEXT, -- ex: 'Karakou', 'Robe Blanche', 'Caftan'
    service_mode service_type, -- ex: 'buy', 'rent', 'both'
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 10. Suivi de la Mariée (Favoris ❤️ & Visité ✅ par Sarah)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.bride_shop_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bride_profile_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000001' REFERENCES public.profiles(id) ON DELETE CASCADE,
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    is_favorite BOOLEAN NOT NULL DEFAULT false,
    is_visited BOOLEAN NOT NULL DEFAULT false,
    visited_at TIMESTAMPTZ,
    personal_note TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (bride_profile_id, shop_id)
);

-- Index pour accélérer les filtres (Wilaya, Achat/Location, Magasin/En ligne)
CREATE INDEX IF NOT EXISTS idx_shops_wilaya ON public.shops(wilaya_code);
CREATE INDEX IF NOT EXISTS idx_shops_service_mode ON public.shops(service_mode, offers_buy, offers_rent);
CREATE INDEX IF NOT EXISTS idx_shops_shop_type ON public.shops(shop_type, is_physical, is_online);
CREATE INDEX IF NOT EXISTS idx_shops_status ON public.shops(status);
CREATE INDEX IF NOT EXISTS idx_shop_images_shop_id ON public.shop_images(shop_id);
CREATE INDEX IF NOT EXISTS idx_bride_interactions_bride ON public.bride_shop_interactions(bride_profile_id);

-- ============================================================================
-- 11. Politiques RLS (Row Level Security) souples pour Sarah + prêtes pour le futur
-- ============================================================================
ALTER TABLE public.wilayas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dress_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bride_shop_interactions ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour les tables de catalogue
CREATE POLICY "Public read wilayas" ON public.wilayas FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON public.wedding_categories FOR SELECT USING (true);
CREATE POLICY "Public read subcategories" ON public.dress_subcategories FOR SELECT USING (true);
CREATE POLICY "Public read shops" ON public.shops FOR SELECT USING (true);
CREATE POLICY "Public read shop_subcategories" ON public.shop_subcategories FOR SELECT USING (true);
CREATE POLICY "Public read shop_images" ON public.shop_images FOR SELECT USING (true);
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);

-- Accès complet aux interactions de Sarah (Favoris / Visité) et gestion des boutiques
CREATE POLICY "Allow bride interactions access" ON public.bride_shop_interactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow shop management" ON public.shops FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow shop_subcategories management" ON public.shop_subcategories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow shop_images management" ON public.shop_images FOR ALL USING (true) WITH CHECK (true);

