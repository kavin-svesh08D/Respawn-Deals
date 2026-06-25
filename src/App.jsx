import { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import Background from './components/Background';
import SearchBar from './components/SearchBar';
import GameList from './components/GameList';
import PriceTable from './components/PriceTable';
import ErrorMessage from './components/ErrorMessage';
import DealOfTheDay from './components/DealOfTheDay';
import QuickViewModal from './components/QuickViewModal';
import {
  fetchStores,
  buildStoreMap,
  searchGames,
  fetchGameDeals,
  fetchTopDeals,
  fetchCheapestPriceEver,
} from './services/cheapSharkApi';

const STORAGE_KEYS = {
  recentSearches: 'pcgpc_recent_searches',
  favorites: 'pcgpc_favorites',
};

const SUGGESTIONS = ['Cyberpunk 2077', 'Elden Ring', 'Red Dead Redemption', 'Hades', 'Stardew Valley'];
const STAGGER = ['stagger-1', 'stagger-2', 'stagger-3', 'stagger-4', 'stagger-5'];

function readFromStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [storeMap, setStoreMap] = useState({});
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [deals, setDeals] = useState([]);
  const [gameInfo, setGameInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState(
    () => readFromStorage(STORAGE_KEYS.recentSearches, [])
  );
  const [favorites, setFavorites] = useState(
    () => readFromStorage(STORAGE_KEYS.favorites, [])
  );
  const [lowestPriceMap, setLowestPriceMap] = useState({});

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingDeals, setLoadingDeals] = useState(false);
  const [loadingStores, setLoadingStores] = useState(true);
  const [loadingDealOfDay, setLoadingDealOfDay] = useState(true);
  const [searchError, setSearchError] = useState(null);
  const [dealsError, setDealsError] = useState(null);
  const [storesError, setStoresError] = useState(null);

  const [dealOfTheDay, setDealOfTheDay] = useState(null);
  const [quickViewGame, setQuickViewGame] = useState(null);
  const [searchBarKey, setSearchBarKey] = useState(0);

  const priceTableRef = useRef(null);
  const searchInputRef = useRef(null);

  const isHomeView = !searchTerm && games.length === 0 && !selectedGame && !loadingSearch;

  // ── FETCH STORES ON MOUNT ──
  useEffect(() => {
    async function loadStores() {
      try {
        setLoadingStores(true);
        const storesArray = await fetchStores();
        setStoreMap(buildStoreMap(storesArray));
      } catch (err) {
        setStoresError('Failed to load store data. Some features may be limited.');
        console.error('Store fetch error:', err);
      } finally {
        setLoadingStores(false);
      }
    }
    loadStores();
  }, []);

  // ── FETCH DEAL OF THE DAY ──
  useEffect(() => {
    async function loadDealOfDay() {
      try {
        setLoadingDealOfDay(true);
        const topDeals = await fetchTopDeals(1);
        if (topDeals?.length > 0) {
          setDealOfTheDay(topDeals[0]);
        }
      } catch (err) {
        console.error('Deal of the day fetch error:', err);
      } finally {
        setLoadingDealOfDay(false);
      }
    }
    loadDealOfDay();
  }, []);

  // ── PERSIST TO LOCALSTORAGE ──
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.recentSearches, JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
  }, [favorites]);

  // ── ENRICH SEARCH RESULTS WITH LOWEST-PRICE-EVER BADGES ──
  const enrichLowestPrices = useCallback(async (gameList) => {
    const toCheck = gameList.slice(0, 12);
    const results = await Promise.allSettled(
      toCheck.map(async (game) => {
        const ever = await fetchCheapestPriceEver(game.gameID);
        if (!ever) return { gameID: game.gameID, isLowest: false };
        const current = parseFloat(game.cheapest);
        const historical = parseFloat(ever.price);
        return {
          gameID: game.gameID,
          isLowest: !isNaN(current) && !isNaN(historical) && current <= historical,
        };
      })
    );

    const map = {};
    results.forEach((r) => {
      if (r.status === 'fulfilled') {
        map[r.value.gameID] = r.value.isLowest;
      }
    });
    setLowestPriceMap((prev) => ({ ...prev, ...map }));
  }, []);

  // ── HOME RESET ──
  const handleHome = useCallback(() => {
    setGames([]);
    setSelectedGame(null);
    setDeals([]);
    setGameInfo(null);
    setSearchTerm('');
    setSearchError(null);
    setDealsError(null);
    setQuickViewGame(null);
    setLowestPriceMap({});
    setSearchBarKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ── SEARCH ──
  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) return;

    setSearchError(null);
    setLoadingSearch(true);
    setSelectedGame(null);
    setDeals([]);
    setGameInfo(null);
    setSearchTerm(query);
    setLowestPriceMap({});

    setRecentSearches((prev) =>
      Array.from(new Set([query, ...prev])).slice(0, 10)
    );

    try {
      const results = await searchGames(query);
      setGames(results || []);
      if (!results || results.length === 0) {
        setSearchError(`No games found for "${query}". Try a different search term.`);
      } else {
        enrichLowestPrices(results);
      }
    } catch (err) {
      setSearchError('Failed to fetch games. Please check your connection and try again.');
      console.error('Search error:', err);
      setGames([]);
    } finally {
      setLoadingSearch(false);
    }
  }, [enrichLowestPrices]);

  // ── SELECT GAME ──
  const handleSelectGame = useCallback(async (game) => {
    setSelectedGame(game);
    setDealsError(null);
    setLoadingDeals(true);
    setDeals([]);
    setGameInfo(null);

    setTimeout(() => {
      priceTableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    try {
      const response = await fetchGameDeals(game.gameID);
      setGameInfo(response.info);
      setDeals(response.deals || []);

      if (response.cheapestPriceEver) {
        const current = parseFloat(game.cheapest);
        const historical = parseFloat(response.cheapestPriceEver.price);
        if (!isNaN(current) && !isNaN(historical) && current <= historical) {
          setLowestPriceMap((prev) => ({ ...prev, [game.gameID]: true }));
        }
      }
    } catch (err) {
      setDealsError('Failed to load deals for this game. Please try again.');
      console.error('Deals fetch error:', err);
    } finally {
      setLoadingDeals(false);
    }
  }, []);

  const handleToggleFavorite = useCallback((game) => {
    setFavorites((prev) => {
      const alreadyFavorited = prev.some((f) => f.gameID === game.gameID);
      if (alreadyFavorited) {
        return prev.filter((f) => f.gameID !== game.gameID);
      }
      return [game, ...prev];
    });
  }, []);

  const handleSelectFavorite = useCallback((game) => {
    handleSelectGame(game);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }, [handleSelectGame]);

  const handleClearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  const handleRemoveRecentSearch = useCallback((term) => {
    setRecentSearches((prev) => prev.filter((t) => t !== term));
  }, []);

  const handleDealOfDayQuickView = useCallback((deal) => {
    setQuickViewGame({
      gameID: deal.gameID,
      external: deal.title,
      cheapest: deal.salePrice,
      thumb: deal.thumb,
      steamAppID: deal.steamAppID,
    });
  }, []);

  const dealOfDayStoreName = dealOfTheDay
    ? storeMap[dealOfTheDay.storeID]?.name
    : null;

  return (
    <div className="min-h-screen text-white relative">

      <Background />
      <Navbar onHome={handleHome} isHomeActive={isHomeView} />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* ── DEAL OF THE DAY (homepage only) ── */}
        {isHomeView && (
          <DealOfTheDay
            deal={dealOfTheDay}
            storeName={dealOfDayStoreName}
            loading={loadingDealOfDay}
            onViewDeal={handleDealOfDayQuickView}
          />
        )}

        {/* ── HERO SEARCH SECTION ── */}
        <section className="text-center pt-4 pb-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-purple-500/20 text-purple-300/80 text-xs font-medium uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            Live prices in INR
          </div>

          <h1 className="font-orbitron text-3xl sm:text-4xl lg:text-6xl font-black text-white mb-4 leading-tight">
            Find the{' '}
            <span className="gradient-text-shimmer">
              Cheapest Price
            </span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Search any PC game and compare prices across Steam, GOG, Epic, and more — instantly on{' '}
            <span className="text-purple-400/80 font-medium">Respawn Deals</span>.
          </p>

          {loadingStores && (
            <p className="text-slate-500 text-xs mb-4 flex items-center justify-center gap-2">
              <span className="w-3 h-3 skeleton-inline rounded-full" />
              Loading store data...
            </p>
          )}
          {storesError && (
            <p className="text-yellow-400/70 text-xs mb-4">{storesError}</p>
          )}

          <div className="relative">
            <SearchBar
              key={searchBarKey}
              onSearch={handleSearch}
              loading={loadingSearch}
              recentSearches={recentSearches}
              onClearRecentSearches={handleClearRecentSearches}
              onRemoveRecentSearch={handleRemoveRecentSearch}
              favorites={favorites}
              onSelectFavorite={handleSelectFavorite}
              searchInputRef={searchInputRef}
            />
          </div>
        </section>

        {searchError && !loadingSearch && (
          <ErrorMessage
            message={searchError}
            onRetry={searchTerm ? () => handleSearch(searchTerm) : undefined}
          />
        )}

        {(games.length > 0 || loadingSearch) && (
          <div className="page-enter">
            {!loadingSearch && searchTerm && (
              <p className="text-slate-500 text-sm mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Results for{' '}
                <span className="text-purple-400 font-medium">"{searchTerm}"</span>
              </p>
            )}
            <GameList
              games={games}
              loading={loadingSearch}
              onSelectGame={handleSelectGame}
              selectedGameID={selectedGame?.gameID}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              lowestPriceMap={lowestPriceMap}
              onQuickView={setQuickViewGame}
            />
          </div>
        )}

        {selectedGame && (
          <div ref={priceTableRef} className="page-enter">
            <PriceTable
              gameInfo={gameInfo}
              deals={deals}
              storeMap={storeMap}
              loading={loadingDeals}
              error={dealsError}
              onRetry={() => handleSelectGame(selectedGame)}
            />
          </div>
        )}

        {isHomeView && !searchError && (
          <div className="text-center py-20 page-enter">
            <div className="w-24 h-24 glass-panel rounded-3xl flex items-center justify-center mx-auto mb-8 border border-purple-500/20 shadow-glow-purple animate-float">
              <svg className="w-12 h-12 text-purple-400/60" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 6H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1zm-10 7H9v2H7v-2H5v-2h2V9h2v2h2v2zm4.5 1a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3-3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
              </svg>
            </div>
            <h2 className="text-slate-300 text-xl font-semibold mb-2 font-display">Search for a game to get started</h2>
            <p className="text-slate-500 text-sm mb-8">
              Try searching for "Cyberpunk", "Witcher", or "Elden Ring"
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {SUGGESTIONS.map((suggestion, i) => (
                <button
                  key={suggestion}
                  onClick={() => handleSearch(suggestion)}
                  className={`text-sm text-slate-400 hover:text-purple-300 glass-panel hover:bg-purple-500/10 border border-slate-700/50 hover:border-purple-500/40 px-4 py-2 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-purple-sm animate-fade-in-up ${STAGGER[i] || 'stagger-5'}`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

      </main>

      <footer className="relative border-t border-slate-800/60 mt-16 py-8 text-center">
        <p className="text-slate-600 text-xs">
          <span className="gradient-text font-semibold font-orbitron">Respawn Deals</span>
          {' '}· Data provided by{' '}
          <a href="https://www.cheapshark.com" target="_blank" rel="noopener noreferrer" className="text-purple-500/60 hover:text-purple-400 transition-colors">
            CheapShark API
          </a>
        </p>
      </footer>

      {quickViewGame && (
        <QuickViewModal
          game={quickViewGame}
          storeMap={storeMap}
          onClose={() => setQuickViewGame(null)}
          onSelectGame={handleSelectGame}
        />
      )}

    </div>
  );
}

export default App;
