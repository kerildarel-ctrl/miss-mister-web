'use client';

import React, { useState } from 'react';
import { X, Sparkles, Trophy, User, Phone, Mail, DollarSign, Users, Calendar, CheckCircle2, Send, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveEventRequest } from '@/services/dbService';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    eventName: '',
    organizerName: '',
    phone: '',
    email: '',
    votePrice: '',
    candidateEstimate: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Save locally & in Admin Espace /keril
    await saveEventRequest(formData);

    // 2. Build WhatsApp Message
    const waText = 
      `Bonjour Keril, nouvelle demande de création d'événement sur MISS MISTER :\n\n` +
      `🏆 Événement: ${formData.eventName}\n` +
      `👤 Responsable: ${formData.organizerName}\n` +
      `📞 WhatsApp: ${formData.phone}\n` +
      `✉️ Email: ${formData.email}\n` +
      `💵 Prix du vote: ${formData.votePrice || '100'} FCFA\n` +
      `👥 Candidats estimé: ${formData.candidateEstimate || 'Non spécifié'}\n` +
      `📅 Période: ${formData.startDate || 'Début à convenir'} au ${formData.endDate || 'Fin à convenir'}\n` +
      `📝 Précisions: ${formData.description || 'Aucune'}`;

    const waUrl = `https://wa.me/237692886326?text=${encodeURIComponent(waText)}`;

    // 3. Open WhatsApp in new window
    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank');
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      eventName: '',
      organizerName: '',
      phone: '',
      email: '',
      votePrice: '',
      candidateEstimate: '',
      startDate: '',
      endDate: '',
      description: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto font-poppins">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-8 shadow-2xl border border-amber-300 my-auto max-h-[92vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 sm:p-2.5 rounded-full bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-slate-950 transition-colors z-10"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          {!isSubmitted ? (
            <div className="space-y-5 sm:space-y-6 pt-2 sm:pt-0">
              
              {/* Header Title */}
              <div className="text-center space-y-2 pr-8 sm:pr-0">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-amber-50 border border-amber-200 text-[10px] sm:text-xs font-black text-amber-800 uppercase tracking-widest mx-auto">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Formulaire de Création d&apos;Événement</span>
                </div>

                <h3 className="text-xl sm:text-3xl font-black text-slate-950 tracking-tight">
                  CRÉER MON <span className="gradient-text-gold">ÉVÉNEMENT</span>
                </h3>

                <p className="text-xs sm:text-sm font-semibold text-slate-600">
                  Remplissez ce formulaire pour soumettre votre demande d&apos;élection en ligne.
                </p>
              </div>

              {/* Form Inputs */}
              <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                
                {/* Event Name */}
                <div className="space-y-1">
                  <label className="text-[11px] sm:text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" /> Nom de l&apos;événement / compétition *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Miss & Mister Excellence 2026"
                    value={formData.eventName}
                    onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                    className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-950 text-xs sm:text-sm font-bold focus:outline-none focus:border-amber-500 focus:bg-white transition-all placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>

                {/* Organizer Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] sm:text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-600" /> Nom du Responsable *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Keril Kousso"
                      value={formData.organizerName}
                      onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
                      className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-950 text-xs sm:text-sm font-bold focus:outline-none focus:border-amber-500 focus:bg-white transition-all placeholder:text-slate-400 placeholder:font-normal"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] sm:text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" /> Téléphone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: +237 692 88 63 26"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-950 text-xs sm:text-sm font-bold focus:outline-none focus:border-amber-500 focus:bg-white transition-all placeholder:text-slate-400 placeholder:font-normal"
                    />
                  </div>
                </div>

                {/* Email & Vote Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] sm:text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-purple-600" /> Adresse E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Ex: keril@mon-evenement.cm"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-950 text-xs sm:text-sm font-bold focus:outline-none focus:border-amber-500 focus:bg-white transition-all placeholder:text-slate-400 placeholder:font-normal"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] sm:text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-amber-600" /> Prix du vote estimé (FCFA) *
                    </label>
                    <input
                      type="number"
                      required
                      min="50"
                      step="50"
                      placeholder="Ex: 100"
                      value={formData.votePrice}
                      onChange={(e) => setFormData({ ...formData, votePrice: e.target.value })}
                      className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-950 text-xs sm:text-sm font-bold focus:outline-none focus:border-amber-500 focus:bg-white transition-all placeholder:text-slate-400 placeholder:font-normal"
                    />
                  </div>
                </div>

                {/* Estimate Candidates & Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] sm:text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-pink-600" /> Estim. Candidats *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="Ex: 15"
                      value={formData.candidateEstimate}
                      onChange={(e) => setFormData({ ...formData, candidateEstimate: e.target.value })}
                      className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-950 text-xs sm:text-sm font-bold focus:outline-none focus:border-amber-500 focus:bg-white transition-all placeholder:text-slate-400 placeholder:font-normal"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] sm:text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" /> Début prévu
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-950 text-xs sm:text-sm font-bold focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] sm:text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-rose-600" /> Fin prévue
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-950 text-xs sm:text-sm font-bold focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Additional Description */}
                <div className="space-y-1">
                  <label className="text-[11px] sm:text-xs font-black uppercase text-slate-800 tracking-wider">
                    Détails ou précisions complémentaires
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Décrivez brièvement votre événement..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-950 text-xs sm:text-sm font-bold focus:outline-none focus:border-amber-500 focus:bg-white transition-all placeholder:text-slate-400 placeholder:font-normal"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full gold-gradient-btn py-3.5 sm:py-4 px-6 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider text-slate-950 shadow-xl flex items-center justify-center gap-2 active:scale-98 transition-transform"
                  >
                    {isSubmitting ? (
                      <span>TRANSMISSION EN COURS...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
                        <span>SOUMETTRE MA DEMANDE DE CRÉATION</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>
          ) : (
            /* Success Popup Content */
            <div className="text-center py-6 sm:py-8 space-y-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 border-2 border-emerald-400 text-emerald-600 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-3xl font-black text-slate-950">
                  DEMANDE TRANSMISE AVEC SUCCÈS !
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-700 max-w-md mx-auto leading-relaxed">
                  Merci <span className="font-extrabold text-amber-600">{formData.organizerName}</span> ! Votre demande pour <span className="font-extrabold text-slate-950">&quot;{formData.eventName}&quot;</span> a bien été enregistrée.
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mx-auto">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Notre équipe étudie vos critères et vous recontactera très vite.</span>
                </div>
              </div>

              <div>
                <button
                  onClick={handleReset}
                  className="gold-gradient-btn py-3 sm:py-3.5 px-8 rounded-2xl font-black text-xs uppercase tracking-wider text-slate-950 shadow-md"
                >
                  FERMER
                </button>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
