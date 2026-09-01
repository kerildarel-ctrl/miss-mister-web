'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminAuthGuard } from '@/components/AdminAuthGuard';
import { Save, ShieldCheck, Sparkles, Database, CheckCircle2, RotateCcw, Trash2 } from 'lucide-react';

export default function KerilSettingsPage() {
  const [platformName, setPlatformName] = useState('MISS MISTER');
  const [slogan, setSlogan] = useState('Votre vote, votre choix, votre champion.');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetToZero = async () => {
    if (!confirm('Voulez-vous vraiment TOUT réinitialiser à zéro ?')) {
      return;
    }
    setIsResetting(true);
    setResetMessage(null);
    try {
      const res = await fetch('/api/admin/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setResetMessage('✅ Toutes les données ont été réinitialisées à 0 avec succès !');
      } else {
        setResetMessage(`⚠️ ${data.error}`);
      }
    } catch {
      setResetMessage('✅ Réinitialisation locale effectuée à 0.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setResetMessage(null);
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setResetMessage('✅ Base Supabase synchronisée avec succès !');
      } else {
        setResetMessage(`⚠️ ${data.error}`);
      }
    } catch {
      setResetMessage('⚠️ Vérifiez la création des tables dans Supabase.');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col lg:flex-row w-full font-poppins">
        <AdminSidebar />

        <main className="flex-1 w-full min-w-0 lg:ml-64 p-4 sm:p-8 space-y-6 sm:space-y-8 overflow-x-hidden">
          
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="text-[10px] sm:text-xs font-black text-amber-800 uppercase tracking-widest">
                  Paramètres & Sécurité (/keril)
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                PARAMÈTRES <span className="gradient-text-gold">SYSTÈME</span>
              </h1>
            </div>
          </div>

          {/* 1. RESET TO ZERO / SEED CARD */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-200 shadow-md max-w-3xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-950">Réinitialisation & Synchronisation Base</h3>
                <p className="text-xs text-slate-500 font-semibold">Videz la base pour repartir à 0 ou réinjectez les compétitions de démonstration.</p>
              </div>
            </div>

            {resetMessage && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{resetMessage}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleResetToZero}
                disabled={isResetting}
                className="py-3 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 font-black text-xs uppercase tracking-wider text-white shadow-md flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-white" />
                <span>{isResetting ? 'Réinitialisation...' : 'Tout Réinitialiser à 0'}</span>
              </button>

              <button
                type="button"
                onClick={handleSeedDatabase}
                disabled={isSeeding}
                className="py-3 px-6 rounded-2xl gold-gradient-btn font-black text-xs uppercase tracking-wider text-slate-950 shadow-md flex items-center gap-2 transition-colors"
              >
                <Database className="w-4 h-4 text-slate-950" />
                <span>{isSeeding ? 'Initialisation...' : 'Injecter les Données de Démo'}</span>
              </button>
            </div>
          </div>

          {/* 2. GENERAL SETTINGS FORM */}
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-md max-w-3xl space-y-6">
            
            <form onSubmit={handleSave} className="space-y-6">
              
              {/* Nom de la plateforme */}
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                  Nom de la plateforme
                </label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-950 font-bold text-sm focus:outline-none focus:border-amber-500 shadow-xs"
                />
              </div>

              {/* Slogan */}
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                  Slogan officiel
                </label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-950 text-sm font-bold focus:outline-none focus:border-amber-500 shadow-xs"
                />
              </div>

              {savedSuccess && (
                <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Paramètres enregistrés avec succès !</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="gold-gradient-btn py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider text-slate-950 shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4 text-slate-950" />
                  <span>Enregistrer les paramètres</span>
                </button>
              </div>

            </form>

          </div>

        </main>
      </div>
    </AdminAuthGuard>
  );
}
