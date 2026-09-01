'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Crown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/competitions', label: 'Compétitions' },
    { href: '/classement', label: 'Classement' },
    { href: '/resultats', label: 'Résultats' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a0d14]/90 backdrop-blur-2xl border-b border-amber-500/25 font-poppins shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 min-h-[84px]">
          
          {/* PROMINENT LOGO WITH GOLD SHINE */}
          <Link href="/" className="flex items-center py-1 group">
            {!imageError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/images/logo.png"
                alt="MISS MISTER Logo"
                className="h-12 sm:h-16 lg:h-18 w-auto object-contain max-w-[240px] sm:max-w-[340px] transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-600 to-yellow-600 p-0.5 shadow-lg flex items-center justify-center">
                  <Crown className="w-6 h-6 text-slate-950 fill-slate-950 animate-pulse" />
                </div>
                <div className="flex items-center text-2xl sm:text-3xl font-black tracking-tight leading-none">
                  <span className="gradient-text-gold">MISS MISTER</span>
                </div>
              </div>
            )}
          </Link>

          {/* Desktop Navigation with Luxury Gold & Glowing Active Pills */}
          <nav className="hidden md:flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-full border border-amber-500/30 shadow-inner">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                    active
                      ? 'gold-gradient-btn text-slate-950 shadow-lg scale-105'
                      : 'text-slate-300 hover:text-amber-400 hover:bg-slate-800/80'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Right CTA & Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              href="/competitions"
              className="px-3.5 py-2 rounded-full gold-gradient-btn text-[11px] font-black uppercase tracking-wider text-slate-950 shadow-md flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vote</span>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-2xl text-amber-400 bg-slate-900 border border-amber-500/30 shadow-xs"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-amber-400" /> : <Menu className="w-6 h-6 text-amber-400" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation in Dark Gold */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0d14]/98 backdrop-blur-2xl border-b border-amber-500/30 overflow-hidden shadow-2xl"
          >
            <div className="px-4 pt-4 pb-6 space-y-2.5">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-5 py-3.5 rounded-2xl text-sm font-black uppercase tracking-wider transition-all ${
                      active
                        ? 'gold-gradient-btn text-slate-950 shadow-md'
                        : 'text-slate-200 hover:bg-slate-900 hover:text-amber-400'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
