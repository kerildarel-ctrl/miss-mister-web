'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getCompetitions, getCandidates } from '@/services/dbService';
import { Competition, Candidate } from '@/data/mockData';
import { Crown, Trophy, Users, Vote, Search, ShieldCheck, Sparkles, ArrowRight, Zap, CheckCircle, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

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

      <main className="flex-1 overflow-hidden font-poppins bg-[#F8FAFC]">
        
        {/* ========================================================================= */}
        {/* FIRST SCREEN (HERO): PURE PRESTIGE BRANDING - NO COMPETITIONS ON FIRST SCREEN */}
        {/* ========================================================================= */}
        <section className="relative min-h-[85vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden py-16">
          
          {/* Ambient Glowing Background Orbs (Pure CSS) */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ambient-glow-pink opacity-60 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] ambient-glow-blue opacity-50 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto space-y-8">
            
            {/* Animated Royal Crown Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/90 backdrop-blur-md border border-pink-200 shadow-sm text-pink-600 text-xs font-extrabold uppercase tracking-widest mx-auto"
            >
              <Crown className="w-4 h-4 text-pink-600 fill-pink-600 animate-bounce" />
              <span>LA PLATEFORME OFFICIELLE DE VOTE EN LIGNE</span>
            </motion.div>

            {/* Giant Title */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none text-slate-900">
                <span className="text-pink-600 drop-shadow-sm">MISS </span>
                <span className="text-blue-600 drop-shadow-sm">MISTER</span>
              </h1>
              
              <p className="text-xl sm:text-2xl font-black text-slate-800 tracking-wide uppercase">
                Votre vote, votre choix, votre champion.
              </p>
            </motion.div>

            {/* Subtitle description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
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
              <div className="relative flex items-center bg-white p-2 rounded-2xl border border-slate-200 shadow-xl">
                <Search className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Rechercher une compétition ou un candidat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent text-slate-900 text-xs sm:text-sm font-semibold placeholder-slate-400 focus:outline-none"
                />
                <Link
                  href={searchQuery ? `/competitions?search=${encodeURIComponent(searchQuery)}` : '/competitions'}
                  className="pink-blue-gradient-btn py-3 px-6 rounded-xl font-extrabold text-xs text-white uppercase tracking-wider flex-shrink-0 flex items-center gap-1.5 shadow-md"
                >
                  <span>Explorer</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* CTA Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-4"
            >
              <Link
                href="/competitions"
                className="pink-blue-gradient-btn py-4 px-8 rounded-2xl text-sm font-extrabold text-white flex items-center gap-2 shadow-xl hover:scale-105 transition-transform"
              >
                <Trophy className="w-5 h-5" />
                <span>Voir les Compétitions Officielle</span>
              </Link>

              <Link
                href="/classement"
                className="py-4 px-8 rounded-2xl bg-white border border-slate-200 text-blue-600 hover:bg-slate-50 text-sm font-extrabold flex items-center gap-2 shadow-md transition-colors"
              >
                <Crown className="w-5 h-5 text-blue-600" />
                <span>Consulter le Classement</span>
              </Link>
            </motion.div>

          </div>

          {/* Live Metrics Counter Bar at bottom of Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-5xl mx-auto mt-16 bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-slate-200/80 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          >
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Compétitions</p>
              <p className="text-3xl font-black text-blue-600 font-mono">{competitions.length || 0}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Candidats</p>
              <p className="text-3xl font-black text-pink-600 font-mono">{candidates.length || 0}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Suffrages</p>
              <p className="text-3xl font-black text-purple-600 font-mono">{totalVotes.toLocaleString('fr-FR')} votes</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Débit Sécurisé</p>
              <p className="text-xs font-black text-emerald-600 uppercase flex items-center justify-center gap-1 mt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Fapshi 100% Vérifié
              </p>
            </div>
          </motion.div>

        </section>

        {/* ========================================================================= */}
        {/* SECOND SCREEN: HOW IT WORKS & WHY CHOOSE US */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-extrabold text-blue-600 uppercase tracking-widest">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>SIMPLE, RAPIDE ET TRANSPARENT</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              COMMENT ÇA <span className="text-pink-600">MARCHE ?</span>
            </h2>
            <p className="text-sm text-slate-600">
              Soutenez vos candidats favoris en 4 étapes simples et sécurisées.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 space-y-4 text-center group">
              <div className="w-16 h-16 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-sm">
                <Trophy className="w-8 h-8" />
              </div>
              <span className="inline-block text-xs font-black text-pink-600 font-mono bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
                ÉTAPE 01
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">Parcourez</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Explorez le catalogue des compétitions officielles et choisissez celle de votre établissement ou région.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 space-y-4 text-center group">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-sm">
                <Users className="w-8 h-8" />
              </div>
              <span className="inline-block text-xs font-black text-blue-600 font-mono bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                ÉTAPE 02
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">Sélectionnez</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Consultez les profils, les biographies et les photos des candidats en lice.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 space-y-4 text-center group">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-sm">
                <Vote className="w-8 h-8" />
              </div>
              <span className="inline-block text-xs font-black text-purple-600 font-mono bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                ÉTAPE 03
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">Payez par Mobile</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Réglez en toute sécurité via Orange Money ou MTN Mobile Money.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 space-y-4 text-center group">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-sm">
                <Crown className="w-8 h-8" />
              </div>
              <span className="inline-block text-xs font-black text-emerald-600 font-mono bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ÉTAPE 04
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">Suivez en Direct</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Votre vote est décompté et ajouté au score du candidat instantanément !
              </p>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* THIRD SECTION: SECURITY & ENGAGEMENT BANNER */}
        {/* ========================================================================= */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-slate-800">
            
            {/* Ambient background blur */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="lg:col-span-8 space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Paiements Sécurisés & Anti-Fraude</span>
              </div>

              <h3 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Une transparence totale pour chaque vote.
              </h3>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                Chaque suffrage est vérifié par confirmation bancaire Mobile Money. Les votes ne sont comptabilisés que si le compte est débité avec succès, garantissant une équité parfaite.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> API Fapshi Officielle
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Sauvegarde Supabase
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Support 24/7
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 relative z-10 flex flex-col items-center justify-center space-y-4 text-center bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
              <Flame className="w-10 h-10 text-pink-400 animate-pulse" />
              <h4 className="text-xl font-extrabold text-white">Prêt à soutenir votre favori ?</h4>
              <Link
                href="/competitions"
                className="w-full pink-blue-gradient-btn py-3.5 px-6 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-lg text-center"
              >
                Accéder aux compétitions
              </Link>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
