import { useEffect, useState } from 'react';
import { fetchGameDeals } from '../services/cheapSharkApi';
import { formatPrice, calculateDiscount } from '../utils/calculateDiscount';

function getSteamScreenshots(steamAppID) {
  if (!steamAppID || steamAppID === '0') return [];
  const id = steamAppID;
  return [
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${id}/header.jpg`,
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${id}/capsule_616x353.jpg`,
    `https://cdn.cloudflare.steamstatic.com/steam/apps/${id}/library_600x900.jpg`,
  ];
}

function QuickViewModal({ game, storeMap, onClose, onSelectGame }) {
  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState([]);
  const [gameInfo, setGameInfo] = useState(null);
  const [cheapestEver, setCheapestEver] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!game) return;

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [game, onClose]);

  useEffect(() => {
    if (!game?.gameID) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchGameDeals(game.gameID);
        if (cancelled) return;
        setGameInfo(data.info);
        setDeals(data.deals || []);
        setCheapestEver(data.cheapestPriceEver || null);
      } catch {
        if (!cancelled) setError('Could not load deal details.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [game?.gameID]);

  if (!game) return null;

  const title = gameInfo?.title || game.external;
  const thumb = gameInfo?.thumb || game.thumb;
  const steamAppID = game.steamAppID || gameInfo?.steamAppID;
  const screenshots = getSteamScreenshots(steamAppID);
  const displayScreenshots = screenshots.length > 0 ? screenshots : (thumb ? [thumb] : []);

  const stores = [...new Set(
    deals.map((d) => storeMap[d.storeID]?.name || `Store ${d.storeID}`)
  )];

  const isLowestEver = cheapestEver && game.cheapest &&
    parseFloat(game.cheapest) <= parseFloat(cheapestEver.price);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${title}`}
    >
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="modal-panel relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel-strong rounded-3xl border border-purple-500/20 shadow-glow-purple animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl glass-panel border border-slate-700/50 text-slate-400 hover:text-white hover:border-purple-500/40 transition-all duration-200 hover:rotate-90"
          aria-label="Close quick view"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {loading ? (
          <div className="p-8 space-y-4">
            <div className="skeleton h-48 rounded-2xl" />
            <div className="skeleton h-6 rounded w-2/3" />
            <div className="skeleton h-4 rounded w-1/2" />
            <div className="flex gap-2">
              <div className="skeleton h-8 rounded-full w-20" />
              <div className="skeleton h-8 rounded-full w-20" />
            </div>
          </div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={onClose} className="btn-primary px-6 py-2 rounded-xl text-slate-950 font-bold">
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="relative">
              {displayScreenshots.length > 0 ? (
                <div className="flex gap-2 p-4 pb-0 overflow-x-auto scrollbar-thin">
                  {displayScreenshots.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`${title} screenshot ${i + 1}`}
                      className="h-36 rounded-xl object-cover flex-shrink-0 border border-slate-700/50 hover:border-purple-500/40 transition-colors"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ))}
                </div>
              ) : (
                <div className="h-36 m-4 rounded-2xl bg-slate-800 flex items-center justify-center">
                  <span className="text-slate-500 text-sm">No screenshots available</span>
                </div>
              )}

              {isLowestEver && (
                <span className="absolute top-6 left-6 badge-lowest-ever animate-badge-pulse">
                  Lowest Price Ever
                </span>
              )}
            </div>

            <div className="p-6 pt-4">
              <h2 className="font-display text-2xl font-bold text-white mb-2 pr-10">{title}</h2>

              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="text-2xl font-black font-orbitron text-green-400">
                  {formatPrice(game.cheapest)}
                </span>
                {cheapestEver && (
                  <span className="text-slate-500 text-sm">
                    All-time low: {formatPrice(cheapestEver.price)}
                  </span>
                )}
              </div>

              {stores.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
                    Available on
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {stores.map((name) => (
                      <span
                        key={name}
                        className="platform-pill text-xs px-3 py-1.5 rounded-lg font-medium"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {deals.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
                    Store Prices
                  </p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {deals.slice(0, 6).map((deal) => {
                      const storeName = storeMap[deal.storeID]?.name || 'Unknown';
                      const discount = calculateDiscount(deal.normalPrice, deal.salePrice);
                      return (
                        <div
                          key={deal.dealID}
                          className="flex items-center justify-between glass-panel px-3 py-2 rounded-xl border border-slate-700/40"
                        >
                          <span className="text-slate-300 text-sm">{storeName}</span>
                          <div className="flex items-center gap-2">
                            {discount > 0 && (
                              <span className="text-orange-400 text-xs font-bold">-{discount}%</span>
                            )}
                            <span className="text-green-400 font-bold text-sm">
                              {formatPrice(deal.salePrice ?? deal.price)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    onSelectGame(game);
                    onClose();
                  }}
                  className="btn-primary flex-1 min-w-[140px] px-6 py-3 rounded-xl text-slate-950 font-bold text-sm"
                >
                  Compare All Prices
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600 transition-colors text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default QuickViewModal;
