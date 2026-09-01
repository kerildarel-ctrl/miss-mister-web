'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminAuthGuard } from '@/components/AdminAuthGuard';
import { CandidateFormModal } from '@/components/CandidateFormModal';
import { INITIAL_CANDIDATES, INITIAL_COMPETITIONS, Candidate } from '@/data/mockData';
import { getCandidates, createCandidate, deleteCandidate } from '@/services/dbService';
import { UserPlus, Edit3, Trash2, Search, Sparkles } from 'lucide-react';

export default function KerilCandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await getCandidates();
      setCandidates(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingCandidate(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cand: Candidate) => {
    setEditingCandidate(cand);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer ce candidat ?')) {
      setCandidates((prev) => prev.filter((c) => c.id !== id));
      await deleteCandidate(id);
    }
  };

  const handleSubmitForm = async (formData: Partial<Candidate>) => {
    if (editingCandidate) {
      setCandidates((prev) =>
        prev.map((c) => (c.id === editingCandidate.id ? ({ ...c, ...formData } as Candidate) : c))
      );
    } else {
      const newCandidate = await createCandidate(formData);
      setCandidates((prev) => [newCandidate, ...prev]);
    }
  };

  const filteredCandidates = candidates.filter((c) =>
    `${c.firstName} ${c.lastName} ${c.candidateNumber}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-poppins">
        <AdminSidebar />

        <main className="flex-1 lg:ml-64 p-4 sm:p-8 space-y-8 overflow-x-hidden">
          
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">
                  Gestion des Candidats (/keril)
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                CANDIDATS <span className="text-pink-600">ADMIN</span>
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm"
                />
              </div>

              <button
                onClick={handleOpenAdd}
                className="w-full sm:w-auto pink-blue-gradient-btn py-2.5 px-5 rounded-2xl font-extrabold text-xs uppercase tracking-wider text-white shadow-md flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Ajouter un candidat</span>
              </button>
            </div>
          </div>

          {/* Candidates Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-xs font-extrabold uppercase tracking-wider text-blue-600 border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-6">Candidat</th>
                    <th className="py-4 px-6">Catégorie</th>
                    <th className="py-4 px-6">Compétition</th>
                    <th className="py-4 px-6">Score</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 font-bold">
                        Chargement des candidats...
                      </td>
                    </tr>
                  ) : filteredCandidates.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 font-bold">
                        Aucun candidat enregistré. Cliquez sur Ajouter un candidat.
                      </td>
                    </tr>
                  ) : filteredCandidates.map((cand) => (
                    <tr key={cand.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
                            <Image
                              src={cand.photoUrl}
                              alt={cand.firstName}
                              fill
                              className="object-cover object-top"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-extrabold text-slate-900">
                              {cand.firstName} <span className="uppercase text-blue-600">{cand.lastName}</span>
                            </p>
                            <p className="text-xs text-slate-400 font-mono">
                              N° {cand.candidateNumber} • Rang #{cand.rank}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-700">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-xs border border-slate-200 font-extrabold">
                          {cand.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500 font-mono">{cand.competitionSlug}</td>
                      <td className="py-4 px-6 font-extrabold text-pink-600 font-mono">
                        {cand.voteCount.toLocaleString('fr-FR')} votes ({cand.percentage}%)
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(cand)}
                            className="p-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 transition-colors"
                            title="Modifier"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cand.id)}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                            title="Supprimer"
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

        <CandidateFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitForm}
          competitions={INITIAL_COMPETITIONS}
          initialData={editingCandidate}
        />
      </div>
    </AdminAuthGuard>
  );
}
