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
      className="group relative rounded-[2rem] glass-mirror-panel p-3.5 flex flex-col justify-between font-poppins transition-all duration-400"
    >
      {/* Banner & Header Image */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden rounded-[1.5rem] bg-slate-950">
        <Image
          src={competition.bannerImage}
          alt={competition.title}
          fill
          className="object-cover group-hover:scale-108 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span
            className={`px-3.5 py-1 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-1.5 shadow-xl border border-white/30 backdrop-blur-md ${
              isEnCours
                ? 'bg-emerald-600/90 text-white'
                : competition.status === 'A VENIR'
                ? 'bg-blue-600/90 text-white'
                : 'bg-slate-800/90 text-white'
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
            <p className="text-xs text-amber-300 flex items-center gap-1.5 mt-1 font-bold">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              Fin : {new Date(competition.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* ULTRA TRANSPARENT FROSTED GLASS BODY CONTENT */}
      <div className="mt-3.5 p-6 space-y-5 flex-1 flex flex-col justify-between glass-inner-box text-white">
        <p className="text-sm text-slate-200 line-clamp-2 leading-relaxed font-medium">
          {competition.description}
        </p>

        {/* Countdown Component */}
        <div className="bg-slate-950/60 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Temps Restant :
          </span>
          <Countdown targetDate={competition.endDate} compact />
        </div>

        {/* Stats metrics */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-slate-950/60 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 text-amber-400 flex items-center justify-center border border-white/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-300 uppercase font-black">Candidats</p>
              <p className="text-base font-black text-white">{competition.totalCandidates}</p>
            </div>
          </div>

          <div className="bg-slate-950/60 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Vote className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-300 uppercase font-black">Total Votes</p>
              <p className="text-base font-black text-amber-400">
                {competition.totalVotes.toLocaleString('fr-FR')}
              </p>
            </div>
          </div>
        </div>

        {/* CTA Link Button */}
        <div className="pt-2">
          <Link
            href={`/competition/${competition.slug}`}
            className="w-full gold-gradient-btn py-3.5 px-5 rounded-2xl font-black text-xs uppercase tracking-wider text-slate-950 flex items-center justify-center gap-2 shadow-xl group/btn active:scale-95 transition-transform"
          >
            <span className="text-slate-950 font-black">Voir la compétition</span>
            <ArrowRight className="w-4 h-4 text-slate-950 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
