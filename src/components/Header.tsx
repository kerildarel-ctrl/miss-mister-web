'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Crown } from 'lucide-react';
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
    <header className="sticky top-0 z-50 w-full bg-[#060911]/60 backdrop-blur-2xl border-b border-white/20 font-poppins shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 sm:py-3 min-h-[88px]">
          
          {/* PROMINENT LOGO */}
          <Link href="/" className="flex items-center py-1 group">
            {!imageError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/images/logo.png"
                alt="MISS MISTER Logo"
                className="h-16 sm:h-20 lg:h-24 w-auto object-contain max-w-[260px] sm:max-w-[380px] scale-110 sm:scale-100 origin-left transition-transform duration-300 group-hover:scale-105 drop-shadow-md"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-700 p-0.5 shadow-md flex items-center justify-center">
                  <Crown className="w-7 h-7 text-slate-950 fill-slate-950 animate-pulse" />
                </div>
                <div className="flex items-center text-2xl sm:text-3xl font-black tracking-tight leading-none">
                  <span className="text-white">MISS </span>
                  <span className="gradient-text-gold ml-1">MISTER</span>
                </div>
              </div>
            )}
          </Link>

          {/* Desktop Navigation - ULTRA FROSTED GLASS PILLS */}
          <nav className="hidden md:flex items-center gap-2 glass-inner-box p-1.5 rounded-full border border-white/30 shadow-2xl">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                    active
                      ? 'gold-gradient-btn text-slate-950 shadow-lg scale-105'
                      : 'text-slate-200 hover:text-white hover:bg-white/20'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-3 rounded-2xl text-amber-400 glass-inner-box border border-white/30 shadow-xl"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-7 h-7 text-amber-400" /> : <Menu className="w-7 h-7 text-amber-400" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation in Frosted Glass */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#060911]/90 backdrop-blur-3xl border-b border-white/20 overflow-hidden shadow-2xl"
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
                        ? 'gold-gradient-btn text-slate-950 shadow-lg'
                        : 'text-slate-200 hover:bg-white/20 hover:text-amber-400'
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
