'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CompetitionCard } from '@/components/CompetitionCard';
import { getCompetitions } from '@/services/dbService';
import { Competition } from '@/data/mockData';
import { Trophy, Sparkles } from 'lucide-react';

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [filterStatus, setFilterStatus] = useState<'TOUTES' | 'EN COURS' | 'A VENIR' | 'TERMINE'>('TOUTES');
  const [isLoading, setIsLoading] = useState(true);

  // Load competitions from live DB
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await getCompetitions();
      setCompetitions(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const filteredCompetitions = competitions.filter((comp) => {
    if (filterStatus === 'TOUTES') return true;
    return comp.status === filterStatus;
  });

  return (
    <>
      <Header />

      <main className="flex-1 min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 font-poppins bg-[#0B0E14] text-white">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#131A26] border border-amber-500/30 text-xs font-black text-amber-400 uppercase tracking-widest">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Catalogue Officiel • Votez en Direct</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            TOUTES LES <span className="gradient-text-gold">COMPÉTITIONS</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium">
            Parcourez les événements officiels, découvrez les enjeux et votez pour soutenir vos candidats préférés.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex justify-center">
          <div className="flex items-center bg-[#131A26]/90 backdrop-blur-xl p-1.5 rounded-full border border-amber-500/30 shadow-2xl">
            {[
              { id: 'TOUTES', label: 'Toutes' },
              { id: 'EN COURS', label: 'En Cours' },
              { id: 'A VENIR', label: 'À Venir' },
              { id: 'TERMINE', label: 'Terminé' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id as any)}
                className={`px-5 py-2.5 rounded-full text-xs font-black transition-all ${
                  filterStatus === tab.id
                    ? 'gold-gradient-btn text-slate-950 shadow-md scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-[#1E293B]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Competitions Grid */}
        {isLoading ? (
          <div className="py-16 text-center text-slate-400 font-bold">
            Chargement des compétitions...
          </div>
        ) : filteredCompetitions.length === 0 ? (
          <div className="bg-[#131A26]/90 backdrop-blur-xl p-12 rounded-3xl border border-amber-500/20 text-center space-y-4 shadow-2xl max-w-xl mx-auto">
            <Sparkles className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="text-2xl font-black text-white">Aucune compétition disponible</h3>
            <p className="text-sm text-slate-300 font-medium">
              Les prochaines élections seront bientôt ouvertes. Restez connectés !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredCompetitions.map((comp) => (
              <CompetitionCard key={comp.id} competition={comp} />
            ))}
          </div>
        )}

      </main>

      <Footer />
    </>
  );
}
