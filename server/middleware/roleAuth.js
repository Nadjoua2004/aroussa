import { DEFAULT_BRIDE_PROFILE, ROLES } from '../config/constants.js';
import { getSupabaseClient } from '../config/supabase.js';

/**
 * Middleware d'contexte utilisateur & rôles.
 * - Actuellement : connecte automatiquement Sarah (rôle 'bride') pour un accès direct fluide.
 * - Évolutif : vérifie le token Bearer Supabase ou l'en-tête x-profile-id / x-user-role
 *   lorsque les boutiques (rôle 'vendor') et l'administration (rôle 'admin') seront ouvertes.
 */
export async function attachUserContext(req, _res, next) {
  try {
    const authHeader = req.headers.authorization;
    const supabase = getSupabaseClient();

    if (authHeader && authHeader.startsWith('Bearer ') && supabase) {
      const token = authHeader.replace('Bearer ', '').trim();
      const { data: authData } = await supabase.auth.getUser(token);

      if (authData?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('auth_user_id', authData.user.id)
          .maybeSingle();

        if (profile) {
          req.userProfile = profile;
          return next();
        }
      }
    }

    // Par défaut : Profil direct de Sarah (La Mariée)
    req.userProfile = {
      ...DEFAULT_BRIDE_PROFILE,
      id: req.headers['x-bride-profile-id'] || DEFAULT_BRIDE_PROFILE.id,
      role: req.headers['x-user-role'] || ROLES.BRIDE,
    };
    return next();
  } catch (_err) {
    req.userProfile = DEFAULT_BRIDE_PROFILE;
    return next();
  }
}

/**
 * Garde de rôle pour protéger les futures routes boutiques ('vendor') et admin ('admin')
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const currentRole = req.userProfile?.role || ROLES.BRIDE;
    if (!allowedRoles.includes(currentRole)) {
      return res.status(403).json({
        error: 'Accès réservé',
        message: `Cette action nécessite l'un des rôles suivants : ${allowedRoles.join(', ')}`,
      });
    }
    return next();
  };
}

