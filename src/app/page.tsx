'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Trophy, Users, Vote, Search, Heart, CheckSquare, Award, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="flex-1 overflow-hidden font-poppins bg-[#F8FAFC]">
        
        {/* HERO SECTION MATCHING SCREENSHOT */}
        <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
          
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-10 left-10 w-96 h-96 bg-pink-300/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-20 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-[120px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Pink Pill Tag */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-pink-600 text-xs font-extrabold uppercase tracking-wider"
              >
                <span>✦ LA BEAUTÉ. LE CHARISME. L&apos;INSPIRATION.</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-slate-900"
              >
                <span className="text-pink-600">MISS </span>
                <span className="text-blue-600">MISTER</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-xl"
              >
                Découvrez, soutenez et votez pour vos candidats préférés dans les différentes compétitions.
              </motion.p>

              {/* CTA Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <Link
                  href="/competitions"
                  className="pink-blue-gradient-btn py-3.5 px-7 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg"
                >
                  <span>Découvrir les compétitions</span>
                  <Trophy className="w-4 h-4" />
                </Link>

                <Link
                  href="/competitions"
                  className="py-3.5 px-7 rounded-full bg-white border border-slate-200 text-blue-600 hover:bg-slate-50 text-sm font-bold flex items-center gap-2 shadow-sm transition-colors"
                >
                  <span>Voir les candidats</span>
                  <Users className="w-4 h-4 text-blue-600" />
                </Link>
              </motion.div>

            </div>

            {/* Right Hero Image (Miss & Mister Pair with Halo) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 relative flex justify-center"
            >
              {/* Glowing Circle Halo Behind Couple */}
              <div className="absolute w-[360px] sm:w-[440px] h-[360px] sm:h-[440px] rounded-full bg-gradient-to-tr from-pink-500/30 via-indigo-500/20 to-blue-500/30 blur-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

              <div className="relative w-full max-w-[460px] h-[440px] sm:h-[520px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="/images/hero_couple.png"
                  alt="Miss Mister Champions"
                  fill
                  priority
                  className="object-cover object-top"
                />
              </div>
            </motion.div>

          </div>
        </section>

        {/* STATISTICS COUNTER ROW */}
        <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center mb-1">
                <Users className="w-6 h-6" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">10+</p>
              <p className="text-xs font-semibold text-slate-500">Compétitions</p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
                <Users className="w-6 h-6" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">150+</p>
              <p className="text-xs font-semibold text-slate-500">Candidats</p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-1">
                <Vote className="w-6 h-6" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">50K+</p>
              <p className="text-xs font-semibold text-slate-500">Votes exprimés</p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1">
                <Award className="w-6 h-6" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">1</p>
              <p className="text-xs font-semibold text-slate-500">Plateforme officielle</p>
            </div>

          </div>
        </section>

        {/* SECTION: COMMENT ÇA MARCHE ? */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">
              COMMENT ÇA MARCHE ?
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <span className="text-xs font-extrabold text-pink-600 font-mono">01</span>
              <h3 className="text-base font-extrabold text-slate-900">Découvrez</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Explorez les compétitions en cours et les candidats.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <span className="text-xs font-extrabold text-blue-600 font-mono">02</span>
              <h3 className="text-base font-extrabold text-slate-900">Choisissez</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Trouvez vos candidats préférés.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                <CheckSquare className="w-6 h-6" />
              </div>
              <span className="text-xs font-extrabold text-purple-600 font-mono">03</span>
              <h3 className="text-base font-extrabold text-slate-900">Votez</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Votez chaque jour pour soutenir vos favoris.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <Trophy className="w-6 h-6" />
              </div>
              <span className="text-xs font-extrabold text-rose-600 font-mono">04</span>
              <h3 className="text-base font-extrabold text-slate-900">Soutenez</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Aidez-les à gagner et devenir la prochaine icône !
              </p>
            </div>

          </div>

        </section>

        {/* CTA BANNER */}
        <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 rounded-3xl p-8 sm:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            
            <div className="space-y-2 max-w-2xl relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black">Votre vote peut tout changer !</h3>
              </div>
              <p className="text-sm text-white/90">
                Chaque vote compte. Soutenez vos candidats préférés dès maintenant.
              </p>
            </div>

            <div className="relative z-10 w-full sm:w-auto">
              <Link
                href="/competitions"
                className="w-full sm:w-auto py-3.5 px-8 rounded-full bg-white text-blue-600 hover:bg-slate-100 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <span>Découvrir les compétitions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
