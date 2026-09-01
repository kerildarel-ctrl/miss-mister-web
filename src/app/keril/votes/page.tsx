'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminAuthGuard } from '@/components/AdminAuthGuard';
import { INITIAL_ADMIN_STATS, RecentVote } from '@/data/mockData';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function KerilVotesPage() {
  const [votes] = useState<RecentVote[]>(INITIAL_ADMIN_STATS.recentVotes || []);

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
                  Historique des Transactions & Votes (/keril)
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                LOGS DES <span className="gradient-text-gold">VOTES EN DIRECT</span>
              </h1>
            </div>
          </div>

          {/* Votes Log Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 min-w-[600px]">
                <thead className="bg-slate-50 text-[11px] font-black uppercase tracking-wider text-amber-800 border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-6">ID Vote</th>
                    <th className="py-4 px-6">Candidat Cible</th>
                    <th className="py-4 px-6">Compétition</th>
                    <th className="py-4 px-6">Lieu / Origine</th>
                    <th className="py-4 px-6">Montant</th>
                    <th className="py-4 px-6">Horodatage</th>
                    <th className="py-4 px-6 text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {votes.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500 font-bold">
                        Aucun log de vote enregistré pour le moment.
                      </td>
                    </tr>
                  ) : (
                    votes.map((vote) => (
                      <tr key={vote.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6 font-mono text-xs font-bold text-amber-600">
                          {vote.id}
                        </td>
                        <td className="py-4 px-6 font-black text-slate-950">
                          {vote.candidateName}
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-600 font-semibold">
                          {vote.competitionTitle}
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-500 font-mono">
                          {vote.location}
                        </td>
                        <td className="py-4 px-6 font-mono font-black text-emerald-600">
                          100 FCFA
                        </td>
                        <td className="py-4 px-6 text-xs font-mono text-slate-500">
                          {vote.timestamp}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Validé
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </AdminAuthGuard>
  );
}
