function ErrorMessage({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-4 py-12 px-6 text-center animate-scale-in"
    >
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center animate-bounce-soft">
        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>

      <div>
        <p className="text-slate-200 font-semibold text-base mb-1 font-display">Something went wrong</p>
        <p className="text-slate-400 text-sm max-w-sm">{message}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-6 py-2.5 glass-panel hover:bg-slate-700/50 border border-slate-600/50 text-white text-sm font-medium rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
