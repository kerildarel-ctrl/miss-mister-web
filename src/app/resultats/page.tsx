'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getCompetitions, getCandidates } from '@/services/dbService';
import { Competition, Candidate } from '@/data/mockData';
import { BarChart3, TrendingUp, PieChart, Trophy, Award, Users, Vote, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResultatsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const comps = await getCompetitions();
      setCompetitions(comps);
      if (comps.length > 0) {
        const initialSlug = comps[0].slug;
        setSelectedSlug(initialSlug);
        const cands = await getCandidates(initialSlug);
        setCandidates(cands);
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleSelectComp = async (slug: string) => {
    setSelectedSlug(slug);
    const cands = await getCandidates(slug);
    setCandidates(cands);
  };

  const currentCompetition = competitions.find((c) => c.slug === selectedSlug) || competitions[0];
  const sortedCandidates = [...candidates].sort((a, b) => b.voteCount - a.voteCount);
  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);

  return (
    <>
      <Header />

      <main className="flex-1 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 font-poppins bg-[#0B0E14] text-white">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#131A26] border border-amber-500/30 text-xs font-black text-amber-400 uppercase tracking-widest">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>Analytiques & Résultats En Direct</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            RÉSULTATS DES <span className="gradient-text-gold">VOTES</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium">
            Visualisation graphique de la répartition des voix et des métriques de participation.
          </p>
        </div>

        {/* Selector Tabs */}
        {competitions.length > 0 && (
          <div className="flex justify-center overflow-x-auto pb-2">
            <div className="flex items-center bg-[#131A26]/90 backdrop-blur-xl p-1.5 rounded-2xl border border-amber-500/30 shadow-2xl max-w-2xl w-full">
              {competitions.map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => handleSelectComp(comp.slug)}
                  className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 min-w-[140px] ${
                    selectedSlug === comp.slug
                      ? 'gold-gradient-btn text-slate-950 shadow-md'
                      : 'text-slate-300 hover:bg-[#1E293B] hover:text-white'
                  }`}
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>{comp.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="py-16 text-center text-slate-400 font-bold">
            Chargement des résultats...
          </div>
        ) : (
          <>
            {/* Overview Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#131A26]/90 backdrop-blur-xl p-6 rounded-3xl border border-amber-500/25 shadow-2xl text-center space-y-2">
                <Vote className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="text-xs font-black text-slate-400 uppercase">Volume Total de Votes</p>
                <p className="text-3xl font-black text-amber-400 font-mono">{totalVotes.toLocaleString('fr-FR')}</p>
              </div>

              <div className="bg-[#131A26]/90 backdrop-blur-xl p-6 rounded-3xl border border-amber-500/25 shadow-2xl text-center space-y-2">
                <Users className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="text-xs font-black text-slate-400 uppercase">Nombre de Candidats</p>
                <p className="text-3xl font-black text-white font-mono">{candidates.length}</p>
              </div>

              <div className="bg-[#131A26]/90 backdrop-blur-xl p-6 rounded-3xl border border-amber-500/25 shadow-2xl text-center space-y-2">
                <Award className="w-8 h-8 text-amber-400 mx-auto" />
                <p className="text-xs font-black text-slate-400 uppercase">Candidat Leader</p>
                <p className="text-xl font-black text-amber-400 truncate">
                  {sortedCandidates[0] ? `${sortedCandidates[0].firstName} ${sortedCandidates[0].lastName}` : 'Aucun vote'}
                </p>
              </div>
            </div>

            {/* GRAPHICAL REPARTITION BARS */}
            <div className="bg-[#131A26]/90 backdrop-blur-xl p-6 sm:p-10 rounded-3xl border border-amber-500/25 shadow-2xl space-y-8">
              <div>
                <h3 className="text-2xl font-black text-white flex items-center gap-2">
                  <PieChart className="w-6 h-6 text-amber-400" />
                  <span>Répartition des Voix par Candidat</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1 font-semibold">
                  Histogramme et pourcentage relatif dans la compétition {currentCompetition?.title || ''}
                </p>
              </div>

              {sortedCandidates.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-bold bg-[#0B0E14] rounded-2xl border border-slate-800 flex flex-col items-center gap-2">
                  <Sparkles className="w-8 h-8 text-amber-400" />
                  <span>Aucun résultat pour le moment dans cette compétition.</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {sortedCandidates.map((cand, idx) => {
                    const pct = totalVotes > 0 ? ((cand.voteCount / totalVotes) * 100).toFixed(1) : '0';
                    return (
                      <div key={cand.id} className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm font-bold gap-1">
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-full bg-[#0B0E14] text-amber-400 border border-amber-500/30 text-xs font-mono font-black flex items-center justify-center flex-shrink-0">
                              #{idx + 1}
                            </span>
                            <span className="text-white font-black">
                              {cand.firstName} <span className="uppercase text-amber-400">{cand.lastName}</span>
                            </span>
                            <span className="text-xs text-slate-400 font-mono">({cand.candidateNumber})</span>
                          </div>

                          <div className="text-left sm:text-right font-mono">
                            <span className="text-white font-black">{cand.voteCount.toLocaleString('fr-FR')} votes</span>
                            <span className="text-amber-400 ml-2">({pct}%)</span>
                          </div>
                        </div>

                        {/* Animated Bar */}
                        <div className="w-full h-4 rounded-full bg-[#0B0E14] overflow-hidden p-0.5 border border-slate-800">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                            className={`h-full rounded-full ${
                              idx === 0
                                ? 'gold-gradient-btn shadow-sm'
                                : 'bg-amber-600'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* VOTE EVOLUTION OVER TIME CHART */}
            <div className="bg-[#131A26]/90 backdrop-blur-xl p-6 sm:p-10 rounded-3xl border border-amber-500/25 shadow-2xl space-y-6">
              <div>
                <h3 className="text-2xl font-black text-white flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                  <span>Évolution des Votes au Fil du Temps</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1 font-semibold">Activité de participation en direct</p>
              </div>

              <div className="h-64 w-full flex items-end justify-between gap-1.5 sm:gap-4 pt-8 pb-4 border-b border-slate-800 overflow-x-auto">
                {[45, 62, 88, 120, 190, 240, 310, 450, 520, 680, 810, 950].map((val, idx) => (
                  <div key={idx} className="flex-1 min-w-[20px] flex flex-col items-center gap-2 group h-full justify-end">
                    <div
                      className="w-full gold-gradient-btn rounded-t-lg transition-all group-hover:brightness-110"
                      style={{ height: `${(val / 950) * 100}%` }}
                    />
                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono">
                      {idx * 2}h
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-1 font-semibold">
                <span>Début de journée (00:00)</span>
                <span>Pics de participation (18:00 - 22:00)</span>
              </div>
            </div>
          </>
        )}

      </main>

      <Footer />
    </>
  );
}
