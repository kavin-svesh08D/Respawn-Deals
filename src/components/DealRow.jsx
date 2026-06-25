import { formatPrice, calculateDiscount, isDiscounted } from '../utils/calculateDiscount';

function getDisplayPrice(deal) {
  const sale = parseFloat(deal.salePrice);
  const normal = parseFloat(deal.normalPrice);

  if ((isNaN(sale) || sale === 0) && normal > 0) return deal.normalPrice;
  if (isNaN(sale) || sale === 0) return '0.00';
  return deal.salePrice;
}

const STAGGER = ['stagger-1', 'stagger-2', 'stagger-3', 'stagger-4', 'stagger-5', 'stagger-6', 'stagger-7', 'stagger-8'];

function DealRow({ deal, storeName, storeLogo, rank, index = 0 }) {
  const displayPrice = getDisplayPrice(deal);
  const discount = calculateDiscount(deal.normalPrice, deal.salePrice);
  const discounted = isDiscounted(deal.normalPrice, deal.salePrice);
  const buyUrl = `https://www.cheapshark.com/redirect?dealID=${deal.dealID}`;
  const staggerClass = STAGGER[Math.min(index, STAGGER.length - 1)];

  return (
    <tr className={`deal-row border-b border-slate-800/60 last:border-0 animate-fade-in-up ${staggerClass} ${rank === 1 ? 'deal-row-best' : ''}`}>

      <td className="py-4 px-4 text-center w-10">
        {rank === 1 ? (
          <span title="Cheapest deal!">
            <svg className="w-5 h-5 text-yellow-400 mx-auto animate-crown-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3a1 1 0 01-1 1H6a1 1 0 010-2h12a1 1 0 011 1z" />
            </svg>
          </span>
        ) : (
          <span className="text-slate-600 text-xs font-medium font-display">#{rank}</span>
        )}
      </td>

      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          {storeLogo ? (
            <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center p-1 border border-slate-700/50">
              <img
                src={storeLogo}
                alt={`${storeName} logo`}
                className="w-full h-full object-contain"
                loading="lazy"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          ) : (
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700/50">
              <span className="text-green-400 text-xs font-bold font-display">
                {storeName?.charAt(0) || '?'}
              </span>
            </div>
          )}
          <span className="text-slate-200 text-sm font-medium">{storeName || `Store ${deal.storeID}`}</span>
        </div>
      </td>

      <td className="py-4 px-4 text-right hidden sm:table-cell">
        {discounted ? (
          <span className="text-slate-500 text-sm line-through">
            {formatPrice(deal.normalPrice)}
          </span>
        ) : parseFloat(deal.normalPrice) > 0 ? (
          <span className="text-slate-400 text-sm">{formatPrice(deal.normalPrice)}</span>
        ) : (
          <span className="text-slate-600 text-sm">—</span>
        )}
      </td>

      <td className="py-4 px-4 text-right">
        <span className={`text-sm font-bold font-display ${discounted ? 'text-green-400' : 'text-white'}`}>
          {formatPrice(displayPrice)}
        </span>
      </td>

      <td className="py-4 px-4 text-center hidden md:table-cell">
        {discounted && discount > 0 ? (
          <span className="inline-block bg-green-500/15 text-green-400 text-xs font-bold px-2.5 py-1 rounded-full border border-green-500/30 shadow-glow animate-scale-in">
            -{discount}%
          </span>
        ) : (
          <span className="text-slate-600 text-xs">Full price</span>
        )}
      </td>

      <td className="py-4 px-4 text-right">
        <a
          href={buyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-slate-950 text-xs font-bold rounded-xl whitespace-nowrap"
        >
          Buy Now
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </td>

    </tr>
  );
}

export function DealRowSkeleton() {
  return (
    <tr className="border-b border-slate-800/60" aria-hidden="true">
      <td className="py-4 px-4"><div className="skeleton h-4 w-4 rounded mx-auto" /></td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="skeleton w-8 h-8 rounded-lg flex-shrink-0" />
          <div className="skeleton h-4 rounded w-24" />
        </div>
      </td>
      <td className="py-4 px-4 hidden sm:table-cell"><div className="skeleton h-4 rounded w-16 ml-auto" /></td>
      <td className="py-4 px-4"><div className="skeleton h-4 rounded w-16 ml-auto" /></td>
      <td className="py-4 px-4 hidden md:table-cell"><div className="skeleton h-5 rounded-full w-12 mx-auto" /></td>
      <td className="py-4 px-4"><div className="skeleton h-8 rounded-xl w-24 ml-auto" /></td>
    </tr>
  );
}

export default DealRow;
