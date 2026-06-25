import { formatPrice } from '../utils/calculateDiscount';

const STAGGER = ['stagger-1', 'stagger-2', 'stagger-3', 'stagger-4', 'stagger-5', 'stagger-6', 'stagger-7', 'stagger-8'];

function GameCard({
  game,
  onSelect,
  isFavorite,
  onToggleFavorite,
  isSelected,
  isLowestEver = false,
  onQuickView,
  index = 0,
}) {
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(game);
  };

  const handleQuickViewClick = (e) => {
    e.stopPropagation();
    onQuickView?.(game);
  };

  const staggerClass = STAGGER[Math.min(index, STAGGER.length - 1)];

  return (
    <div
      onClick={() => onSelect(game)}
      className={`
        game-card group relative glass-panel rounded-2xl overflow-hidden cursor-pointer animate-fade-in-up ${staggerClass}
        ${isSelected
          ? 'border-purple-500/60 ring-1 ring-purple-500/40 glow-purple'
          : 'border-slate-700/40 hover:border-purple-500/30'
        }
      `}
      aria-pressed={isSelected}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(game); }}
    >
      <div className="relative aspect-video bg-slate-800 overflow-hidden">
        {game.thumb ? (
          <>
            <img
              src={game.thumb}
              alt={`${game.external} thumbnail`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.target.src = 'https://placehold.co/460x215/1e293b/475569?text=No+Image';
              }}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {isLowestEver && (
          <span className="absolute top-3 left-3 badge-lowest-ever animate-badge-pulse z-10">
            Lowest Price Ever
          </span>
        )}

        <button
          onClick={handleQuickViewClick}
          className="absolute top-3 right-3 p-2 rounded-xl glass-panel border border-slate-700/50 text-slate-400 hover:text-purple-300 hover:border-purple-500/40 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
          aria-label={`Quick view ${game.external}`}
          title="Quick View"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>

        {isSelected && (
          <div className="absolute inset-0 bg-purple-500/15 flex items-center justify-center backdrop-blur-[2px] animate-scale-in">
            <span className="bg-gradient-to-r from-purple-400 to-violet-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-full shadow-glow-purple-sm">
              ✓ Selected
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-white text-sm font-semibold leading-snug line-clamp-2 flex-1 group-hover:text-purple-300 transition-colors duration-300">
            {game.external}
          </h3>

          <button
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? `Remove ${game.external} from favorites` : `Add ${game.external} to favorites`}
            className="flex-shrink-0 p-1 rounded-lg transition-all duration-300 hover:scale-125 hover:bg-yellow-400/10"
          >
            <svg
              className={`w-4 h-4 transition-all duration-300 ${isFavorite ? 'text-yellow-400 fill-current drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]' : 'text-slate-500 hover:text-yellow-400'}`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill={isFavorite ? 'currentColor' : 'none'}
              strokeWidth={isFavorite ? 0 : 1.5}
            >
              <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="price-pill text-green-400 font-bold text-sm px-2.5 py-0.5 rounded-lg">
            {formatPrice(game.cheapest)}
          </span>
          <span className="text-slate-500 text-xs uppercase tracking-wide">cheapest</span>
        </div>
      </div>
    </div>
  );
}

export function GameCardSkeleton() {
  return (
    <div className="glass-panel border border-slate-800/50 rounded-2xl overflow-hidden" aria-hidden="true">
      <div className="skeleton aspect-video skeleton-pulse" />
      <div className="p-4 space-y-2">
        <div className="skeleton skeleton-pulse h-4 rounded w-3/4" />
        <div className="skeleton skeleton-pulse h-3 rounded w-1/2" />
        <div className="skeleton skeleton-pulse h-6 rounded-lg w-1/3 mt-2" />
      </div>
    </div>
  );
}

export default GameCard;
