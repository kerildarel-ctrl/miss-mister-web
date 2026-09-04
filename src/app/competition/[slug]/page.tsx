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
import { Trophy, Search, Users, Vote, Sparkles, CheckCircle2, Info, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Payment Status Banner State
  const [paymentNotice, setPaymentNotice] = useState<{
    type: 'success' | 'info' | 'error';
    title: string;
    message: string;
  } | null>(null);

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

  // HANDLE POST-PAYMENT REDIRECT FROM FAPSHI GATEWAY
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const voteSuccess = urlParams.get('voteSuccess');
    const voteId = urlParams.get('voteId');
    const transId = urlParams.get('transId');
    const candidateId = urlParams.get('candidateId');

    if (voteSuccess === 'true' || voteId || transId) {
      let attempts = 0;
      const maxAttempts = 5;

      const verifyPayment = async () => {
        try {
          const res = await fetch(
            `/api/pay/status?transId=${transId || ''}&voteId=${voteId || ''}&candidateId=${candidateId || ''}`,
            { cache: 'no-store' }
          );
          const data = await res.json();

          if (data.isSuccess) {
            // Update targeted candidate vote count in local UI state
            const targetId = data.candidateId || candidateId;
            const addedVotes = data.voteCount || 1;

            if (targetId) {
              setCandidates((prev) =>
                prev.map((c) =>
                  c.id === targetId ? { ...c, voteCount: (c.voteCount || 0) + (data.alreadyProcessed ? 0 : addedVotes) } : c
                )
              );
            }

            setPaymentNotice({
              type: 'success',
              title: '🎉 Vote Confirmé & Comptabilisé !',
              message: `Votre paiement a été vérifié avec succès. ${addedVotes} vote(s) ont été crédité(s) à votre candidat !`
            });

            // Trigger celebratory confetti
            try {
              // eslint-disable-next-line @typescript-eslint/no-require-imports
              const confetti = require('canvas-confetti');
              confetti({
                particleCount: 150,
                spread: 90,
                origin: { y: 0.5 },
                colors: ['#F59E0B', '#EC4899', '#3B82F6', '#10B981']
              });
            } catch {
              // Fallback
            }

            // Clean query string from browser URL address bar
            window.history.replaceState({}, document.title, window.location.pathname);
            return true;
          } else if (data.status === 'PENDING' && attempts < maxAttempts) {
            attempts++;
            setPaymentNotice({
              type: 'info',
              title: '⏳ Validation du Paiement en cours...',
              message: 'Confirmation du débit Mobile Money auprès de l’opérateur. Merci de patienter...'
            });
            return false;
          } else {
            setPaymentNotice({
              type: 'info',
              title: '📲 Validation Mobile Money',
              message: 'Si vous avez validé la transaction (#150*50# ou USSD), le vote sera comptabilisé automatiquement.'
            });
            window.history.replaceState({}, document.title, window.location.pathname);
            return true;
          }
        } catch {
          return true;
        }
      };

      const pollInterval = setInterval(async () => {
        const done = await verifyPayment();
        if (done || attempts >= maxAttempts) {
          clearInterval(pollInterval);
        }
      }, 3000);

      verifyPayment();

      return () => clearInterval(pollInterval);
    }
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
        
        {/* PAYMENT NOTIFICATION BANNER */}
        <AnimatePresence>
          {paymentNotice && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`w-full py-4 px-4 text-center font-poppins border-b ${
                paymentNotice.type === 'success'
                  ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
                  : paymentNotice.type === 'error'
                  ? 'bg-rose-950/90 text-rose-200 border-rose-500/40'
                  : 'bg-amber-950/90 text-amber-200 border-amber-500/40'
              }`}
            >
              <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3">
                  {paymentNotice.type === 'success' && <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />}
                  {paymentNotice.type === 'info' && <Loader2 className="w-6 h-6 text-amber-400 animate-spin flex-shrink-0" />}
                  {paymentNotice.type === 'error' && <Info className="w-6 h-6 text-rose-400 flex-shrink-0" />}
                  <div>
                    <h4 className="text-sm font-black tracking-wide">{paymentNotice.title}</h4>
                    <p className="text-xs opacity-90 font-medium">{paymentNotice.message}</p>
                  </div>
                </div>
                <button
                  onClick={() => setPaymentNotice(null)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white transition-colors"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
