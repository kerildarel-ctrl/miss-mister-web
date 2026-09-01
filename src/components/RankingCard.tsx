'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Candidate } from '@/data/mockData';
import { Vote, Eye } from 'lucide-react';

interface RankingCardProps {
  candidate: Candidate;
  onVoteClick?: (candidate: Candidate) => void;
}

export const RankingCard: React.FC<RankingCardProps> = ({ candidate, onVoteClick }) => {
  return (
    <div className="bg-[#131A26]/90 backdrop-blur-xl hover:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-amber-500/20 transition-all flex items-center justify-between gap-3 sm:gap-4 shadow-md font-poppins">
      
      {/* Rank Number & Avatar */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#0B0E14] flex items-center justify-center font-mono font-black text-amber-400 text-sm flex-shrink-0 border border-amber-500/30">
          #{candidate.rank}
        </div>

        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden flex-shrink-0 border border-amber-500/30">
          <Image
            src={candidate.photoUrl}
            alt={candidate.firstName}
            fill
            className="object-cover object-top"
          />
        </div>

        <div>
          <span className="text-[10px] font-black font-mono text-amber-400">
            {candidate.candidateNumber} • {candidate.category}
          </span>
          <h4 className="text-sm sm:text-base font-black text-white">
            {candidate.firstName} <span className="uppercase text-amber-400">{candidate.lastName}</span>
          </h4>
          <p className="text-xs text-slate-300 font-mono flex items-center gap-2 mt-0.5 font-bold">
            <span>{candidate.voteCount.toLocaleString('fr-FR')} votes</span>
            <span className="text-amber-400">({candidate.percentage}%)</span>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Link
          href={`/competition/${candidate.competitionSlug}/candidat/${candidate.id}`}
          className="hidden sm:flex items-center gap-1 py-2 px-3 rounded-xl bg-[#0B0E14] hover:bg-slate-800 text-slate-200 text-xs font-black transition-colors border border-amber-500/20"
        >
          <Eye className="w-3.5 h-3.5 text-amber-400" /> Profil
        </Link>

        {onVoteClick && (
          <button
            onClick={() => onVoteClick(candidate)}
            className="gold-gradient-btn py-2 px-3.5 rounded-xl text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 uppercase"
          >
            <Vote className="w-3.5 h-3.5 text-slate-950" />
            <span>VOTER</span>
          </button>
        )}
      </div>

    </div>
  );
};
