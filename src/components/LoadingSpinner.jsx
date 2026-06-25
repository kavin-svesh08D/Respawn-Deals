function LoadingSpinner({ size = 'md', label = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  return (
    <div
      className="flex flex-col items-center justify-center gap-4"
      role="status"
      aria-label={label}
    >
      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute inset-0 rounded-full border-2 border-slate-700" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-green-400 animate-spin" />
        <div
          className="absolute inset-1 rounded-full border-2 border-transparent border-b-emerald-500 animate-spin"
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        />
      </div>
      {label && (
        <p className="text-slate-400 text-sm animate-pulse">{label}</p>
      )}
    </div>
  );
}

export default LoadingSpinner;
