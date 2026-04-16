import { RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-6">
      <div className="tactical-panel p-6 max-w-lg w-full space-y-3">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <span className="inline-block w-2 h-2 bg-danger animate-blink" />
          <span className="font-mono text-[10px] text-danger uppercase tracking-[0.2em] font-bold">System Diagnostic</span>
        </div>

        <div className="font-mono text-xs space-y-1.5 text-muted-foreground">
          <p><span className="text-danger font-semibold">ERR</span> :: SYS_ERR: DB_CONNECTION_REFUSED</p>
          <p><span className="text-muted-foreground/60">  └─</span> endpoint unreachable at <span className="text-foreground">localhost:1</span></p>
          <p><span className="text-muted-foreground/60">  └─</span> {message}</p>
          <p><span className="text-danger font-semibold">ERR</span> :: FATAL: data pipeline offline</p>
        </div>

        <div className="border-t border-border pt-3 font-mono text-[10px] text-muted-foreground">
          <p>STATUS: <span className="text-danger font-bold">DISCONNECTED</span></p>
          <p>UPTIME: <span className="text-foreground">0ms</span> // RETRY_COUNT: <span className="text-foreground">0</span></p>
        </div>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-danger/10 border border-danger/40 text-danger text-xs font-mono font-bold uppercase tracking-[0.15em] hover:bg-danger/20 hover:border-danger/60 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reboot Sequence
        </button>
      )}
    </div>
  );
}
