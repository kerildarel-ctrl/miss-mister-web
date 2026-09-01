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

      <main className="flex-1 min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 font-poppins bg-[#F8FAFC]">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-xs font-extrabold text-pink-600 uppercase tracking-widest">
            <Trophy className="w-4 h-4 text-pink-600" />
            <span>Catalogue Officiel • Votez en Direct</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight">
            TOUTES LES <span className="text-blue-600">COMPÉTITIONS</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600">
            Parcourez les événements officiels, découvrez les enjeux et votez pour soutenir vos candidats préférés.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex justify-center">
          <div className="flex items-center bg-white p-1.5 rounded-full border border-slate-200 shadow-md">
            {[
              { id: 'TOUTES', label: 'Toutes' },
              { id: 'EN COURS', label: 'En Cours' },
              { id: 'A VENIR', label: 'À Venir' },
              { id: 'TERMINE', label: 'Terminé' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id as any)}
                className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all ${
                  filterStatus === tab.id
                    ? 'blue-pill-btn text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Competitions Grid */}
        {isLoading ? (
          <div className="py-16 text-center text-slate-500 font-bold">
            Chargement des compétitions...
          </div>
        ) : filteredCompetitions.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm max-w-xl mx-auto">
            <Sparkles className="w-12 h-12 text-pink-500 mx-auto" />
            <h3 className="text-2xl font-black text-slate-900">Aucune compétition en cours</h3>
            <p className="text-sm text-slate-500">
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
