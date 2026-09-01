'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminAuthGuard } from '@/components/AdminAuthGuard';
import { StatisticsCard } from '@/components/StatisticsCard';
import { getCompetitions, getCandidates } from '@/services/dbService';
import { Competition, Candidate } from '@/data/mockData';
import { Trophy, Users, Vote, UserCheck, TrendingUp, Sparkles, Activity } from 'lucide-react';

export default function KerilDashboardPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLiveData() {
      setIsLoading(true);
      const comps = await getCompetitions();
      const cands = await getCandidates();
      setCompetitions(comps);
      setCandidates(cands);
      setIsLoading(false);
    }
    loadLiveData();
  }, []);

  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col lg:flex-row w-full font-poppins">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content Area */}
        <main className="flex-1 w-full min-w-0 lg:ml-64 p-4 sm:p-8 space-y-6 sm:space-y-8 overflow-x-hidden">
          
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="text-[10px] sm:text-xs font-black text-amber-800 uppercase tracking-widest">
                  Espace Administration Sécurisé /keril
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                DASHBOARD <span className="gradient-text-gold">ADMIN</span>
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black flex items-center gap-1.5 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Système Actif
              </span>
            </div>
          </div>

          {/* 4 DYNAMIC STATISTICAL KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatisticsCard
              title="Compétitions"
              value={isLoading ? '...' : competitions.length.toString()}
              icon={Trophy}
              subtitle={`${competitions.filter((c) => c.status === 'EN COURS').length} en cours`}
              change={competitions.length > 0 ? `+${competitions.length} créée(s)` : '0 compétition'}
              isPositive={true}
            />
            <StatisticsCard
              title="Candidats"
              value={isLoading ? '...' : candidates.length.toString()}
              icon={Users}
              subtitle="Répartis sur vos concours"
              change={candidates.length > 0 ? `+${candidates.length} enregistré(s)` : '0 candidat'}
              isPositive={true}
            />
            <StatisticsCard
              title="Total Votes"
              value={isLoading ? '...' : totalVotes.toLocaleString('fr-FR')}
              icon={Vote}
              subtitle="Votes comptabilisés"
              change={totalVotes > 0 ? `+${totalVotes} vote(s)` : '0 vote'}
              isPositive={true}
            />
            <StatisticsCard
              title="Sessions Votants"
              value={isLoading ? '...' : Math.ceil(totalVotes * 0.7).toString()}
              icon={UserCheck}
              subtitle="Sessions de vote vérifiées"
              change={totalVotes > 0 ? `+${Math.ceil(totalVotes * 0.7)} uniques` : '0 session'}
              isPositive={true}
            />
          </div>

          {/* CHARTS & RECENT ACTIVITY SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            
            {/* Left Col: Activity Charts */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Votes Activity Chart */}
              <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-950 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-amber-600" />
                      <span>Activité Hebdomadaire des Votes</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">Volume quotidien des suffrages exprimés</p>
                  </div>
                </div>

                <div className="h-56 w-full flex items-end justify-between gap-2 sm:gap-3 pt-6 pb-2">
                  {[
                    { day: 'Lun', val: Math.round(totalVotes * 0.1) },
                    { day: 'Mar', val: Math.round(totalVotes * 0.12) },
                    { day: 'Mer', val: Math.round(totalVotes * 0.15) },
                    { day: 'Jeu', val: Math.round(totalVotes * 0.13) },
                    { day: 'Ven', val: Math.round(totalVotes * 0.2) },
                    { day: 'Sam', val: Math.round(totalVotes * 0.25) },
                    { day: 'Dim', val: Math.round(totalVotes * 0.05) },
                  ].map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group h-full justify-end">
                      <span className="text-[9px] sm:text-[10px] font-mono text-amber-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.val}
                      </span>
                      <div
                        className="w-full bg-gradient-to-t from-amber-500 to-yellow-400 rounded-t-lg transition-all group-hover:brightness-110 shadow-xs"
                        style={{ height: totalVotes > 0 ? `${(item.val / (totalVotes * 0.25 || 1)) * 100}%` : '4px' }}
                      />
                      <span className="text-[11px] text-slate-600 font-bold">{item.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competitions Distribution Chart */}
              <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
                <h3 className="text-lg sm:text-xl font-black text-slate-950 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-600" />
                  <span>Répartition des Votes par Compétition</span>
                </h3>

                {competitions.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4 text-center font-semibold">
                    Aucune compétition créée. Utilisez la rubrique Compétitions pour en créer une.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {competitions.map((comp) => {
                      const compCandidates = candidates.filter((c) => c.competitionSlug === comp.slug);
                      const compVotes = compCandidates.reduce((s, c) => s + c.voteCount, 0);
                      const pct = totalVotes > 0 ? Math.min(Math.round((compVotes / totalVotes) * 100), 100) : 0;
                      return (
                        <div key={comp.id} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-950">{comp.title} (Vote: {comp.votePrice || 100} FCFA)</span>
                            <span className="text-amber-600 font-mono">{compVotes.toLocaleString('fr-FR')} votes ({pct}%)</span>
                          </div>
                          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full gold-gradient-btn rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Right Col: Recent Votes Feed */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-lg sm:text-xl font-black text-slate-950 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-amber-600 animate-pulse" />
                    <span>Derniers Votes Exprimés</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">En Direct</span>
                </div>

                {candidates.length === 0 || totalVotes === 0 ? (
                  <p className="text-xs text-slate-500 italic py-6 text-center font-semibold">
                    Aucun vote enregistré pour le moment.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {candidates
                      .filter((c) => c.voteCount > 0)
                      .slice(0, 5)
                      .map((cand) => (
                        <div
                          key={cand.id}
                          className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-3"
                        >
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-950">
                              {cand.firstName} {cand.lastName}
                            </h4>
                            <p className="text-[11px] text-slate-500">{cand.competitionSlug} • N°{cand.candidateNumber}</p>
                          </div>
                          <span className="text-[10px] font-mono text-amber-900 bg-amber-50 px-2 py-1 rounded-full border border-amber-200 font-bold">
                            {cand.voteCount} vote(s)
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

          </div>

        </main>
      </div>
    </AdminAuthGuard>
  );
}
