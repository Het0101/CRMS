import { useApi } from "@/hooks/useApi";
import { ErrorState } from "@/components/ErrorState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { AlertTriangle, Shield, FileText, Briefcase, Activity } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";

export default function Dashboard() {
  const criminals = useApi<any[]>("/criminals");
  const firs = useApi<any[]>("/firs");
  const cases = useApi<any[]>("/cases");

  const anyError = criminals.error || firs.error || cases.error;
  const allLoading = criminals.loading && firs.loading && cases.loading;

  if (allLoading) return <LoadingSpinner />;

  if (anyError && !criminals.data && !firs.data && !cases.data) {
    return (
      <ErrorState 
        message={anyError} 
        onRetry={() => { criminals.refetch(); firs.refetch(); cases.refetch(); }} 
      />
    );
  }

  // --- THE FIX: Proper Data Filtering ---
  const totalCriminals = criminals.data?.length ?? 0;
  const totalFirs = firs.data?.length ?? 0;
  
  // Only count cases that are explicitly 'Open' or 'Under Trial'
  const openCases = cases.data?.filter(c => 
    c.status?.toLowerCase() === "open" || 
    c.status?.toLowerCase() === "under trial"
  ).length ?? 0;

  // Only count criminals with active warrants/arrested
  const activeWarrants = criminals.data?.filter(c => 
    c.status?.toLowerCase() === "absconding" || 
    c.status?.toLowerCase() === "wanted"
  ).length ?? 0;

  const recentCriminals = criminals.data?.slice(-5).reverse() ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-foreground uppercase tracking-wider">
          Command Center
        </h2>
        <p className="text-muted-foreground text-xs mt-1 font-mono tracking-wide flex items-center gap-2">
          // real-time crime record overview
          <span className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-sm">
            <Activity className="w-3 h-3" /> SYS_STATUS: ONLINE
          </span>
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Warrants Card */}
        <div className="tactical-panel p-5 border-l-2 border-l-red-500 flex flex-col justify-between h-28 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>
          <h3 className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.2em] z-10">Active Warrants</h3>
          <p className="text-4xl font-mono text-foreground font-light z-10">{activeWarrants}</p>
        </div>

        {/* Total Criminals Card */}
        <div className="tactical-panel p-5 border-l-2 border-l-primary flex flex-col justify-between h-28 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
            <Shield className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.2em] z-10">Total Criminals</h3>
          <p className="text-4xl font-mono text-foreground font-light z-10">{totalCriminals}</p>
        </div>

        {/* FIRs Card */}
        <div className="tactical-panel p-5 border-l-2 border-l-primary flex flex-col justify-between h-28 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
            <FileText className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.2em] z-10">Filed FIRs</h3>
          <p className="text-4xl font-mono text-foreground font-light z-10">{totalFirs}</p>
        </div>

        {/* Open Cases Card */}
        <div className="tactical-panel p-5 border-l-2 border-l-primary flex flex-col justify-between h-28 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
            <Briefcase className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.2em] z-10">Open Cases</h3>
          <p className="text-4xl font-mono text-foreground font-light z-10">{openCases}</p>
        </div>
      </div>

      {/* RECENT ACTIVITY TABLE */}
      <div className="tactical-panel overflow-hidden">
        <div className="bg-secondary/50 px-4 py-3 border-b border-border flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <h3 className="text-[10px] font-mono text-foreground uppercase tracking-[0.15em] font-medium">
            Recent Criminal Records
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-black/20">
                <th className="px-4 py-2.5 text-left text-[10px] text-muted-foreground font-mono font-medium uppercase tracking-[0.15em]">ID</th>
                <th className="px-4 py-2.5 text-left text-[10px] text-muted-foreground font-mono font-medium uppercase tracking-[0.15em]">Name</th>
                <th className="px-4 py-2.5 text-left text-[10px] text-muted-foreground font-mono font-medium uppercase tracking-[0.15em]">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentCriminals.length > 0 ? (
                recentCriminals.map((c: any) => (
                  <tr key={c.criminalId ?? c.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-muted-foreground">#{c.criminalId ?? c.id}</td>
                    <td className="px-4 py-2.5 text-foreground font-medium font-mono">{c.name}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={c.status ?? "Unknown"} /></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground font-mono text-xs">
                    NO_DATA :: awaiting database sync
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}