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
        {/* FIRST SCREEN (HERO): CAPTIVATING ROYAL BRANDING - NO COMPETITIONS ON FIRST SCREEN */}
        {/* ========================================================================= */}
        <section className="relative min-h-[85vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden py-16 sm:py-20">
          
          {/* Ambient Glowing Background Orbs (Captivating HSL Colors) */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] ambient-orb-rose opacity-70 rounded-full blur-[150px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] ambient-orb-violet opacity-60 rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 w-[450px] h-[450px] ambient-orb-blue opacity-50 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto space-y-8">
            
            {/* Royal Crown Badge with Captivating Gold Glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/95 backdrop-blur-xl border border-pink-300/80 shadow-lg text-pink-600 text-xs font-black uppercase tracking-widest mx-auto"
            >
              <Crown className="w-4 h-4 text-amber-500 fill-amber-400 animate-bounce" />
              <span className="gradient-text-captivating">LA PLATEFORME OFFICIELLE DE VOTE EN LIGNE</span>
            </motion.div>

            {/* Giant Captivating Title */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black tracking-tight leading-none text-slate-900">
                <span className="gradient-text-captivating drop-shadow-md">MISS MISTER</span>
              </h1>
              
              <p className="text-lg sm:text-2xl font-black text-slate-800 tracking-wider uppercase flex items-center justify-center gap-2 flex-wrap">
                <span>Votre vote,</span>
                <span className="text-pink-600">votre choix,</span>
                <span className="text-blue-600">votre champion.</span>
              </p>
            </motion.div>

            {/* Subtitle description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal"
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
              <div className="relative flex items-center bg-white/95 backdrop-blur-xl p-2 rounded-3xl border border-pink-200/80 shadow-2xl">
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
                  className="captivating-gradient-btn py-3 px-6 rounded-2xl font-black text-xs text-white uppercase tracking-wider flex-shrink-0 flex items-center gap-1.5 shadow-md"
                >
                  <span>Explorer</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* CTA Action Buttons with Captivating Colors */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-4"
            >
              <Link
                href="/competitions"
                className="captivating-gradient-btn py-4 px-8 rounded-2xl text-sm font-black text-white uppercase tracking-wider flex items-center gap-2.5 shadow-xl hover:scale-105 transition-transform"
              >
                <Trophy className="w-5 h-5" />
                <span>Voir les Compétitions Officielle</span>
              </Link>

              <Link
                href="/classement"
                className="py-4 px-8 rounded-2xl bg-white border border-slate-200/90 text-blue-600 hover:bg-slate-50 text-sm font-black uppercase tracking-wider flex items-center gap-2.5 shadow-md transition-colors"
              >
                <Crown className="w-5 h-5 text-amber-500 fill-amber-400" />
                <span>Consulter le Classement</span>
              </Link>
            </motion.div>

          </div>

          {/* Live Metrics Counter Bar with Captivating Color Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-5xl mx-auto mt-16 bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          >
            <div className="space-y-1">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Compétitions</p>
              <p className="text-3xl sm:text-4xl font-black text-blue-600 font-mono">{competitions.length || 0}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Candidats</p>
              <p className="text-3xl sm:text-4xl font-black text-pink-600 font-mono">{candidates.length || 0}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Suffrages</p>
              <p className="text-3xl sm:text-4xl font-black text-purple-600 font-mono">{totalVotes.toLocaleString('fr-FR')} votes</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Débit Sécurisé</p>
              <p className="text-xs font-black text-emerald-600 uppercase flex items-center justify-center gap-1 mt-2 bg-emerald-50 py-1.5 px-3 rounded-full border border-emerald-200">
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-black text-blue-600 uppercase tracking-widest">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>SIMPLE, RAPIDE ET TRANSPARENT</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              COMMENT ÇA <span className="gradient-text-captivating">MARCHE ?</span>
            </h2>
            <p className="text-sm text-slate-600">
              Soutenez vos candidats favoris en 4 étapes simples et sécurisées.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="glass-card-glow p-8 rounded-3xl space-y-4 text-center group">
              <div className="w-16 h-16 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-md border border-pink-200">
                <Trophy className="w-8 h-8" />
              </div>
              <span className="inline-block text-xs font-black text-pink-600 font-mono bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
                ÉTAPE 01
              </span>
              <h3 className="text-lg font-black text-slate-900">Parcourez</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Explorez le catalogue des compétitions officielles et choisissez celle de votre établissement ou région.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-card-glow p-8 rounded-3xl space-y-4 text-center group">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-md border border-blue-200">
                <Users className="w-8 h-8" />
              </div>
              <span className="inline-block text-xs font-black text-blue-600 font-mono bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                ÉTAPE 02
              </span>
              <h3 className="text-lg font-black text-slate-900">Sélectionnez</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Consultez les profils, les biographies et les photos des candidats en lice.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-card-glow p-8 rounded-3xl space-y-4 text-center group">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-md border border-purple-200">
                <Vote className="w-8 h-8" />
              </div>
              <span className="inline-block text-xs font-black text-purple-600 font-mono bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                ÉTAPE 03
              </span>
              <h3 className="text-lg font-black text-slate-900">Payez par Mobile</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Réglez en toute sécurité via Orange Money ou MTN Mobile Money.
              </p>
            </div>

            {/* Step 4 */}
            <div className="glass-card-glow p-8 rounded-3xl space-y-4 text-center group">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-md border border-emerald-200">
                <Crown className="w-8 h-8" />
              </div>
              <span className="inline-block text-xs font-black text-emerald-600 font-mono bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ÉTAPE 04
              </span>
              <h3 className="text-lg font-black text-slate-900">Suivez en Direct</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Votre vote est décompté et ajouté au score du candidat instantanément !
              </p>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* THIRD SECTION: CAPTIVATING SECURITY BANNER */}
        {/* ========================================================================= */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-slate-950 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-purple-900/40">
            
            {/* Ambient background blur */}
            <div className="absolute top-0 right-0 w-96 h-96 ambient-orb-rose opacity-40 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 ambient-orb-blue opacity-40 rounded-full blur-[100px] pointer-events-none" />

            <div className="lg:col-span-8 space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider">
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

            <div className="lg:col-span-4 relative z-10 flex flex-col items-center justify-center space-y-4 text-center bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/15">
              <Flame className="w-10 h-10 text-pink-400 animate-pulse" />
              <h4 className="text-xl font-black text-white">Prêt à soutenir votre favori ?</h4>
              <Link
                href="/competitions"
                className="w-full captivating-gradient-btn py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider text-white shadow-xl text-center"
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
