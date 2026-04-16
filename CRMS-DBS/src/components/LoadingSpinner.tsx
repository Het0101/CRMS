export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="flex items-center gap-2">
        <span className="inline-block w-1.5 h-1.5 bg-primary animate-blink" />
        <span className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em]">Loading data stream</span>
      </div>
      <div className="w-48 h-px bg-border overflow-hidden">
        <div className="h-full w-1/3 bg-primary animate-[shimmer_1.5s_ease-in-out_infinite]" 
             style={{ animation: "shimmer 1.5s ease-in-out infinite" }} />
      </div>
      <style>{`@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } }`}</style>
    </div>
  );
}
