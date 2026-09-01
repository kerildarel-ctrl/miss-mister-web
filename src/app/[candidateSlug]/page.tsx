'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { VoteModal } from '@/components/VoteModal';
import { getCandidates, getCompetitions, submitVote } from '@/services/dbService';
import { Candidate, Competition } from '@/data/mockData';
import { Crown, Vote, ArrowLeft, Trophy, Flame, Share2, Globe, Tag, CheckCircle2, Sparkles } from 'lucide-react';

export default function DirectCandidatePage({
  params,
}: {
  params: Promise<{ candidateSlug: string }>;
}) {
  const resolvedParams = use(params);
  const rawCandSlug = resolvedParams?.candidateSlug || '';

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const cands = await getCandidates();

      const foundCand = cands.find((c) => {
        const fullConcat = `${c.lastName}${c.firstName}`.toLowerCase().replace(/[^a-z0-9]+/g, '');
        const reverseConcat = `${c.firstName}${c.lastName}`.toLowerCase().replace(/[^a-z0-9]+/g, '');
        const hyphenated = `${c.firstName}-${c.lastName}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const numberOnly = c.candidateNumber.replace('#', '').toLowerCase();

        const target = rawCandSlug.toLowerCase();
        return (
          target === fullConcat ||
          target === reverseConcat ||
          target === hyphenated ||
          target === c.id.toLowerCase() ||
          target === numberOnly
        );
      }) || cands[0] || null;

      setCandidate(foundCand);

      if (foundCand) {
        const comps = await getCompetitions();
        const comp = comps.find((c) => c.slug === foundCand.competitionSlug) || comps[0] || null;
        setCompetition(comp);
      }
      setIsLoading(false);
    }
    loadData();
  }, [rawCandSlug]);

  const handleConfirmVote = async (candidateId: string, count: number = 1) => {
    if (candidate && competition) {
      setCandidate((prev) =>
        prev
          ? {
              ...prev,
              voteCount: prev.voteCount + count,
            }
          : null
      );
      await submitVote(
        candidateId,
        `${candidate.firstName} ${candidate.lastName}`,
        competition.slug,
        count,
        competition.votePrice || 100
      );
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-[60vh] bg-[#0B0E14] py-20 text-center font-poppins font-bold text-slate-400">
          Chargement du profil du candidat...
        </main>
        <Footer />
      </>
    );
  }

  if (!candidate) {
    return (
      <>
        <Header />
        <main className="min-h-[60vh] bg-[#0B0E14] py-20 text-center font-poppins space-y-4 px-4 text-white">
          <Sparkles className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-2xl sm:text-3xl font-black text-white">Candidat non trouvé</h2>
          <p className="text-xs sm:text-sm text-slate-300">Le profil recherché n&apos;existe pas.</p>
          <Link href="/competitions" className="inline-block gold-gradient-btn py-3 px-6 rounded-2xl text-slate-950 font-black text-xs uppercase">
            Voir toutes les compétitions
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const votePrice = competition?.votePrice || 100;

  return (
    <>
      <Header />

      <main className="flex-1 min-h-screen py-6 sm:py-10 px-3 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6 sm:space-y-8 font-poppins bg-[#0B0E14] text-white">
        
        {/* Back Link */}
        <Link
          href={competition ? `/competition/${competition.slug}` : '/competitions'}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-200 hover:text-amber-400 bg-[#131A26] px-4 py-2 rounded-full border border-amber-500/20 shadow-xs w-fit"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" /> Retour à la compétition
        </Link>

        {/* Candidate Detail Card Layout - DARK GLASSMORPHISM */}
        <div className="bg-[#131A26]/90 backdrop-blur-xl rounded-3xl p-4 sm:p-8 lg:p-10 border border-amber-500/25 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* Left: Large Portrait Photo (Responsive Height) */}
          <div className="lg:col-span-5 relative w-full">
            <div className="relative h-80 sm:h-[460px] w-full rounded-2xl overflow-hidden border border-amber-500/30 shadow-xl group bg-slate-950">
              <Image
                src={candidate.photoUrl}
                alt={`${candidate.firstName} ${candidate.lastName}`}
                fill
                priority
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Number Badge */}
              <div className="absolute top-3.5 left-3.5 bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-amber-400/40 font-mono font-black text-xs sm:text-sm text-amber-400 shadow-md flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>{candidate.candidateNumber}</span>
              </div>

              {/* Category Pill */}
              <div className="absolute top-3.5 right-3.5 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] sm:text-xs font-black uppercase text-amber-400 border border-amber-500/30">
                {candidate.category}
              </div>

              {/* Rank Overlay Bottom */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 bg-slate-950/90 backdrop-blur-md p-3 rounded-xl border border-amber-500/20 text-white flex items-center justify-between">
                <span className="text-[11px] text-slate-300 font-bold">Rang actuel</span>
                <span className="text-xs sm:text-sm font-black text-amber-400 flex items-center gap-1">
                  {candidate.rank === 1 && <Crown className="w-4 h-4 fill-amber-400 text-amber-400" />}
                  #{candidate.candidateNumber} ({candidate.rank}e place)
                </span>
              </div>
            </div>
          </div>

          {/* Right: Candidate Details & Vote Button */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            
            {/* Header info */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {competition && (
                  <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-[#0B0E14] text-slate-200 border border-amber-500/20 flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" /> {competition.title}
                  </span>
                )}
                <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-black bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-amber-400" /> 1 Vote = {votePrice} FCFA
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                {candidate.firstName} <span className="uppercase text-amber-400">{candidate.lastName}</span>
              </h1>
            </div>

            {/* Statistics box */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 bg-[#0B0E14] p-4 sm:p-5 rounded-2xl border border-amber-500/20">
              <div>
                <p className="text-[10px] sm:text-xs text-slate-400 uppercase font-black tracking-wider">Total Votes</p>
                <p className="text-xl sm:text-3xl font-black text-amber-400 font-mono mt-0.5">
                  {candidate.voteCount.toLocaleString('fr-FR')}
                </p>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-slate-400 uppercase font-black tracking-wider">Pourcentage</p>
                <p className="text-xl sm:text-3xl font-black text-white font-mono mt-0.5">
                  {candidate.percentage}%
                </p>
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider">
                Biographie & Parcours
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#0B0E14] p-4 rounded-2xl border border-amber-500/20 font-medium">
                {candidate.bio}
              </p>
            </div>

            {/* Social handles */}
            {candidate.socialInstagram && (
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>Instagram : <strong className="text-white">{candidate.socialInstagram}</strong></span>
              </div>
            )}

            {/* MAIN VOTE ACTION BUTTON */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => setIsVoteModalOpen(true)}
                className="w-full gold-gradient-btn py-3.5 sm:py-4 px-6 rounded-2xl font-black text-sm sm:text-base text-slate-950 shadow-xl flex items-center justify-center gap-2.5 active:scale-98 transition-transform uppercase tracking-wider"
              >
                <Vote className="w-5 h-5 text-slate-950" />
                <span>VOTER MAINTENANT ({votePrice} FCFA)</span>
              </button>

              <button
                onClick={handleShare}
                className="w-full py-3 px-4 rounded-2xl bg-[#0B0E14] hover:bg-slate-900 text-slate-200 font-black text-xs flex items-center justify-center gap-2 border border-amber-500/20 transition-colors uppercase tracking-wider"
              >
                {copiedShare ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Lien copié dans le presse-papier !</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-amber-400" />
                    <span>Partager le profil du candidat</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </main>

      {/* Vote Confirmation Modal */}
      <VoteModal
        isOpen={isVoteModalOpen}
        candidate={candidate}
        onClose={() => setIsVoteModalOpen(false)}
        onConfirmVote={handleConfirmVote}
      />

      <Footer />
    </>
  );
}
