import { ShieldAlert, Terminal, Activity } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { ErrorState } from "@/components/ErrorState";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function AuditLog() {
  const { data, loading, error, refetch } = useApi<any[]>("/advanced/audit-logs");

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  // Sort logs so the newest are at the top
  const logs = data ? [...data].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) : [];

  return (
    <div className="space-y-5 h-full flex flex-col">
      <div>
        <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2 uppercase tracking-wider text-red-500">
          <ShieldAlert className="w-5 h-5" />
          System Audit Ledger
        </h2>
        <p className="text-muted-foreground text-xs mt-1 font-mono tracking-wide">
          // IMMUTABLE FORENSIC TRACKING :: UNAUTHORIZED ACCESS LOGGED
        </p>
      </div>

      <div className="tactical-panel bg-black border border-red-900/50 flex-1 overflow-hidden flex flex-col relative">
        {/* Terminal Header */}
        <div className="bg-red-950/30 px-4 py-2 border-b border-red-900/50 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-red-500" />
          <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest">Live Security Feed</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </div>
        </div>

        {/* Terminal Output */}
        <div className="p-4 overflow-y-auto flex-1 font-mono text-[11px] sm:text-xs space-y-2">
          {logs.length > 0 ? (
            logs.map((log) => (
              <div key={log.auditId} className="flex flex-col sm:flex-row sm:gap-4 border-b border-red-900/20 pb-2 mb-2 last:border-0 hover:bg-red-950/20 transition-colors p-1">
                <div className="text-red-500/70 whitespace-nowrap shrink-0">
                  [{new Date(log.timestamp).toLocaleString()}]
                </div>
                <div className="text-muted-foreground">
                  <span className="text-emerald-500 font-bold">{log.actionType}</span> :: 
                  Entity <span className="text-primary">{log.targetTable}</span> 
                  (ID: <span className="text-white">{log.recordId}</span>) mutated. 
                  State changed from <span className="line-through text-red-400">[{log.oldValue}]</span> to <span className="text-green-400">[{log.newValue}]</span>.
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2 text-red-500/50 animate-pulse">
              <Activity className="w-4 h-4" />
              <span>AWAITING SECURITY EVENTS...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}