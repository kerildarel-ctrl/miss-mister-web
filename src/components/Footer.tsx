'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Crown, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const [imageError, setImageError] = useState(false);

  const facebookUrl = 'https://www.facebook.com/share/1Hf5TYLo1o/?mibextid=wwXIfr';
  const instagramUrl = 'https://www.instagram.com/mk__prog?igsi=MWhyaXBtZDVidGdhYg%3D%3D&utm_source=qr';

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 pt-16 pb-8 font-poppins">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-slate-100">
          
          {/* Left Column: Logo & Tagline */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              {!imageError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/images/logo.png"
                  alt="MISS MISTER Logo"
                  className="h-14 sm:h-16 w-auto object-contain max-w-[280px]"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-pink-500 p-0.5 shadow-md flex items-center justify-center">
                    <Crown className="w-5 h-5 text-white fill-white" />
                  </div>
                  <div className="flex items-center text-2xl font-black tracking-tight">
                    <span className="text-pink-600">MISS</span>
                    <span className="text-blue-600 ml-1">MISTER</span>
                  </div>
                </div>
              )}
            </Link>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              La plateforme officielle dédiée aux compétitions de beauté, de charisme et de leadership.
            </p>
          </div>

          {/* Middle Column: Liens rapides */}
          <div className="space-y-3">
            <h4 className="text-slate-900 font-extrabold text-xs tracking-wider uppercase">
              Liens rapides
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
              <Link href="/" className="hover:text-blue-600 transition-colors">Accueil</Link>
              <Link href="/classement" className="hover:text-blue-600 transition-colors">Classement</Link>
              <Link href="/competitions" className="hover:text-blue-600 transition-colors">Compétitions</Link>
              <Link href="/resultats" className="hover:text-blue-600 transition-colors">Résultats</Link>
            </div>
          </div>

          {/* Right Column: Suivez-nous */}
          <div className="space-y-3">
            <h4 className="text-slate-900 font-extrabold text-xs tracking-wider uppercase">
              Suivez-nous
            </h4>
            <div className="flex items-center gap-3">
              
              {/* Facebook Icon */}
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* Instagram Icon */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* TikTok Icon */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-100 text-slate-800 hover:bg-black hover:text-white flex items-center justify-center transition-colors shadow-sm"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V5.82a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 12a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.86z"/>
                </svg>
              </a>

              {/* YouTube Icon */}
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2024 Miss Mister. Tous droits réservés.</p>
          <div className="flex items-center gap-1">
            Fait avec <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 mx-0.5" /> pour l&apos;excellence.
          </div>
        </div>

      </div>
    </footer>
  );
};
