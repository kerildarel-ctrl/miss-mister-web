'use client';

import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, ShieldAlert, Sparkles } from 'lucide-react';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('keril_admin_auth');
      setIsAuthenticated(auth === 'true');
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Arielle74#') {
      sessionStorage.setItem('keril_admin_auth', 'true');
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (isAuthenticated === null) {
    return null; // Loading state
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 font-poppins text-slate-900">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-6 text-center">
          
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-200 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-[10px] font-extrabold text-pink-600 uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Accès Securisé — Administrateur</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              CONNEXION <span className="text-blue-600">/KERIL</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Entrez votre mot de passe administrateur pour déverrouiller le panneau de gestion.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Mot de passe administrateur
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Mot de passe..."
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border text-slate-900 text-sm font-mono focus:outline-none transition-colors ${
                    error ? 'border-rose-500 bg-rose-50' : 'border-slate-200 focus:border-blue-500'
                  }`}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>Mot de passe incorrect. Réessayez.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full blue-pill-btn py-3.5 rounded-2xl font-extrabold text-xs uppercase tracking-wider text-white shadow-md transition-all"
            >
              Déverrouiller le panneau Admin
            </button>
          </form>

        </div>
      </div>
    );
  }

  return <>{children}</>;
};
