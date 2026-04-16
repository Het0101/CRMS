import { LayoutDashboard, Users, FileText, Briefcase, ShieldAlert } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

// ADDED THE AUDIT LEDGER HERE
const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Criminal Database", url: "/criminals", icon: Users },
  { title: "FIR Registry", url: "/firs", icon: FileText },
  { title: "Active Cases", url: "/cases", icon: Briefcase },
  { title: "Audit Ledger", url: "/audit", icon: ShieldAlert }, 
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-sidebar border-r border-border">
        <div className={`flex items-center gap-3 px-4 py-4 border-b border-border ${collapsed ? "justify-center" : ""}`}>
          
          {/* YOUR CUSTOM LOGO HERE */}
          <img 
            src="/crms.png" 
            alt="CRMS Logo" 
            className="w-7 h-7 object-contain" 
          />

          {!collapsed && (
            <div>
              <h1 className="text-xs font-bold text-foreground tracking-[0.2em] font-mono">CRMS</h1>
              <p className="text-[9px] text-muted-foreground uppercase tracking-[0.3em] font-mono">v2.4.1</p>
            </div>
          )}
        </div>

        {!collapsed && (
          <div className="px-4 py-2 border-b border-border">
            <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.15em]">Navigation</p>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="rounded-none hover:bg-secondary hover:text-primary font-mono text-xs tracking-wide"
                      activeClassName="bg-primary/10 text-primary border-l-2 border-primary font-semibold"
                    >
                      <item.icon className="mr-2 h-3.5 w-3.5" />
                      {!collapsed && <span className="uppercase">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}