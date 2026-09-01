'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getCompetitions, getCandidates } from '@/services/dbService';
import { Competition, Candidate } from '@/data/mockData';
import { Crown, Trophy, Users, Vote, Search, ShieldCheck, ArrowRight, Zap, CheckCircle, Flame } from 'lucide-react';
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

      <main className="flex-1 overflow-hidden font-poppins bg-[#0a0d14] text-slate-100">
        
        {/* ========================================================================= */}
        {/* FIRST SCREEN (HERO): LUXURY ROYAL GOLD & DARK THEME */}
        {/* ========================================================================= */}
        <section className="relative min-h-[88vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden py-16 sm:py-20">
          
          {/* Ambient Glowing Background Orbs in Luxury Gold & Violet */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] ambient-orb-gold opacity-65 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] ambient-orb-rose opacity-40 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 w-[450px] h-[450px] ambient-orb-violet opacity-40 rounded-full blur-[130px] pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto space-y-8">
            
            {/* Royal Crown Badge with Captivating Gold Glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-slate-900/90 backdrop-blur-xl border border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.25)] text-amber-400 text-xs font-black uppercase tracking-widest mx-auto"
            >
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
              <span className="gradient-text-gold">LA PLATEFORME OFFICIELLE DE VOTE EN LIGNE</span>
            </motion.div>

            {/* Giant Captivating Title */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="text-6xl sm:text-7xl lg:text-9xl font-black tracking-tight leading-none text-white">
                <span className="gradient-text-gold drop-shadow-[0_0_35px_rgba(245,158,11,0.3)]">MISS MISTER</span>
              </h1>
              
              <p className="text-lg sm:text-2xl font-black text-slate-200 tracking-wider uppercase flex items-center justify-center gap-2 flex-wrap">
                <span>Votre vote,</span>
                <span className="text-amber-400">votre choix,</span>
                <span className="text-blue-400">votre champion.</span>
              </p>
            </motion.div>

            {/* Subtitle description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal"
            >
              Découvrez les leaders de demain, soutenez l&apos;excellence et faites entendre votre voix en direct grâce aux paiements sécurisés Mobile Money.
            </motion.p>

            {/* Interactive Search Bar in Dark Gold */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-xl mx-auto pt-2"
            >
              <div className="relative flex items-center bg-slate-900/90 backdrop-blur-xl p-2 rounded-3xl border border-amber-500/40 shadow-2xl">
                <Search className="w-5 h-5 text-amber-400 ml-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Rechercher une compétition ou un candidat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent text-white text-xs sm:text-sm font-semibold placeholder-slate-400 focus:outline-none"
                />
                <Link
                  href={searchQuery ? `/competitions?search=${encodeURIComponent(searchQuery)}` : '/competitions'}
                  className="gold-gradient-btn py-3 px-6 rounded-2xl font-black text-xs text-slate-950 uppercase tracking-wider flex-shrink-0 flex items-center gap-1.5 shadow-md"
                >
                  <span>Explorer</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </Link>
              </div>
            </motion.div>

            {/* CTA Action Buttons with Gold & Royal Colors */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-4"
            >
              <Link
                href="/competitions"
                className="gold-gradient-btn py-4 px-8 rounded-2xl text-sm font-black text-slate-950 uppercase tracking-wider flex items-center gap-2.5 shadow-xl hover:scale-105 transition-transform"
              >
                <Trophy className="w-5 h-5 text-slate-950" />
                <span>Voir les Compétitions Officielle</span>
              </Link>

              <Link
                href="/classement"
                className="py-4 px-8 rounded-2xl bg-slate-900 border border-amber-500/40 text-amber-400 hover:bg-slate-800 text-sm font-black uppercase tracking-wider flex items-center gap-2.5 shadow-md transition-colors"
              >
                <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span>Consulter le Classement</span>
              </Link>
            </motion.div>

          </div>

          {/* Live Metrics Counter Bar in Dark Gold */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-5xl mx-auto mt-16 bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
          >
            <div className="space-y-1">
              <p className="text-xs font-black text-amber-400/80 uppercase tracking-widest">Compétitions</p>
              <p className="text-3xl sm:text-4xl font-black text-blue-400 font-mono">{competitions.length || 0}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-black text-amber-400/80 uppercase tracking-widest">Candidats</p>
              <p className="text-3xl sm:text-4xl font-black text-pink-400 font-mono">{candidates.length || 0}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-black text-amber-400/80 uppercase tracking-widest">Total Suffrages</p>
              <p className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">{totalVotes.toLocaleString('fr-FR')} votes</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-black text-amber-400/80 uppercase tracking-widest">Débit Sécurisé</p>
              <p className="text-xs font-black text-emerald-400 uppercase flex items-center justify-center gap-1 mt-2 bg-emerald-500/10 py-1.5 px-3 rounded-full border border-emerald-500/30">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Fapshi 100% Vérifié
              </p>
            </div>
          </motion.div>

        </section>

        {/* ========================================================================= */}
        {/* SECOND SCREEN: HOW IT WORKS & WHY CHOOSE US */}
        {/* ========================================================================= */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-black text-amber-400 uppercase tracking-widest">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>SIMPLE, RAPIDE ET TRANSPARENT</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              COMMENT ÇA <span className="gradient-text-gold">MARCHE ?</span>
            </h2>
            <p className="text-sm text-slate-400">
              Soutenez vos candidats favoris en 4 étapes simples et sécurisées.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="glass-card-gold p-8 rounded-3xl space-y-4 text-center group">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-md border border-amber-500/30">
                <Trophy className="w-8 h-8" />
              </div>
              <span className="inline-block text-xs font-black text-amber-400 font-mono bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                ÉTAPE 01
              </span>
              <h3 className="text-lg font-black text-white">Parcourez</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Explorez le catalogue des compétitions officielles et choisissez celle de votre établissement ou région.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-card-gold p-8 rounded-3xl space-y-4 text-center group">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-md border border-blue-500/30">
                <Users className="w-8 h-8" />
              </div>
              <span className="inline-block text-xs font-black text-blue-400 font-mono bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/30">
                ÉTAPE 02
              </span>
              <h3 className="text-lg font-black text-white">Sélectionnez</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Consultez les profils, les biographies et les photos des candidats en lice.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-card-gold p-8 rounded-3xl space-y-4 text-center group">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-md border border-purple-500/30">
                <Vote className="w-8 h-8" />
              </div>
              <span className="inline-block text-xs font-black text-purple-400 font-mono bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/30">
                ÉTAPE 03
              </span>
              <h3 className="text-lg font-black text-white">Payez par Mobile</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Réglez en toute sécurité via Orange Money ou MTN Mobile Money.
              </p>
            </div>

            {/* Step 4 */}
            <div className="glass-card-gold p-8 rounded-3xl space-y-4 text-center group">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-md border border-emerald-500/30">
                <Crown className="w-8 h-8" />
              </div>
              <span className="inline-block text-xs font-black text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                ÉTAPE 04
              </span>
              <h3 className="text-lg font-black text-white">Suivez en Direct</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Votre vote est décompté et ajouté au score du candidat instantanément !
              </p>
            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* THIRD SECTION: CAPTIVATING GOLD SECURITY BANNER */}
        {/* ========================================================================= */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-slate-950 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-amber-500/30">
            
            {/* Ambient background blur */}
            <div className="absolute top-0 right-0 w-96 h-96 ambient-orb-gold opacity-30 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 ambient-orb-blue opacity-30 rounded-full blur-[100px] pointer-events-none" />

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

            <div className="lg:col-span-4 relative z-10 flex flex-col items-center justify-center space-y-4 text-center bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl border border-amber-500/30">
              <Flame className="w-10 h-10 text-amber-400 animate-pulse" />
              <h4 className="text-xl font-black text-white">Prêt à soutenir votre favori ?</h4>
              <Link
                href="/competitions"
                className="w-full gold-gradient-btn py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider text-slate-950 shadow-xl text-center"
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
