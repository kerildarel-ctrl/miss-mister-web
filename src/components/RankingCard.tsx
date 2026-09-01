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
    <div className="bg-white hover:bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 transition-all flex items-center justify-between gap-3 sm:gap-4 shadow-sm font-poppins">
      
      {/* Rank Number & Avatar */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center font-mono font-extrabold text-slate-700 text-sm flex-shrink-0 border border-slate-200">
          #{candidate.rank}
        </div>

        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
          <Image
            src={candidate.photoUrl}
            alt={candidate.firstName}
            fill
            className="object-cover object-top"
          />
        </div>

        <div>
          <span className="text-[10px] font-bold font-mono text-pink-600">
            {candidate.candidateNumber} • {candidate.category}
          </span>
          <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
            {candidate.firstName} <span className="uppercase text-blue-600">{candidate.lastName}</span>
          </h4>
          <p className="text-xs text-slate-500 font-mono flex items-center gap-2 mt-0.5">
            <span>{candidate.voteCount.toLocaleString('fr-FR')} votes</span>
            <span className="text-blue-600 font-bold">({candidate.percentage}%)</span>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Link
          href={`/competition/${candidate.competitionSlug}/candidat/${candidate.id}`}
          className="hidden sm:flex items-center gap-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors border border-slate-200"
        >
          <Eye className="w-3.5 h-3.5 text-blue-600" /> Profil
        </Link>

        {onVoteClick && (
          <button
            onClick={() => onVoteClick(candidate)}
            className="pink-blue-gradient-btn py-2 px-3.5 rounded-xl text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Vote className="w-3.5 h-3.5" />
            <span>VOTER (100 F)</span>
          </button>
        )}
      </div>

    </div>
  );
};
