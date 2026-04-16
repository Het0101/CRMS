import { useState } from "react";
import { Briefcase, AlertTriangle, PlusSquare, AlertOctagon } from "lucide-react";
import { useApi, apiPost } from "@/hooks/useApi";
import { ErrorState } from "@/components/ErrorState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { StatusBadge } from "@/components/StatusBadge";

export default function ActiveCases() {
  const { data, loading, error, refetch } = useApi<any[]>("/cases");
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ firId: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const records = data ?? [];

  const handleCloseCase = async (caseId: number, startDate: string) => {
    if (!confirm(`SYS_PROMPT: Execute PL/SQL closure for Case #${caseId}?`)) return;
    setProcessingId(caseId);
    setActionError(null);
    try {
      const daysOpen = 45; 
      await apiPost(`/advanced/cases/${caseId}/close?daysOpen=${daysOpen}`);
      refetch(); 
    } catch (err: any) {
      setActionError(`PL/SQL_ERR: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      const generatedId = Math.floor(Math.random() * 90000) + 10000;
      const payload = {
        caseId: generatedId,
        status: "Open",
        startDate: new Date().toISOString().split('T')[0],
        fir: { firId: parseInt(formData.firId) } // Maps to the FIR Foreign Key
      };

      await apiPost("/cases", payload);
      setShowForm(false);
      setFormData({ firId: "" });
      refetch();
    } catch (err: any) {
      setFormError(`TRANSACTION_REJECTED: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2 uppercase tracking-wider">
            <Briefcase className="w-5 h-5 text-primary" />
            Active Cases
          </h2>
          <p className="text-muted-foreground text-xs mt-1 font-mono tracking-wide">// {records.length} cases tracked // DB_SYNC: OK</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-black px-4 py-2 text-xs font-mono font-bold uppercase rounded-sm hover:bg-primary/80 transition-all flex items-center gap-2"
        >
          <PlusSquare className="w-4 h-4" />
          Initialize Case
        </button>
      </div>

      {/* REGISTRY FORM */}
      {showForm && (
        <div className="tactical-panel p-4 border border-primary/30 bg-primary/5 relative">
          <h3 className="text-primary font-mono text-sm mb-4 uppercase flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Open New Case Record
          </h3>
          
          {formError && (
            <div className="mb-4 bg-red-950/50 border border-red-500 p-3 rounded-sm flex items-start gap-3 text-red-400 font-mono text-xs">
              <AlertOctagon className="w-4 h-4 mt-0.5 shrink-0" />
              <p>{formError}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-64">
              <label className="block text-[10px] text-muted-foreground font-mono uppercase mb-1">Link FIR ID (Foreign Key)</label>
              <input required placeholder="Must be a valid FIR ID" value={formData.firId} onChange={e => setFormData({...formData, firId: e.target.value})} type="number" className="w-full p-2 bg-secondary border border-border text-xs font-mono text-foreground focus:outline-none focus:border-primary" />
            </div>
            <button type="submit" disabled={formLoading} className="w-full md:w-auto bg-primary text-black px-8 py-2 text-xs font-mono font-bold uppercase hover:bg-primary/80 transition-all disabled:opacity-50">
              {formLoading ? "UPLOADING..." : "COMMIT TO DB"}
            </button>
          </form>
        </div>
      )}

      {actionError && (
        <div className="bg-red-950/50 border border-red-500/50 p-3 rounded-sm flex items-center gap-3 text-red-400 font-mono text-xs">
          <AlertTriangle className="w-4 h-4" />
          {actionError}
        </div>
      )}

      <div className="tactical-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-2.5 text-left text-[10px] text-muted-foreground font-mono font-medium uppercase tracking-[0.15em]">Case ID</th>
                <th className="px-4 py-2.5 text-left text-[10px] text-muted-foreground font-mono font-medium uppercase tracking-[0.15em]">Crime / Location</th>
                <th className="px-4 py-2.5 text-left text-[10px] text-muted-foreground font-mono font-medium uppercase tracking-[0.15em]">Status</th>
                <th className="px-4 py-2.5 text-right text-[10px] text-muted-foreground font-mono font-medium uppercase tracking-[0.15em]">Command</th>
              </tr>
            </thead>
            <tbody>
              {records.length > 0 ? (
                records.map((c: any) => (
                  <tr key={c.caseId} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-muted-foreground">#{c.caseId}</td>
                    <td className="px-4 py-2.5 text-foreground font-medium font-mono">
                      {c.fir?.crimeType?.description ?? "UNKNOWN"} // {c.fir?.location ?? "UNSPECIFIED"}
                    </td>
                    <td className="px-4 py-2.5"><StatusBadge status={c.status ?? "Unknown"} /></td>
                    <td className="px-4 py-2.5 text-right">
                      {c.status !== 'Closed' && (
                        <button 
                          onClick={() => handleCloseCase(c.caseId, c.startDate)}
                          disabled={processingId === c.caseId}
                          className="bg-primary/10 text-primary hover:bg-primary hover:text-black border border-primary/30 px-3 py-1 rounded-sm font-mono text-[10px] uppercase transition-all disabled:opacity-50"
                        >
                          {processingId === c.caseId ? "EXECUTING..." : "CLOSE CASE"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground font-mono text-xs">NO_DATA :: case records unavailable</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}