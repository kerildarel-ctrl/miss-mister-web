'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CreateEventModal } from '@/components/CreateEventModal';
import { getCompetitions, getCandidates } from '@/services/dbService';
import { Competition, Candidate } from '@/data/mockData';
import { Crown, Trophy, Users, Vote, Search, ShieldCheck, ArrowRight, Zap, CheckCircle, Flame, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const comps = await getCompetitions();
      const cands = await getCandidates();
      setCompetitions(comps);
      setCandidates(cands);
    }
    loadData();
  }, []);

  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);

  return (
    <>
      <Header />

      <main className="flex-1 overflow-hidden font-poppins bg-[#0B0E14] text-white">
        
        {/* ========================================================================= */}
        {/* FIRST SCREEN (HERO): PURE PRESTIGE BRANDING WITH CREATE EVENT CTA BUTTON */}
        {/* ========================================================================= */}
        <section className="relative min-h-[85vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden py-16">
          
          {/* Ambient Glowing Background Orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ambient-orb-gold opacity-50 rounded-full blur-[140px] pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto space-y-8">
            
            {/* Crown Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-[#131A26]/90 backdrop-blur-md border border-amber-500/30 shadow-lg text-white text-xs font-black uppercase tracking-widest mx-auto"
            >
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
              <span className="text-amber-300">LA PLATEFORME OFFICIELLE DE VOTE EN LIGNE</span>
            </motion.div>

            {/* Giant Title */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none text-white drop-shadow-md">
                <span>MISS </span>
                <span className="gradient-text-gold">MISTER</span>
              </h1>
              
              <p className="text-xl sm:text-2xl font-black text-slate-200 tracking-wide uppercase">
                Votre vote, votre choix, <span className="gradient-text-gold">votre champion</span>.
              </p>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Découvrez les leaders de demain, soutenez l&apos;excellence et faites entendre votre voix en direct grâce aux paiements sécurisés Mobile Money.
            </motion.p>

            {/* Interactive Search Bar in Hero */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-xl mx-auto pt-2"
            >
              <div className="relative flex items-center bg-[#131A26]/90 backdrop-blur-md p-2 rounded-2xl border border-amber-500/30 shadow-2xl">
                <Search className="w-5 h-5 text-amber-400 ml-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Rechercher une compétition ou un candidat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent text-white text-xs sm:text-sm font-bold placeholder-slate-400 focus:outline-none"
                />
                <Link
                  href={searchQuery ? `/competitions?search=${encodeURIComponent(searchQuery)}` : '/competitions'}
                  className="gold-gradient-btn py-3 px-6 rounded-xl font-black text-xs text-slate-950 uppercase tracking-wider flex-shrink-0 flex items-center gap-1.5 shadow-md"
                >
                  <span>Explorer</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </Link>
              </div>
            </motion.div>

            {/* CTA ACTION BUTTONS */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-4"
            >
              {/* HIGH-VISIBILITY BUTTON: CRÉER MON ÉVÉNEMENT */}
              <button
                onClick={() => setIsEventModalOpen(true)}
                className="gold-gradient-btn py-4 px-8 rounded-2xl text-sm font-black uppercase tracking-wider text-slate-950 flex items-center gap-2.5 shadow-2xl hover:scale-105 transition-transform border border-amber-300"
              >
                <PlusCircle className="w-6 h-6 text-slate-950" />
                <span>CRÉER MON ÉVÉNEMENT</span>
              </button>

              <Link
                href="/competitions"
                className="py-4 px-8 rounded-2xl bg-[#131A26] border border-amber-500/30 hover:border-amber-400 text-white text-sm font-black uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 transition-transform"
              >
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>Voir les Compétitions</span>
              </Link>

              <Link
                href="/classement"
                className="py-4 px-8 rounded-2xl bg-[#131A26] border border-amber-500/30 text-white hover:bg-slate-800 text-sm font-black uppercase tracking-wider flex items-center gap-2 shadow-md transition-colors"
              >
                <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span>Classement</span>
              </Link>
            </motion.div>

          </div>

          {/* Live Metrics Counter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-5xl mx-auto mt-16 bg-[#131A26]/90 backdrop-blur-xl rounded-3xl p-6 border border-amber-500/30 shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          >
            <div className="space-y-1">
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Compétitions</p>
              <p className="text-3xl font-black text-amber-400 font-mono">{competitions.length || 0}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Candidats</p>
              <p className="text-3xl font-black text-amber-400 font-mono">{candidates.length || 0}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Total Suffrages</p>
              <p className="text-3xl font-black text-amber-400 font-mono">{totalVotes.toLocaleString('fr-FR')} votes</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Débit Sécurisé</p>
              <p className="text-xs font-black text-emerald-400 uppercase flex items-center justify-center gap-1 mt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Mobile Money 100% Sécurisé
              </p>
            </div>
          </motion.div>

        </section>

        {/* ========================================================================= */}
        {/* SECOND SCREEN: HOW IT WORKS */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#131A26] border border-amber-500/30 text-xs font-black text-amber-400 uppercase tracking-widest">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>SIMPLE, RAPIDE ET TRANSPARENT</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              COMMENT ÇA <span className="gradient-text-gold">MARCHE ?</span>
            </h2>
            <p className="text-sm font-semibold text-slate-300">
              Soutenez vos candidats favoris en 4 étapes simples et sécurisées.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="bg-[#131A26]/90 backdrop-blur-xl p-8 rounded-3xl border border-amber-500/20 shadow-xl hover:border-amber-400 transition-all duration-300 space-y-4 text-center group">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-sm border border-amber-500/20">
                <Trophy className="w-8 h-8" />
              </div>
              <span className="inline-block text-xs font-black text-amber-400 font-mono bg-[#0B0E14] px-3 py-1 rounded-full border border-amber-500/20">
                ÉTAPE 01
              </span>
              <h3 className="text-lg font-black text-white">Parcourez</h3>
              <p className="text-xs font-medium text-slate-300 leading-relaxed">
                Explorez le catalogue des compétitions officielles et choisissez celle de votre établissement ou région.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#131A26]/90 backdrop-blur-xl p-8 rounded-3xl border border-amber-500/20 shadow-xl hover:border-amber-400 transition-all duration-300 space-y-4 text-center group">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-sm border border-amber-500/20">
                <Users className="w-8 h-8" />
              </div>
              <span className="inline-block text-xs font-black text-amber-400 font-mono bg-[#0B0E14] px-3 py-1 rounded-full border border-amber-500/20">
                ÉTAPE 02
              </span>
              <h3 className="text-lg font-black text-white">Sélectionnez</h3>
              <p className="text-xs font-medium text-slate-300 leading-relaxed">
                Consultez les profils, les biographies et les photos des candidats en lice.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#131A26]/90 backdrop-blur-xl p-8 rounded-3xl border border-amber-500/20 shadow-xl hover:border-amber-400 transition-all duration-300 space-y-4 text-center group">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-sm border border-amber-500/20">
                <Vote className="w-8 h-8" />
              </div>
              <span className="inline-block text-xs font-black text-amber-400 font-mono bg-[#0B0E14] px-3 py-1 rounded-full border border-amber-500/20">
                ÉTAPE 03
              </span>
              <h3 className="text-lg font-black text-white">Payez par Mobile</h3>
              <p className="text-xs font-medium text-slate-300 leading-relaxed">
                Réglez en toute sécurité via Orange Money ou MTN Mobile Money.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#131A26]/90 backdrop-blur-xl p-8 rounded-3xl border border-amber-500/20 shadow-xl hover:border-amber-400 transition-all duration-300 space-y-4 text-center group">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-sm border border-amber-500/20">
                <Crown className="w-8 h-8 text-amber-400" />
              </div>
              <span className="inline-block text-xs font-black text-amber-400 font-mono bg-[#0B0E14] px-3 py-1 rounded-full border border-amber-500/20">
                ÉTAPE 04
              </span>
              <h3 className="text-lg font-black text-white">Suivez en Direct</h3>
              <p className="text-xs font-medium text-slate-300 leading-relaxed">
                Votre vote est décompté et ajouté au score du candidat instantanément !
              </p>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* THIRD SECTION: SECURITY BANNER */}
        {/* ========================================================================= */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-[#131A26] rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-amber-500/30">
            
            {/* Ambient background blur */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="lg:col-span-8 space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Paiements Sécurisés & Anti-Fraude</span>
              </div>

              <h3 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
                Vous souhaitez organiser votre propre élection ?
              </h3>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                Soumettez votre demande d&apos;événement en ligne pour créer votre compétition personnalisée et recevoir vos paiements directement par Mobile Money.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-slate-200">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Configuration Rapide
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Débit Direct Sécurisé
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Support 24/7
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 relative z-10 flex flex-col items-center justify-center space-y-4 text-center bg-[#0B0E14]/80 backdrop-blur-md p-6 rounded-2xl border border-amber-500/30">
              <Flame className="w-10 h-10 text-amber-400 animate-pulse" />
              <h4 className="text-xl font-extrabold text-white">Créez votre élection dès aujourd&apos;hui</h4>
              <button
                onClick={() => setIsEventModalOpen(true)}
                className="w-full gold-gradient-btn py-3.5 px-6 rounded-xl font-black text-xs uppercase tracking-wider text-slate-950 shadow-xl text-center flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-5 h-5 text-slate-950" />
                <span>CRÉER MON ÉVÉNEMENT</span>
              </button>
            </div>

          </div>
        </section>

      </main>

      {/* EVENT CREATION FORM MODAL */}
      <CreateEventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
      />

      <Footer />
    </>
  );
}
