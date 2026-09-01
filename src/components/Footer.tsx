'use client';

import React from 'react';
import Link from 'next/link';
import { Crown, Heart, ShieldCheck, Share2, Globe, Video, Camera } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#07090e] border-t border-amber-500/25 text-slate-400 font-poppins pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-400 fill-amber-400" />
              <span className="text-xl font-black gradient-text-gold tracking-tight">MISS MISTER</span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed">
              La plateforme officielle de vote et d&apos;élection en ligne pour concours de beauté et d&apos;excellence.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Paiement Sécurisé Fapshi</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-amber-400 tracking-widest">Navigation</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li><Link href="/" className="hover:text-amber-400 transition-colors">Accueil</Link></li>
              <li><Link href="/competitions" className="hover:text-amber-400 transition-colors">Compétitions</Link></li>
              <li><Link href="/classement" className="hover:text-amber-400 transition-colors">Classement En Direct</Link></li>
              <li><Link href="/resultats" className="hover:text-amber-400 transition-colors">Résultats</Link></li>
            </ul>
          </div>

          {/* Confidential Admin Route */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-amber-400 tracking-widest">Espace Organisateur</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li><Link href="/keril" className="hover:text-amber-400 transition-colors">Connexion Espace /keril</Link></li>
              <li><Link href="/keril/competitions" className="hover:text-amber-400 transition-colors">Gestion des Compétitions</Link></li>
              <li><Link href="/keril/candidates" className="hover:text-amber-400 transition-colors">Gestion des Candidats</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-amber-400 tracking-widest">Suivez-Nous</h4>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/share/1Hf5TYLo1o/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                className="w-10 h-10 rounded-2xl bg-slate-900 border border-amber-500/30 flex items-center justify-center text-amber-400 hover:bg-amber-400 hover:text-slate-950 transition-all shadow-md"
              >
                <Share2 className="w-5 h-5" />
              </a>

              <a
                href="https://www.instagram.com/mk__prog?igsi=MWhyaXBtZDVidGdhYg%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="w-10 h-10 rounded-2xl bg-slate-900 border border-amber-500/30 flex items-center justify-center text-amber-400 hover:bg-amber-400 hover:text-slate-950 transition-all shadow-md"
              >
                <Camera className="w-5 h-5" />
              </a>

              <a
                href="https://www.facebook.com/share/1Hf5TYLo1o/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                title="YouTube"
                className="w-10 h-10 rounded-2xl bg-slate-900 border border-amber-500/30 flex items-center justify-center text-amber-400 hover:bg-amber-400 hover:text-slate-950 transition-all shadow-md"
              >
                <Video className="w-5 h-5" />
              </a>

              <a
                href="https://www.instagram.com/mk__prog?igsi=MWhyaXBtZDVidGdhYg%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                title="TikTok"
                className="w-10 h-10 rounded-2xl bg-slate-900 border border-amber-500/30 flex items-center justify-center text-amber-400 hover:bg-amber-400 hover:text-slate-950 transition-all shadow-md"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} MISS MISTER. Tous droits réservés.</p>
          <p className="flex items-center gap-1">
            Fait avec <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> pour l&apos;excellence.
          </p>
        </div>

      </div>
    </footer>
  );
};
