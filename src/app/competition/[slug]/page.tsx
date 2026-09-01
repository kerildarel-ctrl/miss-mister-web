'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CandidateCard } from '@/components/CandidateCard';
import { Countdown } from '@/components/Countdown';
import { VoteModal } from '@/components/VoteModal';
import { getCompetitions, getCandidates, submitVote } from '@/services/dbService';
import { Competition, Candidate } from '@/data/mockData';
import { Trophy, Search, Users, Vote, Sparkles } from 'lucide-react';

export default function CompetitionDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState<'TOUT' | 'Miss' | 'Mister'>('TOUT');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch live competition and candidates from DB
  useEffect(() => {
    async function loadLiveData() {
      setIsLoading(true);
      const comps = await getCompetitions();
      const targetComp = comps.find((c) => c.slug === slug) || comps[0] || null;
      setCompetition(targetComp);

      if (targetComp) {
        const cands = await getCandidates(targetComp.slug);
        setCandidates(cands);
      }
      setIsLoading(false);
    }
    loadLiveData();
  }, [slug]);

  const handleVoteClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsVoteModalOpen(true);
  };

  const handleConfirmVote = async (candidateId: string, count: number = 1) => {
    if (selectedCandidate && competition) {
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === candidateId
            ? {
                ...c,
                voteCount: c.voteCount + count,
              }
            : c
        )
      );
      await submitVote(
        candidateId,
        `${selectedCandidate.firstName} ${selectedCandidate.lastName}`,
        competition.slug,
        count,
        competition.votePrice || 100
      );
    }
  };

  const filteredCandidates = candidates.filter((cand) => {
    const matchesCategory = categoryFilter === 'TOUT' || cand.category === categoryFilter;
    const matchesSearch =
      cand.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cand.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cand.candidateNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#F8FAFC] py-20 text-center font-poppins font-bold text-slate-500">
          Chargement de la compétition...
        </main>
        <Footer />
      </>
    );
  }

  if (!competition) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#F8FAFC] py-20 text-center font-poppins space-y-4">
          <h2 className="text-3xl font-black text-slate-900">Compétition non disponible</h2>
          <p className="text-sm text-slate-500">Cette compétition n&apos;est pas ouverte actuellement.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="flex-1 min-h-screen pb-16 font-poppins bg-[#F8FAFC]">
        
        {/* HERO BANNER SECTION */}
        <section className="relative w-full h-[320px] sm:h-[420px] bg-slate-900 overflow-hidden">
          <Image
            src={competition.bannerImage}
            alt={competition.title}
            fill
            priority
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/20 backdrop-blur-md border border-pink-400/40 text-xs font-extrabold text-pink-300 uppercase tracking-widest w-fit">
              <Trophy className="w-4 h-4 text-pink-400" />
              <span>{competition.status} • Vote : {competition.votePrice || 100} FCFA</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
              {competition.title}
            </h1>

            <p className="text-slate-200 text-xs sm:text-sm max-w-2xl leading-relaxed">
              {competition.description}
            </p>
          </div>
        </section>

        {/* METRICS & COUNTDOWN BAR */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Candidats Sélectionnés</p>
                <p className="text-2xl font-black text-slate-900 font-mono">{candidates.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold flex-shrink-0">
                <Vote className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Total Suffrages</p>
                <p className="text-2xl font-black text-pink-600 font-mono">{totalVotes.toLocaleString('fr-FR')} votes</p>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Fin des votes dans :</p>
              <Countdown targetDate={competition.endDate} />
            </div>

          </div>
        </section>

        {/* CANDIDATES GRID & FILTERS SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-8">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              {[
                { id: 'TOUT', label: 'Tous' },
                { id: 'Miss', label: 'Miss' },
                { id: 'Mister', label: 'Mister' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCategoryFilter(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex-1 sm:flex-initial ${
                    categoryFilter === tab.id
                      ? 'blue-pill-btn text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher par nom ou N°..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

          </div>

          {/* Grid of Candidates */}
          {filteredCandidates.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-xs">
              <Sparkles className="w-10 h-10 text-pink-500 mx-auto" />
              <h3 className="text-xl font-bold text-slate-900">Aucun candidat dans cette catégorie</h3>
              <p className="text-xs text-slate-500">
                La liste des candidats sélectionnés sera publiée incessamment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onVoteClick={handleVoteClick}
                />
              ))}
            </div>
          )}

        </section>

      </main>

      {/* Vote Confirmation Modal */}
      <VoteModal
        isOpen={isVoteModalOpen}
        candidate={selectedCandidate}
        onClose={() => setIsVoteModalOpen(false)}
        onConfirmVote={handleConfirmVote}
      />

      <Footer />
    </>
  );
}
