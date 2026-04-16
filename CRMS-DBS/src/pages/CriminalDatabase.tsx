import { useState, useMemo } from "react";
import { Search, Users, PlusSquare, AlertOctagon } from "lucide-react";
import { useApi, apiPost } from "@/hooks/useApi";
import { ErrorState } from "@/components/ErrorState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { StatusBadge } from "@/components/StatusBadge";

export default function CriminalDatabase() {
  const { data, loading, error, refetch } = useApi<any[]>("/criminals");
  const [search, setSearch] = useState("");
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", nationalId: "", gender: "M", status: "Active" });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(
      (c: any) =>
        c.name?.toLowerCase().includes(q) ||
        c.nationalId?.toLowerCase().includes(q) ||
        String(c.criminalId).includes(q)
    );
  }, [data, search]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      // FIX: Generate a random ID since our Oracle DB doesn't auto-increment
      const generatedId = Math.floor(Math.random() * 90000) + 10000;
      
      const payload = {
        ...formData,
        criminalId: generatedId // Attach the ID to the data before sending
      };

      await apiPost("/criminals", payload);
      setShowForm(false);
      setFormData({ name: "", nationalId: "", gender: "M", status: "Active" });
      refetch(); // Reload the table with the new data
    } catch (err: any) {
      // THIS IS WHERE ORACLE TRIGGERS/CONSTRAINTS WILL BE DISPLAYED
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
            <Users className="w-5 h-5 text-primary" />
            Criminal Database
          </h2>
          <p className="text-muted-foreground text-xs mt-1 font-mono tracking-wide">// {filtered.length} records found</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="QUERY :: name, ID..."
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
            New
          </button>
        </div>
      </div>

      {/* REGISTRY FORM */}
      {showForm && (
        <div className="tactical-panel p-4 border border-primary/30 bg-primary/5 relative">
          <h3 className="text-primary font-mono text-sm mb-4 uppercase flex items-center gap-2">
            <Users className="w-4 h-4" />
            Initialize Suspect Registry
          </h3>
          
          {formError && (
            <div className="mb-4 bg-red-950/50 border border-red-500 p-3 rounded-sm flex items-start gap-3 text-red-400 font-mono text-xs">
              <AlertOctagon className="w-4 h-4 mt-0.5 shrink-0" />
              <p>{formError}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] text-muted-foreground font-mono uppercase mb-1">Full Name</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full p-2 bg-secondary border border-border text-xs font-mono text-foreground focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-[10px] text-muted-foreground font-mono uppercase mb-1">National ID (Unique)</label>
              <input required value={formData.nationalId} onChange={e => setFormData({...formData, nationalId: e.target.value})} type="text" className="w-full p-2 bg-secondary border border-border text-xs font-mono text-foreground focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-[10px] text-muted-foreground font-mono uppercase mb-1">Gender</label>
              <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full p-2 bg-secondary border border-border text-xs font-mono text-foreground focus:outline-none focus:border-primary">
                <option value="M">M - Male</option>
                <option value="F">F - Female</option>
                <option value="O">O - Other</option>
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" disabled={formLoading} className="w-full bg-primary text-black py-2 text-xs font-mono font-bold uppercase hover:bg-primary/80 transition-all disabled:opacity-50">
                {formLoading ? "UPLOADING..." : "COMMIT TO DB"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DATA TABLE */}
      <div className="tactical-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-2.5 text-left text-[10px] text-muted-foreground font-mono font-medium uppercase tracking-[0.15em]">ID</th>
                <th className="px-4 py-2.5 text-left text-[10px] text-muted-foreground font-mono font-medium uppercase tracking-[0.15em]">Name</th>
                <th className="px-4 py-2.5 text-left text-[10px] text-muted-foreground font-mono font-medium uppercase tracking-[0.15em]">National ID</th>
                <th className="px-4 py-2.5 text-left text-[10px] text-muted-foreground font-mono font-medium uppercase tracking-[0.15em]">Gender</th>
                <th className="px-4 py-2.5 text-left text-[10px] text-muted-foreground font-mono font-medium uppercase tracking-[0.15em]">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((c: any) => (
                  <tr key={c.criminalId} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-muted-foreground">#{c.criminalId}</td>
                    <td className="px-4 py-2.5 text-foreground font-medium font-mono">{c.name}</td>
                    <td className="px-4 py-2.5 font-mono text-muted-foreground">{c.nationalId ?? "—"}</td>
                    <td className="px-4 py-2.5 font-mono text-foreground">{c.gender ?? "—"}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={c.status ?? "Unknown"} /></td>
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