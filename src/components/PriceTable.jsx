import { useState } from 'react';
import DealRow, { DealRowSkeleton } from './DealRow';
import ErrorMessage from './ErrorMessage';
import { sortDeals } from '../utils/sortDeals';
import { USD_TO_INR } from '../utils/calculateDiscount';

const SORT_OPTIONS = [
  { value: 'price', label: 'Lowest Price' },
  { value: 'discount', label: 'Best Discount' },
  { value: 'store', label: 'Store Name' },
];

function PriceTable({ gameInfo, deals, storeMap, loading, error, onRetry }) {
  const [sortBy, setSortBy] = useState('price');

  const enrichedAndSorted = sortDeals(
    (deals || []).map((deal) => ({
      ...deal,
      storeName: storeMap[deal.storeID]?.name || 'Unknown Store',
      storeLogo: storeMap[deal.storeID]?.logo || null,
    })),
    sortBy
  );

  if (loading) {
    return (
      <div
        id="price-comparison"
        className="glass-panel rounded-2xl overflow-hidden animate-fade-in-up border border-slate-700/40"
      >
        <div className="p-6 border-b border-slate-800/60">
          <div className="skeleton h-6 rounded w-48 mb-2" aria-hidden="true" />
          <div className="skeleton h-4 rounded w-32" aria-hidden="true" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => <DealRowSkeleton key={i} />)}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="price-comparison" className="glass-panel rounded-2xl border border-slate-700/40 animate-fade-in-up">
        <ErrorMessage message={error} onRetry={onRetry} />
      </div>
    );
  }

  if (!deals || deals.length === 0) {
    return (
      <div id="price-comparison" className="glass-panel rounded-2xl p-10 text-center border border-slate-700/40 animate-fade-in-up">
        <p className="text-slate-400">No deals found for this game right now.</p>
      </div>
    );
  }

  return (
    <section id="price-comparison" className="glass-panel rounded-2xl overflow-hidden animate-fade-in-up border border-slate-700/40 shadow-card">

      <div className="p-5 sm:p-6 border-b border-slate-800/60 bg-gradient-to-r from-green-500/5 to-transparent">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">

          <div className="flex items-center gap-4 flex-1 min-w-0">
            {gameInfo?.thumb && (
              <div className="relative flex-shrink-0">
                <img
                  src={gameInfo.thumb}
                  alt={gameInfo.title}
                  className="w-20 h-11 object-cover rounded-xl border border-slate-700/50 shadow-card"
                />
                <div className="absolute -inset-1 rounded-xl bg-green-500/10 blur-sm -z-10" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-green-400/70 text-xs font-semibold uppercase tracking-[0.15em] mb-1">
                Price Comparison
              </p>
              <h2 className="text-white font-bold text-xl leading-tight truncate font-display">
                {gameInfo?.title || 'Game Deals'}
              </h2>
              <p className="text-slate-500 text-xs mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                {enrichedAndSorted.length} {enrichedAndSorted.length === 1 ? 'store' : 'stores'} available
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-slate-500 text-xs">Sort by:</span>
            <div className="flex glass-panel rounded-xl p-1 gap-1 border border-slate-700/40">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  className={`
                    px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-300
                    ${sortBy === option.value
                      ? 'sort-pill-active text-slate-950'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }
                  `}
                  aria-pressed={sortBy === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" aria-label={`Price comparison for ${gameInfo?.title}`}>
          <thead>
            <tr className="border-b border-slate-800/60 bg-slate-900/40">
              <th className="py-3 px-4 text-left text-xs text-slate-500 font-semibold uppercase tracking-wider w-10">#</th>
              <th className="py-3 px-4 text-left text-xs text-slate-500 font-semibold uppercase tracking-wider">Store</th>
              <th className="py-3 px-4 text-right text-xs text-slate-500 font-semibold uppercase tracking-wider hidden sm:table-cell">Regular</th>
              <th className="py-3 px-4 text-right text-xs text-slate-500 font-semibold uppercase tracking-wider">Sale Price</th>
              <th className="py-3 px-4 text-center text-xs text-slate-500 font-semibold uppercase tracking-wider hidden md:table-cell">Savings</th>
              <th className="py-3 px-4 text-right text-xs text-slate-500 font-semibold uppercase tracking-wider">Buy</th>
            </tr>
          </thead>
          <tbody>
            {enrichedAndSorted.map((deal, index) => (
              <DealRow
                key={deal.dealID}
                deal={deal}
                storeName={deal.storeName}
                storeLogo={deal.storeLogo}
                rank={index + 1}
                index={index}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3.5 border-t border-slate-800/60 bg-slate-950/40">
        <p className="text-slate-600 text-xs text-center">
          Prices from{' '}
          <a
            href="https://www.cheapshark.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500/70 hover:text-green-400 transition-colors"
          >
            CheapShark
          </a>
          {' '}· Converted to ₹ INR at ~₹{USD_TO_INR} per $1 USD · Rates may vary
        </p>
      </div>

    </section>
  );
}

export default PriceTable;
