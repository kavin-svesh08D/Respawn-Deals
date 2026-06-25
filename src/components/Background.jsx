function Background() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
      <div className="absolute inset-0 bg-slate-950" />

      <div className="absolute inset-0 grid-pattern opacity-60" />

      <div
        className="bg-orb w-[500px] h-[500px] bg-purple-600/20 -top-32 -left-32 animate-float"
      />
      <div
        className="bg-orb w-[400px] h-[400px] bg-violet-600/15 top-1/3 -right-48 animate-float-slow"
        style={{ animationDelay: '-4s' }}
      />
      <div
        className="bg-orb w-[350px] h-[350px] bg-emerald-500/10 bottom-0 left-1/3 animate-float"
        style={{ animationDelay: '-8s' }}
      />
      <div
        className="bg-orb w-[280px] h-[280px] bg-orange-500/10 top-1/2 left-1/4 animate-pulse-glow"
      />
      <div
        className="bg-orb w-[200px] h-[200px] bg-cyan-500/8 bottom-1/4 right-1/4 animate-float-slow"
        style={{ animationDelay: '-6s' }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950" />
    </div>
  );
}

export default Background;
