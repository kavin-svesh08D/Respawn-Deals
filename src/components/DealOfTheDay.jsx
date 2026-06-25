import { useState, useEffect } from 'react';
import { formatPrice, calculateDiscount } from '../utils/calculateDiscount';

function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight - now;
}

function formatCountdown(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
}

function DealOfTheDay({ deal, storeName, loading, onViewDeal }) {
  const [countdown, setCountdown] = useState(() => formatCountdown(getTimeUntilMidnight()));

  useEffect(() => {
    const tick = () => setCountdown(formatCountdown(getTimeUntilMidnight()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (loading) {
    return (
      <div className="deal-hero glass-panel rounded-3xl overflow-hidden border border-purple-500/20 animate-fade-in-up mb-2">
        <div className="flex flex-col md:flex-row">
          <div className="skeleton md:w-72 lg:w-80 aspect-video md:aspect-auto md:min-h-[200px]" />
          <div className="flex-1 p-6 md:p-8 space-y-4">
            <div className="skeleton h-4 rounded w-32" />
            <div className="skeleton h-8 rounded w-3/4" />
            <div className="skeleton h-6 rounded w-1/2" />
            <div className="flex gap-3">
              <div className="skeleton h-12 rounded-xl w-24" />
              <div className="skeleton h-12 rounded-xl w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!deal) return null;

  const discount = calculateDiscount(deal.normalPrice, deal.salePrice);
  const buyUrl = `https://www.cheapshark.com/redirect?dealID=${encodeURIComponent(deal.dealID)}`;

  return (
    <section
      className="deal-hero glass-panel rounded-3xl overflow-hidden border border-purple-500/25 shadow-glow-purple animate-fade-in-up mb-2 relative group"
      aria-label="Deal of the Day"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-orange-500/10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-pulse-glow pointer-events-none" />

      <div className="relative flex flex-col md:flex-row">
        <div className="relative md:w-72 lg:w-80 flex-shrink-0 overflow-hidden">
          {deal.thumb ? (
            <img
              src={deal.thumb}
              alt={deal.title}
              className="w-full h-full object-cover aspect-video md:aspect-auto md:min-h-[200px] transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="aspect-video md:min-h-[200px] bg-slate-800 flex items-center justify-center">
              <svg className="w-16 h-16 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-950/60 hidden md:block" />
          {discount > 0 && (
            <span className="absolute top-4 left-4 badge-hot-deal animate-badge-pulse">
              -{discount}% OFF
            </span>
          )}
        </div>

        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold uppercase tracking-widest">
              <svg className="w-3.5 h-3.5 animate-bounce-soft" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Deal of the Day
            </span>
            {storeName && (
              <span className="text-slate-500 text-xs">via {storeName}</span>
            )}
          </div>

          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-3 leading-tight group-hover:text-purple-200 transition-colors">
            {deal.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 mb-5">
            <span className="text-3xl font-black font-orbitron gradient-text-fire">
              {formatPrice(deal.salePrice)}
            </span>
            {parseFloat(deal.normalPrice) > parseFloat(deal.salePrice) && (
              <span className="text-slate-500 line-through text-lg">
                {formatPrice(deal.normalPrice)}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 glass-panel px-4 py-2 rounded-xl border border-slate-700/50">
              <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-slate-400 text-xs">Refreshes in</span>
              <span className="font-mono text-sm font-bold text-orange-300 tabular-nums">
                {countdown.hours}:{countdown.minutes}:{countdown.seconds}
              </span>
            </div>

            <button
              onClick={() => onViewDeal?.(deal)}
              className="px-5 py-2.5 rounded-xl border border-purple-500/40 text-purple-300 hover:bg-purple-500/15 hover:border-purple-400/60 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
            >
              Quick View
            </button>

            <a
              href={buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-fire px-6 py-2.5 rounded-xl text-slate-950 text-sm font-bold inline-flex items-center gap-2"
            >
              Grab Deal
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DealOfTheDay;
