'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Podium } from '@/components/Podium';
import { RankingCard } from '@/components/RankingCard';
import { VoteModal } from '@/components/VoteModal';
import { getCompetitions, getCandidates, submitVote } from '@/services/dbService';
import { Competition, Candidate } from '@/data/mockData';
import { Crown, Trophy, Sparkles } from 'lucide-react';

export default function ClassementPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load competitions & candidates live from DB
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

  // When competition tab changes
  const handleSelectComp = async (slug: string) => {
    setSelectedSlug(slug);
    const cands = await getCandidates(slug);
    setCandidates(cands);
  };

  const currentCompetition = competitions.find((c) => c.slug === selectedSlug) || competitions[0];

  const currentCandidates = candidates
    .sort((a, b) => b.voteCount - a.voteCount)
    .map((cand, idx) => ({ ...cand, rank: idx + 1 }));

  const handleVoteClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsVoteModalOpen(true);
  };

  const handleConfirmVote = async (candidateId: string, count: number = 1) => {
    if (selectedCandidate && currentCompetition) {
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
        currentCompetition.slug,
        count,
        currentCompetition.votePrice || 100
      );
    }
  };

  return (
    <>
      <Header />

      <main className="flex-1 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10 font-poppins bg-[#0B0E14] text-white">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#131A26] border border-amber-500/30 text-xs font-black text-amber-400 uppercase tracking-widest">
            <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Classement En Direct • Mise à Jour Instantanée</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            LEADERBOARD <span className="gradient-text-gold">OFFICIEL</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium">
            Suivez la course vers la victoire et découvrez la hiérarchie des candidats mise à jour instantanément.
          </p>
        </div>

        {/* Competition Switcher Pills */}
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
            Chargement du classement...
          </div>
        ) : currentCandidates.length === 0 ? (
          <div className="bg-[#131A26]/90 backdrop-blur-xl p-12 rounded-3xl border border-amber-500/20 text-center space-y-3 shadow-2xl">
            <Sparkles className="w-10 h-10 text-amber-400 mx-auto" />
            <h3 className="text-xl font-black text-white">Aucun candidat dans cette compétition</h3>
            <p className="text-xs text-slate-300 font-medium">Ajoutez des candidats depuis l&apos;espace administrateur.</p>
          </div>
        ) : (
          <>
            {/* 3D PODIUM SECTION (Top 3) */}
            {currentCandidates.length >= 3 && (
              <section className="bg-[#131A26]/90 backdrop-blur-xl p-6 sm:p-10 rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden">
                <div className="text-center mb-6">
                  <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-2">
                    <Crown className="w-6 h-6 text-amber-400 fill-amber-400" />
                    <span>LE PODIUM</span>
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 font-semibold">
                    Les 3 leaders de la compétition {currentCompetition?.title}
                  </p>
                </div>

                <Podium candidates={currentCandidates.slice(0, 3)} onVoteClick={handleVoteClick} />
              </section>
            )}

            {/* FULL RANKINGS LIST */}
            <section className="space-y-4 pt-4">
              <h3 className="text-xl font-black text-white tracking-wide flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Suite du Classement Général</span>
              </h3>

              <div className="space-y-3">
                {currentCandidates.slice(currentCandidates.length >= 3 ? 3 : 0).map((cand) => (
                  <RankingCard key={cand.id} candidate={cand} onVoteClick={handleVoteClick} />
                ))}
              </div>
            </section>
          </>
        )}

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
