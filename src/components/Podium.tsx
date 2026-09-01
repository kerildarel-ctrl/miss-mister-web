'use client';

import React from 'react';
import Image from 'next/image';
import { Candidate } from '@/data/mockData';
import { Crown, Flame, Vote } from 'lucide-react';
import { motion } from 'framer-motion';

interface PodiumProps {
  candidates: Candidate[];
  onVoteClick?: (candidate: Candidate) => void;
}

export const Podium: React.FC<PodiumProps> = ({ candidates, onVoteClick }) => {
  const first = candidates.find((c) => c.rank === 1) || candidates[0];
  const second = candidates.find((c) => c.rank === 2) || candidates[1];
  const third = candidates.find((c) => c.rank === 3) || candidates[2];

  if (!first) return null;

  return (
    <div className="w-full pt-8 pb-12 font-poppins">
      <div className="max-w-4xl mx-auto grid grid-cols-3 gap-3 sm:gap-6 items-end">
        
        {/* 2nd Place (Left) */}
        {second && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            {/* Avatar */}
            <div className="relative mb-3 group">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-xl">
                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white">
                  <Image
                    src={second.photoUrl}
                    alt={second.firstName}
                    fill
                    className="object-cover object-top"
                  />
                </div>
              </div>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md border-2 border-white">
                🥈
              </div>
            </div>

            <div className="text-center mb-2">
              <span className="text-[10px] font-bold font-mono text-slate-500">{second.candidateNumber}</span>
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 truncate max-w-[110px] sm:max-w-[150px]">
                {second.firstName} <span className="uppercase text-blue-600">{second.lastName}</span>
              </h4>
              <p className="text-xs text-blue-600 font-extrabold font-mono flex items-center justify-center gap-1 mt-0.5">
                <Vote className="w-3 h-3 text-blue-600" /> {second.voteCount.toLocaleString('fr-FR')}
              </p>
            </div>

            {/* Pedestal Bar */}
            <div className="w-full h-36 sm:h-44 rounded-t-2xl bg-gradient-to-t from-blue-700 to-blue-500 border-t-2 border-blue-400 p-4 flex flex-col items-center justify-between shadow-lg text-white">
              <div className="font-extrabold text-3xl sm:text-5xl text-white opacity-80">
                2
              </div>
              {onVoteClick && (
                <button
                  onClick={() => onVoteClick(second)}
                  className="w-full py-1.5 px-2 rounded-xl bg-white hover:bg-slate-100 text-blue-700 font-extrabold text-xs shadow transition-colors"
                >
                  VOTER (100 F)
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* 1st Place (Center - Elevated Highest) */}
        {first && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center z-10"
          >
            {/* Crown Icon */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mb-1 text-pink-600"
            >
              <Crown className="w-9 h-9 sm:w-12 sm:h-12 fill-pink-600 drop-shadow-md" />
            </motion.div>

            {/* Avatar */}
            <div className="relative mb-3 group">
              <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full p-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-600 shadow-2xl">
                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white">
                  <Image
                    src={first.photoUrl}
                    alt={first.firstName}
                    fill
                    className="object-cover object-top"
                  />
                </div>
              </div>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-pink-600 text-white flex items-center justify-center font-black text-base shadow-xl border-2 border-white">
                🥇
              </div>
            </div>

            <div className="text-center mb-2">
              <span className="text-xs font-bold font-mono text-pink-600">{first.candidateNumber}</span>
              <h4 className="text-base sm:text-xl font-extrabold text-slate-900 truncate max-w-[130px] sm:max-w-[180px]">
                {first.firstName} <span className="uppercase text-pink-600">{first.lastName}</span>
              </h4>
              <p className="text-sm text-pink-600 font-extrabold font-mono flex items-center justify-center gap-1 mt-0.5">
                <Flame className="w-3.5 h-3.5 fill-pink-500 text-pink-500" /> {first.voteCount.toLocaleString('fr-FR')} votes
              </p>
            </div>

            {/* Pedestal Bar */}
            <div className="w-full h-48 sm:h-56 rounded-t-2xl bg-gradient-to-t from-pink-600 via-purple-600 to-pink-500 border-t-4 border-pink-300 p-4 flex flex-col items-center justify-between shadow-xl text-white">
              <div className="font-extrabold text-4xl sm:text-6xl text-white opacity-90">
                1
              </div>
              {onVoteClick && (
                <button
                  onClick={() => onVoteClick(first)}
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-pink-600 font-extrabold text-xs sm:text-sm shadow-md"
                >
                  VOTER POUR LE 1ER
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* 3rd Place (Right) */}
        {third && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center"
          >
            {/* Avatar */}
            <div className="relative mb-3 group">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-purple-600 to-indigo-500 shadow-xl">
                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white">
                  <Image
                    src={third.photoUrl}
                    alt={third.firstName}
                    fill
                    className="object-cover object-top"
                  />
                </div>
              </div>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md border-2 border-white">
                🥉
              </div>
            </div>

            <div className="text-center mb-2">
              <span className="text-[10px] font-bold font-mono text-slate-500">{third.candidateNumber}</span>
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 truncate max-w-[110px] sm:max-w-[150px]">
                {third.firstName} <span className="uppercase text-purple-600">{third.lastName}</span>
              </h4>
              <p className="text-xs text-purple-600 font-extrabold font-mono flex items-center justify-center gap-1 mt-0.5">
                <Vote className="w-3 h-3 text-purple-600" /> {third.voteCount.toLocaleString('fr-FR')}
              </p>
            </div>

            {/* Pedestal Bar */}
            <div className="w-full h-28 sm:h-36 rounded-t-2xl bg-gradient-to-t from-purple-700 to-purple-500 border-t-2 border-purple-400 p-4 flex flex-col items-center justify-between shadow-lg text-white">
              <div className="font-extrabold text-3xl sm:text-5xl text-white opacity-80">
                3
              </div>
              {onVoteClick && (
                <button
                  onClick={() => onVoteClick(third)}
                  className="w-full py-1.5 px-2 rounded-xl bg-white hover:bg-slate-100 text-purple-700 font-extrabold text-xs shadow transition-colors"
                >
                  VOTER (100 F)
                </button>
              )}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};
