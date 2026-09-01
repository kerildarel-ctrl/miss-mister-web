'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Vote, ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { Competition } from '@/data/mockData';
import { Countdown } from '@/components/Countdown';
import { motion } from 'framer-motion';

interface CompetitionCardProps {
  competition: Competition;
  index?: number;
}

export const CompetitionCard: React.FC<CompetitionCardProps> = ({ competition, index = 0 }) => {
  const isEnCours = competition.status === 'EN COURS';

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative rounded-3xl overflow-hidden bg-white border border-slate-200 hover:border-blue-400 transition-all duration-300 shadow-md hover:shadow-xl flex flex-col justify-between font-poppins"
    >
      {/* Banner & Header Image */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-100">
        <Image
          src={competition.bannerImage}
          alt={competition.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span
            className={`px-3.5 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase flex items-center gap-1.5 shadow-md ${
              isEnCours
                ? 'bg-emerald-500 text-white'
                : competition.status === 'A VENIR'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-white'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isEnCours ? 'bg-white animate-ping' : 'bg-slate-300'
              }`}
            />
            🏆 {competition.status}
          </span>
        </div>

        {/* Competition Title Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-wide drop-shadow-md">
              {competition.title}
            </h3>
            <p className="text-xs text-slate-200 flex items-center gap-1.5 mt-1 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-pink-400" />
              Fin : {new Date(competition.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 space-y-5 flex-1 flex flex-col justify-between bg-white relative z-10">
        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed font-normal">
          {competition.description}
        </p>

        {/* Countdown Component */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Temps Restant :
          </span>
          <Countdown targetDate={competition.endDate} compact />
        </div>

        {/* Stats metrics */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Candidats</p>
              <p className="text-base font-extrabold text-slate-900">{competition.totalCandidates}</p>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Vote className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Total Votes</p>
              <p className="text-base font-extrabold text-blue-600">
                {competition.totalVotes.toLocaleString('fr-FR')}
              </p>
            </div>
          </div>
        </div>

        {/* CTA Link Button */}
        <div className="pt-2">
          <Link
            href={`/competition/${competition.slug}`}
            className="w-full blue-pill-btn py-3.5 px-5 rounded-2xl font-extrabold text-xs text-white flex items-center justify-center gap-2 shadow-md group/btn"
          >
            <span>Voir la compétition</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
