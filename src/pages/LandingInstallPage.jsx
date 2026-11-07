import {
  Check,
  Copy,
  Crown,
  Download,
  Share,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DressDrawing } from '../components/DressIllustrations';
import { useBridal } from '../context/BridalContext';

export default function LandingInstallPage({ onEnterFullApp }) {
  const { subcategories, shops } = useBridal();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallNow = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setDeferredPrompt(null);
        onEnterFullApp?.();
      }
    } else {
      setShowIosGuide(true);
    }
  };

  const installUrl = `${window.location.origin}/install`;

  const copyInstallLink = () => {
    navigator.clipboard?.writeText(installUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="h-[100dvh] w-full native-app-scroll bg-princess-gradient px-4 py-8">
      <div className="max-w-md mx-auto space-y-6 pb-10">
        {/* Carte Principale d'Installation PWA */}
        <div className="bg-card-bridal rounded-[2.2rem] p-6 text-center shadow-princess space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-[#F9E8EC] border border-[#E5C5CD] flex items-center justify-center mx-auto shadow-xs">
            <Crown className="w-8 h-8 text-[#B86B7D]" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#B86B7D] font-semibold">
              Application Mobile Mariée
            </span>
            <h1 className="font-serif-bridal text-4xl font-semibold text-[#4A3B39]">
              Aroussa
            </h1>
            <p className="text-xs text-[#84706C]">
              Installe l&apos;application <strong>Aroussa</strong> sur ton téléphone pour accéder aux{' '}
              <strong>{shops.length || 34} boutiques</strong>, cartes, numéros et ta liste de
              favoris.
            </p>
          </div>

          {/* Gros bouton d'installation */}
          <button
            type="button"
            onClick={handleInstallNow}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#B86B7D] hover:bg-[#A3596A] active:scale-[0.98] text-white text-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Installer Aroussa (PWA)</span>
          </button>

          {/* Lien séparé d'installation partageable */}
          <div className="pt-1 flex items-center justify-between gap-2 px-3 py-2 rounded-2xl bg-[#FAF6F1] border border-[#EAD9D5] text-xs">
            <span className="truncate text-[#7D6A66] font-mono text-[11px]">
              {installUrl}
            </span>
            <button
              type="button"
              onClick={copyInstallLink}
              className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#F9E8EC] text-[#B86B7D] font-medium"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copié</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier lien</span>
                </>
              )}
            </button>
          </div>

          {/* Guide d'installation rapide si iOS / navigateur sans prompt automatique */}
          {showIosGuide && (
            <div className="p-4 rounded-2xl bg-[#FFFDFB] border border-[#E5C5CD] text-left space-y-2 text-xs text-[#6B5753]">
              <p className="font-semibold text-[#B86B7D] flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" />
                <span>Comment installer sur ton téléphone :</span>
              </p>
              <p className="flex items-center gap-1.5">
                <span>1. Sur iPhone : appuie sur</span>
                <Share className="w-3.5 h-3.5 text-[#B86B7D] inline" />
                <strong>Partager → Sur l&apos;écran d&apos;accueil</strong>.
              </p>
              <p>
                2. Sur Android (Chrome) : appuie sur <strong>⋮</strong> en haut à droite →{' '}
                <strong>Installer l&apos;application</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Aperçu minimaliste des catégories de tenues (sans dévoiler tout le catalogue sur le web) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-serif-bridal text-2xl font-semibold text-[#4A3B39]">
              Catégories disponibles dans l&apos;App
            </h2>
            <Sparkles className="w-4 h-4 text-[#B86B7D]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {subcategories.map((sub) => (
              <div
                key={sub.id || sub.slug}
                onClick={handleInstallNow}
                className="bg-card-bridal rounded-3xl p-3.5 flex flex-col items-center text-center cursor-pointer active:scale-95 transition-transform"
              >
                <DressDrawing slug={sub.slug} className="w-20 h-20 mb-1" />
                <span className="font-serif-bridal text-lg font-semibold text-[#4A3B39] leading-tight">
                  {sub.short_label || sub.name_fr}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Petit bouton discret pour ouvrir quand même depuis le navigateur si besoin */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onEnterFullApp}
            className="text-xs text-[#84706C] underline hover:text-[#4A3B39]"
          >
            Continuer vers l&apos;application complète →
          </button>
        </div>
      </div>
    </div>
  );
}

