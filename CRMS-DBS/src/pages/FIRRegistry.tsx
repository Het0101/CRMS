import { useState, useMemo } from "react";
import { FileText, Search, PlusSquare, AlertOctagon } from "lucide-react";
import { useApi, apiPost } from "@/hooks/useApi";
import { ErrorState } from "@/components/ErrorState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { StatusBadge } from "@/components/StatusBadge";

export default function FIRRegistry() {
  const { data, loading, error, refetch } = useApi<any[]>("/firs");
  const [search, setSearch] = useState("");
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ crimeTypeId: "", location: "", description: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(
      (f: any) =>
        f.location?.toLowerCase().includes(q) ||
        f.crimeType?.description?.toLowerCase().includes(q) ||
        String(f.firId).includes(q)
    );
  }, [data, search]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      const generatedId = Math.floor(Math.random() * 900000) + 100000;
      
      const payload = {
        firId: generatedId,
        location: formData.location,
        description: formData.description,
        status: "Pending",
        dateFiled: new Date().toISOString().split('T')[0],
        // Spring Boot maps this nested object to the foreign key column
        crimeType: { crimeTypeId: parseInt(formData.crimeTypeId) } 
      };

      await apiPost("/firs", payload);
      setShowForm(false);
      setFormData({ crimeTypeId: "", location: "", description: "" });
      refetch();
    } catch (err: any) {
      setFormError(`TRANSACTION_REJECTED: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2 uppercase tracking-wider">
            <FileText className="w-5 h-5 text-primary" />
            FIR Registry
          </h2>
          <p className="text-muted-foreground text-xs mt-1 font-mono tracking-wide">// {filtered.length} records on file</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="QUERY :: location, crime type, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-secondary border border-border text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all rounded-sm"
            />
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-black px-4 py-2 text-xs font-mono font-bold uppercase rounded-sm hover:bg-primary/80 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <PlusSquare className="w-4 h-4" />
            File FIR
          </button>
        </div>
      </div>

      {/* REGISTRY FORM */}
      {showForm && (
        <div className="tactical-panel p-4 border border-primary/30 bg-primary/5 relative">
          <h3 className="text-primary font-mono text-sm mb-4 uppercase flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Lodge New FIR
          </h3>
          
          {formError && (
            <div className="mb-4 bg-red-950/50 border border-red-500 p-3 rounded-sm flex items-start gap-3 text-red-400 font-mono text-xs">
              <AlertOctagon className="w-4 h-4 mt-0.5 shrink-0" />
              <p>{formError}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] text-muted-foreground font-mono uppercase mb-1">Crime Type ID (FK)</label>
              <input required placeholder="e.g. 1 for Theft" value={formData.crimeTypeId} onChange={e => setFormData({...formData, crimeTypeId: e.target.value})} type="number" className="w-full p-2 bg-secondary border border-border text-xs font-mono text-foreground focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-[10px] text-muted-foreground font-mono uppercase mb-1">Location</label>
              <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} type="text" className="w-full p-2 bg-secondary border border-border text-xs font-mono text-foreground focus:outline-none focus:border-primary" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] text-muted-foreground font-mono uppercase mb-1">Description</label>
              <input required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} type="text" className="w-full p-2 bg-secondary border border-border text-xs font-mono text-foreground focus:outline-none focus:border-primary" />
            </div>
            <div className="md:col-span-4 flex justify-end mt-2">
              <button type="submit" disabled={formLoading} className="bg-primary text-black px-8 py-2 text-xs font-mono font-bold uppercase hover:bg-primary/80 transition-all disabled:opacity-50">
                {formLoading ? "UPLOADING..." : "COMMIT TO DB"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="tactical-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-2.5 text-left text-[10px] text-muted-foreground font-mono font-medium uppercase tracking-[0.15em]">FIR ID</th>
                <th className="px-4 py-2.5 text-left text-[10px] text-muted-foreground font-mono font-medium uppercase tracking-[0.15em]">Crime Type</th>
                <th className="px-4 py-2.5 text-left text-[10px] text-muted-foreground font-mono font-medium uppercase tracking-[0.15em]">Date Filed</th>
                <th className="px-4 py-2.5 text-left text-[10px] text-muted-foreground font-mono font-medium uppercase tracking-[0.15em]">Location</th>
                <th className="px-4 py-2.5 text-left text-[10px] text-muted-foreground font-mono font-medium uppercase tracking-[0.15em]">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((f: any) => (
                  <tr key={f.firId} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-muted-foreground">#{f.firId}</td>
                    <td className="px-4 py-2.5 text-foreground font-medium font-mono">{f.crimeType?.description ?? "UNCLASSIFIED"}</td>
                    <td className="px-4 py-2.5 font-mono text-muted-foreground">{f.dateFiled ?? "—"}</td>
                    <td className="px-4 py-2.5 text-foreground font-medium font-mono">{f.location ?? "—"}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={f.status ?? "Unknown"} /></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground font-mono text-xs">NO_MATCH :: query returned 0 results</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}