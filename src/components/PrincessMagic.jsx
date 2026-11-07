import React, { useEffect, useState } from 'react';

/**
 * Étoiles et poussière de fée style Disney qui flottent doucement en arrière-plan
 * + éclat d'étincelles au clic de la souris / du doigt.
 */
export function DisneySparklesOverlay() {
  const [bursts, setBursts] = useState([]);

  useEffect(() => {
    const handlePointerDown = (e) => {
      const id = Date.now() + Math.random();
      const newBurst = {
        id,
        x: e.clientX,
        y: e.clientY,
      };
      setBursts((prev) => [...prev.slice(-5), newBurst]);
      setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== id));
      }, 900);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  // Étoiles flottantes permanentes
  const ambientStars = [
    { top: '12%', left: '8%', size: 14, delay: '0s', duration: '4.2s', color: '#E2B07E' },
    { top: '18%', left: '86%', size: 18, delay: '0.8s', duration: '5s', color: '#D98A9C' },
    { top: '36%', left: '92%', size: 12, delay: '1.5s', duration: '3.8s', color: '#E2B07E' },
    { top: '52%', left: '5%', size: 16, delay: '2.1s', duration: '4.6s', color: '#D98A9C' },
    { top: '70%', left: '88%', size: 15, delay: '0.4s', duration: '4.4s', color: '#E2B07E' },
    { top: '82%', left: '12%', size: 12, delay: '1.2s', duration: '5.2s', color: '#D98A9C' },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {ambientStars.map((s, idx) => (
        <svg
          key={idx}
          viewBox="0 0 24 24"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
          className="absolute animate-disney-twinkle opacity-60"
        >
          <path
            d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z"
            fill={s.color}
          />
        </svg>
      ))}

      {/* Éclats magiques au toucher / clic */}
      {bursts.map((b) => (
        <div
          key={b.id}
          style={{ left: b.x, top: b.y }}
          className="fixed -translate-x-1/2 -translate-y-1/2"
        >
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <span
              key={angle}
              style={{ '--angle': `${angle}deg` }}
              className="absolute w-2.5 h-2.5 rounded-full bg-[#E5B887] animate-wand-burst"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Écran d'ouverture animé (Splash Screen Princesse) :
 * Une princesse dessinée qui ouvre ses yeux étoilés et agite sa baguette magique
 * en lançant une pluie d'étincelles dorées et roses style film Disney.
 */
export function PrincessOpeningSplash({ onFinish }) {
  const [eyesOpen, setEyesOpen] = useState(false);
  const [wandSparkling, setWandSparkling] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // 1. Ouvre les yeux à 0.75s
    const t1 = setTimeout(() => setEyesOpen(true), 750);
    // 2. Coup de baguette magique + pluie d'étoiles à 1.05s
    const t2 = setTimeout(() => setWandSparkling(true), 1050);
    // 3. Fondu de sortie à 3.5s
    const t3 = setTimeout(() => setFadingOut(true), 3500);
    // 4. Fermeture complète à 4.0s
    const t4 = setTimeout(() => onFinish?.(), 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onFinish]);

  const sparkParticles = [
    { cx: 52, cy: 56, r: 4, delay: '0s' },
    { cx: 34, cy: 78, r: 3, delay: '0.12s' },
    { cx: 74, cy: 36, r: 3.5, delay: '0.2s' },
    { cx: 25, cy: 45, r: 2.5, delay: '0.28s' },
    { cx: 88, cy: 62, r: 4.5, delay: '0.15s' },
    { cx: 60, cy: 96, r: 3, delay: '0.3s' },
    { cx: 210, cy: 52, r: 3.5, delay: '0.22s' },
    { cx: 235, cy: 84, r: 4, delay: '0.35s' },
    { cx: 248, cy: 120, r: 3, delay: '0.18s' },
    { cx: 38, cy: 130, r: 3.5, delay: '0.25s' },
  ];

  return (
    <div
      onClick={() => {
        setFadingOut(true);
        setTimeout(() => onFinish?.(), 300);
      }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 select-none cursor-pointer transition-opacity duration-500 ${
        fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background:
          'radial-gradient(circle at 50% 38%, #FFFDFB 0%, #F9E6EC 52%, #F2E4D8 100%)',
      }}
    >
      {/* Halo lumineux magique derrière la princesse */}
      <div className="relative flex flex-col items-center">
        <div
          className={`w-72 h-72 sm:w-80 sm:h-80 relative flex items-center justify-center transition-transform duration-700 ${
            wandSparkling ? 'scale-105' : 'scale-100'
          }`}
        >
          <svg
            viewBox="0 0 280 280"
            fill="none"
            className="w-full h-full drop-shadow-[0_12px_28px_rgba(217,138,156,0.28)]"
          >
            {/* Grand cercle féerique */}
            <circle
              cx="145"
              cy="148"
              r="108"
              fill="#FFF9FB"
              stroke="#EBCBD3"
              strokeWidth="2"
            />
            <circle
              cx="145"
              cy="148"
              r="98"
              stroke="#E6C79C"
              strokeWidth="1"
              strokeDasharray="4 4"
            />

            {/* Pluie d'étincelles Disney quand la baguette s'active */}
            {wandSparkling && (
              <g className="animate-fade-in">
                {sparkParticles.map((p, i) => (
                  <g key={i}>
                    <circle
                      cx={p.cx}
                      cy={p.cy}
                      r={p.r}
                      fill={i % 2 === 0 ? '#F2C17D' : '#D98A9C'}
                      className="animate-ping"
                      style={{ animationDuration: '1.6s', animationDelay: p.delay }}
                    />
                    <circle cx={p.cx} cy={p.cy} r={p.r} fill="#FFFDFB" />
                  </g>
                ))}

                {/* Grandes étoiles à 4 branches Disney */}
                <path
                  d="M64 42L68 54L80 58L68 62L64 74L60 62L48 58L60 54L64 42Z"
                  fill="#F0B86E"
                  className="animate-disney-twinkle"
                />
                <path
                  d="M226 58L229 67L238 70L229 73L226 82L223 73L214 70L223 67L226 58Z"
                  fill="#D98A9C"
                  className="animate-disney-twinkle"
                />
                <path
                  d="M42 104L45 112L53 115L45 118L42 126L39 118L31 115L39 112L42 104Z"
                  fill="#F0B86E"
                  className="animate-disney-twinkle"
                />
                {/* Arc-en-ciel de poussière d'or partant de la baguette */}
                <path
                  d="M68 64C105 32 175 28 228 68"
                  stroke="url(#magicTrail)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray="4 6"
                />
              </g>
            )}

            <defs>
              <linearGradient id="magicTrail" x1="68" y1="64" x2="228" y2="68" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F5C97B" />
                <stop offset="0.5" stopColor="#D98A9C" />
                <stop offset="1" stopColor="#F5C97B" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Chevelure arrière de la princesse */}
            <path
              d="M104 105C94 132 92 172 104 205H196C208 172 206 132 196 105C186 80 114 80 104 105Z"
              fill="#8C584C"
            />

            {/* Couronne / Diadème de Princesse */}
            <path
              d="M124 76L132 56L145 68L158 50L171 68L180 56L186 76H124Z"
              fill="#F6D8A8"
              stroke="#B88746"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            <circle cx="158" cy="48" r="3.5" fill="#D98A9C" />
            <circle cx="131" cy="54" r="2.5" fill="#D98A9C" />
            <circle cx="181" cy="54" r="2.5" fill="#D98A9C" />

            {/* Robe de Princesse Rose Poudré & Beige Doré */}
            <path
              d="M126 168L98 238C126 250 184 250 212 238L184 168H126Z"
              fill="#F7D6E0"
              stroke="#B86B7D"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />
            {/* Bustier & Manches bouffantes */}
            <circle cx="122" cy="176" r="14" fill="#FBE8EE" stroke="#B86B7D" strokeWidth="2" />
            <circle cx="188" cy="176" r="14" fill="#FBE8EE" stroke="#B86B7D" strokeWidth="2" />
            <path
              d="M130 162C140 156 170 156 180 162L175 198H135L130 162Z"
              fill="#FFFDFB"
              stroke="#C59B76"
              strokeWidth="2"
            />
            {/* Nœud doré à la taille */}
            <rect x="134" y="194" width="42" height="6" rx="3" fill="#E8C396" stroke="#B88746" strokeWidth="1.5" />

            {/* Cou & Visage */}
            <rect x="148" y="146" width="14" height="18" rx="6" fill="#FDE7DF" />
            <path
              d="M114 112C114 88 132 74 155 74C178 74 196 88 196 112C196 138 178 154 155 154C132 154 114 138 114 112Z"
              fill="#FFF0EA"
              stroke="#C89D94"
              strokeWidth="2"
            />

            {/* Frange & Mèches de princesse */}
            <path
              d="M114 110C118 86 138 78 155 78C172 78 192 86 196 110C186 96 172 92 155 96C138 92 124 96 114 110Z"
              fill="#A06658"
            />

            {/* Joues rosées */}
            <ellipse cx="130" cy="129" rx="7" ry="4" fill="#F4B8C6" opacity="0.65" />
            <ellipse cx="180" cy="129" rx="7" ry="4" fill="#F4B8C6" opacity="0.65" />

            {/* YEUX DE LA PRINCESSE : Fermés au début -> S'ouvrent avec des étoiles dorées ! */}
            {!eyesOpen ? (
              <g>
                {/* Œil gauche fermé avec longs cils */}
                <path
                  d="M128 116C132 122 142 122 146 116"
                  stroke="#5C3D38"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
                <path d="M131 119L129 123M137 121V125M143 119L145 123" stroke="#5C3D38" strokeWidth="1.8" strokeLinecap="round" />

                {/* Œil droit fermé avec longs cils */}
                <path
                  d="M164 116C168 122 178 122 182 116"
                  stroke="#5C3D38"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
                <path d="M167 119L165 123M173 121V125M179 119L181 123" stroke="#5C3D38" strokeWidth="1.8" strokeLinecap="round" />
              </g>
            ) : (
              <g>
                {/* Œil gauche ouvert avec étoile dorée (comme sur l'image de référence !) */}
                <ellipse cx="137" cy="116" rx="9" ry="10.5" fill="#5A3932" />
                <ellipse cx="137" cy="117" rx="6.5" ry="7.5" fill="#9E6248" />
                {/* Étoile dans la pupille */}
                <path
                  d="M137 110L138.6 114.8L143.5 116.5L138.6 118.2L137 123L135.4 118.2L130.5 116.5L135.4 114.8L137 110Z"
                  fill="#FFE39F"
                />
                <circle cx="133" cy="112" r="2.2" fill="#FFFFFF" />
                <path d="M126 110C131 104 143 104 147 110" stroke="#4A2E2B" strokeWidth="2.5" strokeLinecap="round" />

                {/* Œil droit ouvert avec étoile dorée */}
                <ellipse cx="173" cy="116" rx="9" ry="10.5" fill="#5A3932" />
                <ellipse cx="173" cy="117" rx="6.5" ry="7.5" fill="#9E6248" />
                <path
                  d="M173 110L174.6 114.8L179.5 116.5L174.6 118.2L173 123L171.4 118.2L166.5 116.5L171.4 114.8L173 110Z"
                  fill="#FFE39F"
                />
                <circle cx="169" cy="112" r="2.2" fill="#FFFFFF" />
                <path d="M163 110C167 104 179 104 184 110" stroke="#4A2E2B" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            )}

            {/* Sourire doux -> Joyeux quand les yeux s'ouvrent */}
            {!eyesOpen ? (
              <path
                d="M150 136C153 139 157 139 160 136"
                stroke="#B86B7D"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M147 134C149 142 161 142 163 134Z"
                fill="#E38B9E"
                stroke="#9E4E60"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            )}

            {/* Bras + Baguette Magique (Stick) qui bouge et lance des étincelles */}
            <g
              style={{
                transformOrigin: '115px 175px',
                transform: wandSparkling ? 'rotate(-14deg)' : 'rotate(8deg)',
                transition: 'transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {/* Bras tenant la baguette */}
              <path
                d="M116 176L88 128"
                stroke="#FFF0EA"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M116 176L88 128"
                stroke="#C89D94"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* La Baguette Magique (Stick) */}
              <line
                x1="92"
                y1="134"
                x2="64"
                y2="66"
                stroke="#C59B76"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
              <circle cx="88" cy="124" r="5" fill="#D98A9C" stroke="#FFFDFB" strokeWidth="1.5" />

              {/* Étoile magique au bout de la baguette */}
              <g
                style={{
                  transformOrigin: '64px 64px',
                }}
                className={wandSparkling ? 'animate-spin-slow' : ''}
              >
                <circle
                  cx="64"
                  cy="64"
                  r={wandSparkling ? '22' : '10'}
                  fill="#FCE5B4"
                  opacity="0.55"
                />
                <path
                  d="M64 44L69 59L84 64L69 69L64 84L59 69L44 64L59 59L64 44Z"
                  fill="#F6C467"
                  stroke="#B88746"
                  strokeWidth="1.5"
                />
                <circle cx="64" cy="64" r="4" fill="#FFFFFF" />
              </g>
            </g>
          </svg>
        </div>

        {/* Texte Princesse Sarah */}
        <div className="text-center space-y-2 -mt-2">
          <p className="text-xs uppercase tracking-[0.25em] text-[#B86B7D] font-semibold">
            ✨ Il était une fois ✨
          </p>
          <h1 className="font-serif-bridal text-4xl sm:text-5xl font-semibold text-[#4A3B39]">
            Princesse Sarah
          </h1>
          <p className="text-xs sm:text-sm text-[#84706C]">
            Ton carnet féerique de robes & tenues de mariée
          </p>

          <button
            type="button"
            onClick={() => {
              setFadingOut(true);
              setTimeout(() => onFinish?.(), 250);
            }}
            className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#B86B7D] text-white text-xs sm:text-sm font-medium shadow-md hover:bg-[#A3596A] transition-all"
          >
            <span>Entrer dans la magie ✨</span>
          </button>
        </div>
      </div>
    </div>
  );
}
