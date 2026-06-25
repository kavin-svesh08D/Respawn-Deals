import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

function SearchBar({
  onSearch,
  loading,
  recentSearches = [],
  onClearRecentSearches,
  onRemoveRecentSearch,
  favorites = [],
  onSelectFavorite,
  searchInputRef,
}) {
  const [inputValue, setInputValue] = useState('');
  const [showRecent, setShowRecent] = useState(false);
  const [dropdownPos, setDropdownPos] = useState(null);

  const internalRef = useRef(null);
  const inputRef = searchInputRef || internalRef;
  const wrapperRef = useRef(null);
  const dropdownRef = useRef(null);

  const updateDropdownPosition = useCallback(() => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  const handleSearch = useCallback((query) => {
    const trimmed = (query ?? inputValue).trim();
    if (!trimmed) return;
    setInputValue(trimmed);
    onSearch(trimmed);
    setShowRecent(false);
  }, [inputValue, onSearch]);

  const handleRecentSelect = useCallback((term) => {
    const value = String(term ?? '').trim();
    if (!value) return;
    setInputValue(value);
    onSearch(value);
    setShowRecent(false);
  }, [onSearch]);

  const openRecent = useCallback(() => {
    if (recentSearches.length > 0) {
      updateDropdownPosition();
      setShowRecent(true);
    }
  }, [recentSearches.length, updateDropdownPosition]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
    if (e.key === 'Escape') setShowRecent(false);
  };

  // Reposition dropdown on scroll/resize while open
  useEffect(() => {
    if (!showRecent) return;
    updateDropdownPosition();
    const onReposition = () => updateDropdownPosition();
    window.addEventListener('resize', onReposition);
    window.addEventListener('scroll', onReposition, true);
    return () => {
      window.removeEventListener('resize', onReposition);
      window.removeEventListener('scroll', onReposition, true);
    };
  }, [showRecent, updateDropdownPosition]);

  // Close when clicking outside search wrapper + dropdown
  useEffect(() => {
    if (!showRecent) return;

    const handlePointerDown = (e) => {
      const inWrapper = wrapperRef.current?.contains(e.target);
      const inDropdown = dropdownRef.current?.contains(e.target);
      if (!inWrapper && !inDropdown) {
        setShowRecent(false);
      }
    };

    // Bubble phase so item pointerdown handlers run before this closes the menu
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [showRecent]);

  const dropdown = showRecent && recentSearches.length > 0 && dropdownPos
    ? createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
            zIndex: 9999,
          }}
          className="glass-panel-strong rounded-2xl shadow-glow-purple overflow-hidden animate-slide-down border border-purple-500/20"
          role="listbox"
          aria-label="Recent searches"
        >
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Recent Searches</p>
            <button
              type="button"
              onPointerDown={(e) => {
                e.stopPropagation();
                onClearRecentSearches?.();
              }}
              className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-500/10 cursor-pointer"
              aria-label="Clear all recent searches"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear
            </button>
          </div>

          {recentSearches.slice(0, 8).map((term) => (
            <button
              key={term}
              type="button"
              role="option"
              onPointerDown={(e) => {
                e.stopPropagation();
                handleRecentSelect(term);
              }}
              className="w-full text-left px-4 py-3 text-slate-300 hover:text-purple-300 hover:bg-purple-500/10 flex items-center gap-3 text-sm cursor-pointer transition-colors duration-200 border-l-2 border-transparent hover:border-purple-500/50"
            >
              <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="flex-1">{term}</span>
              <span
                role="button"
                tabIndex={-1}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onRemoveRecentSearch?.(term);
                }}
                className="p-1 rounded-md text-slate-600 hover:text-red-400 hover:bg-red-500/10 shrink-0"
                aria-label={`Remove "${term}" from recent searches`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            </button>
          ))}
        </div>,
        document.body
      )
    : null;

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in-up relative">

      <div
        ref={wrapperRef}
        className="search-wrapper relative flex items-center glass-panel rounded-2xl overflow-hidden border border-slate-700/50"
      >
        <div className="pl-5 pr-2 flex-shrink-0">
          <svg className="w-5 h-5 text-purple-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={openRecent}
          onClick={openRecent}
          placeholder="Search any PC game..."
          disabled={loading}
          className="flex-1 bg-transparent text-white placeholder-slate-500 py-4 pr-2 outline-none text-base disabled:opacity-50 cursor-text"
          aria-label="Search for a PC game"
          aria-expanded={showRecent && recentSearches.length > 0}
          aria-haspopup="listbox"
        />

        {inputValue && (
          <button
            type="button"
            onClick={() => setInputValue('')}
            className="px-2 text-slate-500 hover:text-slate-300 transition-all duration-200 hover:rotate-90"
            aria-label="Clear search input"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <button
          type="button"
          onClick={() => handleSearch()}
          disabled={loading || !inputValue.trim()}
          className="btn-primary m-1.5 px-6 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl flex items-center gap-2 text-sm flex-shrink-0"
        >
          {loading ? (
            <span className="w-4 h-4 skeleton-inline rounded-full" aria-label="Searching" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
          <span className="hidden sm:block">{loading ? 'Searching...' : 'Search'}</span>
        </button>
      </div>

      {dropdown}

      {favorites.length > 0 && !showRecent && (
        <div className="mt-5 animate-fade-in-up stagger-3">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2.5 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-yellow-400 animate-bounce-soft" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Favorites
          </p>
          <div className="flex flex-wrap gap-2">
            {favorites.slice(0, 8).map((game) => (
              <button
                key={game.gameID}
                type="button"
                onClick={() => onSelectFavorite(game)}
                className="text-xs glass-panel hover:bg-purple-500/10 border border-slate-700/50 hover:border-purple-500/40 text-slate-300 hover:text-purple-300 px-3 py-1.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 max-w-[140px] hover:-translate-y-0.5 hover:shadow-glow-purple-sm"
              >
                <span className="truncate">{game.external}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
