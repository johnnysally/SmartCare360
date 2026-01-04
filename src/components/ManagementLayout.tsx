import { ReactNode, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building,
  Menu, 
  X, 
  Settings, 
  LogOut,
  Bell,
  Search,
  PieChart,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const menuItems = [
  { icon: BarChart3, label: "Dashboard", path: "/management/dashboard" },
  { icon: TrendingUp, label: "Revenue", path: "/management/revenue" },
  { icon: Users, label: "Performance", path: "/management/performance" },
  { icon: PieChart, label: "Analytics", path: "/management/analytics" },
  { icon: FileText, label: "Reports", path: "/management/reports" },
];

interface ManagementLayoutProps {
  children: ReactNode;
  title: string;
}

const ManagementLayout = ({ children, title }: ManagementLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar-background transition-all duration-300",
        sidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
            <Link to="/management/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Building className="w-6 h-6 text-accent" />
              </div>
              {sidebarOpen && (
                <span className="text-xl font-bold text-sidebar-foreground font-display">
                  Director
                </span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    isActive 
                      ? "bg-accent/20 text-accent" 
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          {sidebarOpen && (
            <div className="p-4 border-t border-sidebar-border">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent">
                <Avatar className="w-10 h-10 border-2 border-accent">
                  <AvatarFallback className="bg-accent/20 text-accent">MD</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">Dr. Kamau</p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">Medical Director</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer Links */}
          <div className="p-3 border-t border-sidebar-border space-y-1">
            <Link to="/management/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent transition-colors">
              <Settings className="w-5 h-5" />
              {sidebarOpen && <span>Settings</span>}
            </Link>
            <Link to="/login" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent transition-colors">
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span>Logout</span>}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn("transition-all duration-300", sidebarOpen ? "ml-64" : "ml-20")}>
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-background/95 backdrop-blur border-b border-border">
          <div className="flex h-full items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <h1 className="text-xl font-bold font-display">{title}</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search..." className="w-64 pl-10" />
              </div>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">2</span>
              </Button>
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-accent/10 text-accent">MD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default ManagementLayout;
