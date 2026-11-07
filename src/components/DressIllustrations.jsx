import React from 'react';

/**
 * Dessins illustrés style Princesse (Beige, Rose Poudré & Or Champagne)
 * pour chaque catégorie de robe et tenue traditionnelle.
 */
export function DressDrawing({ slug, className = 'w-24 h-24' }) {
  switch (slug) {
    case 'robe-blanche':
      return (
        <svg viewBox="0 0 140 140" fill="none" className={className}>
          {/* Halo scintillant */}
          <circle cx="70" cy="72" r="54" fill="#FFF9FA" stroke="#F0D4DC" strokeWidth="1.5" />
          {/* Étincelles */}
          <path d="M32 34L34 40L40 42L34 44L32 50L30 44L24 42L30 40L32 34Z" fill="#DFB18B" />
          <path d="M108 30L109.5 34.5L114 36L109.5 37.5L108 42L106.5 37.5L102 36L106.5 34.5L108 30Z" fill="#D98A9C" />
          {/* Couronne / Voile */}
          <path d="M58 24L63 17L70 22L77 17L82 24H58Z" fill="#F7E1D7" stroke="#C59B76" strokeWidth="1.8" />
          <path d="M56 25C44 38 38 58 40 78" stroke="#F0D4DC" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M84 25C96 38 102 58 100 78" stroke="#F0D4DC" strokeWidth="1.5" strokeDasharray="3 2" />
          {/* Bustier Cœur */}
          <path
            d="M57 36C61 33 66 35 70 39C74 35 79 33 83 36L80 58H60L57 36Z"
            fill="#FFFDFB"
            stroke="#C59B76"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Jupe Princesse Volumineuse */}
          <path
            d="M60 58L32 114C50 121 90 121 108 114L80 58H60Z"
            fill="#FFFDFB"
            stroke="#C59B76"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Plis et tulle rose poudré */}
          <path d="M65 58L50 116" stroke="#EAD0D7" strokeWidth="1.5" />
          <path d="M70 58V118" stroke="#EAD0D7" strokeWidth="1.5" />
          <path d="M75 58L90 116" stroke="#EAD0D7" strokeWidth="1.5" />
          <path d="M36 108C52 115 88 115 104 108" stroke="#D98A9C" strokeWidth="1.5" strokeDasharray="4 3" />
          {/* Ceinture dorée */}
          <rect x="59" y="55" width="22" height="4" rx="2" fill="#D98A9C" />
        </svg>
      );

    case 'robe-soiree':
      return (
        <svg viewBox="0 0 140 140" fill="none" className={className}>
          <circle cx="70" cy="72" r="54" fill="#FDF3F6" stroke="#EBCBD3" strokeWidth="1.5" />
          <path d="M105 40L107 45L112 47L107 49L105 54L103 49L98 47L103 45L105 40Z" fill="#D98A9C" />
          <path d="M34 80L35.5 84L39.5 85.5L35.5 87L34 91L32.5 87L28.5 85.5L32.5 84L34 80Z" fill="#C59B76" />
          {/* Bretelles & Bustier */}
          <path d="M60 26V36M80 26V36" stroke="#B86B7D" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M57 35C62 32 67 35 70 38C73 35 78 32 83 35L79 57H61L57 35Z"
            fill="#F4C7D2"
            stroke="#B86B7D"
            strokeWidth="2"
          />
          {/* Coupe Sirène / Fluide */}
          <path
            d="M61 57C58 76 50 96 40 116C58 121 82 121 100 116C90 96 82 76 79 57H61Z"
            fill="#F9DCE4"
            stroke="#B86B7D"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Drapé scintillant */}
          <path d="M63 57C65 78 58 100 52 117" stroke="#D98A9C" strokeWidth="1.5" />
          <path d="M75 57C76 78 82 100 88 117" stroke="#D98A9C" strokeWidth="1.5" />
          <circle cx="70" cy="57" r="3" fill="#C59B76" />
        </svg>
      );

    case 'caftan':
      return (
        <svg viewBox="0 0 140 140" fill="none" className={className}>
          <circle cx="70" cy="72" r="54" fill="#FAF3EB" stroke="#E5D3C0" strokeWidth="1.5" />
          <path d="M32 38L34 43L39 45L34 47L32 52L30 47L25 45L30 43L32 38Z" fill="#C59B76" />
          {/* Caftan Royal à manches évasées */}
          <path
            d="M58 30H82L104 64L92 70L82 50V58L98 115H42L58 58V50L48 70L36 64L58 30Z"
            fill="#F7E4EA"
            stroke="#B87D5B"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Sfifa & Aakad dorés au milieu */}
          <path d="M70 30V115" stroke="#C59B76" strokeWidth="3" />
          <path d="M64 30L70 42L76 30" stroke="#C59B76" strokeWidth="1.8" />
          {/* Ceinture Mdamma Dorée */}
          <rect x="57" y="55" width="26" height="6" rx="3" fill="#E6C39C" stroke="#B87D5B" strokeWidth="1.8" />
          <circle cx="70" cy="58" r="3.5" fill="#B86B7D" stroke="#FFFDFB" strokeWidth="1" />
          {/* Bordures brodées manches et bas */}
          <path d="M44 110H96" stroke="#C59B76" strokeWidth="2" strokeDasharray="3 2" />
        </svg>
      );

    case 'karakou':
      return (
        <svg viewBox="0 0 140 140" fill="none" className={className}>
          <circle cx="70" cy="72" r="54" fill="#F9EFF2" stroke="#E5C5CD" strokeWidth="1.5" />
          <path d="M106 34L108 39L113 41L108 43L106 48L104 43L99 41L104 39L106 34Z" fill="#C59B76" />
          {/* Veste Karakou Velours cintrée à basques */}
          <path
            d="M56 30H84L96 62L86 66L80 48L86 72C78 76 62 76 54 72L60 48L54 66L44 62L56 30Z"
            fill="#C87589"
            stroke="#8F495A"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Broderie Fetla Dorée sur le plastron */}
          <path d="M62 31C65 42 75 42 78 31" stroke="#F3D6A4" strokeWidth="2" />
          <path d="M60 36C65 48 75 48 80 36" stroke="#F3D6A4" strokeWidth="1.5" />
          <path d="M70 34V72" stroke="#F3D6A4" strokeWidth="2" strokeDasharray="2 2" />
          {/* Seroual Chelka / Mdawer en dessous */}
          <path
            d="M57 73L48 114C56 117 65 117 69 114L70 90L71 114C75 117 84 117 92 114L83 73"
            fill="#FFFDFB"
            stroke="#C59B76"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M52 96L49 113M88 96L91 113" stroke="#C59B76" strokeWidth="1.5" />
        </svg>
      );

    case 'djebba-traditionnelle':
      return (
        <svg viewBox="0 0 140 140" fill="none" className={className}>
          <circle cx="70" cy="72" r="54" fill="#FAF4EC" stroke="#E8D5C4" strokeWidth="1.5" />
          {/* Robe Kabyle / Patrimoine */}
          <path
            d="M54 32H86L98 56L87 62L82 48V58L96 114H44L58 58V48L53 62L42 56L54 32Z"
            fill="#FFFDFB"
            stroke="#C59B76"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Encolure carrée avec motifs berbères/zigzags */}
          <rect x="61" y="32" width="18" height="12" fill="#F9E8EC" stroke="#B86B7D" strokeWidth="1.8" />
          <path d="M58 48L62 52L66 48L70 52L74 48L78 52L82 48" stroke="#D98A9C" strokeWidth="2" />
          {/* Fouta / Ceinture tressée */}
          <rect x="56" y="58" width="28" height="5" rx="2" fill="#D98A9C" />
          <path d="M47 104L53 100L59 104L65 100L71 104L77 100L83 104L89 100L93 104" stroke="#B86B7D" strokeWidth="2" />
          <path d="M46 109H94" stroke="#C59B76" strokeWidth="2" />
          {/* Fibule (Ameclux) */}
          <circle cx="70" cy="39" r="3" fill="#D98A9C" />
        </svg>
      );

    case 'badroune-blouza-chedda':
      return (
        <svg viewBox="0 0 140 140" fill="none" className={className}>
          <circle cx="70" cy="72" r="54" fill="#FCF2F5" stroke="#EBCBD3" strokeWidth="1.5" />
          {/* Sder (Collier de perles / poitrine Blouza & Badroune) */}
          <path
            d="M54 34H86L94 52L84 56L80 46V60L92 114H48L60 60V46L56 56L46 52L54 34Z"
            fill="#F6D8E0"
            stroke="#B86B7D"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Plastron brodé de perles */}
          <path d="M60 35C63 45 77 45 80 35" stroke="#C59B76" strokeWidth="2.5" strokeDasharray="2 2" />
          <path d="M57 39C62 52 78 52 83 39" stroke="#C59B76" strokeWidth="2" strokeDasharray="2 2" />
          <circle cx="70" cy="58" r="3.5" fill="#C59B76" />
          <path d="M64 60L56 114M76 60L84 114" stroke="#FFFDFB" strokeWidth="1.5" />
        </svg>
      );

    default:
      // Trousseau & Tenues de nuit / Ensembles
      return (
        <svg viewBox="0 0 140 140" fill="none" className={className}>
          <circle cx="70" cy="72" r="54" fill="#FAF5EF" stroke="#EAD9D5" strokeWidth="1.5" />
          <path d="M104 34L106 39L111 41L106 43L104 48L102 43L97 41L102 39L104 34Z" fill="#D98A9C" />
          {/* Peignoir en soie / Kimono Mariée */}
          <path
            d="M56 32L70 48L84 32L100 54L88 62L81 50V62L92 112H48L59 62V50L52 62L40 54L56 32Z"
            fill="#FFFDFB"
            stroke="#D98A9C"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Ruban satin */}
          <rect x="58" y="60" width="24" height="4" rx="2" fill="#F3C6D1" stroke="#B86B7D" strokeWidth="1.5" />
          <path d="M72 64L66 82M74 64L80 82" stroke="#B86B7D" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}

