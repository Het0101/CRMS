import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full scanline-bg">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-10 flex items-center border-b border-border px-4 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger className="text-muted-foreground hover:text-primary" />
            <div className="ml-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-none bg-primary animate-blink" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-[0.25em] font-mono">CRMS // Central Dispatch Console</span>
            </div>
            <div className="ml-auto text-[10px] font-mono text-muted-foreground tracking-wider">
              SYS_STATUS: <span className="text-success">ONLINE</span>
            </div>
          </header>
          <main className="flex-1 p-5 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
