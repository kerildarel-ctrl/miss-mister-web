'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownProps {
  targetDate: string;
  size?: 'sm' | 'md' | 'lg';
  compact?: boolean;
}

export const Countdown: React.FC<CountdownProps> = ({ targetDate, size = 'md', compact = false }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.isExpired) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 text-xs font-bold">
        <Clock className="w-3.5 h-3.5" />
        <span>COMPÉTITION TERMINÉE</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-blue-600 text-xs font-mono font-bold bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
        <Clock className="w-3.5 h-3.5 text-pink-600 animate-pulse" />
        <span>
          {String(timeLeft.days).padStart(2, '0')}j : {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
        </span>
      </div>
    );
  }

  const boxSizes = {
    sm: 'w-11 h-11 text-base',
    md: 'w-14 h-14 text-xl',
    lg: 'w-16 h-16 sm:w-20 sm:h-20 text-2xl sm:text-3xl'
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3 font-poppins">
      <div className="flex flex-col items-center">
        <div className={`${boxSizes[size]} bg-white rounded-xl flex items-center justify-center font-mono font-black text-blue-600 shadow-md border border-slate-200`}>
          {String(timeLeft.days).padStart(2, '0')}
        </div>
        <span className="text-[10px] uppercase font-bold text-slate-500 mt-1">Jours</span>
      </div>

      <span className="text-xl font-bold text-blue-600 mb-4">:</span>

      <div className="flex flex-col items-center">
        <div className={`${boxSizes[size]} bg-white rounded-xl flex items-center justify-center font-mono font-black text-blue-600 shadow-md border border-slate-200`}>
          {String(timeLeft.hours).padStart(2, '0')}
        </div>
        <span className="text-[10px] uppercase font-bold text-slate-500 mt-1">Heures</span>
      </div>

      <span className="text-xl font-bold text-blue-600 mb-4">:</span>

      <div className="flex flex-col items-center">
        <div className={`${boxSizes[size]} bg-white rounded-xl flex items-center justify-center font-mono font-black text-blue-600 shadow-md border border-slate-200`}>
          {String(timeLeft.minutes).padStart(2, '0')}
        </div>
        <span className="text-[10px] uppercase font-bold text-slate-500 mt-1">Minutes</span>
      </div>

      <span className="text-xl font-bold text-blue-600 mb-4">:</span>

      <div className="flex flex-col items-center">
        <div className={`${boxSizes[size]} bg-pink-600 rounded-xl flex items-center justify-center font-mono font-black text-white shadow-md`}>
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>
        <span className="text-[10px] uppercase font-bold text-pink-600 mt-1 animate-pulse">Secs</span>
      </div>
    </div>
  );
};
