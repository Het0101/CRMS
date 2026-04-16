import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import CriminalDatabase from "@/pages/CriminalDatabase";
import FIRRegistry from "@/pages/FIRRegistry";
import ActiveCases from "@/pages/ActiveCases";
import AuditLog from "@/pages/AuditLog"; // <-- Added the import
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/criminals" element={<CriminalDatabase />} />
            <Route path="/firs" element={<FIRRegistry />} />
            <Route path="/cases" element={<ActiveCases />} />
            <Route path="/audit" element={<AuditLog />} /> {/* <-- Added the route */}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;