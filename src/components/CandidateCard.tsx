'use client';

import React from 'react';
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
  // Format slug e.g. koussokeril or arielle-kousso
  const candidateSlug = `${candidate.lastName}${candidate.firstName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');

  const candidateUrl = `/competition/${candidate.competitionSlug}/${candidateSlug}`;

  const getRankBadgeClass = (rank: number) => {
    if (rank === 1) return 'bg-pink-600 text-white font-extrabold shadow-md';
    if (rank === 2) return 'bg-blue-600 text-white font-extrabold shadow-md';
    if (rank === 3) return 'bg-purple-600 text-white font-extrabold shadow-md';
    return 'bg-slate-800 text-white font-bold';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="group relative rounded-3xl bg-white border border-slate-200 hover:border-blue-400 overflow-hidden flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300 font-poppins"
    >
      {/* Top Image Container (Clicking opens /competition/[slug]/[candidateSlug]) */}
      <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-slate-100">
        <Image
          src={candidate.photoUrl}
          alt={`${candidate.firstName} ${candidate.lastName}`}
          fill
          className="object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

        {/* Candidate Number Badge Top Left */}
        <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-200 font-mono font-extrabold text-xs text-blue-600 shadow-md flex items-center gap-1.5 z-10">
          <Flame className="w-3.5 h-3.5 text-pink-500 fill-pink-500 animate-pulse" />
          <span>{candidate.candidateNumber}</span>
        </div>

        {/* Rank Position Badge Top Right */}
        <div className="absolute top-3.5 right-3.5 z-10">
          <span className={`px-3 py-1 rounded-2xl text-xs flex items-center gap-1.5 shadow-md ${getRankBadgeClass(candidate.rank)}`}>
            {candidate.rank === 1 && <Crown className="w-3.5 h-3.5 fill-white text-white" />}
            {candidate.rank <= 3 ? `${candidate.rank}e Rang` : `#${candidate.rank}`}
          </span>
        </div>

        {/* Category Pill Bottom */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
          <span className="px-3 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-[10px] uppercase font-bold text-white tracking-wider">
            {candidate.category}
          </span>
        </div>

        {/* Direct Link to Candidate Page /competition/[slug]/[candidateSlug] */}
        <Link
          href={candidateUrl}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/30 backdrop-blur-xs"
        >
          <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform">
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
            <h4 className="text-xl font-extrabold text-slate-900 tracking-wide group-hover/title:text-blue-600 transition-colors">
              {candidate.firstName} <span className="uppercase text-blue-600">{candidate.lastName}</span>
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
              <Vote className="w-3.5 h-3.5 text-blue-600" /> Score :
            </span>
            <span className="text-blue-600 font-mono text-sm font-extrabold">
              {candidate.voteCount.toLocaleString('fr-FR')} ({candidate.percentage}%)
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-pink-500 to-blue-600 rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${Math.min(candidate.percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Action Button: VOTER Full Width */}
        <div className="pt-1">
          <button
            onClick={() => onVoteClick && onVoteClick(candidate)}
            className="w-full pink-blue-gradient-btn py-3.5 px-4 rounded-2xl font-extrabold text-xs text-white shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Vote className="w-4 h-4" />
            <span>VOTER MAINTENANT</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
