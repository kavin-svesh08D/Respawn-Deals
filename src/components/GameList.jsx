import GameCard, { GameCardSkeleton } from './GameCard';

function GameList({
  games,
  loading,
  onSelectGame,
  selectedGameID,
  favorites,
  onToggleFavorite,
  lowestPriceMap = {},
  onQuickView,
}) {
  if (loading) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 page-enter"
        aria-label="Loading game results"
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <GameCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!games || games.length === 0) {
    return null;
  }

  return (
    <section aria-label="Search results" className="page-enter">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-slate-300 text-sm font-medium">
          <span className="text-purple-400 font-bold text-lg font-display">{games.length}</span>{' '}
          <span className="text-slate-400">{games.length === 1 ? 'game' : 'games'} found</span>
        </h2>
        <p className="text-slate-500 text-xs flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          Click a game to compare prices
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {games.map((game, index) => (
          <GameCard
            key={game.gameID}
            game={game}
            index={index}
            onSelect={onSelectGame}
            isSelected={selectedGameID === game.gameID}
            isFavorite={favorites.some((f) => f.gameID === game.gameID)}
            onToggleFavorite={onToggleFavorite}
            isLowestEver={lowestPriceMap[game.gameID] === true}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </section>
  );
}

export default GameList;
