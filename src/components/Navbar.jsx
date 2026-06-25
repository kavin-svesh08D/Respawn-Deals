function Navbar({ onHome, isHomeActive = true }) {
  return (
    <nav className="nav-glass sticky top-0 z-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center gap-4">
            <button
              onClick={onHome}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300
                ${isHomeActive
                  ? 'text-purple-300 bg-purple-500/15 border border-purple-500/30 shadow-glow-purple-sm'
                  : 'text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20'
                }
              `}
              aria-label="Go to homepage"
              title="Home — clear search and return to default view"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden sm:inline">Home</span>
            </button>

            <div className="flex items-center gap-3 group cursor-default">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-violet-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-glow-purple-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-slate-950"
                  aria-hidden="true"
                >
                  <path d="M21 6H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1zm-10 7H9v2H7v-2H5v-2h2V9h2v2h2v2zm4.5 1a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3-3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                </svg>
              </div>

              <div>
                <span className="font-orbitron text-white font-bold text-lg tracking-wide hidden sm:block">
                  <span className="gradient-text-shimmer">Respawn</span>{' '}
                  <span className="text-white">Deals</span>
                </span>
                <span className="font-orbitron text-white font-bold text-base sm:hidden">
                  <span className="gradient-text">Respawn</span> Deals
                </span>
                <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] hidden sm:block -mt-0.5">
                  Game Price Finder
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:block">Powered by</span>
            <a
              href="https://www.cheapshark.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-all duration-300 border border-purple-400/20 hover:border-purple-400/50 px-3 py-1.5 rounded-lg hover:shadow-glow-purple-sm hover:-translate-y-0.5"
            >
              CheapShark
            </a>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
