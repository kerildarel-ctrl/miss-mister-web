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
    if (rank === 1) return 'gold-gradient-btn text-slate-950 font-black shadow-lg ring-2 ring-amber-300/50';
    if (rank === 2) return 'bg-blue-600 text-white font-extrabold shadow-md';
    if (rank === 3) return 'bg-purple-600 text-white font-extrabold shadow-md';
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
      className={`group relative rounded-3xl bg-white overflow-hidden flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300 font-poppins ${
        candidate.rank === 1 ? 'border-2 border-amber-400 shadow-amber-500/10' : 'border border-slate-200 hover:border-amber-300'
      }`}
    >
      {/* Top Image / Avatar Container */}
      <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-slate-900">
        {!imageError && candidate.photoUrl ? (
          <Image
            src={candidate.photoUrl}
            alt={`${candidate.firstName} ${candidate.lastName}`}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={() => setImageError(true)}
          />
        ) : (
          /* Styled Gradient Avatar Box (No AI Image) */
          <div className="w-full h-full bg-gradient-to-br from-amber-500 via-purple-600 to-blue-600 flex flex-col items-center justify-center p-6 text-white text-center">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-3xl mb-2 border border-white/30 shadow-lg">
              {getInitials()}
            </div>
            <span className="font-extrabold text-sm tracking-wider uppercase opacity-95">{candidate.firstName} {candidate.lastName}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent pointer-events-none" />

        {/* Candidate Number Badge Top Left */}
        <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-amber-200 font-mono font-extrabold text-xs text-amber-600 shadow-md flex items-center gap-1.5 z-10">
          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
          <span>{candidate.candidateNumber}</span>
        </div>

        {/* Rank Position Badge Top Right with Gold Highlight on #1 */}
        <div className="absolute top-3.5 right-3.5 z-10">
          <span className={`px-3 py-1.5 rounded-2xl text-xs flex items-center gap-1.5 shadow-md ${getRankBadgeClass(candidate.rank)}`}>
            {candidate.rank === 1 && <Crown className="w-4 h-4 fill-slate-950 text-slate-950 animate-bounce" />}
            {candidate.rank <= 3 ? `${candidate.rank}e Rang` : `#${candidate.rank}`}
          </span>
        </div>

        {/* Category Pill Bottom */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
          <span className="px-3 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-[10px] uppercase font-bold text-amber-300 tracking-wider">
            {candidate.category}
          </span>
        </div>

        {/* Direct Link Overlay */}
        <Link
          href={candidateUrl}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/30 backdrop-blur-xs z-20"
        >
          <div className="w-14 h-14 rounded-full gold-gradient-btn text-slate-950 flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform">
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
            <h4 className="text-xl font-extrabold text-slate-900 tracking-wide group-hover/title:text-amber-600 transition-colors">
              {candidate.firstName} <span className="uppercase text-amber-600 font-black">{candidate.lastName}</span>
            </h4>
          </Link>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 font-normal leading-relaxed">
            {candidate.bio}
          </p>
        </div>

        {/* Vote Progress Bar & Metrics */}
        <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Vote className="w-3.5 h-3.5 text-amber-600" /> Score :
            </span>
            <span className="text-amber-600 font-mono text-sm font-extrabold">
              {candidate.voteCount.toLocaleString('fr-FR')} ({candidate.percentage}%)
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${Math.min(candidate.percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Action Button: VOTER Full Width */}
        <div className="pt-1">
          <button
            onClick={() => onVoteClick && onVoteClick(candidate)}
            className="w-full gold-gradient-btn py-3.5 px-4 rounded-2xl font-extrabold text-xs text-slate-950 shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Vote className="w-4 h-4 text-slate-950" />
            <span>VOTER MAINTENANT</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
