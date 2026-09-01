'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminAuthGuard } from '@/components/AdminAuthGuard';
import { CompetitionFormModal } from '@/components/CompetitionFormModal';
import { CandidateFormModal } from '@/components/CandidateFormModal';
import { INITIAL_COMPETITIONS, Competition, Candidate } from '@/data/mockData';
import { getCompetitions, createCompetition, deleteCompetition, createCandidate } from '@/services/dbService';
import { Trophy, Plus, Edit3, Trash2, Power, Eye, Sparkles, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function KerilCompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>(INITIAL_COMPETITIONS);
  const [isCompModalOpen, setIsCompModalOpen] = useState(false);
  const [isCandModalOpen, setIsCandModalOpen] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null);
  const [selectedCompForCand, setSelectedCompForCand] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await getCompetitions();
      setCompetitions(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleOpenAddComp = () => {
    setEditingCompetition(null);
    setIsCompModalOpen(true);
  };

  const handleOpenEditComp = (comp: Competition) => {
    setEditingCompetition(comp);
    setIsCompModalOpen(true);
  };

  const handleOpenAddCandForComp = (compSlug: string) => {
    setSelectedCompForCand(compSlug);
    setIsCandModalOpen(true);
  };

  const handleDelete = async (id: string, slug?: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette compétition ?')) {
      setCompetitions((prev) => prev.filter((c) => c.id !== id && c.slug !== slug));
      await deleteCompetition(id, slug);
    }
  };

  const handleToggleStatus = (id: string) => {
    setCompetitions((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'EN COURS' ? 'TERMINE' : 'EN COURS';
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const handleSubmitCompForm = async (formData: Partial<Competition>) => {
    if (editingCompetition) {
      setCompetitions((prev) =>
        prev.map((c) => (c.id === editingCompetition.id ? ({ ...c, ...formData } as Competition) : c))
      );
    } else {
      const newComp = await createCompetition(formData);
      setCompetitions((prev) => [newComp, ...prev]);
    }
  };

  const handleSubmitCandForm = async (formData: Partial<Candidate>) => {
    await createCandidate({
      ...formData,
      competitionSlug: selectedCompForCand || formData.competitionSlug || competitions[0]?.slug || 'copa-ahn'
    });
    setCompetitions((prev) =>
      prev.map((c) =>
        c.slug === (selectedCompForCand || formData.competitionSlug)
          ? { ...c, totalCandidates: (c.totalCandidates || 0) + 1 }
          : c
      )
    );
    setIsCandModalOpen(false);
  };

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col lg:flex-row w-full font-poppins">
        <AdminSidebar />

        <main className="flex-1 w-full min-w-0 lg:ml-64 p-4 sm:p-8 space-y-6 sm:space-y-8 overflow-x-hidden">
          
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="text-[10px] sm:text-xs font-black text-amber-800 uppercase tracking-widest">
                  Gestion des Événements (/keril)
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                COMPÉTITIONS <span className="gradient-text-gold">ADMIN</span>
              </h1>
            </div>

            <button
              onClick={handleOpenAddComp}
              className="gold-gradient-btn py-3 px-6 rounded-2xl font-black text-xs uppercase tracking-wider text-slate-950 shadow-md flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5 text-slate-950" />
              <span>Créer une compétition</span>
            </button>
          </div>

          {/* Competitions Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 min-w-[600px]">
                <thead className="bg-slate-50 text-[11px] font-black uppercase tracking-wider text-amber-800 border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-6">Compétition</th>
                    <th className="py-4 px-6">Prix du Vote</th>
                    <th className="py-4 px-6">Statut</th>
                    <th className="py-4 px-6">Candidats</th>
                    <th className="py-4 px-6">Ajout Candidat</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 font-bold">
                        Chargement des compétitions...
                      </td>
                    </tr>
                  ) : competitions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 font-bold">
                        Aucune compétition créée. Cliquez sur Créer une compétition ci-dessus.
                      </td>
                    </tr>
                  ) : competitions.map((comp) => (
                    <tr key={comp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-950">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: comp.primaryColor || '#f59e0b' }}
                          />
                          <div>
                            <p className="text-sm sm:text-base font-black text-slate-950">{comp.title}</p>
                            <p className="text-[11px] text-slate-400 font-mono">/competition/{comp.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono font-black text-amber-600">
                        {comp.votePrice || 100} FCFA
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            comp.status === 'EN COURS'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : comp.status === 'A VENIR'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {comp.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-950 font-mono">{comp.totalCandidates}</td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleOpenAddCandForComp(comp.slug)}
                          className="py-1.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-black flex items-center gap-1.5"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Ajouter candidat</span>
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/competition/${comp.slug}`}
                            target="_blank"
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Voir la compétition sur le site"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleToggleStatus(comp.id)}
                            className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors"
                            title="Activer / Désactiver"
                          >
                            <Power className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditComp(comp)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Modifier"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(comp.id, comp.slug)}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                            title="Supprimer la compétition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>

        <CompetitionFormModal
          isOpen={isCompModalOpen}
          onClose={() => setIsCompModalOpen(false)}
          onSubmit={handleSubmitCompForm}
          initialData={editingCompetition}
        />

        <CandidateFormModal
          isOpen={isCandModalOpen}
          onClose={() => setIsCandModalOpen(false)}
          onSubmit={handleSubmitCandForm}
          competitions={competitions}
        />
      </div>
    </AdminAuthGuard>
  );
}
