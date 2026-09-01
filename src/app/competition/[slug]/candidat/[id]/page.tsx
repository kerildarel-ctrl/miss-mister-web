'use client';

import React, { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { VoteModal } from '@/components/VoteModal';
import { INITIAL_COMPETITIONS, INITIAL_CANDIDATES, Candidate } from '@/data/mockData';
import { Crown, Vote, ArrowLeft, Trophy, Flame, Share2, Globe, Tag, CheckCircle2 } from 'lucide-react';

export default function CandidateDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = use(params);

  const competition = INITIAL_COMPETITIONS.find((c) => c.slug === slug);
  const initialCandidate = INITIAL_CANDIDATES.find((c) => c.id === id);

  if (!competition || !initialCandidate) {
    notFound();
  }

  const [candidate, setCandidate] = useState<Candidate>(initialCandidate);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleConfirmVote = (candidateId: string, count: number = 1) => {
    setCandidate((prev) => ({
      ...prev,
      voteCount: prev.voteCount + count,
      percentage: Number((((prev.voteCount + count) / (prev.voteCount + count + 100)) * 100).toFixed(1)),
    }));
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <>
      <Header />

      <main className="flex-1 min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 font-poppins bg-[#F8FAFC]">
        
        {/* Back Link */}
        <Link
          href={`/competition/${slug}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-600 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm w-fit"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600" /> Retour à {competition.title}
        </Link>

        {/* Candidate Detail Card Layout */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Large Portrait Photo */}
          <div className="lg:col-span-5 relative">
            <div className="relative h-[420px] sm:h-[500px] w-full rounded-2xl overflow-hidden border-2 border-slate-200 shadow-xl group">
              <Image
                src={candidate.photoUrl}
                alt={`${candidate.firstName} ${candidate.lastName}`}
                fill
                priority
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

              {/* Number Badge */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-xl border border-slate-200 font-mono font-extrabold text-base text-blue-600 shadow-md flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-pink-500 fill-pink-500" />
                <span>{candidate.candidateNumber}</span>
              </div>

              {/* Category Pill */}
              <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold uppercase text-white">
                {candidate.category}
              </div>

              {/* Rank Overlay Bottom */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-700 text-white flex items-center justify-between">
                <span className="text-xs text-slate-300 font-semibold">Position Actuelle</span>
                <span className="text-sm font-black text-pink-400 flex items-center gap-1">
                  {candidate.rank === 1 && <Crown className="w-4 h-4 fill-pink-400 text-pink-400" />}
                  #{candidate.candidateNumber} ({candidate.rank}e place)
                </span>
              </div>
            </div>
          </div>

          {/* Right: Candidate Details & Vote Button */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header info */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" /> {competition.title}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-pink-50 text-pink-600 border border-pink-200 font-mono flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> 1 Vote = 100 FCFA
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                {candidate.firstName} <span className="uppercase text-blue-600">{candidate.lastName}</span>
              </h1>
            </div>

            {/* Statistics box */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Total Votes</p>
                <p className="text-2xl sm:text-3xl font-black text-pink-600 font-mono mt-0.5">
                  {candidate.voteCount.toLocaleString('fr-FR')}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Pourcentage</p>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono mt-0.5">
                  {candidate.percentage}%
                </p>
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Biographie & Parcours
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {candidate.bio}
              </p>
            </div>

            {/* Social handles */}
            {candidate.socialInstagram && (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>Instagram : <strong className="text-slate-900">{candidate.socialInstagram}</strong></span>
              </div>
            )}

            {/* MAIN VOTE ACTION BUTTON */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => setIsVoteModalOpen(true)}
                className="w-full pink-blue-gradient-btn py-4 px-6 rounded-2xl font-black text-lg text-white shadow-xl flex items-center justify-center gap-3 active:scale-98 transition-transform"
              >
                <Vote className="w-6 h-6" />
                <span>🗳️ VOTER (100 FCFA)</span>
              </button>

              <button
                onClick={handleShare}
                className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 transition-colors"
              >
                {copiedShare ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-600">Lien copié dans le presse-papier !</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-blue-600" />
                    <span>Partager le lien du candidat</span>
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
