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
        <main className="min-h-screen bg-[#0B0E14] py-20 text-center font-poppins font-bold text-slate-400">
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
        <main className="min-h-screen bg-[#0B0E14] py-20 text-center font-poppins space-y-4 text-white">
          <h2 className="text-3xl font-black text-white">Compétition non disponible</h2>
          <p className="text-sm text-slate-300">Cette compétition n&apos;est pas ouverte actuellement.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="flex-1 min-h-screen pb-16 font-poppins bg-[#0B0E14] text-white">
        
        {/* HERO BANNER SECTION */}
        <section className="relative w-full h-[320px] sm:h-[420px] bg-slate-950 overflow-hidden">
          <Image
            src={competition.bannerImage}
            alt={competition.title}
            fill
            priority
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-slate-950/60 to-transparent" />

          <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#131A26] backdrop-blur-md border border-amber-500/30 text-xs font-black text-amber-400 uppercase tracking-widest w-fit">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{competition.status} • Vote : {competition.votePrice || 100} FCFA</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md">
              {competition.title}
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed font-medium">
              {competition.description}
            </p>
          </div>
        </section>

        {/* METRICS & COUNTDOWN BAR */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="bg-[#131A26]/95 backdrop-blur-xl rounded-3xl p-6 border border-amber-500/30 shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0">
              <div className="w-12 h-12 rounded-2xl bg-[#0B0E14] text-amber-400 flex items-center justify-center font-bold flex-shrink-0 border border-amber-500/20">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase">Candidats Sélectionnés</p>
                <p className="text-2xl font-black text-white font-mono">{candidates.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0">
              <div className="w-12 h-12 rounded-2xl bg-[#0B0E14] text-amber-400 flex items-center justify-center font-bold flex-shrink-0 border border-amber-500/20">
                <Vote className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase">Total Suffrages</p>
                <p className="text-2xl font-black text-amber-400 font-mono">{totalVotes.toLocaleString('fr-FR')} votes</p>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-xs font-black text-slate-400 uppercase mb-1">Fin des votes dans :</p>
              <Countdown targetDate={competition.endDate} />
            </div>

          </div>
        </section>

        {/* CANDIDATES GRID & FILTERS SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-8">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#131A26]/90 backdrop-blur-xl p-4 rounded-2xl border border-amber-500/25 shadow-xl">
            
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
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex-1 sm:flex-initial ${
                    categoryFilter === tab.id
                      ? 'gold-gradient-btn text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:bg-[#1E293B] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher par nom ou N°..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0B0E14] border border-amber-500/20 text-white text-xs font-bold placeholder-slate-400 focus:outline-none focus:border-amber-400"
              />
            </div>

          </div>

          {/* Grid of Candidates */}
          {filteredCandidates.length === 0 ? (
            <div className="bg-[#131A26]/90 backdrop-blur-xl p-12 rounded-3xl border border-amber-500/20 text-center space-y-3 shadow-2xl">
              <Sparkles className="w-10 h-10 text-amber-400 mx-auto" />
              <h3 className="text-xl font-black text-white">Aucun candidat dans cette catégorie</h3>
              <p className="text-xs text-slate-300 font-medium">
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
