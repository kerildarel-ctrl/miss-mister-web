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
    if (rank === 1) return 'bg-gradient-to-r from-pink-600 to-rose-500 text-white font-black shadow-lg ring-2 ring-pink-300/50';
    if (rank === 2) return 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black shadow-md';
    if (rank === 3) return 'bg-gradient-to-r from-purple-600 to-violet-600 text-white font-black shadow-md';
    return 'bg-slate-900/90 text-white font-bold backdrop-blur-md';
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
      className="group relative rounded-3xl bg-white border border-slate-200/80 hover:border-pink-300 overflow-hidden flex flex-col justify-between shadow-md hover:shadow-2xl transition-all duration-400 font-poppins"
    >
      {/* Top Image / Avatar Container */}
      <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-slate-950">
        {!imageError && candidate.photoUrl ? (
          <Image
            src={candidate.photoUrl}
            alt={`${candidate.firstName} ${candidate.lastName}`}
            fill
            className="object-cover object-top group-hover:scale-108 transition-transform duration-700 ease-out"
            onError={() => setImageError(true)}
          />
        ) : (
          /* Sleek Styled Gradient Avatar Box (No AI Image) */
          <div className="w-full h-full bg-gradient-to-br from-rose-500 via-purple-600 to-blue-600 flex flex-col items-center justify-center p-6 text-white text-center">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-3xl mb-2 border border-white/40 shadow-xl">
              {getInitials()}
            </div>
            <span className="font-extrabold text-sm tracking-wider uppercase opacity-95">{candidate.firstName} {candidate.lastName}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

        {/* Candidate Number Badge Top Left */}
        <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-pink-200 font-mono font-black text-xs text-pink-600 shadow-lg flex items-center gap-1.5 z-10">
          <Flame className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
          <span>{candidate.candidateNumber}</span>
        </div>

        {/* Rank Position Badge Top Right */}
        <div className="absolute top-3.5 right-3.5 z-10">
          <span className={`px-3 py-1.5 rounded-2xl text-xs flex items-center gap-1.5 shadow-lg ${getRankBadgeClass(candidate.rank)}`}>
            {candidate.rank === 1 && <Crown className="w-4 h-4 fill-amber-300 text-amber-300 animate-bounce" />}
            {candidate.rank <= 3 ? `${candidate.rank}e Rang` : `#${candidate.rank}`}
          </span>
        </div>

        {/* Category Pill Bottom */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
          <span className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md text-[10px] uppercase font-black text-pink-400 tracking-wider border border-white/10 shadow-md">
            {candidate.category}
          </span>
        </div>

        {/* Direct Link Overlay */}
        <Link
          href={candidateUrl}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/40 backdrop-blur-xs z-20"
        >
          <div className="w-14 h-14 rounded-full captivating-gradient-btn text-white flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform">
            <Eye className="w-6 h-6" />
          </div>
        </Link>
      </div>

      {/* Card Details */}
      <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between bg-white">
        <div>
          <Link
            href={candidateUrl}
            className="group/title inline-block"
          >
            <h4 className="text-xl font-black text-slate-900 tracking-wide group-hover/title:text-pink-600 transition-colors">
              {candidate.firstName} <span className="uppercase text-blue-600">{candidate.lastName}</span>
            </h4>
          </Link>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 font-normal leading-relaxed">
            {candidate.bio}
          </p>
        </div>

        {/* Vote Progress Bar & Captivating Metrics */}
        <div className="space-y-2.5 bg-slate-50/90 p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="text-slate-600 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Vote className="w-4 h-4 text-pink-600" /> Score Suffrages :
            </span>
            <span className="text-pink-600 font-mono text-sm font-black">
              {candidate.voteCount.toLocaleString('fr-FR')} <span className="text-slate-400 font-normal">({candidate.percentage}%)</span>
            </span>
          </div>

          {/* Glowing Gradient Progress track */}
          <div className="w-full h-3 rounded-full bg-slate-200/80 overflow-hidden p-0.5 border border-slate-300/40 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-600 rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${Math.min(candidate.percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Action Button: VOTER Full Width with Captivating Glow */}
        <div className="pt-1">
          <button
            onClick={() => onVoteClick && onVoteClick(candidate)}
            className="w-full captivating-gradient-btn py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider text-white shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Vote className="w-4.5 h-4.5" />
            <span>VOTER MAINTENANT</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
