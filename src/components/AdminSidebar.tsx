'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Trophy,
  Users,
  Vote,
  BarChart2,
  Settings,
  Menu,
  X,
  ArrowLeft,
  ShieldCheck,
  Crown,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: '/keril', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/keril/competitions', label: 'Compétitions', icon: Trophy },
    { href: '/keril/candidates', label: 'Candidats', icon: Users },
    { href: '/keril/votes', label: 'Votes', icon: Vote },
    { href: '/resultats', label: 'Résultats', icon: BarChart2 },
    { href: '/keril/settings', label: 'Paramètres', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/keril') return pathname === '/keril';
    return pathname.startsWith(path);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('keril_admin_auth');
      window.location.href = '/keril';
    }
  };

  return (
    <>
      {/* Top Mobile Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between font-poppins">
        <Link href="/" className="flex items-center gap-2">
          {!imageError ? (
            <div className="relative h-8 w-32">
              <Image
                src="/images/logo.png"
                alt="MISS MISTER Logo"
                fill
                className="object-contain object-left"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <span className="font-black text-[#0F172A]">MISS MISTER</span>
          )}
          <span className="text-[10px] font-extrabold uppercase text-pink-600 bg-pink-50 px-2 py-0.5 rounded">KERIL</span>
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl text-slate-700 hover:text-blue-600 bg-slate-100"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 bg-white min-h-screen p-6 fixed top-0 left-0 bottom-0 z-40 font-poppins shadow-sm">
        
        {/* Brand */}
        <div className="pb-8 border-b border-slate-100">
          <Link href="/" className="flex flex-col gap-2">
            {!imageError ? (
              <div className="relative h-10 w-44">
                <Image
                  src="/images/logo.png"
                  alt="MISS MISTER Logo"
                  fill
                  className="object-contain object-left"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Crown className="w-6 h-6 text-pink-600" />
                <span className="font-black text-xl text-slate-900">MISS MISTER</span>
              </div>
            )}
            <span className="text-[9px] font-extrabold uppercase text-pink-600 bg-pink-50 px-2 py-0.5 rounded border border-pink-200 w-fit">
              ESPACE ADMIN /KERIL
            </span>
          </Link>
        </div>

        {/* Links */}
        <nav className="flex-1 space-y-2 pt-6">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all ${
                  active
                    ? 'blue-pill-btn text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-blue-600'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Banner & Logout */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Espace Sécurisé</p>
              <p className="text-[11px] text-emerald-700">Connecté sur /keril</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 transition-colors font-bold"
          >
            <LogOut className="w-4 h-4 text-rose-600" /> Se déconnecter
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors font-bold"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600" /> Voir le site public
          </Link>
        </div>

      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex font-poppins">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-72 bg-white border-r border-slate-200 p-6 flex flex-col justify-between z-10 shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <span className="font-black text-slate-900 text-lg">ADMIN /KERIL</span>
                  <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-900">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="space-y-2 pt-6">
                  {links.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider ${
                          active
                            ? 'blue-pill-btn text-white'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 text-xs text-rose-600 font-bold"
                >
                  <LogOut className="w-4 h-4 text-rose-600" /> Se déconnecter
                </button>
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-xs text-slate-600 hover:text-blue-600 font-bold"
                >
                  <ArrowLeft className="w-4 h-4 text-blue-600" /> Voir le site public
                </Link>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
