'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { getEventRequests, EventRequestData } from '@/services/dbService';
import { Inbox, Trophy, Phone, Mail, DollarSign, Users, Calendar, MessageSquare, Trash2, ShieldCheck, Search } from 'lucide-react';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<EventRequestData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRequests() {
      setIsLoading(true);
      const data = await getEventRequests();
      setRequests(data);
      setIsLoading(false);
    }
    loadRequests();
  }, []);

  const handleDelete = (id?: string) => {
    if (!id) return;
    if (confirm('Voulez-vous supprimer cette demande d\'événement ?')) {
      const updated = requests.filter((r) => r.id !== id);
      setRequests(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('miss_mister_event_requests', JSON.stringify(updated));
      }
    }
  };

  const filteredRequests = requests.filter(
    (r) =>
      r.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.organizerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC] font-poppins">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 p-4 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-black text-amber-800 uppercase tracking-widest mb-1">
              <Inbox className="w-4 h-4 text-amber-600" /> Espace /keril Admin
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
              Demandes d&apos;<span className="gradient-text-gold">Événements</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold">
              Consultez et gérez les demandes de création d&apos;élections en ligne.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-4 py-2 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 font-black text-xs font-mono shadow-xs">
              {requests.length} demande{requests.length > 1 ? 's' : ''} reçue{requests.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Search Input */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom d'événement, organisateur, téléphone ou e-mail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-slate-950 text-xs sm:text-sm font-bold placeholder-slate-400 focus:outline-none"
          />
        </div>

        {/* List of Requests */}
        {isLoading ? (
          <div className="text-center py-16 font-bold text-slate-500 text-sm">
            Chargement des demandes...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
            <Inbox className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-black text-slate-950">Aucune demande d&apos;événement enregistrée</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Les demandes soumises depuis le formulaire du site public apparaîtront ici et sur votre WhatsApp.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4 relative hover:border-amber-300 transition-colors"
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <h3 className="font-black text-slate-950 text-base sm:text-lg">
                      {req.eventName}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleDelete(req.id)}
                    className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Grid Info */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <p className="text-slate-500 font-bold uppercase text-[10px]">Organisateur</p>
                    <p className="font-black text-slate-900 flex items-center gap-1">
                      {req.organizerName}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-slate-500 font-bold uppercase text-[10px]">Téléphone / WA</p>
                    <a
                      href={`https://wa.me/${req.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-black text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" /> {req.phone}
                    </a>
                  </div>

                  <div className="space-y-1">
                    <p className="text-slate-500 font-bold uppercase text-[10px]">E-mail</p>
                    <p className="font-bold text-slate-800 truncate flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-purple-600" /> {req.email}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-slate-500 font-bold uppercase text-[10px]">Prix du vote</p>
                    <p className="font-black text-amber-600 font-mono flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-amber-600" /> {req.votePrice || '100'} FCFA
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-slate-500 font-bold uppercase text-[10px]">Estim. Candidats</p>
                    <p className="font-black text-slate-900 font-mono flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-pink-600" /> {req.candidateEstimate || 'Non spécifié'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-slate-500 font-bold uppercase text-[10px]">Période</p>
                    <p className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" /> {req.startDate || 'N/A'} au {req.endDate || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Additional Description */}
                {req.description && (
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs text-slate-700">
                    <p className="font-bold text-[10px] uppercase text-slate-400 mb-1">Précisions :</p>
                    <p className="font-normal">{req.description}</p>
                  </div>
                )}

                {/* Direct Action Button to WhatsApp */}
                <div className="pt-2">
                  <a
                    href={`https://wa.me/237692886326?text=${encodeURIComponent(`Bonjour Keril, concernant votre demande pour "${req.eventName}"`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-wider text-white shadow-sm flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-white" />
                    <span>Répondre sur WhatsApp (+237692886326)</span>
                  </a>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
