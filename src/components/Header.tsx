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
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-pink-100/60 font-poppins shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 min-h-[84px]">
          
          {/* PROMINENT LOGO WITH CAPTIVATING SHINE */}
          <Link href="/" className="flex items-center py-1 group">
            {!imageError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/images/logo.png"
                alt="MISS MISTER Logo"
                className="h-12 sm:h-16 lg:h-18 w-auto object-contain max-w-[240px] sm:max-w-[340px] transition-transform duration-300 group-hover:scale-105"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-600 via-purple-600 to-blue-600 p-0.5 shadow-md flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white fill-white animate-pulse" />
                </div>
                <div className="flex items-center text-2xl sm:text-3xl font-black tracking-tight leading-none">
                  <span className="gradient-text-captivating">MISS MISTER</span>
                </div>
              </div>
            )}
          </Link>

          {/* Desktop Navigation with Captivating Gradient Active Pills */}
          <nav className="hidden md:flex items-center gap-2 bg-slate-100/90 p-1.5 rounded-full border border-slate-200/80 shadow-inner">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-300 ${
                    active
                      ? 'captivating-gradient-btn text-white shadow-md scale-105'
                      : 'text-slate-700 hover:text-pink-600 hover:bg-white'
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
              className="px-3.5 py-2 rounded-full captivating-gradient-btn text-[11px] font-black uppercase tracking-wider text-white shadow-sm flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vote</span>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-2xl text-slate-800 hover:text-pink-600 bg-slate-100 border border-slate-200/80 shadow-xs"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-pink-600" /> : <Menu className="w-6 h-6 text-blue-600" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation with Vibrant Colors */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/98 backdrop-blur-2xl border-b border-pink-200 overflow-hidden shadow-2xl"
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
                        ? 'captivating-gradient-btn text-white shadow-md'
                        : 'text-slate-800 hover:bg-pink-50 hover:text-pink-600'
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
