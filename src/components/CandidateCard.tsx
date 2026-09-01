'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Candidate } from '@/data/mockData';
import { Vote, Crown, Eye, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface CandidateCardProps {
  candidate: Candidate;
  onVoteClick?: (candidate: Candidate) => void;
  index?: number;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onVoteClick,
  index = 0
}) => {
  const [imageError, setImageError] = useState(false);

  const candidateSlug = `${candidate.lastName}${candidate.firstName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');

  const candidateUrl = `/competition/${candidate.competitionSlug}/${candidateSlug}`;

  const getRankBadgeClass = (rank: number) => {
    if (rank === 1) return 'gold-gradient-btn text-slate-950 font-black shadow-lg ring-2 ring-amber-400/60';
    if (rank === 2) return 'blue-pill-btn text-white font-extrabold shadow-md';
    if (rank === 3) return 'bg-purple-600 text-white font-extrabold shadow-md border border-white/30';
    return 'bg-slate-950/80 text-white font-bold backdrop-blur-md border border-white/20';
  };

  const getInitials = () => {
    return `${candidate.firstName.charAt(0)}${candidate.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className={`group relative rounded-[2rem] glass-mirror-panel overflow-hidden flex flex-col justify-between transition-all duration-300 font-poppins p-3 border border-white/20 shadow-2xl ${
        candidate.rank === 1 ? 'ring-2 ring-amber-400/50 shadow-amber-500/20' : ''
      }`}
    >
      {/* Top Image Container */}
      <div className="relative h-72 sm:h-80 w-full overflow-hidden rounded-[1.5rem] bg-slate-950">
        {!imageError && candidate.photoUrl ? (
          <Image
            src={candidate.photoUrl}
            alt={`${candidate.firstName} ${candidate.lastName}`}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-600 via-blue-600 to-slate-950 flex flex-col items-center justify-center p-6 text-white text-center">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-3xl mb-2 border border-white/40 shadow-lg">
              {getInitials()}
            </div>
            <span className="font-extrabold text-sm tracking-wider uppercase opacity-95">{candidate.firstName} {candidate.lastName}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

        {/* Candidate Number Badge Top Left */}
        <div className="absolute top-3.5 left-3.5 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/30 font-mono font-black text-xs text-amber-400 shadow-md flex items-center gap-1.5 z-10">
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
          <span>{candidate.candidateNumber}</span>
        </div>

        {/* Rank Position Badge Top Right */}
        <div className="absolute top-3.5 right-3.5 z-10">
          <span className={`px-3.5 py-1.5 rounded-2xl text-xs flex items-center gap-1.5 shadow-md ${getRankBadgeClass(candidate.rank)}`}>
            {candidate.rank === 1 && <Crown className="w-4 h-4 fill-slate-950 text-slate-950 animate-bounce" />}
            {candidate.rank <= 3 ? `${candidate.rank}e Rang` : `#${candidate.rank}`}
          </span>
        </div>

        {/* Category Pill Bottom */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
          <span className="px-3.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-[10px] uppercase font-black text-amber-300 tracking-wider border border-white/20">
            {candidate.category}
          </span>
        </div>

        {/* Direct Link Overlay */}
        <Link
          href={candidateUrl}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/40 backdrop-blur-xs z-20"
        >
          <div className="w-14 h-14 rounded-full gold-gradient-btn text-slate-950 flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform">
            <Eye className="w-6 h-6 text-slate-950" />
          </div>
        </Link>
      </div>

      {/* Neo-Tactile White Inner Details Card (Matching reference UI Kit) */}
      <div className="mt-3 p-5 space-y-4 flex-1 flex flex-col justify-between bg-white/95 rounded-[1.5rem] text-slate-950 shadow-inner">
        <div>
          <Link
            href={candidateUrl}
            className="group/title inline-block"
          >
            <h4 className="text-xl font-black text-slate-950 tracking-wide group-hover/title:text-amber-600 transition-colors">
              {candidate.firstName} <span className="uppercase text-amber-600 font-black">{candidate.lastName}</span>
            </h4>
          </Link>
          <p className="text-xs text-slate-600 line-clamp-2 mt-1 font-medium leading-relaxed">
            {candidate.bio}
          </p>
        </div>

        {/* Vote Score Inner Box */}
        <div className="space-y-2 bg-slate-100/90 p-3.5 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="text-slate-600 flex items-center gap-1.5">
              <Vote className="w-3.5 h-3.5 text-amber-600" /> Score :
            </span>
            <span className="text-amber-600 font-mono text-sm font-black">
              {candidate.voteCount.toLocaleString('fr-FR')} ({candidate.percentage}%)
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden p-0.5 border border-slate-300">
            <div
              className="h-full gold-gradient-btn rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${Math.min(candidate.percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Action Button: VOTER Full Width */}
        <div className="pt-1">
          <button
            onClick={() => onVoteClick && onVoteClick(candidate)}
            className="w-full gold-gradient-btn py-3.5 px-4 rounded-2xl font-black text-xs text-slate-950 shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform uppercase tracking-wider"
          >
            <Vote className="w-4 h-4 text-slate-950" />
            <span>VOTER MAINTENANT</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
