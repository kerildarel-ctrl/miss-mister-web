'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Candidate } from '@/data/mockData';
import { getCompetitions } from '@/services/dbService';
import { X, Vote, CheckCircle2, Smartphone, Sparkles, ShieldCheck, Loader2, AlertTriangle, Info } from 'lucide-react';
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
  const [paymentMethod, setPaymentMethod] = useState<'orange' | 'mtn'>('orange');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Payment Flow States
  const [step, setStep] = useState<'FORM' | 'WAITING_PAYMENT' | 'SUCCESS' | 'FAILED'>('FORM');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Automatic Polling to verify Mobile Money debit status
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (step === 'WAITING_PAYMENT' && transId) {
      timer = setInterval(async () => {
        try {
          const res = await fetch(`/api/pay/status?transId=${transId}&voteId=${voteId || ''}`, { cache: 'no-store' });
          const data = await res.json();

          if (data.isSuccess) {
            // MONEY CONFIRMED DEDUCTED!
            clearInterval(timer);
            setStep('SUCCESS');
            onConfirmVote(candidate?.id || '', voteCount);

            try {
              if (typeof window !== 'undefined') {
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                const confetti = require('canvas-confetti');
                confetti({
                  particleCount: 120,
                  spread: 80,
                  origin: { y: 0.6 },
                  colors: ['#EC4899', '#2563EB', '#8B5CF6', '#10B981']
                });
              }
            } catch {
              // Fallback
            }
          } else if (data.status === 'FAILED' || data.status === 'EXPIRED') {
            clearInterval(timer);
            setErrorMessage('Le paiement a été refusé ou a expiré. Aucun compte n’a été débité.');
            setStep('FAILED');
          }
        } catch {
          // Continue polling
        }
      }, 3000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, transId, voteId, candidate, voteCount, onConfirmVote]);

  if (!isOpen || !candidate) return null;

  const totalPrice = voteCount * unitVotePrice;

  // Initiate Payment & AUTOMATICALLY REDIRECT TO PAYMENT PORTAL
  const handleInitiatePayment = async () => {
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
          paymentMethod: paymentMethod,
          phone: phoneNumber
        })
      });

      const data = await response.json();

      if (data.success) {
        setTransId(data.transId);
        setVoteId(data.voteId);

        // Simulation Mode
        if (data.transId && data.transId.startsWith('sim_')) {
          setIsSubmitting(false);
          setStep('SUCCESS');
          onConfirmVote(candidate.id, voteCount);
          return;
        }

        // AUTOMATIC DIRECT REDIRECT TO PAYMENT PORTAL
        if (data.link && typeof window !== 'undefined') {
          window.location.href = data.link;
        } else {
          setIsSubmitting(false);
          setStep('WAITING_PAYMENT');
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto font-poppins">
        
        {/* Backdrop click to exit */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={handleCloseAll}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl z-10 my-8 overflow-hidden text-slate-900"
        >
          {/* Top Close Button */}
          <button
            onClick={handleCloseAll}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {step === 'FORM' && (
            /* Step 1: Form & Pack Selection */
            <div className="space-y-5 text-center">
              
              <div className="w-14 h-14 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center mx-auto shadow-sm">
                <Vote className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-wide">
                  Soutenir {candidate.firstName}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  1 Vote = <strong className="text-amber-600 font-extrabold">{unitVotePrice} FCFA</strong> • Redirection directe vers le paiement
                </p>
              </div>

              {/* Candidate Quick Header */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3 text-left">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
                  <Image
                    src={candidate.photoUrl}
                    alt={candidate.firstName}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-blue-600 font-mono">
                    Candidat {candidate.candidateNumber}
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900">
                    {candidate.firstName} {candidate.lastName}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {candidate.voteCount.toLocaleString('fr-FR')} votes comptabilisés
                  </p>
                </div>
              </div>

              {/* Vote Quantity Package Selection */}
              <div className="space-y-2 text-left">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Nombre de votes souhaités :
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 5, 10, 50].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setVoteCount(count)}
                      className={`py-2.5 rounded-xl font-extrabold text-xs transition-all border ${
                        voteCount === count
                          ? 'gold-gradient-btn text-slate-950 border-amber-500 shadow-md scale-105'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
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

              {/* Payment Method Selector */}
              <div className="space-y-2 text-left">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Moyen de Débit (Mobile Money) :
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'orange', label: 'Orange Money' },
                    { id: 'mtn', label: 'MTN Mobile Money' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-3 rounded-xl font-extrabold text-xs flex items-center justify-between border transition-all ${
                        paymentMethod === method.id
                          ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm ring-2 ring-amber-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span>{method.label}</span>
                      <Smartphone className="w-4 h-4 text-amber-600" />
                    </button>
                  ))}
                </div>

                {/* Phone Number Input */}
                <div className="pt-1 space-y-1.5">
                  <input
                    type="tel"
                    placeholder="Numéro Mobile Money (ex: 699000000)"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  />
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200 font-medium">
                    <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>
                      {paymentMethod === 'orange'
                        ? 'Pour Orange Money : Composez #150*50# sur votre téléphone pour valider le débit.'
                        : 'Pour MTN : Validez la notification USSD ou composez *126#.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Summary */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Montant du Débit</p>
                  <p className="text-xs text-slate-600">{voteCount} vote{voteCount > 1 ? 's' : ''} × {unitVotePrice} FCFA</p>
                </div>
                <p className="text-2xl font-black text-amber-600 font-mono">
                  {totalPrice.toLocaleString('fr-FR')} FCFA
                </p>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Débit sécurisé Mobile Money</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleCloseAll}
                  disabled={isSubmitting}
                  className="py-3 px-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 font-bold text-xs transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleInitiatePayment}
                  disabled={isSubmitting}
                  className="gold-gradient-btn py-3 px-4 rounded-xl font-extrabold text-xs text-slate-950 shadow-md flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Payer {totalPrice} FCFA</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {step === 'WAITING_PAYMENT' && (
            /* Step 2: Redirecting & Polling State */
            <div className="space-y-6 text-center py-6">
              <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-500 mx-auto flex items-center justify-center text-amber-600 shadow-md">
                <Loader2 className="w-10 h-10 animate-spin" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-wide">
                  Redirection Vers le Portail de Paiement...
                </h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto">
                  Veuillez valider le débit de <strong className="text-amber-600">{totalPrice} FCFA</strong> sur la page de paiement pour comptabiliser votre vote.
                </p>
              </div>

              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-800 font-semibold flex items-center gap-2 text-left">
                <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <span>Le vote sera crédité à {candidate.firstName} dès confirmation stricte du débit par l&apos;opérateur.</span>
              </div>

              <button
                type="button"
                onClick={handleCloseAll}
                className="py-2.5 px-6 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-xs"
              >
                Annuler la transaction
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
              <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500 mx-auto flex items-center justify-center text-emerald-600 shadow-lg animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-wide">
                  🎉 Vote Comptabilisé !
                </h3>
                <p className="text-sm text-slate-600 mt-2 max-w-xs mx-auto">
                  Le débit de <strong className="text-amber-600">{totalPrice} FCFA</strong> a été confirmé. <strong className="text-blue-600">{voteCount} vote{voteCount > 1 ? 's' : ''}</strong> {voteCount > 1 ? 'ont été ajoutés' : 'a été ajouté'} à {candidate.firstName} {candidate.lastName}.
                </p>
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-700 font-bold flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Paiement débité & Score mis à jour en direct !</span>
              </div>

              <button
                type="button"
                onClick={handleCloseAll}
                className="w-full gold-gradient-btn py-3.5 rounded-xl font-extrabold text-sm text-slate-950 shadow-md"
              >
                Fermer
              </button>
            </motion.div>
          )}

          {step === 'FAILED' && (
            /* Step 4: Payment Failed / Cancelled */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 mx-auto flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900">
                  Paiement Non Confirmé
                </h3>
                <p className="text-xs text-slate-500 mt-2 max-w-xs mx-auto">
                  {errorMessage || 'Aucun débit n’a été effectué sur votre compte. Le vote n’a pas été comptabilisé.'}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseAll}
                  className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Fermer
                </button>
                <button
                  type="button"
                  onClick={() => setStep('FORM')}
                  className="flex-1 gold-gradient-btn py-3 rounded-xl text-slate-950 font-bold text-xs"
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
