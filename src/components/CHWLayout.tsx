import { ReactNode, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  Baby, 
  ClipboardList,
  Menu, 
  X, 
  Settings, 
  LogOut,
  Bell,
  MapPin,
  Wifi,
  WifiOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/chw/dashboard" },
  { icon: Users, label: "Follow-ups", path: "/chw/followups" },
  { icon: MapPin, label: "Home Visits", path: "/chw/visits" },
  { icon: Baby, label: "Maternal Health", path: "/chw/maternal" },
  { icon: ClipboardList, label: "Reports", path: "/chw/reports" },
];

interface CHWLayoutProps {
  children: ReactNode;
  title: string;
}

const CHWLayout = ({ children, title }: CHWLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
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
            <Link to="/chw/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                <Home className="w-6 h-6 text-warning" />
              </div>
              {sidebarOpen && (
                <span className="text-xl font-bold text-sidebar-foreground font-display">
                  CHW Portal
                </span>
              )}
            </Link>
          </div>

          {/* Online Status */}
          {sidebarOpen && (
            <div className="px-4 py-3 border-b border-sidebar-border">
              <div className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                isOnline ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
              )}>
                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                {isOnline ? "Online" : "Offline Mode"}
              </div>
            </div>
          )}

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
                      ? "bg-warning/20 text-warning" 
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
                <Avatar className="w-10 h-10 border-2 border-warning">
                  <AvatarFallback className="bg-warning/20 text-warning">CW</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">Grace Akinyi</p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">Community Worker</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer Links */}
          <div className="p-3 border-t border-sidebar-border space-y-1">
            <Link to="/chw/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent transition-colors">
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
              <Badge variant="outline" className="hidden md:flex">
                <MapPin className="w-3 h-3 mr-1" />
                Kibera Zone 5
              </Badge>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-warning text-warning-foreground text-xs rounded-full flex items-center justify-center">4</span>
              </Button>
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-warning/10 text-warning">CW</AvatarFallback>
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

export default CHWLayout;
