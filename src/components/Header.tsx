'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Crown, Palette, Sun, Moon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light-gold' | 'dark-gold' | 'vibrant-pink'>('light-gold');
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const pathname = usePathname();

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('miss_mister_theme') as any;
    if (savedTheme && ['light-gold', 'dark-gold', 'vibrant-pink'].includes(savedTheme)) {
      setCurrentTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const changeTheme = (theme: 'light-gold' | 'dark-gold' | 'vibrant-pink') => {
    setCurrentTheme(theme);
    localStorage.setItem('miss_mister_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    setIsThemeDropdownOpen(false);
  };

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
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-amber-200/80 font-poppins shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 min-h-[84px]">
          
          {/* PROMINENT LOGO */}
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
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-500 p-0.5 shadow-md flex items-center justify-center">
                  <Crown className="w-6 h-6 text-slate-950 fill-slate-950 animate-pulse" />
                </div>
                <div className="flex items-center text-2xl sm:text-3xl font-black tracking-tight leading-none">
                  <span className="text-slate-900">MISS </span>
                  <span className="gradient-text-gold ml-1">MISTER</span>
                </div>
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 bg-slate-100/90 p-1.5 rounded-full border border-slate-200/80 shadow-inner">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-300 ${
                    active
                      ? 'gold-gradient-btn text-slate-950 shadow-md scale-105'
                      : 'text-slate-800 hover:text-amber-600 hover:bg-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* INTERACTIVE COLOR THEME SELECTOR DROPDOWN (REPLACED TOP VOTE BUTTON) */}
          <div className="relative flex items-center gap-2">
            
            {/* Color Theme Selector Trigger */}
            <button
              onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-amber-50 border border-amber-300/80 text-xs font-black text-slate-900 shadow-sm transition-all"
              title="Choisir le style de couleurs"
            >
              <Palette className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline uppercase tracking-wider">Style</span>
              <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black">
                {currentTheme === 'light-gold' ? '☀️ Or Épuré' : currentTheme === 'dark-gold' ? '🌙 Gala Noir' : '💖 Rose'}
              </span>
            </button>

            {/* Theme Selection Dropdown Menu */}
            <AnimatePresence>
              {isThemeDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-12 w-56 bg-white rounded-3xl p-3 shadow-2xl border border-amber-300/80 z-50 space-y-1.5 font-poppins"
                >
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1">
                    Choisir votre Thème
                  </p>

                  <button
                    onClick={() => changeTheme('light-gold')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-black transition-all ${
                      currentTheme === 'light-gold'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-500" /> ☀️ Royal Or & Épuré
                    </span>
                    {currentTheme === 'light-gold' && <span className="text-amber-600 font-bold">✓</span>}
                  </button>

                  <button
                    onClick={() => changeTheme('dark-gold')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-black transition-all ${
                      currentTheme === 'dark-gold'
                        ? 'bg-slate-900 text-amber-400 border border-amber-500/40'
                        : 'text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-amber-400" /> 🌙 Gala Noir & Or
                    </span>
                    {currentTheme === 'dark-gold' && <span className="text-amber-400 font-bold">✓</span>}
                  </button>

                  <button
                    onClick={() => changeTheme('vibrant-pink')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-black transition-all ${
                      currentTheme === 'vibrant-pink'
                        ? 'bg-pink-100 text-pink-900 border border-pink-300'
                        : 'text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-500" /> 💖 Rose & Violet
                    </span>
                    {currentTheme === 'vibrant-pink' && <span className="text-pink-600 font-bold">✓</span>}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-2xl text-slate-800 hover:text-amber-600 bg-slate-100 border border-slate-200/80 shadow-xs"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-amber-600" /> : <Menu className="w-6 h-6 text-blue-600" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/98 backdrop-blur-2xl border-b border-amber-200 overflow-hidden shadow-2xl"
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
                        : 'text-slate-800 hover:bg-amber-50 hover:text-amber-600'
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
