'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Candidate } from '@/data/mockData';
import { getCompetitions } from '@/services/dbService';
import { X, Vote, CheckCircle2, Smartphone, Sparkles, ShieldCheck, Loader2, AlertTriangle, PhoneCall, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoteModalProps {
  isOpen: boolean;
  candidate: Candidate | null;
  onClose: () => void;
  onConfirmVote: (candidateId: string, count: number) => void;
}

export const VoteModal: React.FC<VoteModalProps> = ({
  isOpen,
  candidate,
  onClose,
  onConfirmVote,
}) => {
  const [voteCount, setVoteCount] = useState<number>(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Payment Flow States: FORM -> WAITING_DIRECT_PAY / REDIRECTING -> SUCCESS / FAILED
  const [step, setStep] = useState<'FORM' | 'WAITING_DIRECT_PAY' | 'REDIRECTING' | 'SUCCESS' | 'FAILED'>('FORM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [transId, setTransId] = useState<string | null>(null);
  const [voteId, setVoteId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [unitVotePrice, setUnitVotePrice] = useState<number>(100);

  // Fetch custom votePrice per competition
  useEffect(() => {
    async function loadVotePrice() {
      if (candidate?.competitionSlug) {
        const comps = await getCompetitions();
        const comp = comps.find((c) => c.slug === candidate.competitionSlug);
        if (comp && comp.votePrice) {
          setUnitVotePrice(comp.votePrice);
        }
      }
    }
    if (isOpen && candidate) {
      loadVotePrice();
    }
  }, [isOpen, candidate]);

  // Function to perform status verification
  const checkPaymentStatus = async () => {
    if (!transId) return;
    setIsCheckingStatus(true);

    try {
      const res = await fetch(`/api/pay/status?transId=${transId}&voteId=${voteId || ''}`, { cache: 'no-store' });
      const data = await res.json();

      if (data.isSuccess) {
        setStep('SUCCESS');
        onConfirmVote(candidate?.id || '', voteCount);

        try {
          if (typeof window !== 'undefined') {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const confetti = require('canvas-confetti');
            confetti({
              particleCount: 140,
              spread: 90,
              origin: { y: 0.6 },
              colors: ['#F59E0B', '#3B82F6', '#10B981', '#EC4899']
            });
          }
        } catch {
          // Fallback
        }
      } else if (data.status === 'FAILED' || data.status === 'EXPIRED') {
        setErrorMessage('Le paiement a été refusé ou a expiré sur votre téléphone. Aucun compte n’a été débité.');
        setStep('FAILED');
      }
    } catch {
      // Continue
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Automatic Polling to verify Mobile Money debit status in real-time (every 1.8s)
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (step === 'WAITING_DIRECT_PAY' && transId) {
      timer = setInterval(() => {
        checkPaymentStatus();
      }, 1800);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, transId, voteId, candidate, voteCount]);

  if (!isOpen || !candidate) return null;

  const totalPrice = voteCount * unitVotePrice;

  // Initiate Fapshi Direct Pay (USSD Prompt directly to user's phone)
  const handleInitiatePayment = async () => {
    const cleanPhone = phoneNumber ? phoneNumber.replace(/[^0-9]/g, '').slice(-9) : '';

    if (!cleanPhone || cleanPhone.length !== 9) {
      setErrorMessage('Veuillez saisir un numéro de téléphone valide à 9 chiffres (ex: 699000000 ou 670000000).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/pay/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: candidate.id,
          candidateName: `${candidate.firstName} ${candidate.lastName}`,
          competitionSlug: candidate.competitionSlug,
          voteCount: voteCount,
          amount: totalPrice,
          phone: cleanPhone
        })
      });

      const data = await response.json();

      if (data.success) {
        setTransId(data.transId);
        setVoteId(data.voteId);
        setIsSubmitting(false);

        // Simulation Mode
        if (data.transId && data.transId.startsWith('sim_')) {
          setStep('SUCCESS');
          onConfirmVote(candidate.id, voteCount);
          return;
        }

        // Direct Pay (Fapshi USSD Push prompt sent to user's phone!)
        if (data.directPay) {
          setStep('WAITING_DIRECT_PAY');
        } else if (data.link && typeof window !== 'undefined') {
          setStep('REDIRECTING');
          window.location.href = data.link;
        } else {
          setStep('WAITING_DIRECT_PAY');
        }
      } else {
        setIsSubmitting(false);
        setErrorMessage(data.error || 'Erreur lors de l’initialisation de la demande de paiement.');
        setStep('FAILED');
      }
    } catch {
      setIsSubmitting(false);
      setErrorMessage('Erreur réseau. Impossible d’initier le paiement.');
      setStep('FAILED');
    }
  };

  const handleCloseAll = () => {
    setStep('FORM');
    setVoteCount(1);
    setTransId(null);
    setVoteId(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto font-poppins">
        
        {/* Backdrop click to exit */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={handleCloseAll}
        />

        {/* Modal Window in Ultra-Transparent Frosted Glass */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg glass-mirror-panel rounded-[2.5rem] p-6 sm:p-8 border border-white/40 shadow-2xl z-10 my-8 overflow-hidden text-white"
        >
          {/* Top Close Button */}
          <button
            onClick={handleCloseAll}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-300 hover:text-white glass-inner-box transition-colors border border-white/20"
          >
            <X className="w-5 h-5" />
          </button>

          {step === 'FORM' && (
            /* Step 1: Form & Direct Pay Phone Input */
            <div className="space-y-5 text-center">
              
              <div className="w-14 h-14 rounded-full glass-inner-box text-amber-400 flex items-center justify-center mx-auto shadow-xl border border-white/30">
                <Vote className="w-7 h-7 text-amber-400" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white tracking-wide">
                  Soutenir {candidate.firstName}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  1 Vote = <strong className="text-amber-400 font-extrabold">{unitVotePrice} FCFA</strong> • Direct Pay par Mobile Money
                </p>
              </div>

              {/* Candidate Quick Header */}
              <div className="glass-inner-box p-3.5 rounded-2xl border border-white/20 flex items-center gap-3 text-left">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-white/30">
                  <Image
                    src={candidate.photoUrl}
                    alt={candidate.firstName}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-amber-400 font-mono">
                    Candidat {candidate.candidateNumber}
                  </span>
                  <h4 className="text-base font-black text-white">
                    {candidate.firstName} {candidate.lastName}
                  </h4>
                  <p className="text-xs text-slate-300">
                    {candidate.voteCount.toLocaleString('fr-FR')} votes comptabilisés
                  </p>
                </div>
              </div>

              {/* Error Alert Box */}
              {errorMessage && (
                <div className="bg-rose-500/20 border border-rose-400/40 p-3 rounded-xl text-xs text-rose-200 font-bold flex items-center gap-2 text-left">
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Vote Quantity Package Selection */}
              <div className="space-y-2 text-left">
                <label className="block text-xs font-black text-slate-200 uppercase tracking-wider">
                  Nombre de votes souhaités :
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 5, 10, 50].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setVoteCount(count)}
                      className={`py-2.5 rounded-xl font-black text-xs transition-all border ${
                        voteCount === count
                          ? 'gold-gradient-btn text-slate-950 border-white shadow-lg scale-105'
                          : 'glass-inner-box text-slate-200 border-white/20 hover:bg-white/20'
                      }`}
                    >
                      {count} vote{count > 1 ? 's' : ''}
                      <span className="block text-[9px] font-normal opacity-90">
                        {count * unitVotePrice} FCFA
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Pay Phone Input (Clean & Single Input field) */}
              <div className="space-y-1.5 text-left">
                <label className="block text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span>Numéro Mobile Money (Orange / MTN) :</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-black text-slate-300 font-mono">+237</span>
                  <input
                    type="tel"
                    placeholder="699000000 ou 670000000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-16 pr-4 py-3.5 rounded-xl bg-slate-950/90 border border-amber-400/50 text-white text-sm font-mono font-black placeholder-slate-400 focus:outline-none focus:border-amber-400 shadow-inner"
                  />
                </div>
                <p className="text-[10px] text-slate-300 font-medium">
                  Le système détecte automatiquement Orange Money ou MTN Mobile Money.
                </p>
              </div>

              {/* Total Summary */}
              <div className="glass-inner-box p-3.5 rounded-2xl border border-white/20 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-300 font-black uppercase">Montant Total à Débiter</p>
                  <p className="text-xs text-slate-300">{voteCount} vote{voteCount > 1 ? 's' : ''} × {unitVotePrice} FCFA</p>
                </div>
                <p className="text-2xl font-black text-amber-400 font-mono">
                  {totalPrice.toLocaleString('fr-FR')} FCFA
                </p>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-300 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Paiement Direct Pay Fapshi 100% Sécurisé</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleCloseAll}
                  disabled={isSubmitting}
                  className="py-3.5 px-4 rounded-xl glass-inner-box border border-white/20 text-slate-300 hover:text-white font-bold text-xs transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleInitiatePayment}
                  disabled={isSubmitting}
                  className="gold-gradient-btn py-3.5 px-4 rounded-xl font-black text-xs text-slate-950 shadow-xl flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  ) : (
                    <>
                      <PhoneCall className="w-4 h-4 text-slate-950" />
                      <span>Valider ({totalPrice} F)</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {step === 'WAITING_DIRECT_PAY' && (
            /* Step 2: Fapshi Direct Pay USSD Prompt Waiting State + Manual Trigger Button */
            <div className="space-y-6 text-center py-6">
              <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400 mx-auto flex items-center justify-center text-amber-400 shadow-2xl animate-pulse">
                <PhoneCall className="w-10 h-10 text-amber-400 animate-bounce" />
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase">
                  <Smartphone className="w-4 h-4 text-emerald-400" /> Prompt Envoyé au +237 {phoneNumber}
                </span>

                <h3 className="text-2xl font-black text-white tracking-wide">
                  Vérifiez Votre Téléphone !
                </h3>
                <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Une demande de confirmation de <strong className="text-amber-400">{totalPrice} FCFA</strong> a été envoyée sur votre écran de téléphone.
                </p>
              </div>

              <div className="glass-inner-box p-4 rounded-2xl border border-white/30 text-xs text-slate-200 font-semibold space-y-3 text-left">
                <div className="flex items-center gap-2 font-black text-amber-400">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Vérification automatique du statut de débit...</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-normal">
                  Saisissez votre code secret Mobile Money sur votre téléphone (ou composez le <strong>*126#</strong> / <strong>#150*50#</strong> si la notification n&apos;apparaît pas).
                </p>
              </div>

              {/* Interactive Manual Status Check Button */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={checkPaymentStatus}
                  disabled={isCheckingStatus}
                  className="w-full gold-gradient-btn py-3.5 px-4 rounded-2xl font-black text-xs text-slate-950 shadow-xl flex items-center justify-center gap-2 uppercase tracking-wider"
                >
                  {isCheckingStatus ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 text-slate-950" />
                      <span>J&apos;AI VALIDÉ SUR MON TÉLÉPHONE 🚀</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCloseAll}
                  className="py-2.5 px-6 rounded-xl glass-inner-box text-slate-300 hover:text-white font-bold text-xs border border-white/10"
                >
                  Annuler la transaction
                </button>
              </div>

            </div>
          )}

          {step === 'REDIRECTING' && (
            /* Step 2-B: Redirecting State */
            <div className="space-y-6 text-center py-6">
              <div className="w-20 h-20 rounded-full bg-blue-500/20 border-2 border-blue-400 mx-auto flex items-center justify-center text-blue-400 shadow-2xl">
                <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white tracking-wide">
                  Redirection Vers le Portail de Paiement...
                </h3>
                <p className="text-sm text-slate-300 max-w-sm mx-auto">
                  Veuillez valider le débit de <strong className="text-amber-400">{totalPrice} FCFA</strong> sur la page de paiement.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseAll}
                className="py-2.5 px-6 rounded-xl glass-inner-box text-slate-300 hover:text-white font-bold text-xs"
              >
                Annuler
              </button>
            </div>
          )}

          {step === 'SUCCESS' && (
            /* Step 3: Payment Verified & Vote Counted */
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6 text-center py-4"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 mx-auto flex items-center justify-center text-emerald-400 shadow-2xl animate-bounce">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>

              <div>
                <h3 className="text-3xl font-black text-white tracking-wide">
                  🎉 Vote Comptabilisé !
                </h3>
                <p className="text-sm text-slate-300 mt-2 max-w-xs mx-auto">
                  Le débit de <strong className="text-amber-400">{totalPrice} FCFA</strong> a été confirmé. <strong className="text-amber-400">{voteCount} vote{voteCount > 1 ? 's' : ''}</strong> {voteCount > 1 ? 'ont été ajoutés' : 'a été ajouté'} à {candidate.firstName} {candidate.lastName}.
                </p>
              </div>

              <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-400/40 text-xs text-emerald-300 font-bold flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Débit confirmé par Fapshi & Score mis à jour en direct !</span>
              </div>

              <button
                type="button"
                onClick={handleCloseAll}
                className="w-full gold-gradient-btn py-3.5 rounded-xl font-black text-sm text-slate-950 shadow-xl uppercase tracking-wider"
              >
                Fermer
              </button>
            </motion.div>
          )}

          {step === 'FAILED' && (
            /* Step 4: Payment Failed / Cancelled */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-400/40 mx-auto flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-8 h-8 text-rose-400" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">
                  Paiement Non Confirmé
                </h3>
                <p className="text-xs text-slate-300 mt-2 max-w-xs mx-auto leading-relaxed font-mono font-bold">
                  {errorMessage || 'Aucun débit n’a été effectué sur votre compte. Le vote n’a pas été comptabilisé.'}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseAll}
                  className="flex-1 py-3 rounded-xl glass-inner-box text-slate-300 hover:text-white font-bold text-xs"
                >
                  Fermer
                </button>
                <button
                  type="button"
                  onClick={() => setStep('FORM')}
                  className="flex-1 gold-gradient-btn py-3 rounded-xl text-slate-950 font-black text-xs uppercase"
                >
                  Réessayer
                </button>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
