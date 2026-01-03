import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserCog,
  Activity,
  AlertTriangle,
  TrendingUp,
  Server,
  Database,
  Clock,
} from "lucide-react";

const stats = [
  { label: "Total Users", value: "1,284", change: "+12%", icon: Users, color: "text-primary" },
  { label: "Active Staff", value: "86", change: "+3%", icon: UserCog, color: "text-secondary" },
  { label: "System Uptime", value: "99.9%", change: "+0.1%", icon: Server, color: "text-accent" },
  { label: "Active Sessions", value: "342", change: "+28%", icon: Activity, color: "text-primary" },
];

const recentActivities = [
  { action: "User login", user: "Dr. Sarah Kimani", time: "2 minutes ago", type: "info" },
  { action: "Password reset", user: "John Mwangi", time: "15 minutes ago", type: "warning" },
  { action: "New staff added", user: "Admin", time: "1 hour ago", type: "success" },
  { action: "Role updated", user: "Admin", time: "2 hours ago", type: "info" },
  { action: "Failed login attempt", user: "Unknown", time: "3 hours ago", type: "error" },
];

const systemHealth = [
  { name: "Database", status: "healthy", load: 45 },
  { name: "API Server", status: "healthy", load: 32 },
  { name: "File Storage", status: "healthy", load: 67 },
  { name: "Auth Service", status: "healthy", load: 23 },
];

const AdminDashboard = () => {
  return (
    <AdminLayout title="Admin Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold font-display">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-accent" />
                    <span className="text-sm text-accent font-medium">{stat.change}</span>
                    <span className="text-xs text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'error' ? 'bg-destructive' :
                      activity.type === 'warning' ? 'bg-yellow-500' :
                      activity.type === 'success' ? 'bg-accent' : 'bg-primary'
                    }`} />
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Database className="w-5 h-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.map((system) => (
                <div key={system.name} className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{system.name}</span>
                    <Badge variant="secondary" className="bg-accent/20 text-accent">
                      {system.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${system.load}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12">{system.load}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
                <p className="font-medium text-yellow-600 dark:text-yellow-400">Storage Warning</p>
                <p className="text-sm text-muted-foreground mt-1">File storage at 67% capacity</p>
              </div>
              <div className="p-4 rounded-lg border border-primary/30 bg-primary/10">
                <p className="font-medium text-primary">Scheduled Maintenance</p>
                <p className="text-sm text-muted-foreground mt-1">System update on Jan 10, 2026</p>
              </div>
              <div className="p-4 rounded-lg border border-accent/30 bg-accent/10">
                <p className="font-medium text-accent">Backup Complete</p>
                <p className="text-sm text-muted-foreground mt-1">Last backup: 2 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
